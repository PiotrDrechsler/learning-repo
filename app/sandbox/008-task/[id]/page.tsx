import { getProduct, getRecommendations, getReviews } from "@/lib/sandbox-data";
import ProductNav from "../../_shared/ProductNav";

// Ta strona DZIAŁA, ale jest powolna i krucha:
// - trzy zapytania idą jedno po drugim (waterfall), więc biały ekran trwa ~4,3 s,
// - nic się nie pokazuje, dopóki nie przyjdą najwolniejsze dane,
// - produkt 999 nie zwraca 404, a produkt 13 wywraca całą stronę.
// Treść zadania: README ćwiczenia 008.

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  const product = await getProduct(productId);
  const reviews = await getReviews(productId);
  const recommendations = await getRecommendations(productId);

  if (!product) {
    return <p>Nie ma takiego produktu.</p>;
  }

  return (
    <div className="stack">
      <ProductNav base="/sandbox/008-task" />

      <article>
        <h1 style={{ margin: 0 }}>{product.name}</h1>
        <p className="muted">
          {product.price} zł · ★ {product.rating} · {product.stock > 0 ? `${product.stock} szt.` : "brak w magazynie"}
        </p>
        <p>{product.description}</p>
      </article>

      <section>
        <h2>Opinie</h2>
        <ul>
          {reviews.map((r) => (
            <li key={r.id}>
              <strong>{r.author}</strong> · ★ {r.rating}
              <div>{r.text}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Podobne produkty</h2>
        <ul>
          {recommendations.map((p) => (
            <li key={p.id}>
              {p.name} · {p.price} zł
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
