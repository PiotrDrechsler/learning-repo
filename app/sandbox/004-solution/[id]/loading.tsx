// Next.js owija stronę tego segmentu w <Suspense> z tym komponentem jako fallbackiem.
// Użytkownik widzi szkielet od razu po kliknięciu, zanim serwer odda dane produktu.
export default function ProductLoading() {
  return (
    <div className="stack" role="status" aria-label="Ładowanie produktu">
      <div style={{ height: 14, width: 110, background: "var(--surface-2)", borderRadius: 4 }} />
      <div style={{ height: 30, width: "60%", background: "var(--surface-2)", borderRadius: 6 }} />
      <div style={{ height: 14, width: "30%", background: "var(--surface-2)", borderRadius: 4 }} />
      <div style={{ height: 14, width: "85%", background: "var(--surface-2)", borderRadius: 4 }} />
    </div>
  );
}
