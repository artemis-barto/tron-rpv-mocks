import type { Metadata } from "next";
import { ConceptSwitcher, LogoCloud, MetricBars, ProofStrip, SiteFooter, SiteHeader } from "../shared";
import { formatMonth, formatPercent, formatUSD, getTronPaymentsData } from "../data";

export const metadata: Metadata = {
  title: "Proof of Scale",
  description: "An editorial, evidence-led homepage direction for TRON Payments.",
};

export default async function ProofPage() {
  const data = await getTronPaymentsData();
  return (
    <main className="proof-page">
      <ConceptSwitcher active="proof" data={data} />
      <SiteHeader active="proof" />

      <section className="proof-hero shell" id="why">
        <div className="proof-hero-copy">
          <p className="eyebrow">The payments network</p>
          <h1>The rail moving digital dollars at global scale.</h1>
          <p className="hero-copy">Fast, affordable settlement for the ways money moves now - across borders, businesses, and everyday life.</p>
          <div className="button-row">
            <a className="button button-dark" href="#solutions">Explore payments</a>
            <a className="text-link" href="#proof">See the network proof <span>↓</span></a>
          </div>
        </div>
        <div className="proof-metric-card" id="proof">
          <div><span>Verified network proof</span><em>{formatMonth(data.asOf, true)}</em></div>
          <strong>{formatUSD(data.latestB2B)}</strong>
          <p>monthly B2B stablecoin volume</p>
          <MetricBars light series={data.b2bSeries} label="Monthly B2B stablecoin volume for the latest twelve complete months" />
        </div>
      </section>

      <section className="shell"><ProofStrip data={data} /></section>

      <section className="proof-thesis shell" id="solutions">
        <div>
          <p className="section-index">01 / WHY TRON</p>
          <h2>One network.<br />Many payment moments.</h2>
        </div>
        <div className="thesis-copy">
          <p>Stablecoins make digital dollars programmable. TRON gives those dollars a proven network to move on - quickly, globally, and around the clock.</p>
          <a href="#use-cases">Follow the payment story →</a>
        </div>
      </section>

      <section className="use-case-grid shell" id="use-cases">
        <article className="use-case-feature">
          <span>B2B SETTLEMENT</span>
          <h3>Pay suppliers globally without rebuilding the finance stack.</h3>
          <p>Move funds between businesses with transparent, programmable settlement.</p>
          <a href="#stories">Explore B2B payments →</a>
        </article>
        <article><b>01</b><span>PAYROLL + PAYOUTS</span><h3>Pay global teams on their schedule.</h3><p>Faster distribution for recurring and on-demand payments.</p></article>
        <article><b>02</b><span>PERSON TO PERSON</span><h3>Send digital dollars where they are needed.</h3><p>Borderless value transfer without banking-hour constraints.</p></article>
        <article><b>03</b><span>CARDS + COMMERCE</span><h3>Turn stablecoin balances into daily spending.</h3><p>Connect onchain funds to familiar checkout experiences.</p></article>
      </section>

      <section className="ecosystem-band" id="ecosystem">
        <div className="shell">
          <div className="band-heading"><p className="section-index">02 / ECOSYSTEM</p><h2>Built into the way money moves.</h2></div>
          <LogoCloud />
        </div>
      </section>

      <section className="proof-story shell" id="stories">
        <div className="story-visual"><span>FEATURED OUTCOME</span><div className="story-orbit"><i /><i /><i /></div></div>
        <div className="story-copy">
          <p className="section-index">03 / CASE STUDY</p>
          <h2>From balance to checkout.</h2>
          <p>See how a payments partner can bring TRON stablecoins into everyday spending with a familiar customer experience.</p>
          <div className="story-stat"><strong>{formatPercent(data.trackedPaymentsYoY)}</strong><span>tracked payment volume YoY</span></div>
          <a className="button button-red" href="#build">Read the story</a>
        </div>
      </section>

      <section className="build-cta shell" id="build">
        <p className="section-index">04 / BUILD</p>
        <h2>Make TRON part of your payments stack.</h2>
        <div><a className="button button-light" href="#why">Explore developer resources</a><span>Documentation and developer content are planned for the next phase.</span></div>
      </section>
      <SiteFooter data={data} />
    </main>
  );
}
