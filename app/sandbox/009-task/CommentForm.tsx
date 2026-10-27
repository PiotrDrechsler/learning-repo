"use client";

// TODO: podłącz formularz do Server Action z ./actions.ts (useActionState),
// pokaż błędy walidacji przy polach i stan wysyłania.
export default function CommentForm() {
  return (
    <form className="stack" onSubmit={(e) => e.preventDefault()}>
      <input name="author" placeholder="Twoje imię" />
      <textarea name="text" placeholder="Napisz komentarz…" rows={3} />
      <div className="row">
        <button type="submit">Dodaj komentarz</button>
      </div>
    </form>
  );
}
