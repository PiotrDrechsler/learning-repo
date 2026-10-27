"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

type Props = {
  q: string;
  category: string;
  sort: string;
  categories: readonly string[];
  sorts: readonly string[];
};

const SORT_LABELS: Record<string, string> = {
  relevance: "Trafność",
  "price-asc": "Cena rosnąco",
  "price-desc": "Cena malejąco",
  rating: "Ocena",
};

/** Filtry nie mają własnej "prawdy": czytają wartości z URL (przez propsy z serwera) i zmieniają URL. */
export default function Filters({ q, category, sort, categories, sorts }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Tekst wyszukiwania ma lokalny stan, bo URL aktualizujemy dopiero po debounce.
  const [text, setText] = useState(q);
  const lastSentQ = useRef(q);

  // URL zmienił się z zewnątrz (Wstecz, link "Wyczyść filtry")? Zsynchronizuj input.
  // Nie nadpisujemy tekstu, który sami właśnie wysłaliśmy, bo użytkownik mógł w tym czasie pisać dalej.
  useEffect(() => {
    if (q !== lastSentQ.current) {
      lastSentQ.current = q;
      setText(q);
    }
  }, [q]);

  const navigate = (patch: Record<string, string>, mode: "push" | "replace") => {
    // window.location.search zamiast useSearchParams: zawsze aktualne, także w odroczonym (debounce) wywołaniu.
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // nowy filtr = wracamy na 1. stronę
    const qs = params.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      if (mode === "push") router.push(href, { scroll: false });
      else router.replace(href, { scroll: false });
    });
  };

  // Debounce: URL (i zapytanie na serwerze) zmienia się 300 ms po ostatnim znaku.
  useEffect(() => {
    const value = text.trim();
    if (value === lastSentQ.current) return;
    const id = setTimeout(() => {
      lastSentQ.current = value;
      navigate({ q: value }, "replace"); // pisanie nie zaśmieca historii przeglądarki
    }, 300);
    return () => clearTimeout(id);
    // navigate celowo poza zależnościami: czyta świeży URL z window.location
  }, [text]);

  return (
    <div className="row" aria-busy={isPending}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Szukaj produktu…" aria-label="Szukaj" />
      <select value={category} onChange={(e) => navigate({ category: e.target.value }, "push")} aria-label="Kategoria">
        <option value="">Wszystkie kategorie</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => navigate({ sort: e.target.value === "relevance" ? "" : e.target.value }, "push")}
        aria-label="Sortowanie"
      >
        {sorts.map((s) => (
          <option key={s} value={s}>
            {SORT_LABELS[s] ?? s}
          </option>
        ))}
      </select>
      {isPending && <span className="muted">Aktualizuję…</span>}
    </div>
  );
}
