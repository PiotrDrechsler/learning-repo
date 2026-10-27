// Typy, stan początkowy i walidacja: wspólne dla serwera i klienta.
// Nie mogą żyć w actions.ts, bo plik "use server" eksportuje wyłącznie funkcje async.

export type CommentErrors = { author?: string; text?: string };

export type CommentFormState = {
  status: "idle" | "success" | "error";
  errors: CommentErrors;
  /** Wartości do ponownego wypełnienia pól po błędzie walidacji. */
  values: { author: string; text: string };
  /** Zmienia się po każdym udanym wysłaniu: klucz do wyczyszczenia formularza. */
  submittedAt?: number;
};

export const initialCommentFormState: CommentFormState = {
  status: "idle",
  errors: {},
  values: { author: "", text: "" },
};

export function validateComment(author: string, text: string): CommentErrors {
  const errors: CommentErrors = {};
  if (author.length < 2 || author.length > 40) errors.author = "Imię musi mieć od 2 do 40 znaków.";
  if (text.length < 3 || text.length > 280) errors.text = "Komentarz musi mieć od 3 do 280 znaków.";
  else if (/spam/i.test(text)) errors.text = "Ten komentarz wygląda na spam.";
  return errors;
}
