import Link from "next/link";

// Folder z podkreśleniem (_shared) nie tworzy trasy w App Routerze.
const LINKS = [
  { id: 1, label: "1" },
  { id: 2, label: "2" },
  { id: 7, label: "7" },
  { id: 13, label: "13 (błąd opinii)" },
  { id: 999, label: "999 (nie istnieje)" },
];

export default function ProductNav({ base }: { base: string }) {
  return (
    <nav className="row" aria-label="Produkty" style={{ marginBottom: 16 }}>
      <span className="muted">Produkt:</span>
      {LINKS.map((l) => (
        <Link key={l.id} href={`${base}/${l.id}`}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
