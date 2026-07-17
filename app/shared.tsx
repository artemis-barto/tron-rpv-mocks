import Link from "next/link";
import { SegmentChartCarousel, type SegmentChartItem } from "./SegmentChartCarousel";
import {
  barHeights,
  formatMonth,
  formatPercent,
  formatUSD,
  type TronPaymentsData,
  type VolumePoint,
} from "./data";

type Concept = "home" | "proof" | "movement" | "future" | "live";

export function Mark() {
  return <span className="mark" aria-hidden="true"><i /></span>;
}

export function ConceptSwitcher({ active, data }: { active: Concept; data: TronPaymentsData }) {
  const links: { href: string; label: string; id: Concept }[] = [
    { href: "/", label: "All concepts", id: "home" },
    { href: "/proof", label: "01 Proof", id: "proof" },
    { href: "/movement", label: "02 Movement", id: "movement" },
    { href: "/future", label: "03 Future", id: "future" },
    { href: "/live", label: "04 Live", id: "live" },
  ];
  return (
    <aside className="concept-switcher" aria-label="Switch design concept">
      <span>CONCEPT PREVIEW</span>
      <nav>
        {links.map((link) => (
          <Link key={link.id} href={link.href} aria-current={active === link.id ? "page" : undefined}>
            {link.label}
          </Link>
        ))}
      </nav>
      <em className={`data-status data-status-${data.status}`}>
        {data.status === "live"
          ? `Full data · ${formatMonth(data.asOf, true)}`
          : data.status === "partial"
            ? `Partial verified data · ${formatMonth(data.asOf, true)}`
            : "Live data unavailable"}
      </em>
    </aside>
  );
}

export function SiteHeader({
  active,
  dark = false,
}: {
  active: Exclude<Concept, "home">;
  dark?: boolean;
}) {
  return (
    <header className={`site-header shell ${dark ? "site-header-dark" : ""}`}>
      <Link className={`brand ${dark ? "brand-light" : "brand-dark"}`} href="/" aria-label="TRON Payments concepts home">
        <Mark />
        <span>TRON PAYMENTS</span>
      </Link>
      <nav aria-label="Primary navigation">
        <a href="#why">Why TRON</a>
        <a href="#data">Data</a>
        <a href="#solutions">Solutions</a>
        <a href="#ecosystem">Ecosystem</a>
      </nav>
      <a className="header-cta" href="#build">Build on TRON</a>
      <span className="route-name">{active}</span>
    </header>
  );
}

export function MetricBars({
  light = false,
  series,
  label,
}: {
  light?: boolean;
  series: VolumePoint[];
  label: string;
}) {
  const window = series.slice(-12);
  const heights = barHeights(window);
  return (
    <div className={`metric-bars ${light ? "metric-bars-light" : ""}`} role="img" aria-label={label}>
      {heights.map((height, index) => <i key={window[index].month} style={{ height: `${height}%` }} />)}
    </div>
  );
}

export function ProofStrip({ dark = false, data }: { dark?: boolean; data: TronPaymentsData }) {
  return (
    <div className={`proof-strip ${dark ? "proof-strip-dark" : ""}`}>
      {data.proofMetrics.map(({ value, label }) => (
        <div key={label}><strong>{value}</strong><span>{label}</span></div>
      ))}
    </div>
  );
}

