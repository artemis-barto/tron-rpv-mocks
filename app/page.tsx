import type { Metadata } from "next";
import { ConceptSwitcher, Mark, SiteFooter } from "./shared";

export const metadata: Metadata = {
  title: "Choose a design direction",
  description:
    "Compare Proof of Scale, Global Movement, and Ecosystem Stories for TRON Payments.",
};

const concepts = [
  {
    href: "/proof",
    number: "01",
    title: "Proof of Scale",
    tone: "Editorial / assured / institutional",
    description:
      "A clear payments thesis supported by one decisive metric, compact proof, and a restrained editorial system.",
    className: "card-proof",
    best: "Best foundation",
  },
  {
    href: "/movement",
    number: "02",
    title: "Global Movement",
    tone: "Immersive / dynamic / brand-led",
    description:
      "A living global network where payment journeys, routes, and settlement moments become the visual identity.",
    className: "card-movement",
    best: "Highest impact",
  },
  {
    href: "/ecosystem",
    number: "03",
    title: "Ecosystem Stories",
    tone: "Modular / human / content-led",
    description:
      "A flexible publishing system built around partners, use cases, case studies, and a growing payments ecosystem.",
    className: "card-ecosystem",
    best: "Best content engine",
  },
];

export default function Home() {
  return (
    <main className="chooser-page">
      <ConceptSwitcher active="home" />
      <header className="chooser-header shell">
        <a className="brand brand-dark" href="/" aria-label="TRON Payments design concepts home">
          <Mark />
          <span>TRON PAYMENTS</span>
        </a>
        <span className="chooser-kicker">INTERACTIVE DESIGN REVIEW</span>
      </header>

      <section className="chooser-intro shell">
        <div>
          <p className="eyebrow">Three creative routes</p>
          <h1>Same story.<br />Different posture.</h1>
        </div>
        <div className="chooser-lede">
          <p>
            Open each concept as a real responsive homepage. The core content and placeholder metrics stay consistent so the layout, mood, and storytelling approach are easy to compare.
          </p>
          <span>Recommended starting point: Proof of Scale + Ecosystem Stories.</span>
        </div>
      </section>

      <section className="concept-grid shell" aria-label="Design concepts">
        {concepts.map((concept) => (
          <a className={`concept-card ${concept.className}`} href={concept.href} key={concept.href}>
            <div className="concept-card-top">
              <span>{concept.number}</span>
              <span className="concept-tag">{concept.best}</span>
            </div>
            <div className="concept-mini" aria-hidden="true">
              <span className="mini-nav" />
              <span className="mini-title mini-title-one" />
              <span className="mini-title mini-title-two" />
              <span className="mini-copy" />
              <span className="mini-panel" />
              <span className="mini-card mini-card-one" />
              <span className="mini-card mini-card-two" />
              <span className="mini-card mini-card-three" />
            </div>
            <div className="concept-card-body">
              <p>{concept.tone}</p>
              <h2>{concept.title}</h2>
              <span>{concept.description}</span>
              <strong>Open concept <i aria-hidden="true">↗</i></strong>
            </div>
          </a>
        ))}
      </section>

      <section className="review-guide shell">
        <span>How to review</span>
        <div><b>01</b><p>Judge the first impression before reading every detail.</p></div>
        <div><b>02</b><p>Notice how the same proof is framed in each route.</p></div>
        <div><b>03</b><p>Choose the posture, then combine the strongest modules.</p></div>
      </section>
      <SiteFooter dark />
    </main>
  );
}
