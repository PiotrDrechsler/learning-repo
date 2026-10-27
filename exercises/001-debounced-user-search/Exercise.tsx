"use client";

import { useState } from "react";

type User = { id: number; name: string; email: string; city: string };
type UsersResponse = { results: User[]; total: number };

// TODO: zaimplementuj wyszukiwarkę zgodnie z README.
// API: GET /api/users?q=<fraza>  ->  UsersResponse
export default function Exercise() {
  const [query, setQuery] = useState("");

  return (
    <div className="stack">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj użytkownika…"
        aria-label="Szukaj użytkownika"
      />
      <p className="muted">Wpisz frazę, np. „anna” albo „kraków”.</p>
    </div>
  );
}
