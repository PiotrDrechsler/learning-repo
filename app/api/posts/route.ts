import { POSTS, randomDelay } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/posts?page=1&limit=10
 * Odpowiedź: { items, page, totalPages, hasMore }
 * Strony > 1 w ~15% przypadków zwracają 503, żeby przećwiczyć ponawianie.
 * ?stable=1 wyłącza losowe błędy.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(Math.max(1, Number(searchParams.get("limit") ?? 10) || 10), 30);
  const stable = searchParams.get("stable") === "1";

  await randomDelay(400, 900);

  if (!stable && page > 1 && Math.random() < 0.15) {
    return Response.json({ message: "Chwilowa awaria, spróbuj ponownie." }, { status: 503 });
  }

  const totalPages = Math.ceil(POSTS.length / limit);
  const items = POSTS.slice((page - 1) * limit, page * limit);
  return Response.json({ items, page, totalPages, hasMore: page < totalPages });
}
