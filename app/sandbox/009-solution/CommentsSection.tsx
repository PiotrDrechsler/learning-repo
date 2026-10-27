"use client";

import { useActionState, useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import type { Comment } from "@/lib/sandbox-data";
import { addCommentAction, deleteCommentAction } from "./actions";
import { initialCommentFormState, validateComment, type CommentFormState } from "./form-state";

type ShownComment = Comment & { pending?: boolean };

export default function CommentsSection({ comments }: { comments: Comment[] }) {
  const [optimisticComments, addOptimistic] = useOptimistic<ShownComment[], ShownComment>(comments, (state, comment) => [
    comment,
    ...state,
  ]);

  const [state, formAction, isPending] = useActionState(async (prev: CommentFormState, formData: FormData) => {
    const author = String(formData.get("author") ?? "").trim();
    const text = String(formData.get("text") ?? "").trim();
    // Optymistycznie pokazujemy tylko to, co i tak przejdzie walidację (ta sama funkcja co na serwerze).
    if (Object.keys(validateComment(author, text)).length === 0) {
      addOptimistic({ id: -Date.now(), author, text, createdAt: new Date().toISOString(), pending: true });
    }
    return addCommentAction(prev, formData);
  }, initialCommentFormState);

  return (
    <>
      {/* key: po udanym wysłaniu formularz montuje się od nowa, więc pola się czyszczą */}
      <form key={state.submittedAt ?? 0} action={formAction} className="stack" noValidate>
        <label className="stack" style={{ gap: 4 }}>
          <span>Imię</span>
          <input
            name="author"
            defaultValue={state.values.author}
            aria-invalid={Boolean(state.errors.author)}
            aria-describedby={state.errors.author ? "author-error" : undefined}
          />
          {state.errors.author && (
            <span id="author-error" className="error">
              {state.errors.author}
            </span>
          )}
        </label>
        <label className="stack" style={{ gap: 4 }}>
          <span>Komentarz</span>
          <textarea
            name="text"
            rows={3}
            defaultValue={state.values.text}
            aria-invalid={Boolean(state.errors.text)}
            aria-describedby={state.errors.text ? "text-error" : undefined}
          />
          {state.errors.text && (
            <span id="text-error" className="error">
              {state.errors.text}
            </span>
          )}
        </label>
        <div className="row">
          <SubmitButton />
          {isPending && <span className="muted">Zapisuję na serwerze…</span>}
          {state.status === "success" && !isPending && <span className="muted">Dodano ✓</span>}
        </div>
      </form>

      <ul>
        {optimisticComments.map((c) => (
          <li key={c.id} className="row" style={{ justifyContent: "space-between", opacity: c.pending ? 0.55 : 1 }}>
            <div>
              <strong>{c.author}</strong>{" "}
              <span className="muted">· {c.pending ? "wysyłanie…" : new Date(c.createdAt).toLocaleString("pl-PL")}</span>
              <div>{c.text}</div>
            </div>
            {!c.pending && (
              // bind: Server Action z argumentem przekazanym z góry
              <form action={deleteCommentAction.bind(null, c.id)}>
                <DeleteButton />
              </form>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

/** useFormStatus czyta stan NAJBLIŻSZEGO formularza-rodzica, więc musi być osobnym komponentem w środku <form>. */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Wysyłanie…" : "Dodaj komentarz"}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-label="Usuń komentarz">
      {pending ? "…" : "Usuń"}
    </button>
  );
}
