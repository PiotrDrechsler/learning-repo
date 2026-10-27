// Pokazuje się od razu po nawigacji, dopóki strona czeka na produkt (Suspense dla całego segmentu).
export default function Loading() {
  return (
    <div className="stack" role="status" aria-label="Ładowanie produktu">
      <div style={{ height: 28, width: "55%", background: "var(--surface-2)", borderRadius: 6 }} />
      <div style={{ height: 14, width: "35%", background: "var(--surface-2)", borderRadius: 4 }} />
      <div style={{ height: 14, width: "80%", background: "var(--surface-2)", borderRadius: 4 }} />
    </div>
  );
}
