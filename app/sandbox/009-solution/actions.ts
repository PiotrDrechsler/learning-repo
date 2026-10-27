"use server";

import { revalidatePath } from "next/cache";
import { addComment, deleteComment } from "@/lib/sandbox-data";
import { validateComment, type CommentFormState } from "./form-state";

const PATH = "/sandbox/009-solution";

/** Sygnatura pod useActionState: (poprzedni stan, FormData) => nowy stan. */
export async function addCommentAction(_prev: CommentFormState, formData: FormData): Promise<CommentFormState> {
  const author = String(formData.get("author") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();

  // Walidacja na serwerze jest obowiązkowa: akcję da się wywołać z pominięciem formularza.
  const errors = validateComment(author, text);
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values: { author, text } };
  }

  await addComment(author, text);
  revalidatePath(PATH); // Server Component z listą pobierze świeże dane

  return { status: "success", errors: {}, values: { author: "", text: "" }, submittedAt: Date.now() };
}

export async function deleteCommentAction(id: number): Promise<void> {
  if (!Number.isInteger(id)) return;
  await deleteComment(id);
  revalidatePath(PATH);
}
