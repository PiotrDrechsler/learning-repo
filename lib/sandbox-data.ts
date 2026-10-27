// "Baza danych" i wolne zapytania dla zadań Next.js (app/sandbox/*).
// Używaj tylko po stronie serwera: w Server Components, Server Actions i Route Handlers.
import { randomDelay } from "./mock-data";

export type Category = "keyboards" | "mice" | "monitors" | "headphones" | "accessories";

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  rating: number;
  stock: number;
  description: string;
}

export const CATEGORIES: Category[] = ["keyboards", "mice", "monitors", "headphones", "accessories"];

const BRANDS = ["Nova", "Pixel", "Orbit", "Zenith", "Atlas", "Lumen"];
const NOUNS: Record<Category, string> = {
  keyboards: "Keyboard",
  mice: "Mouse",
  monitors: "Monitor",
  headphones: "Headphones",
  accessories: "Dock",
};

export const PRODUCTS: Product[] = Array.from({ length: 48 }, (_, i) => {
  const category = CATEGORIES[i % CATEGORIES.length];
  const brand = BRANDS[(i * 5) % BRANDS.length];
  return {
    id: i + 1,
    name: `${brand} ${NOUNS[category]} ${100 + i * 7}`,
    category,
    price: 79 + ((i * 53) % 920),
    rating: Math.round((3 + ((i * 17) % 21) / 10) * 10) / 10,
    stock: (i * 11) % 9,
    description: `Model ${100 + i * 7} z serii ${brand}. Solidny wybór w kategorii ${category}.`,
  };
});

/** Jeden produkt. Brak = undefined. Opóźnienie ~600 ms, żeby było widać loading.tsx. */
export async function getProduct(id: number): Promise<Product | undefined> {
  await randomDelay(500, 700);
  return PRODUCTS.find((p) => p.id === id);
}

// ---------- Katalog ----------

export const SORTS = ["relevance", "price-asc", "price-desc", "rating"] as const;
export type Sort = (typeof SORTS)[number];

export interface ProductQuery {
  q?: string;
  category?: Category;
  sort?: Sort;
  page?: number;
  perPage?: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

/** Filtrowanie, sortowanie i paginacja po stronie "bazy". Opóźnienie ~400 ms. */
export async function listProducts({ q = "", category, sort = "relevance", page = 1, perPage = 8 }: ProductQuery): Promise<ProductPage> {
  await randomDelay(350, 450);
  const needle = q.trim().toLowerCase();
  let items = PRODUCTS.filter(
    (p) => (!needle || p.name.toLowerCase().includes(needle)) && (!category || p.category === category),
  );
  if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
  if (sort === "rating") items = [...items].sort((a, b) => b.rating - a.rating);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((safePage - 1) * perPage, safePage * perPage),
    total: items.length,
    page: safePage,
    totalPages,
  };
}
