type Concept = "home" | "proof" | "movement" | "future";

export function Mark() {
  return <span className="mark" aria-hidden="true"><i /></span>;
}

export function ConceptSwitcher({ active }: { active: Concept }) {
  const links: { href: string; label: string; id: Concept }[] = [
    { href: "/", label: "All concepts", id: "home" },
    { href: "/proof", label: "01 Proof", id: "proof" },
    { href: "/movement", label: "02 Movement", id: "movement" },
    { href: "/future", label: "03 Future", id: "future" },
  ];
  return (
    <aside className="concept-switcher" aria-label="Switch design concept">
      <span>CONCEPT PREVIEW</span>
      <nav>
        {links.map((link) => (
          <a key={link.id} href={link.href} aria-current={active === link.id ? "page" : undefined}>
            {link.label}
          </a>
        ))}
      </nav>
      <em>Metrics are placeholders</em>
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
      <a className={`brand ${dark ? "brand-light" : "brand-dark"}`} href="/" aria-label="TRON Payments concepts home">
        <Mark />
        <span>TRON PAYMENTS</span>
      </a>
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

export function MetricBars({ light = false }: { light?: boolean }) {
  const heights = [22, 29, 25, 38, 44, 40, 58, 51, 69, 83, 76, 91];
  return (
    <div className={`metric-bars ${light ? "metric-bars-light" : ""}`} aria-label="Illustrative upward network activity trend">
      {heights.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
    </div>
  );
}

export function ProofStrip({ dark = false }: { dark?: boolean }) {
  const metrics = [
    ["24 / 7", "settlement"],
    ["GLOBAL", "reach"],
    ["LOW", "friction"],
    ["OPEN", "network"],
  ];
  return (
    <div className={`proof-strip ${dark ? "proof-strip-dark" : ""}`}>
      {metrics.map(([value, label]) => (
        <div key={value}><strong>{value}</strong><span>{label}</span></div>
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

export function SiteFooter({ dark = false }: { dark?: boolean }) {
  return (
    <footer className={`site-footer ${dark ? "site-footer-dark" : ""}`}>
      <div className="shell footer-inner">
        <div className="brand"><Mark /><span>TRON PAYMENTS</span></div>
        <p>Concept exploration. Placeholder metrics pending data sign-off.</p>
        <a href="/">Compare concepts</a>
      </div>
    </footer>
  );
}
