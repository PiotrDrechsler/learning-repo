"use client";

import { useState } from "react";

const LABELS = ["słabo", "tak sobie", "ok", "dobrze", "super"];

function Star({ fill }) {
  // fill: 0, 0.5 albo 1
  return (
    <span style={{ position: "relative", display: "inline-block", width: "1em", lineHeight: 1 }} aria-hidden>
      <span style={{ color: "var(--border)" }}>★</span>
      <span style={{ position: "absolute", inset: 0, width: `${fill * 100}%`, overflow: "hidden", color: "#f2b01e" }}>★</span>
    </span>
  );
}

function StarRating({ value, onChange, max = 5, readOnly = false, labels }) {
  const [hover, setHover] = useState(null); // jedyny stan wewnętrzny: podgląd
  const shown = hover ?? value;
  const clamp = (n) => Math.min(max, Math.max(1, n));

  if (readOnly) {
    return (
      <span role="img" aria-label={`Ocena: ${value} z ${max}`} style={{ fontSize: 26, display: "inline-flex", gap: 2 }}>
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} fill={Math.min(1, Math.max(0, Math.round((value - i) * 2) / 2))} />
        ))}
      </span>
    );
  }

  const onKeyDown = (e) => {
    const map = {
      ArrowRight: clamp(value + 1),
      ArrowUp: clamp(value + 1),
      ArrowLeft: clamp(value - 1),
      ArrowDown: clamp(value - 1),
      Home: 1,
      End: max,
    };
    if (e.key in map) {
      e.preventDefault();
      onChange(map[e.key]);
    }
  };

  return (
    <div className="row" style={{ gap: 10 }}>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Ocena"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`Ocena: ${value} z ${max}${labels?.[value - 1] ? `, ${labels[value - 1]}` : ""}`}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHover(null)}
        style={{ fontSize: 30, display: "inline-flex", gap: 2, cursor: "pointer", borderRadius: 6 }}
      >
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          return (
            <span
              key={n}
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n === value ? 0 : n)}
              title={labels?.[i] ?? `${n}`}
            >
              <Star fill={n <= shown ? 1 : 0} />
            </span>
          );
        })}
      </div>
      {labels && shown > 0 && <span className="muted">{labels[shown - 1]}</span>}
    </div>
  );
}

export default function Solution() {
  const [rating, setRating] = useState(0);

  return (
    <div className="stack">
      <StarRating value={rating} onChange={setRating} labels={LABELS} />
      <div className="row">
        <span>Twoja ocena: {rating}</span>
        <button type="button" onClick={() => setRating(0)} disabled={rating === 0}>
          Wyczyść (reset z zewnątrz)
        </button>
      </div>
      <div className="row">
        <StarRating value={4} readOnly />
        <StarRating value={3.5} readOnly />
        <span className="muted">tylko do odczytu, także połówki</span>
      </div>
    </div>
  );
}
