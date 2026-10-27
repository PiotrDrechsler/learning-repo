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

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  text: string;
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

const AUTHORS = ["Ania", "Bartek", "Celina", "Darek", "Ewa", "Filip"];

/** Jeden produkt. Brak = undefined. Opóźnienie ~300 ms. */
export async function getProduct(id: number): Promise<Product | undefined> {
  await randomDelay(250, 350);
  return PRODUCTS.find((p) => p.id === id);
}

/** Opinie: WOLNE (~1,5 s). Dla produktu 13 zawsze rzucają błąd, żeby przećwiczyć error.tsx. */
export async function getReviews(productId: number): Promise<Review[]> {
  await randomDelay(1400, 1600);
  if (productId === 13) throw new Error("Serwis opinii nie odpowiada (produkt 13 zawsze się wywraca).");
  return Array.from({ length: 2 + (productId % 3) }, (_, i) => ({
    id: productId * 10 + i,
    productId,
    author: AUTHORS[(productId + i) % AUTHORS.length],
    rating: 3 + ((productId + i) % 3),
    text: `Opinia ${i + 1}: działa jak należy, polecam do codziennej pracy.`,
  }));
}

/** Rekomendacje: BARDZO WOLNE (~2,5 s). */
export async function getRecommendations(productId: number): Promise<Product[]> {
  await randomDelay(2400, 2600);
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== productId).slice(0, 4);
}

// ---------- Katalog (zadanie 010) ----------

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

// ---------- Komentarze (zadanie 009) ----------

export interface Comment {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

// Dane w pamięci procesu: znikają po restarcie serwera, i dobrze.
const comments: Comment[] = [
  { id: 1, author: "Ania", text: "Server Actions to najprzyjemniejsza część App Routera.", createdAt: "2026-10-20T10:00:00.000Z" },
  { id: 2, author: "Bartek", text: "A pamiętasz o walidacji po stronie serwera?", createdAt: "2026-10-21T12:30:00.000Z" },
];
let nextCommentId = 3;

export async function getComments(): Promise<Comment[]> {
  await randomDelay(150, 250);
  return [...comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Zapis jest wolny (~800 ms), żeby było widać stan "wysyłanie". */
export async function addComment(author: string, text: string): Promise<Comment> {
  await randomDelay(700, 900);
  const comment = { id: nextCommentId++, author, text, createdAt: new Date().toISOString() };
  comments.push(comment);
  return comment;
}

export async function deleteComment(id: number): Promise<void> {
  await randomDelay(300, 500);
  const index = comments.findIndex((c) => c.id === id);
  if (index !== -1) comments.splice(index, 1);
}
