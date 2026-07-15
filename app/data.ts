const DEFAULT_DATA_ORIGIN = "https://tron-rpv.vercel.app";

export type VolumePoint = {
  month: string;
  volume: number;
};

export type ProofMetric = {
  value: string;
  label: string;
};

export type TronPaymentsData = {
  status: "live" | "partial" | "unavailable";
  asOf: string | null;
  latestB2B: number | null;
  latestTrackedPayments: number | null;
  twelveMonthB2B: number | null;
  trackedPaymentsYoY: number | null;
  b2bSeries: VolumePoint[];
  trackedPaymentsSeries: VolumePoint[];
  proofMetrics: ProofMetric[];
};

function isVolumePoint(value: unknown): value is VolumePoint {
  if (!value || typeof value !== "object") return false;
  const point = value as Record<string, unknown>;
  return (
    typeof point.month === "string" &&
    /^\d{4}-\d{2}$/.test(point.month) &&
    typeof point.volume === "number" &&
    Number.isFinite(point.volume) &&
    point.volume >= 0
  );
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

function monthOffset(month: string, offset: number): string {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function valueAt(series: VolumePoint[], month: string | null): number | null {
  if (!month) return null;
  return series.find((point) => point.month === month)?.volume ?? null;
}

function seriesThrough(series: VolumePoint[], month: string | null): VolumePoint[] {
  return month ? series.filter((point) => point.month <= month) : [];
}

function sumLastTwelve(series: VolumePoint[]): number | null {
  const window = series.slice(-12);
  if (window.length === 0) return null;
  return window.reduce((sum, point) => sum + point.volume, 0);
}

function yearOverYear(series: VolumePoint[], month: string | null): number | null {
  if (!month) return null;
  const current = valueAt(series, month);
  const previous = valueAt(series, monthOffset(month, -12));
  if (current === null || previous === null || previous === 0) return null;
  return current / previous - 1;
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
  const [b2bResult, trackedResult] = await Promise.allSettled([
    fetchSeries("/api/b2b"),
    // This legacy route is backed by the chain-level PaymentScan table, so the
    // UI labels it "tracked payments" rather than presenting it as a C2B segment.
    fetchSeries("/api/c2b"),
  ]);

  const b2b = b2bResult.status === "fulfilled" ? b2bResult.value : [];
  const tracked = trackedResult.status === "fulfilled" ? trackedResult.value : [];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const completeB2B = b2b.filter((point) => point.month < currentMonth);
  const completeTracked = tracked.filter((point) => point.month < currentMonth);
  const trackedMonths = new Set(completeTracked.map((point) => point.month));
  const commonMonths = completeB2B
    .map((point) => point.month)
    .filter((month) => trackedMonths.has(month));
  const asOf = commonMonths.at(-1) ?? completeB2B.at(-1)?.month ?? completeTracked.at(-1)?.month ?? null;
  const b2bSeries = seriesThrough(completeB2B, asOf);
  const trackedPaymentsSeries = seriesThrough(completeTracked, asOf);
  const latestB2B = valueAt(b2bSeries, asOf);
  const latestTrackedPayments = valueAt(trackedPaymentsSeries, asOf);
  const twelveMonthB2B = sumLastTwelve(b2bSeries);
  const trackedPaymentsYoY = yearOverYear(trackedPaymentsSeries, asOf);
  const status = b2b.length > 0 && tracked.length > 0
    ? "live"
    : b2b.length > 0 || tracked.length > 0
      ? "partial"
      : "unavailable";

  return {
    status,
    asOf,
    latestB2B,
    latestTrackedPayments,
    twelveMonthB2B,
    trackedPaymentsYoY,
    b2bSeries,
    trackedPaymentsSeries,
    proofMetrics: [
      { value: formatUSD(latestB2B), label: "monthly B2B volume" },
      { value: formatUSD(latestTrackedPayments), label: "tracked payments" },
      { value: formatUSD(twelveMonthB2B), label: "12-month B2B volume" },
      { value: formatPercent(trackedPaymentsYoY), label: "tracked payments YoY" },
    ],
  };
}
