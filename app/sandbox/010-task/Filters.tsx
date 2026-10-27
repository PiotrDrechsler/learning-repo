"use client";

import { useState } from "react";

type Props = { categories: readonly string[]; sorts: readonly string[] };

// TODO: ten stan nie trafia ani do URL, ani do serwera. Przenieś go do searchParams.
export default function Filters({ categories, sorts }: Props) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("relevance");

  return (
    <div className="row">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Szukaj produktu…" aria-label="Szukaj" />
      <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Kategoria">
        <option value="">Wszystkie kategorie</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sortowanie">
        {sorts.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
