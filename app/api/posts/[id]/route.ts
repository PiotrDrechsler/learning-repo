import { POSTS, randomDelay } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

/** GET /api/posts/:id — 404 dla nieistniejącego id. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await randomDelay(300, 900);

  const post = POSTS.find((p) => p.id === Number(id));
  if (!post) {
    return Response.json({ message: `Post ${id} nie istnieje.` }, { status: 404 });
  }
  return Response.json(post);
}
