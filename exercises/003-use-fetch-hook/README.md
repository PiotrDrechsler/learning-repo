## Kontekst

„Nie używamy jeszcze React Query. Napisz hook, którego cały zespół użyje do pobierania danych”. Liczy się API hooka i typy, a nie sam fetch.

API: `GET /api/posts/:id` → `{ id, title, body, author, likes }`, opóźnienie 300–900 ms. Id spoza zakresu 1–87 zwraca **404** z `{ message }`.

## Wymagania

- [ ] `useFetch<T>(url: string | null)` zwraca `{ status, data, error, refetch }`.
- [ ] `status` to unia `"idle" | "loading" | "success" | "error"`. `url === null` oznacza `"idle"` (nic nie pobieramy).
- [ ] Odpowiedź inna niż 2xx to błąd z treścią `message` z serwera, jeśli jest.
- [ ] Zmiana `url` przerywa poprzedni request. Odmontowanie też.
- [ ] `refetch()` pobiera ponownie ten sam URL.
- [ ] Demo: input numeryczny z id posta, przyciski −/+, karta posta, stany ładowania i błędu, przycisk „Odśwież”.

## Bonus

- [ ] Przy przejściu na kolejny post pokazuj **poprzednie** dane z lekkim wyszarzeniem, zamiast pustego ekranu (jak `keepPreviousData`).
- [ ] Typ zwracany jako unia dyskryminowana, żeby po `if (status === "success")` TypeScript wiedział, że `data: T`.
- [ ] Prosty cache w `Map` na poziomie modułu.

## Na co patrzy rekruter

- czy hook jest naprawdę generyczny i nie zna kształtu `Post`,
- czy nie ma wyścigu przy szybkim klikaniu „+”,
- czy rozumiesz, dlaczego `refetch` musi być stabilny (`useCallback`) albo dlaczego to nie ma znaczenia,
- czy umiesz powiedzieć, czego temu hookowi brakuje względem React Query.

## Pytania follow-up

<details><summary>Dlaczego nie robić async bezpośrednio jako callbacku useEffect?</summary>

`useEffect` oczekuje, że callback zwróci funkcję cleanup albo nic. Funkcja `async` zawsze zwraca Promise, więc cleanup by przepadł. Definiujemy funkcję async w środku i ją wołamy (albo używamy `.then`).

</details>

<details><summary>Czego brakuje temu hookowi w porównaniu z React Query / SWR?</summary>

Współdzielonego cache między komponentami, deduplikacji zapytań, unieważniania po mutacjach, retry z backoffem, odświeżania przy powrocie do karty, garbage collection cache, devtools i wsparcia dla Suspense.

</details>

<details><summary>Jak wyglądałoby to w Next.js App Router bez hooka?</summary>

W Server Component możesz zrobić `const post = await fetch(...)` bezpośrednio w komponencie, a stany ładowania i błędu obsłużyć przez `loading.tsx` i `error.tsx` (Suspense i error boundary). Hook po stronie klienta jest potrzebny dla danych zależnych od interakcji.

</details>

<details><summary>Po co unia dyskryminowana zamiast osobnych isLoading / isError?</summary>

Osobne flagi pozwalają na niemożliwe stany (np. `isLoading && isError`). Unia wymusza dokładnie jeden stan, a TypeScript zawęża typy w gałęziach.

</details>
