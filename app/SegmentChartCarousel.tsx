"use client";

import { useEffect, useState } from "react";
import type { PaymentSegment, VolumePoint } from "./data";

export type SegmentChartItem = {
  id: PaymentSegment;
  label: string;
  sourceLabel: string;
  latestLabel: string;
  startLabel: string;
  endLabel: string;
  available: boolean;
  series: VolumePoint[];
};

const AUTO_ADVANCE_MS = 4500;

function heights(series: VolumePoint[]): number[] {
  if (series.length === 0) return [];
  const max = Math.max(...series.map((point) => point.volume));
  if (max === 0) return series.map(() => 8);
  return series.map((point) => Math.max(8, Math.round((point.volume / max) * 100)));
}

export function SegmentChartCarousel({ items }: { items: SegmentChartItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const active = items[activeIndex] ?? items[0];
  const chartHeights = heights(active?.series ?? []);

  useEffect(() => {
    if (!playing || interacting || items.length < 2) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, interacting, items.length, playing]);

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  }

  if (!active) return null;

  return (
    <div
      className={`stacked-data-card segment-carousel-card carousel-segment-${active.id.toLowerCase()}`}
      aria-label="Monthly payment volume by segment"
      aria-roledescription="carousel"
      onPointerEnter={() => setInteracting(true)}
      onPointerLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
    >
      <div className="carousel-heading">
        <div className="data-card-top">
          <span>MONTHLY {active.id} PAYMENT VOLUME</span>
          <em>LATEST 12 COMPLETE MONTHS</em>
        </div>
        <div className="carousel-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Show previous payment segment">←</button>
          <button
            className="carousel-play"
            type="button"
            onClick={() => setPlaying((current) => !current)}
            aria-label={playing ? "Pause automatic chart rotation" : "Resume automatic chart rotation"}
            aria-pressed={!playing}
          >
            {playing ? "Ⅱ" : "▶"}
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Show next payment segment">→</button>
        </div>
      </div>

      <div className="carousel-meta">
        <strong>{active.id}</strong>
        <span>{active.label}</span>
        <b>{active.latestLabel}</b>
        <em>{active.sourceLabel}</em>
      </div>

      <div className="proof-carousel-stage" key={active.id}>
        {active.available && chartHeights.length > 0 ? (
          <div
            className="proof-carousel-bars"
            role="img"
            aria-label={`${active.id} monthly volume from ${active.startLabel} to ${active.endLabel}`}
          >
            {chartHeights.map((height, index) => (
              <i key={active.series[index].month} style={{ height: `${height}%` }} />
            ))}
          </div>
        ) : (
          <div className="carousel-empty">
            <strong>{active.id}</strong>
            <span>This segment is not returned by the current verified source.</span>
          </div>
        )}
      </div>

      <div className="stacked-data-axis"><span>{active.startLabel}</span><span>{active.endLabel}</span></div>
      <div className="carousel-tabs" aria-label="Choose a payment segment">
        {items.map((item, index) => (
          <button
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            key={item.id}
          >
            <i className={`bar-${item.id.toLowerCase()}`} />
            <span>{item.id}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Showing {active.id}: {active.label}</p>
    </div>
  );
}
