"use client";

import { useState } from "react";

// TODO: zaimplementuj stoper zgodnie z README.
export default function Exercise() {
  const [elapsedMs] = useState(0);

  return (
    <div className="stack">
      <div style={{ fontFamily: "var(--mono)", fontSize: 48, fontWeight: 700 }}>{elapsedMs}</div>
      <div className="row">
        <button type="button">Start</button>
        <button type="button">Okrążenie</button>
        <button type="button">Reset</button>
      </div>
    </div>
  );
}
