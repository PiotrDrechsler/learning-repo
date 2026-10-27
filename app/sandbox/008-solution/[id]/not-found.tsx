import Link from "next/link";

// Renderowany po wywołaniu notFound() w tym segmencie; odpowiedź ma status 404.
export default function ProductNotFound() {
  return (
    <div className="stack">
      <h2 style={{ margin: 0 }}>Nie znaleźliśmy tego produktu</h2>
      <p className="muted">Mógł zostać usunięty albo adres jest błędny.</p>
      <Link href="/sandbox/008-solution/1">← Wróć do produktu 1</Link>
    </div>
  );
}
