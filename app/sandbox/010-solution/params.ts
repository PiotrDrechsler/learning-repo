import { CATEGORIES, SORTS, type Category, type Sort } from "@/lib/sandbox-data";

export type CatalogParams = { q: string; category: Category | null; sort: Sort; page: number };

type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const isCategory = (v: unknown): v is Category => (CATEGORIES as string[]).includes(v as string);
const isSort = (v: unknown): v is Sort => (SORTS as readonly string[]).includes(v as string);

/** URL to dane od użytkownika: wszystko sprawdzamy i sprowadzamy do bezpiecznych wartości. */
export function parseCatalogParams(raw: RawSearchParams): CatalogParams {
  const q = (first(raw.q) ?? "").trim().slice(0, 60);
  const category = first(raw.category);
  const sort = first(raw.sort);
  const page = Number.parseInt(first(raw.page) ?? "1", 10);
  return {
    q,
    category: isCategory(category) ? category : null,
    sort: isSort(sort) ? sort : "relevance",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** Buduje adres z bieżącymi parametrami i zmianą; wartości domyślne nie trafiają do URL. */
export function catalogHref(base: string, current: CatalogParams, patch: Partial<CatalogParams>): string {
  const next = { ...current, ...patch };
  const search = new URLSearchParams();
  if (next.q) search.set("q", next.q);
  if (next.category) search.set("category", next.category);
  if (next.sort !== "relevance") search.set("sort", next.sort);
  if (next.page > 1) search.set("page", String(next.page));
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}
