"use client";

import { useState } from "react";

// TODO: zaimplementuj komponent zgodnie z README.
function StarRating({ value, onChange, max = 5, readOnly = false }) {
  return (
    <div>
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function Exercise() {
  const [rating, setRating] = useState(0);

  return (
    <div className="stack">
      <StarRating value={rating} onChange={setRating} />
      <p>Twoja ocena: {rating}</p>
      <StarRating value={4} readOnly />
    </div>
  );
}
