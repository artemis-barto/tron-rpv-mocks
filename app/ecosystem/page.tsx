import type { Metadata } from "next";
import { ConceptSwitcher, LogoCloud, ProofStrip, SiteFooter, SiteHeader } from "../shared";

export const metadata: Metadata = {
  title: "Ecosystem Stories",
  description: "A modular, partner-led homepage direction for TRON Payments.",
};

export default function EcosystemPage() {
  return (
    <main className="ecosystem-page">
      <ConceptSwitcher active="ecosystem" />
      <SiteHeader active="ecosystem" />

      <section className="ecosystem-hero shell" id="why">
        <div className="ecosystem-hero-copy">
          <p className="eyebrow">The TRON payments ecosystem</p>
          <h1>Built by the companies turning stablecoins into everyday money.</h1>
          <p>Meet the wallets, payment providers, cards, ramps, and apps making the network useful.</p>
          <a className="button button-red" href="#ecosystem">Explore the ecosystem</a>
        </div>
        <a className="featured-story" href="#stories">
          <div className="featured-art"><i /><i /><i /><i /><i /></div>
          <span>FEATURED STORY</span>
          <h2>From balance to checkout.</h2>
          <p>How a payments partner brings TRON stablecoins into daily spending.</p>
          <b>Read the story →</b>
        </a>
      </section>

      <section className="logo-section shell" id="ecosystem">
        <div><p className="section-index">ECOSYSTEM</p><h2>A network of roles,<br />not a wall of logos.</h2></div>
        <LogoCloud />
      </section>

      <section className="ecosystem-bento shell" id="solutions">
        <article className="bento-intro"><p className="section-index">PAYMENT MOMENTS</p><h2>Start with what people need to do.</h2><p>Each solution becomes an editorial doorway into companies, evidence, and stories.</p></article>
        <a className="bento-card bento-p2p" href="#stories"><span>P2P</span><h3>Send money home.</h3><p>Faster, more accessible cross-border value transfer.</p><b>Explore →</b></a>
        <a className="bento-card bento-payroll" href="#stories"><span>PAYROLL</span><h3>Pay teams globally.</h3><p>Recurring payments without banking-hour constraints.</p><b>Explore →</b></a>
        <a className="bento-card bento-b2b" href="#stories"><span>B2B</span><h3>Settle with suppliers.</h3><p>Transparent and programmable business payments.</p><b>Explore →</b></a>
        <a className="bento-card bento-commerce" href="#stories"><span>COMMERCE</span><h3>Spend digital dollars.</h3><p>Stablecoin-linked cards and familiar checkout experiences.</p><b>Explore →</b></a>
      </section>

      <section className="ecosystem-proof"><div className="shell"><div><p className="section-index">NETWORK PROOF</p><h2>The evidence lives inside the story.</h2><p>Use one verified metric at the moment it helps a visitor understand scale.</p></div><div className="ecosystem-proof-number"><span>MONTHLY ACTIVITY</span><strong>$XXB</strong><em>Illustrative placeholder</em></div><ProofStrip /></div></section>

      <section className="story-list shell" id="stories">
        <div className="story-list-heading"><p className="section-index">LATEST STORIES</p><h2>The ecosystem in motion.</h2><a href="#build">View all stories →</a></div>
        <div className="story-list-grid">
          <article><div className="story-thumb thumb-red"><span>01</span></div><p>CASE STUDY</p><h3>How a wallet makes digital dollars useful across borders.</h3><a href="#build">Read story →</a></article>
          <article><div className="story-thumb thumb-black"><span>02</span></div><p>ECOSYSTEM</p><h3>The infrastructure connecting stablecoins to familiar payments.</h3><a href="#build">Read story →</a></article>
          <article><div className="story-thumb thumb-mint"><span>03</span></div><p>RESEARCH</p><h3>What network activity tells us about real payment behavior.</h3><a href="#build">Read story →</a></article>
        </div>
      </section>

      <section className="ecosystem-build shell" id="build"><div><p className="section-index">FOR BUILDERS</p><h2>Join the payments ecosystem.</h2></div><p>Developer documentation, tools, research, and integration guides can become the next layer of the property.</p><a className="button button-dark" href="#why">Start building</a></section>
      <SiteFooter />
    </main>
  );
}
