"use server";

// TODO: Server Action dodająca komentarz.
// Pamiętaj: walidacja po stronie serwera, zwrócenie błędów do formularza, odświeżenie listy.
// Z pliku "use server" można eksportować tylko funkcje async.
// Sygnaturę dopasuj do tego, jak wywołasz akcję (np. useActionState podaje (prevState, formData)).

export async function addCommentAction(formData: FormData): Promise<void> {
  console.log("TODO: addCommentAction", Object.fromEntries(formData));
}
