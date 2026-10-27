## Kontekst

„Dodaj komentarze pod artykułem. Bez osobnego API, użyj Server Actions”. Bardzo częste zadanie na rozmowach z App Routera, bo sprawdza granicę serwer/klient i nowe hooki z React 19.

Strona: `/sandbox/009-task`. Dane (z `@/lib/sandbox-data`): `getComments()`, `addComment(author, text)` (~0,8 s), `deleteComment(id)`. Dane żyją w pamięci serwera i znikają po restarcie.

## Wymagania

- [ ] Server Action w `actions.ts` (`"use server"`) dodaje komentarz z danych formularza (`FormData`).
- [ ] Walidacja **na serwerze**: imię 2–40 znaków, komentarz 3–280 znaków, słowo „spam” odrzucone.
- [ ] Błędy wracają do formularza i pokazują się **przy polach**. Wpisane wartości nie znikają po błędzie.
- [ ] Formularz używa `useActionState`. Przycisk w trakcie wysyłania jest zablokowany i pokazuje „Wysyłanie…”.
- [ ] Po sukcesie lista odświeża się (`revalidatePath`), a pola się czyszczą.
- [ ] Formularz działa nawet przed załadowaniem JavaScriptu (progressive enhancement: `action={...}`, nie `onSubmit`).

## Bonus

- [ ] Nowy komentarz pojawia się od razu, wyszarzony, zanim serwer odpowie (`useOptimistic`).
- [ ] Usuwanie komentarza Server Actionem z argumentem przez `.bind(null, id)`, z osobnym stanem „…” dla każdego przycisku (`useFormStatus`).
- [ ] Ta sama funkcja walidacji na kliencie (do optymizmu) i na serwerze (jako ostateczna decyzja).

## Na co patrzy rekruter

- czy walidujesz na serwerze, a nie tylko w przeglądarce,
- czy wiesz, czego nie można eksportować z pliku `"use server"`,
- czy rozumiesz, że `useFormStatus` działa tylko w komponencie **wewnątrz** `<form>`,
- czy umiesz powiedzieć, czym Server Action różni się od Route Handlera (`route.ts`).

## Pytania follow-up

<details><summary>Czym jest Server Action od strony sieci?</summary>

To funkcja na serwerze, którą Next.js wystawia jako endpoint POST z niejawnym identyfikatorem. Formularz albo wywołanie z klienta wysyła request, a framework serializuje argumenty i wynik. To publiczny endpoint, więc zawsze sprawdzaj uprawnienia i dane wejściowe.

</details>

<details><summary>useActionState vs useFormStatus — do czego każdy?</summary>

`useActionState` trzyma **wynik** akcji (np. błędy walidacji) i daje `isPending`. `useFormStatus` czyta stan wysyłania **najbliższego formularza-rodzica**, więc nadaje się do przycisków jako osobnych komponentów.

</details>

<details><summary>Co się dzieje z useOptimistic, gdy akcja się nie powiedzie?</summary>

Optymistyczny stan żyje tylko do końca akcji (transition). Po jej zakończeniu React wraca do prawdziwych danych z propsów. Jeśli zapis się nie udał, wpis po prostu znika, a Ty pokazujesz błąd.

</details>

<details><summary>revalidatePath vs router.refresh() — czym się różnią?</summary>

`revalidatePath` działa na serwerze: unieważnia cache dla ścieżki, a odpowiedź Server Action od razu niesie świeży wynik. `router.refresh()` wywołuje się na kliencie i pobiera na nowo bieżącą trasę, ale nie czyści cache danych na serwerze.

</details>

<details><summary>Kiedy jednak Route Handler zamiast Server Action?</summary>

Gdy endpoint ma być wołany spoza tej aplikacji (aplikacja mobilna, webhook, publiczne API), gdy potrzebujesz GET z cache HTTP albo pełnej kontroli nad statusem i nagłówkami odpowiedzi.

</details>
