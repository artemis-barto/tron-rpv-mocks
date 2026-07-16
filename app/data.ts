const DEFAULT_DATA_ORIGIN = "https://tron-rpv.vercel.app";

export const PAYMENT_SEGMENTS = ["B2B", "B2C", "C2C", "C2B"] as const;
export const CONTINENTS = [
  "Asia",
  "North America",
  "Europe",
  "South America",
  "Africa",
  "Oceania",
] as const;

export type PaymentSegment = (typeof PAYMENT_SEGMENTS)[number];
export type Continent = (typeof CONTINENTS)[number];

export type VolumePoint = {
  month: string;
  volume: number;
};

export type SegmentPoint = {
  month: string;
} & Record<PaymentSegment, number>;

export type SegmentMetric = {
  segment: PaymentSegment;
  useCase: string;
  available: boolean;
  sourceLabel: string;
  latest: number | null;
  total36m: number | null;
  yoy: number | null;
};

export type GeographyMetric = {
  continent: Continent;
  volume: number | null;
};

export type ProofMetric = {
  value: string;
  label: string;
};

export type TronPaymentsData = {
  status: "live" | "partial" | "unavailable";
  coverage: "full" | "partial" | "unavailable";
  source: string;
  asOf: string | null;
  availableSegments: PaymentSegment[];
  latestB2B: number | null;
  latestTrackedPayments: number | null;
  twelveMonthB2B: number | null;
  twelveMonthTrackedPayments: number | null;
  thirtySixMonthTrackedPayments: number | null;
  averageMonthlyVolume: number | null;
  peakMonth: { month: string; value: number } | null;
  trackedPaymentsYoY: number | null;
  trackedPaymentsMoM: number | null;
  b2bShare: number | null;
  b2bSeries: VolumePoint[];
  trackedPaymentsSeries: VolumePoint[];
  segmentSeries: SegmentPoint[];
  segmentMetrics: SegmentMetric[];
  geographyStatus: "live" | "unavailable";
  geography: GeographyMetric[];
  proofMetrics: ProofMetric[];
};

type FullPaymentsPayload = {
  status: "live";
  points: SegmentPoint[];
  availableSegments: PaymentSegment[];
  source: string;
};

const SEGMENT_USE_CASES: Record<PaymentSegment, string> = {
  B2B: "Business settlement",
  B2C: "Payroll + payouts",
  C2C: "P2P + remittance",
  C2B: "Cards + commerce",
};

function isMonth(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}$/.test(value);
}

function isVolumePoint(value: unknown): value is VolumePoint {
  if (!value || typeof value !== "object") return false;
  const point = value as Record<string, unknown>;
  return (
    isMonth(point.month) &&
    typeof point.volume === "number" &&
    Number.isFinite(point.volume) &&
    point.volume >= 0
  );
}

function isSegmentPoint(value: unknown): value is SegmentPoint {
  if (!value || typeof value !== "object") return false;
  const point = value as Record<string, unknown>;
  return isMonth(point.month) && PAYMENT_SEGMENTS.every((segment) => (
    typeof point[segment] === "number" &&
    Number.isFinite(point[segment]) &&
    Number(point[segment]) >= 0
  ));
}

async function fetchSeries(path: string): Promise<VolumePoint[]> {
  const origin = process.env.TRON_DATA_ORIGIN ?? DEFAULT_DATA_ORIGIN;
  const response = await fetch(`${origin}${path}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`TRON data request failed with ${response.status}`);
  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isVolumePoint)) {
    throw new Error("TRON data response had an unexpected shape");
  }

  return payload.slice().sort((a, b) => a.month.localeCompare(b.month));
}

async function fetchFullPayments(): Promise<FullPaymentsPayload> {
  const origin = process.env.TRON_DATA_ORIGIN ?? DEFAULT_DATA_ORIGIN;
  const response = await fetch(`${origin}/api/payments`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Full TRON dataset request failed with ${response.status}`);
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") throw new Error("Full TRON dataset was invalid");
  const candidate = payload as Record<string, unknown>;
  const availableSegments = Array.isArray(candidate.availableSegments)
    ? candidate.availableSegments.filter((segment): segment is PaymentSegment => (
        typeof segment === "string" && PAYMENT_SEGMENTS.includes(segment as PaymentSegment)
      ))
    : [];
  if (
    candidate.status !== "live" ||
    !Array.isArray(candidate.points) ||
    !candidate.points.every(isSegmentPoint) ||
    availableSegments.length === 0
  ) {
    throw new Error("Full TRON dataset had an unexpected shape");
  }

  return {
    status: "live",
    points: candidate.points.slice().sort((a, b) => a.month.localeCompare(b.month)),
    availableSegments,
    source: typeof candidate.source === "string"
      ? candidate.source
      : "PC_DBT_DB.PROD.AGG_TRON_RPV_METRICS",
  };
}

