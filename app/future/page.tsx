import type { Metadata } from "next";
import { ConceptSwitcher, Mark, ProofStrip, SiteFooter, SiteHeader } from "../shared";

export const metadata: Metadata = {
  title: "Future Protocol",
  description: "A TRON-red, programmable-money homepage direction for TRON Payments.",
};

const capabilities = [
  { number: "01", tag: "CONDITIONAL", title: "Payments that respond to rules.", copy: "Settle when work is verified, goods arrive, or software triggers the next action." },
  { number: "02", tag: "AUTONOMOUS", title: "Infrastructure for agentic commerce.", copy: "Give software and connected services a programmable way to exchange stable value." },
  { number: "03", tag: "EMBEDDED", title: "Money inside the product experience.", copy: "Integrate wallets, payouts, and settlement without making the network the interface." },
  { number: "04", tag: "GLOBAL", title: "One rail across markets and time zones.", copy: "Move digital dollars around the clock through an open global network." },
];

export default function FuturePage() {
  return (
    <main className="future-page">
      <ConceptSwitcher active="future" />
      <div className="future-shell-top">
        <SiteHeader active="future" dark />

        <section className="future-hero shell" id="why">
          <div className="future-hero-copy">
            <div className="future-status"><i /> NETWORK ONLINE <span>BLOCK // LIVE</span></div>
            <p className="eyebrow">TRON / NEXT-GENERATION PAYMENTS</p>
            <h1>The payment layer for what comes next.</h1>
            <p>Programmable digital dollars for businesses, people, and autonomous software - moving on one global network.</p>
            <div className="future-actions">
              <a href="#solutions">Explore the protocol <span>↘</span></a>
              <a href="#proof">View network proof</a>
            </div>
          </div>

          <div className="future-core" aria-label="Abstract layered payment protocol visualization">
            <div className="future-grid" />
            <div className="core-ring core-ring-one" /><div className="core-ring core-ring-two" /><div className="core-ring core-ring-three" />
            <div className="core-axis core-axis-x" /><div className="core-axis core-axis-y" />
            <div className="core-chip"><Mark /><strong>TRON</strong><span>PAYMENT<br />PROTOCOL</span></div>
            <div className="core-packet packet-one"><b>01</b><span>INITIATE</span><i /></div>
            <div className="core-packet packet-two"><b>02</b><span>VERIFY</span><i /></div>
            <div className="core-packet packet-three"><b>03</b><span>SETTLE</span><i /></div>
            <div className="core-readout readout-one"><span>LATENCY</span><b>LOW</b></div>
            <div className="core-readout readout-two"><span>UPTIME</span><b>24 / 7</b></div>
            <div className="core-readout readout-three"><span>REACH</span><b>GLOBAL</b></div>
          </div>
        </section>

        <section className="future-telemetry shell" id="proof">
          <div><span>NETWORK ACTIVITY</span><strong>$XXB</strong><em>MONTHLY / PLACEHOLDER</em></div>
          <div><span>SETTLEMENT</span><strong>24 / 7</strong><em>ALWAYS AVAILABLE</em></div>
          <div><span>INTEGRATION MODE</span><strong>OPEN</strong><em>PROGRAMMABLE RAILS</em></div>
          <div className="telemetry-wave" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} />)}</div>
        </section>
      </div>

      <section className="future-intro shell" id="solutions">
        <div><p className="section-index">01 / PROGRAMMABLE BY DEFAULT</p><h2>Money becomes a system primitive.</h2></div>
        <p>Present TRON as the infrastructure underneath new payment experiences - from automated treasury movement to software-mediated commerce.</p>
      </section>

      <section className="future-capability-grid shell">
        {capabilities.map((capability) => (
          <article key={capability.number}>
            <div className="capability-top"><span>{capability.number}</span><i /></div>
            <p>{capability.tag}</p>
            <h3>{capability.title}</h3>
            <div className="capability-scan"><i /><i /><i /><i /><i /></div>
            <span>{capability.copy}</span>
          </article>
        ))}
      </section>

      <section className="future-protocol" id="ecosystem">
        <div className="shell future-protocol-inner">
          <div className="protocol-copy">
            <p className="section-index">02 / ONE RAIL, MANY INTERFACES</p>
            <h2>The network disappears. The experience gets better.</h2>
            <p>Make the site feel future-facing without becoming a product dashboard: simple claims, cinematic signals, and clear examples of what the infrastructure enables.</p>
          </div>
          <div className="protocol-stack">
            <article><span>01 / INTERFACE</span><b>WALLETS · APPS · AGENTS</b><i>USER EXPERIENCE</i></article>
            <article><span>02 / LOGIC</span><b>RULES · ESCROW · AUTOMATION</b><i>PROGRAMMABLE LAYER</i></article>
            <article><span>03 / RAIL</span><b>TRON PAYMENT NETWORK</b><i>GLOBAL SETTLEMENT</i></article>
            <div className="stack-beam" />
          </div>
        </div>
      </section>

      <section className="future-use-cases shell" id="stories">
        <div className="future-use-heading"><p className="section-index">03 / FUTURE PAYMENT MOMENTS</p><h2>Designed for the next transaction.</h2></div>
        <div className="future-use-grid">
          <a href="#build"><span>01</span><p>AUTONOMOUS COMMERCE</p><h3>Software pays software.</h3><i>EXPLORE ↗</i></a>
          <a href="#build"><span>02</span><p>GLOBAL OPERATIONS</p><h3>Treasury moves continuously.</h3><i>EXPLORE ↗</i></a>
          <a href="#build"><span>03</span><p>CONDITIONAL PAYOUTS</p><h3>Value settles when work is done.</h3><i>EXPLORE ↗</i></a>
        </div>
      </section>

      <section className="future-proof shell">
        <div className="future-proof-copy"><p className="section-index">04 / PROVEN NETWORK</p><h2>Future-facing.<br />Grounded in proof.</h2><p>The page still earns trust with verified network evidence - it simply presents that evidence as part of a bigger vision.</p></div>
        <div className="future-proof-panel"><span>LIVE SIGNAL / ILLUSTRATIVE</span><strong>$XXB</strong><p>monthly stablecoin activity</p><div className="future-proof-line"><i /><i /><i /><i /><i /><i /><i /></div></div>
        <ProofStrip />
      </section>

      <section className="future-build" id="build">
        <div className="shell"><div><span>BUILD // 2026+</span><h2>Program the next way money moves.</h2></div><a href="#why">ENTER DEVELOPER MODE <i>↗</i></a></div>
      </section>
      <SiteFooter dark />
    </main>
  );
}