export function CompleteDataPanel({
  data,
  theme,
}: {
  data: TronPaymentsData;
  theme: Exclude<Concept, "home">;
}) {
  const overview = [
    { label: "Global tracked volume · 36mo", value: formatUSD(data.thirtySixMonthTrackedPayments), detail: "WORLD VOLUME" },
    { label: "Latest tracked month", value: formatUSD(data.latestTrackedPayments), detail: formatMonth(data.asOf, true) },
    { label: "Average monthly", value: formatUSD(data.averageMonthlyVolume), detail: "36-MONTH WINDOW" },
    { label: "Peak month", value: formatUSD(data.peakMonth?.value ?? null), detail: formatMonth(data.peakMonth?.month ?? null, true) },
    { label: "B2B share", value: formatPercent(data.b2bShare), detail: data.b2bShare === null ? "NEEDS FULL SEGMENT SET" : "OF TRACKED VOLUME" },
    { label: "Month over month", value: formatPercent(data.trackedPaymentsMoM), detail: "GLOBAL TRACKED VOLUME" },
  ];
  const carouselItems: SegmentChartItem[] = data.segmentMetrics.map((metric) => {
    const series = data.segmentSeries.length > 0
      ? data.segmentSeries.map((point) => ({ month: point.month, volume: point[metric.segment] }))
      : metric.segment === "B2B"
        ? data.b2bSeries
        : metric.segment === "C2B"
          ? data.trackedPaymentsSeries
          : [];
    const window = series.slice(-12);
    return {
      id: metric.segment,
      label: metric.useCase,
      sourceLabel: metric.sourceLabel,
      latestLabel: formatUSD(metric.latest),
      startLabel: formatMonth(window.at(0)?.month ?? null, true),
      endLabel: formatMonth(window.at(-1)?.month ?? null, true),
      available: metric.available,
      series: window,
    };
  });

  return (
    <section className={`complete-data complete-data-${theme}`} id="data">
      <div className="shell">
        <div className="complete-data-heading">
          <div>
            <p>VERIFIED DATA / COMPLETE VIEW</p>
            <h2>Every payment signal,<br />in this direction.</h2>
          </div>
          <div className="complete-data-source">
            <span className={`coverage coverage-${data.coverage}`}>{data.coverage} coverage</span>
            <p>{data.source}</p>
            <small>Through {formatMonth(data.asOf)}. Values not returned by a verified source are left unavailable.</small>
          </div>
        </div>

        <div className="overview-data-grid" aria-label="TRON payments overview metrics">
          {overview.map((metric) => (
            <article key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <em>{metric.detail}</em>
            </article>
          ))}
        </div>

        <div className="segment-data-block">
          <div className="data-block-heading">
            <div><span>PAYMENT SEGMENTS</span><h3>B2B, payouts, peer payments, and commerce.</h3></div>
            <p>Latest complete month, 36-month total, and trailing-12-month growth for every segment in the original data model.</p>
          </div>
          <div className="segment-data-grid">
            {data.segmentMetrics.map((metric) => (
              <article className={`segment-card segment-${metric.segment.toLowerCase()} ${metric.available ? "segment-available" : "segment-unavailable"}`} key={metric.segment}>
                <div><span>{metric.segment}</span><i>{metric.sourceLabel}</i></div>
                <p>{metric.useCase}</p>
                <strong>{formatUSD(metric.latest)}</strong>
                <dl>
                  <div><dt>36MO TOTAL</dt><dd>{formatUSD(metric.total36m)}</dd></div>
                  <div><dt>YOY</dt><dd>{formatPercent(metric.yoy)}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>

        <div className="volume-data-layout">
          <SegmentChartCarousel items={carouselItems} />

          <div className="world-data-card">
            <div className="data-card-top"><span>GLOBAL / WORLD VOLUME</span><em>{data.geographyStatus === "live" ? "VERIFIED" : "SOURCE GAP"}</em></div>
            <strong>{formatUSD(data.thirtySixMonthTrackedPayments)}</strong>
            <p>Verified global TRON volume is shown above. The original source has no country or continent dimension, so regional values remain unfilled.</p>
            <div className="continent-data-grid">
              {data.geography.map((item) => <span key={item.continent}><b>{item.continent}</b><em>{formatUSD(item.volume)}</em></span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LogoCloud({ dark = false }: { dark?: boolean }) {
  const logos = ["WALLET 01", "PSP 02", "CARD 03", "RAMP 04", "APP 05", "ISSUER 06"];
  return (
    <div className={`logo-cloud ${dark ? "logo-cloud-dark" : ""}`}>
      {logos.map((logo) => <span key={logo}>{logo}</span>)}
    </div>
  );
}

export function SiteFooter({ dark = false, data }: { dark?: boolean; data: TronPaymentsData }) {
  return (
    <footer className={`site-footer ${dark ? "site-footer-dark" : ""}`}>
      <div className="shell footer-inner">
        <div className="brand"><Mark /><span>TRON PAYMENTS</span></div>
        <p>
          {data.status !== "unavailable"
            ? `Artemis Snowflake data · through ${formatMonth(data.asOf)}`
            : "Network data is temporarily unavailable."}
        </p>
        <Link href="/">Compare concepts</Link>
      </div>
    </footer>
  );
}
