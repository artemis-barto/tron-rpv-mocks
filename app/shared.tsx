import Link from "next/link";
import {
  barHeights,
  formatMonth,
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
        {data.status === "live" ? `Verified data · ${formatMonth(data.asOf, true)}` : "Live data unavailable"}
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
        <a href="#solutions">Solutions</a>
        <a href="#ecosystem">Ecosystem</a>
        <a href="#stories">Stories</a>
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
          {data.status === "live"
            ? `Artemis Snowflake data · through ${formatMonth(data.asOf)}`
            : "Network data is temporarily unavailable."}
        </p>
        <Link href="/">Compare concepts</Link>
      </div>
    </footer>
  );
}
