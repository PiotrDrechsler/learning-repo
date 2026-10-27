import { CATEGORIES, SORTS, listProducts } from "@/lib/sandbox-data";
import Filters from "./Filters";

// Treść zadania: README ćwiczenia 010.
// Teraz filtry żyją tylko w stanie komponentu klienckiego, a strona zawsze pokazuje pierwszą stronę wyników.
// Cel: stan filtrów, sortowania i strony ma być w URL (?q=&category=&sort=&page=).

export default async function CatalogPage() {
  const data = await listProducts({});

  return (
    <div className="stack">
      <h1 style={{ margin: 0 }}>Katalog</h1>
      <Filters categories={CATEGORIES} sorts={SORTS} />
      <p className="muted">
        Wyników: {data.total} · strona {data.page} z {data.totalPages}
      </p>
      <ul>
        {data.items.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> <span className="muted">· {p.category}</span>
            <div>
              {p.price} zł · ★ {p.rating}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
