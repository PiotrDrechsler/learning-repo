import Link from "next/link";
import { Suspense } from "react";
import { CATEGORIES, SORTS, listProducts } from "@/lib/sandbox-data";
import Filters from "./Filters";
import { catalogHref, parseCatalogParams, type CatalogParams } from "./params";

const BASE = "/sandbox/010-solution";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Źródłem prawdy jest URL: link można wysłać komuś, odświeżyć stronę, a "Wstecz" cofa filtr.
export default async function CatalogPage({ searchParams }: Props) {
  const params = parseCatalogParams(await searchParams);

  return (
    <div className="stack">
      <h1 style={{ margin: 0 }}>Katalog</h1>
      <Filters q={params.q} category={params.category ?? ""} sort={params.sort} categories={CATEGORIES} sorts={SORTS} />
      {/* key: każda zmiana filtrów to nowy boundary, więc znów widać fallback zamiast starych wyników */}
      <Suspense key={JSON.stringify(params)} fallback={<p className="muted">Ładowanie wyników…</p>}>
        <Results params={params} />
      </Suspense>
    </div>
  );
}

async function Results({ params }: { params: CatalogParams }) {
  const data = await listProducts({
    q: params.q,
    category: params.category ?? undefined,
    sort: params.sort,
    page: params.page,
  });

  if (data.total === 0) {
    return (
      <p className="muted">
        Brak wyników. <Link href={BASE}>Wyczyść filtry</Link>
      </p>
    );
  }

  // Strona z URL mogła być za duża (np. ?page=99): listProducts ją przycina, pokazujemy faktyczną.
  const current = { ...params, page: data.page };

  return (
    <>
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
      <nav className="row" aria-label="Strony wyników">
        {data.page > 1 ? <Link href={catalogHref(BASE, current, { page: data.page - 1 })}>← Poprzednia</Link> : null}
        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((n) =>
          n === data.page ? (
            <strong key={n} aria-current="page">
              {n}
            </strong>
          ) : (
            <Link key={n} href={catalogHref(BASE, current, { page: n })}>
              {n}
            </Link>
          ),
        )}
        {data.page < data.totalPages ? <Link href={catalogHref(BASE, current, { page: data.page + 1 })}>Następna →</Link> : null}
      </nav>
    </>
  );
}
