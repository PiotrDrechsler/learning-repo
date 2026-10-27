import { getComments } from "@/lib/sandbox-data";
import CommentForm from "./CommentForm";

// Treść zadania: README ćwiczenia 009.
// Dane: getComments(), addComment(author, text), deleteComment(id) z "@/lib/sandbox-data".

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  const comments = await getComments();

  return (
    <div className="stack">
      <h1 style={{ margin: 0 }}>Komentarze</h1>
      <CommentForm />
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.author}</strong> <span className="muted">· {new Date(c.createdAt).toLocaleString("pl-PL")}</span>
            <div>{c.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
