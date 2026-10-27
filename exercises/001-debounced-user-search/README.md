## Kontekst

Klasyk z rozmów na mid. Rekruter: „Zbuduj pole wyszukiwania użytkowników. API jest wolne i nie chcemy strzelać requestem przy każdej literze”.

API: `GET /api/users?q=<fraza>` → `{ results: User[], total: number }`, gdzie `User = { id, name, email, city }`.
Odpowiedzi przychodzą z losowym opóźnieniem **150–1200 ms**, więc starsze zapytanie potrafi wrócić *później* niż nowsze. `q=error` zwraca 500.

## Wymagania

- [ ] Kontrolowany `<input>`, zapytanie leci dopiero **300 ms** po ostatnim naciśnięciu klawisza (debounce).
- [ ] Pusta fraza (po `trim()`) nie wysyła requestu i czyści wyniki.
- [ ] Na ekranie zawsze są wyniki dla **aktualnej** frazy: przerwij poprzedni request (`AbortController`) albo ignoruj spóźnione odpowiedzi.
- [ ] Stany: ładowanie, błąd (z przyciskiem „Spróbuj ponownie”), brak wyników, lista wyników.
- [ ] Lista pokazuje imię i nazwisko, e-mail i miasto; pod listą „Znaleziono X”.
- [ ] Brak ostrzeżeń w konsoli i brak setState po odmontowaniu.

## Bonus

- [ ] Wyciągnij logikę do hooka `useDebouncedValue(value, delay)`.
- [ ] Podświetl dopasowany fragment imienia tagiem `<mark>`.
- [ ] Nawigacja strzałkami po wynikach.

## Na co patrzy rekruter

- czy rozumiesz, **dlaczego** potrzebny jest cleanup w `useEffect` (timer i request),
- czy zauważasz race condition bez podpowiedzi,
- czy typujesz odpowiedź API, a nie wszędzie `any`,
- czy stan jest minimalny (np. nie trzymasz „liczby wyników” osobno, skoro wynika z danych).

## Pytania follow-up

<details><summary>Czym różni się debounce od throttle? Kiedy który?</summary>

Debounce wykonuje akcję dopiero po ciszy trwającej N ms (wyszukiwarka, autosave). Throttle wykonuje akcję najwyżej raz na N ms w trakcie ciągłych zdarzeń (scroll, resize, drag).

</details>

<details><summary>Co się stanie, jeśli nie przerwiesz poprzedniego requestu?</summary>

Odpowiedzi mogą przyjść w innej kolejności niż zapytania, więc wolna odpowiedź dla „an” nadpisze świeże wyniki dla „anna”. Rozwiązania: `AbortController` w cleanupie efektu albo flaga `ignore`/porównanie id zapytania.

</details>

<details><summary>Dlaczego AbortError nie powinien pokazywać się jako błąd?</summary>

To my przerwaliśmy request, bo stał się nieaktualny. To nie awaria, tylko oczekiwany przebieg, więc ignorujemy `error.name === "AbortError"`.

</details>

<details><summary>Jak zrobiłbyś to z React Query / SWR? Co zyskujesz?</summary>

Klucz zapytania `['users', debouncedQuery]` i `enabled: !!debouncedQuery`. Dostajesz cache, deduplikację, anulowanie przez `signal`, retry i `placeholderData`/`keepPreviousData`, żeby lista nie migała.

</details>

<details><summary>Czy useDeferredValue zastąpi debounce?</summary>

Nie do końca. `useDeferredValue` opóźnia *renderowanie* kosztownej części UI, ale nie ogranicza liczby requestów. Do sieci dalej potrzebujesz debounce.

</details>