function valueAt(series: VolumePoint[], month: string | null): number | null {
  if (!month) return null;
  return series.find((point) => point.month === month)?.volume ?? null;
}

function seriesThrough(series: VolumePoint[], month: string | null): VolumePoint[] {
  return month ? series.filter((point) => point.month <= month) : [];
}

function sumWindow(series: VolumePoint[], months: number): number | null {
  const window = series.slice(-months);
  if (window.length === 0) return null;
  return window.reduce((sum, point) => sum + point.volume, 0);
}

function rollingYearOverYear(series: VolumePoint[]): number | null {
  if (series.length < 24) return null;
  const recent = series.slice(-12).reduce((sum, point) => sum + point.volume, 0);
  const prior = series.slice(-24, -12).reduce((sum, point) => sum + point.volume, 0);
  return prior === 0 ? null : recent / prior - 1;
}

function monthOverMonth(series: VolumePoint[]): number | null {
  if (series.length < 2) return null;
  const current = series.at(-1)?.volume ?? null;
  const previous = series.at(-2)?.volume ?? null;
  return current === null || previous === null || previous === 0 ? null : current / previous - 1;
}

function peak(series: VolumePoint[]): { month: string; value: number } | null {
  if (series.length === 0) return null;
  return series.reduce(
    (best, point) => point.volume > best.value ? { month: point.month, value: point.volume } : best,
    { month: series[0].month, value: series[0].volume },
  );
}

function segmentVolumeSeries(points: SegmentPoint[], segment: PaymentSegment): VolumePoint[] {
  return points.map((point) => ({ month: point.month, volume: point[segment] }));
}

function totalVolumeSeries(points: SegmentPoint[], segments: PaymentSegment[]): VolumePoint[] {
  return points.map((point) => ({
    month: point.month,
    volume: segments.reduce((sum, segment) => sum + point[segment], 0),
  }));
}

