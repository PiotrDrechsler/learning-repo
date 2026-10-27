import Link from "next/link";

// Renderowany, gdy strona w tym segmencie wywoła notFound(). Odpowiedź ma status 404.
export default function ProductNotFound() {
  return (
    <div className="stack">
      <h1 style={{ margin: 0 }}>Nie ma takiego produktu</h1>
      <p className="muted">Sprawdź adres albo wybierz produkt z listy.</p>
      <Link href="/sandbox/004-solution">← Wszystkie produkty</Link>
    </div>
  );
}
