import type { Metadata } from "next";
import { ConceptSwitcher, Mark, SiteFooter, SiteHeader } from "../shared";

export const metadata: Metadata = {
  title: "Payments Live",
  description: "A proof-first institutional payments homepage direction for TRON Payments.",
};

const proofPoints = [
  ["$XXB", "MONTHLY STABLECOIN TRANSFERS"],
  ["$XXM", "MONTHLY PAYMENT VOLUME"],
  ["24 / 7", "GLOBAL SETTLEMENT"],
  ["LOW", "MEDIAN NETWORK FEE"],
];

const solutions = [
  ["01", "Cross-border settlement", "Move stable value between markets without waiting for banking hours."],
  ["02", "Merchant payments", "Give customers a direct, digital-dollar payment path across devices and channels."],
  ["03", "Treasury operations", "Coordinate balances, payouts, and working capital on one always-on rail."],
  ["04", "Embedded finance", "Put stablecoin settlement underneath a familiar product experience."],
];

export default function LivePage() {
  return (
    <main className="live-page">
      <ConceptSwitcher active="live" />
      <div className="live-top">
        <SiteHeader active="live" dark />

        <section className="live-hero shell" id="why">
          <div className="live-hero-copy">
            <p className="live-mono">TRON MAINNET / STABLECOIN PAYMENTS</p>
            <h1>Payments,<br /><em>already in motion.</em></h1>
            <p>TRON is an always-on network for stable value—supporting the payment experiences businesses and people use every day.</p>
            <div className="live-hero-actions">
              <a href="#proof">Explore the network <span>→</span></a>
              <span><i /> MAINNET ACTIVE</span>
            </div>
          </div>

          <div className="live-signal" aria-label="Abstract live network signal visualization">
            <div className="live-signal-grid" />
            <div className="signal-halo signal-halo-one" />
            <div className="signal-halo signal-halo-two" />
            <div className="signal-mark"><Mark /><b>TRON</b></div>
            <div className="signal-panel signal-panel-one"><span>NETWORK</span><b>ONLINE</b><i /></div>
            <div className="signal-panel signal-panel-two"><span>SETTLEMENT</span><b>24 / 7</b><i /></div>
            <div className="signal-route route-one" /><div className="signal-route route-two" />
          </div>
        </section>

        <section className="live-proof-strip shell" id="proof">
          {proofPoints.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </section>
      </div>

      <section className="live-demo shell" id="solutions">
        <div className="live-section-copy">
          <p className="live-mono">01 / PRODUCT MOMENT</p>
          <h2>Make the network tangible.</h2>
          <p>Use a focused payment moment to turn infrastructure into something immediate and understandable—without making the whole site feel like an app.</p>
        </div>
        <div className="payment-demo-card">
          <div className="demo-top"><span>TRON PAY</span><em>ILLUSTRATIVE</em></div>
          <div className="demo-wallet"><span>AVAILABLE</span><strong>$2,480.00</strong><small>USDT · TRON</small></div>
          <div className="demo-recipient"><span>RECIPIENT</span><b>TR7x ···· 4F2A</b><i>VERIFIED</i></div>
          <div className="demo-amount"><span>PAYMENT AMOUNT</span><strong>$250.00</strong></div>
          <div className="demo-button">PREVIEW PAYMENT <span>→</span></div>
          <p>No transaction is initiated in this concept preview.</p>
        </div>
      </section>

      <section className="live-enterprise" id="ecosystem">
        <div className="shell live-enterprise-inner">
          <div className="live-section-copy">
            <p className="live-mono">02 / NETWORK PROOF</p>
            <h2>Enterprise-grade infrastructure, presented with confidence.</h2>
            <p>Pair a decisive narrative with compact, legible evidence. Keep metrics in context and give every chart a reason to exist.</p>
          </div>
          <div className="live-chart-card">
            <div className="chart-heading"><span>ILLUSTRATIVE NETWORK ACTIVITY</span><em>30 DAYS</em></div>
            <div className="chart-bars" aria-hidden="true">{[26,31,38,34,46,54,50,66,63,78,74,92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
            <div className="chart-axis"><span>DAY 01</span><span>DAY 30</span></div>
            <div className="chart-note"><i /><span>TRON PAYMENT ACTIVITY</span><b>UPWARD SIGNAL</b></div>
          </div>
        </div>
      </section>

      <section className="live-ecosystem shell">
        <div className="live-ecosystem-heading"><p className="live-mono">03 / USED ACROSS THE STACK</p><h2>One network. Many ways to build.</h2></div>
        <div className="live-logo-line" aria-label="Illustrative ecosystem categories">
          {["ISSUERS", "WALLETS", "EXCHANGES", "PAYMENT PROVIDERS", "ONRAMPS", "FINTECHS"].map((item, index) => <span key={item}><i>0{index + 1}</i>{item}</span>)}
        </div>
      </section>

      <section className="live-control">
        <div className="shell live-control-inner">
          <div className="control-index"><span>INSTITUTIONAL READINESS</span><b>04</b></div>
          <div className="control-copy"><p className="live-mono">CONTROL / COMPLIANCE / CONNECTIVITY</p><h2>Built for open access.<br />Designed for real operations.</h2><p>Frame institutional requirements as a modular system: policy-aligned asset controls, transparent settlement, and an ecosystem of specialized providers.</p></div>
          <div className="control-modules">
            <article><span>01</span><div><b>ASSET CONTROLS</b><p>Support policy-aware payment products.</p></div><i>↗</i></article>
            <article><span>02</span><div><b>TRANSPARENT SETTLEMENT</b><p>Make transaction state clear and auditable.</p></div><i>↗</i></article>
            <article><span>03</span><div><b>MODULAR PROVIDERS</b><p>Connect the services each market requires.</p></div><i>↗</i></article>
          </div>
        </div>
      </section>

      <section className="live-solutions shell" id="stories">
        <div className="live-solutions-heading"><p className="live-mono">05 / SOLUTIONS</p><h2>Start with the payment need.</h2><p>Lead each module with a recognizable business problem, then show why TRON is a credible rail underneath it.</p></div>
        <div className="live-solutions-list">
          {solutions.map(([number, title, copy]) => <a href="#build" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><i>→</i></a>)}
        </div>
      </section>

      <section className="live-build" id="build">
        <div className="shell"><p className="live-mono">READY TO MOVE VALUE?</p><h2>Bring the next payment experience to life.</h2><a href="#why">BUILD ON TRON <span>↗</span></a></div>
      </section>

      <SiteFooter dark />
    </main>
  );
}
