import type { Metadata } from "next";
import Link from "next/link";
import { listProducts } from "@/lib/sandbox-data";

export const metadata: Metadata = { title: "Sklep: produkty" };

// Server Component: async, pobiera dane bezpośrednio, bez useEffect i bez API route.
export default async function ProductsPage() {
  const { items, total } = await listProducts({ perPage: 12 });

  return (
    <>
      <h1 style={{ margin: 0 }}>Produkty</h1>
      <p className="muted" style={{ margin: 0 }}>
        Pokazuję {items.length} z {total}
      </p>
      <ul>
        {items.map((product) => (
          <li key={product.id} className="row" style={{ justifyContent: "space-between" }}>
            {/* <Link> zamiast <a>: nawigacja po stronie klienta i prefetch, bez przeładowania strony */}
            <Link href={`/sandbox/004-solution/${product.id}`}>{product.name}</Link>
            <span className="muted">
              {product.category} · {product.price} zł
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
