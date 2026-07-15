import type { Metadata } from "next";
import { ConceptSwitcher, Mark, ProofStrip, SiteFooter, SiteHeader } from "../shared";
import { getTronPaymentsData } from "../data";

export const metadata: Metadata = {
  title: "Global Movement",
  description: "An immersive, network-in-motion homepage direction for TRON Payments.",
};

const nodes = Array.from({ length: 14 }, (_, index) => index + 1);

export default async function MovementPage() {
  const data = await getTronPaymentsData();
  return (
    <main className="movement-page">
      <ConceptSwitcher active="movement" data={data} />
      <SiteHeader active="movement" dark />

      <section className="movement-hero shell" id="why">
        <div className="movement-copy">
          <p className="eyebrow">A global settlement network</p>
          <h1>Money<br />moves here.</h1>
          <p>One network connecting wallets, businesses, and people across borders.</p>
          <a className="signal-button" href="#journeys">Follow a payment <span>↘</span></a>
        </div>
        <div className="network-field" aria-label="Abstract visualization of global payment routes">
          <div className="network-glow" />
          {nodes.map((node) => <i className={`network-node node-${node}`} key={node}><span /></i>)}
          <b className="route-arc arc-1" /><b className="route-arc arc-2" /><b className="route-arc arc-3" /><b className="route-arc arc-4" /><b className="route-arc arc-5" />
          <div className="network-center"><Mark /><span>TRON</span></div>
        </div>
      </section>

      <section className="route-feed shell" id="journeys">
        <article><span>PAYROLL · EXAMPLE</span><h3>Singapore <i>→</i> Manila</h3><p><b>PAYMENT JOURNEY</b> · 24 / 7</p></article>
        <article><span>B2B · EXAMPLE</span><h3>Dubai <i>→</i> Lagos</h3><p><b>PAYMENT JOURNEY</b> · GLOBAL</p></article>
        <article><span>P2P · EXAMPLE</span><h3>São Paulo <i>→</i> Lisbon</h3><p><b>PAYMENT JOURNEY</b> · ALWAYS ON</p></article>
        <div className="route-ticker"><b>HOW VALUE MOVES</b><span>WALLET</span><i>→</i><span>NETWORK</span><i>→</i><span>SETTLEMENT</span><i>→</i><span>RECIPIENT</span></div>
      </section>

      <section className="movement-proof shell"><ProofStrip dark data={data} /></section>

      <section className="journey-story shell" id="solutions">
        <div className="journey-sticky">
          <p className="section-index">A PAYMENT JOURNEY</p>
          <h2>From intent<br />to settlement.</h2>
          <p>The story unfolds as a sequence, turning infrastructure into something people can immediately understand.</p>
        </div>
        <div className="journey-steps">
          <article><b>01</b><div><span>INITIATE</span><h3>A person or business starts a payment.</h3><p>From a wallet, app, payroll platform, or checkout experience.</p></div></article>
          <article><b>02</b><div><span>VERIFY</span><h3>The network validates the transfer.</h3><p>Open infrastructure makes the movement visible and programmable.</p></div></article>
          <article><b>03</b><div><span>SETTLE</span><h3>Digital dollars arrive across borders.</h3><p>Value moves without banking-hour constraints or a chain of intermediaries.</p></div></article>
        </div>
      </section>

      <section className="movement-cases" id="ecosystem">
        <div className="shell">
          <p className="section-index">USE THE NETWORK</p>
          <h2>Every route starts with a real payment need.</h2>
          <div className="movement-case-grid">
            <a href="#stories"><span>01</span><h3>Pay a global team</h3><p>Payroll + payouts</p><i>↗</i></a>
            <a href="#stories"><span>02</span><h3>Settle with suppliers</h3><p>B2B payments</p><i>↗</i></a>
            <a href="#stories"><span>03</span><h3>Send money home</h3><p>Person to person</p><i>↗</i></a>
            <a href="#stories"><span>04</span><h3>Spend digital dollars</h3><p>Cards + commerce</p><i>↗</i></a>
          </div>
        </div>
      </section>

      <section className="movement-story shell" id="stories">
        <div><p className="section-index">FEATURED ROUTE</p><h2>One payment.<br />A world of context.</h2></div>
        <div className="story-route-line"><i /><i /><i /><i /></div>
        <div><p>Pair live or verified payment evidence with a human story: who sent it, why it mattered, and what changed.</p><a href="#build">Read a payment story →</a></div>
      </section>

      <section className="movement-build" id="build">
        <div className="shell"><span>BUILD THE NEXT ROUTE</span><h2>Bring your payment product to TRON.</h2><a href="#why">Explore developer resources ↗</a></div>
      </section>
      <SiteFooter dark data={data} />
    </main>
  );
}
