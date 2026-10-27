import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { getProduct, getRecommendations, getReviews, type Product, type Review } from "@/lib/sandbox-data";
import ProductNav from "../../_shared/ProductNav";

const BASE = "/sandbox/008-solution";

type Props = { params: Promise<{ id: string }> };

// cache() deduplikuje wywołanie w obrębie jednego requestu:
// generateMetadata i strona pytają o produkt, a "baza" dostaje jedno zapytanie.
const getProductOnce = cache(getProduct);

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) notFound();
  return id;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductOnce(Number(id));
  return { title: product ? product.name : "Produkt nie istnieje" };
}

export default async function ProductPage({ params }: Props) {
  const id = parseId((await params).id);

  // Wolne zapytania startują OD RAZU, równolegle z produktem (bez waterfalla).
  // Nie czekamy na nie tutaj: oczekują na nie komponenty w <Suspense>.
  const reviewsPromise = getReviews(id);
  const recommendationsPromise = getRecommendations(id);
  // Gdy niżej padnie notFound(), nikt nie poczeka na te obietnice.
  // Pusty catch oznacza odrzucenie jako obsłużone (bez "unhandled rejection"), a <Reviews> i tak dostanie błąd.
  reviewsPromise.catch(() => {});
  recommendationsPromise.catch(() => {});

  const product = await getProductOnce(id);
  if (!product) notFound();

  return (
    <div className="stack">
      <ProductNav base={BASE} />

      <ProductInfo product={product} />

      <section>
        <h2>Opinie</h2>
        <Suspense fallback={<Skeleton rows={3} label="Ładowanie opinii…" />}>
          <Reviews promise={reviewsPromise} />
        </Suspense>
      </section>

      <section>
        <h2>Podobne produkty</h2>
        <Suspense fallback={<Skeleton rows={4} label="Ładowanie rekomendacji…" />}>
          <Recommendations promise={recommendationsPromise} />
        </Suspense>
      </section>
    </div>
  );
}

function ProductInfo({ product }: { product: Product }) {
  return (
    <article>
      <h1 style={{ margin: 0 }}>{product.name}</h1>
      <p className="muted">
        {product.price} zł · ★ {product.rating} · {product.stock > 0 ? `${product.stock} szt.` : "brak w magazynie"}
      </p>
      <p>{product.description}</p>
    </article>
  );
}

async function Reviews({ promise }: { promise: Promise<Review[]> }) {
  const reviews = await promise; // błąd (produkt 13) trafi do najbliższego error.tsx
  if (reviews.length === 0) return <p className="muted">Brak opinii.</p>;
  return (
    <ul>
      {reviews.map((r) => (
        <li key={r.id}>
          <strong>{r.author}</strong> · ★ {r.rating}
          <div>{r.text}</div>
        </li>
      ))}
    </ul>
  );
}

async function Recommendations({ promise }: { promise: Promise<Product[]> }) {
  const products = await promise;
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          <Link href={`${BASE}/${p.id}`}>{p.name}</Link> · {p.price} zł
        </li>
      ))}
    </ul>
  );
}

function Skeleton({ rows, label }: { rows: number; label: string }) {
  return (
    <div role="status" aria-label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          style={{ height: 14, width: `${90 - i * 12}%`, background: "var(--surface-2)", borderRadius: 4, margin: "10px 0" }}
        />
      ))}
    </div>
  );
}
