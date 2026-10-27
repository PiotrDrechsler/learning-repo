import Link from "next/link";

// Layout segmentu: otacza listę i szczegóły. Przy przejściu między nimi NIE renderuje się od nowa,
// zmienia się tylko {children}.
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stack">
      <header className="row" style={{ justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
        <Link href="/sandbox/004-solution" style={{ fontWeight: 800, textDecoration: "none" }}>
          🛒 Sklep
        </Link>
        <span className="muted">App Router · Server Components</span>
      </header>
      {children}
    </div>
  );
}