export function formatUSD(value: number | null): string {
  if (value === null) return "—";
  const absolute = Math.abs(value);
  if (absolute >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (absolute >= 1e9) return `$${(value / 1e9).toFixed(absolute >= 1e11 ? 1 : 2)}B`;
  if (absolute >= 1e6) return `$${(value / 1e6).toFixed(absolute >= 1e8 ? 0 : 1)}M`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function formatPercent(value: number | null): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(1)}%`;
}

export function formatMonth(month: string | null, short = false): string {
  if (!month) return "Data pending";
  const [year, monthNumber] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: short ? "short" : "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}

export function barHeights(series: VolumePoint[]): number[] {
  if (series.length === 0) return [];
  const max = Math.max(...series.map((point) => point.volume));
  if (max === 0) return series.map(() => 8);
  return series.map((point) => Math.max(8, Math.round((point.volume / max) * 100)));
}

export async function getTronPaymentsData(): Promise<TronPaymentsData> {
  const [fullResult, b2bResult, trackedResult] = await Promise.allSettled([
    fetchFullPayments(),
    fetchSeries("/api/b2b"),
    // The legacy /api/c2b route is backed by the chain-level PaymentScan table.
    // By product decision, the design uses it as a clearly labeled C2B proxy.
    fetchSeries("/api/c2b"),
  ]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const full = fullResult.status === "fulfilled" ? fullResult.value : null;
  const fullPoints = full?.points.filter((point) => point.month < currentMonth).slice(-36) ?? [];
  const standaloneB2B = b2bResult.status === "fulfilled"
    ? b2bResult.value.filter((point) => point.month < currentMonth)
    : [];
  const standaloneTracked = trackedResult.status === "fulfilled"
    ? trackedResult.value.filter((point) => point.month < currentMonth)
    : [];
  const fallbackSegments: PaymentSegment[] = [];
  if (standaloneB2B.length > 0) fallbackSegments.push("B2B");
  if (standaloneTracked.length > 0) fallbackSegments.push("C2B");
  const availableSegments: PaymentSegment[] = full?.availableSegments ?? fallbackSegments;
  const coverage = PAYMENT_SEGMENTS.every((segment) => availableSegments.includes(segment))
    ? "full"
    : availableSegments.length > 0 || standaloneTracked.length > 0
      ? "partial"
      : "unavailable";

  const fullTotalSeries = fullPoints.length > 0
    ? totalVolumeSeries(fullPoints, availableSegments)
    : [];
  const totalBase = fullTotalSeries.length > 0 ? fullTotalSeries : standaloneTracked;
  const b2bBase = fullPoints.length > 0 && availableSegments.includes("B2B")
    ? segmentVolumeSeries(fullPoints, "B2B")
    : standaloneB2B;
  const totalMonths = new Set(totalBase.map((point) => point.month));
  const commonMonths = b2bBase.map((point) => point.month).filter((month) => totalMonths.has(month));
  const asOf = commonMonths.at(-1) ?? totalBase.at(-1)?.month ?? b2bBase.at(-1)?.month ?? null;
  const trackedPaymentsSeries = seriesThrough(totalBase, asOf);
  const b2bSeries = seriesThrough(b2bBase, asOf);
  const segmentSeries = fullPoints.filter((point) => !asOf || point.month <= asOf);
  const latestB2B = valueAt(b2bSeries, asOf);
  const latestTrackedPayments = valueAt(trackedPaymentsSeries, asOf);
  const twelveMonthB2B = sumWindow(b2bSeries, 12);
  const twelveMonthTrackedPayments = sumWindow(trackedPaymentsSeries, 12);
  const thirtySixMonthTrackedPayments = sumWindow(trackedPaymentsSeries, 36);
  const averageMonthlyVolume = trackedPaymentsSeries.length > 0
    ? trackedPaymentsSeries.slice(-36).reduce((sum, point) => sum + point.volume, 0) /
      trackedPaymentsSeries.slice(-36).length
    : null;
  const trackedPaymentsYoY = rollingYearOverYear(trackedPaymentsSeries);
  const trackedPaymentsMoM = monthOverMonth(trackedPaymentsSeries);
  const peakMonth = peak(trackedPaymentsSeries.slice(-36));
  const b2bShare = coverage === "full" && thirtySixMonthTrackedPayments
    ? (sumWindow(b2bSeries, 36) ?? 0) / thirtySixMonthTrackedPayments
    : null;
  const status = coverage === "full" ? "live" : coverage === "partial" ? "partial" : "unavailable";

  const segmentMetrics = PAYMENT_SEGMENTS.map((segment): SegmentMetric => {
    const available = availableSegments.includes(segment);
    const series = available && fullPoints.length > 0
      ? segmentVolumeSeries(segmentSeries, segment)
      : segment === "B2B"
        ? b2bSeries
        : segment === "C2B"
          ? seriesThrough(standaloneTracked, asOf)
          : [];
    const sourceLabel = !available
      ? "NOT RETURNED"
      : segment === "C2B" && fullPoints.length === 0
        ? "TRON CHAIN PROXY"
        : "VERIFIED SEGMENT";
    return {
      segment,
      useCase: SEGMENT_USE_CASES[segment],
      available,
      sourceLabel,
      latest: available ? valueAt(series, asOf) : null,
      total36m: available ? sumWindow(series, 36) : null,
      yoy: available ? rollingYearOverYear(series) : null,
    };
  });

  return {
    status,
    coverage,
    source: full?.source ?? "Artemis Snowflake B2B + PaymentScan TRON chain volume as C2B proxy",
    asOf,
    availableSegments,
    latestB2B,
    latestTrackedPayments,
    twelveMonthB2B,
    twelveMonthTrackedPayments,
    thirtySixMonthTrackedPayments,
    averageMonthlyVolume,
    peakMonth,
    trackedPaymentsYoY,
    trackedPaymentsMoM,
    b2bShare,
    b2bSeries,
    trackedPaymentsSeries,
    segmentSeries,
    segmentMetrics,
    geographyStatus: "unavailable",
    geography: CONTINENTS.map((continent) => ({ continent, volume: null })),
    proofMetrics: [
      { value: formatUSD(thirtySixMonthTrackedPayments), label: "tracked volume · 36mo" },
      { value: formatUSD(latestB2B), label: "monthly B2B volume" },
      { value: formatUSD(averageMonthlyVolume), label: "average monthly volume" },
      { value: formatPercent(trackedPaymentsYoY), label: "tracked volume YoY" },
    ],
  };
}
