import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/sandbox-data";

// W nowych wersjach Next.js params to obietnica, więc trzeba ją "await".
type Props = { params: Promise<{ id: string }> };

/** "abc", "-1" czy "1.5" to nie są poprawne id: od razu 404. */
async function loadProduct(params: Props["params"]) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const product = await getProduct(id);
  if (!product) notFound();
  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  const product = Number.isInteger(id) ? await getProduct(id) : undefined;
  return { title: product ? `${product.name} · Sklep` : "Nie znaleziono produktu" };
}

export default async function ProductPage({ params }: Props) {
  const product = await loadProduct(params);

  return (
    <article className="stack">
      <Link href="/sandbox/004-solution">← Wróć do listy</Link>
      <h1 style={{ margin: 0 }}>{product.name}</h1>
      <p className="muted" style={{ margin: 0 }}>
        {product.category} · ★ {product.rating}
      </p>
      <p style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>{product.price} zł</p>
      <p style={{ margin: 0 }}>{product.stock > 0 ? `Dostępny: ${product.stock} szt.` : "Brak w magazynie"}</p>
      <p>{product.description}</p>
    </article>
  );
}
