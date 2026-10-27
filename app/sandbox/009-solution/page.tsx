import { getComments } from "@/lib/sandbox-data";
import CommentsSection from "./CommentsSection";

export const dynamic = "force-dynamic";

// Server Component pobiera dane; interaktywna część (formularz, optymistyczna lista) jest w komponencie klienckim.
export default async function CommentsPage() {
  const comments = await getComments();

  return (
    <div className="stack">
      <h1 style={{ margin: 0 }}>Komentarze</h1>
      <CommentsSection comments={comments} />
    </div>
  );
}
