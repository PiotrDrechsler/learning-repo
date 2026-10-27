import { USERS, randomDelay } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/users?q=ann&limit=20
 * Celowo losowe opóźnienie 150–1200 ms: starsze zapytanie potrafi wrócić PÓŹNIEJ niż nowsze (race condition).
 * q=error zwraca 500, żeby przećwiczyć obsługę błędów.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const limit = Math.min(Number(searchParams.get("limit") ?? 20) || 20, 50);

  await randomDelay(150, 1200);

  if (q === "error") {
    return Response.json({ message: "Serwer się przewrócił (celowo)." }, { status: 500 });
  }

  const matches = q
    ? USERS.filter((u) => u.name.toLowerCase().includes(q) || u.email.includes(q) || u.city.toLowerCase().includes(q))
    : USERS;

  return Response.json({ results: matches.slice(0, limit), total: matches.length });
}
