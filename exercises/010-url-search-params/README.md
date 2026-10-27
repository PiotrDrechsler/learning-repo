## Kontekst

„Klient chce wysłać koledze link do przefiltrowanej listy produktów. Teraz po odświeżeniu filtry znikają”. Pytanie o **stan w URL** pada na prawie każdej rozmowie z Next.js.

Strona: `/sandbox/010-task`. Dane: `listProducts({ q, category, sort, page, perPage })` (~0,4 s) z `@/lib/sandbox-data`, a do tego stałe `CATEGORIES` i `SORTS`.

## Wymagania

- [ ] Stan w adresie: `?q=&category=&sort=&page=`. Odświeżenie strony i wysłany link pokazują to samo.
- [ ] Strona (Server Component) czyta `searchParams` i to ona pobiera dane. Żadnego `fetch` z klienta.
- [ ] Wyszukiwarka aktualizuje URL z **debounce 300 ms**. Pisanie nie dodaje wpisu do historii przy każdym znaku (`replace`).
- [ ] Zmiana kategorii lub sortowania dodaje wpis do historii (`push`), więc „Wstecz” cofa filtr.
- [ ] Zmiana filtra wraca na stronę 1.
- [ ] Paginacja to zwykłe `<Link>` zachowujące pozostałe parametry, z oznaczeniem bieżącej strony.
- [ ] Śmieci w URL (`?page=-3&sort=xyz&category=lodówki`) nie wywracają strony, tylko zamieniają się na wartości domyślne.
- [ ] Widać, że coś się ładuje (`useTransition` albo `<Suspense>`).

## Bonus

- [ ] Wartości domyślne nie trafiają do URL (`sort=relevance`, `page=1`).
- [ ] Input wyszukiwania synchronizuje się z URL po „Wstecz”, ale nie kasuje tekstu, który użytkownik właśnie dopisuje.
- [ ] `<Suspense key={...}>`, żeby po zmianie filtrów zobaczyć szkielet zamiast starych wyników.

## Na co patrzy rekruter

- czy URL jest jedynym źródłem prawdy, a nie kopią stanu w `useState`,
- czy rozumiesz `push` vs `replace` z punktu widzenia użytkownika,
- czy walidujesz parametry jak dane od użytkownika,
- czy wiesz, że `searchParams` czyni stronę dynamiczną (renderowaną przy każdym żądaniu).

## Pytania follow-up

<details><summary>Dlaczego trzymać filtry w URL, a nie w useState albo w Context?</summary>

URL przeżywa odświeżenie, da się go udostępnić i zapisać w zakładkach, działa z „Wstecz/Dalej” i jest czytelny dla serwera, więc dane mogą być pobierane w Server Component bez dodatkowego API.

</details>

<details><summary>useSearchParams po stronie klienta vs searchParams w page.tsx — czym się różnią?</summary>

`searchParams` w `page.tsx` to dane na serwerze (obietnica w nowych wersjach), używane do pobrania danych. `useSearchParams` czyta URL w komponencie klienckim. W stronie statycznej wymaga granicy `<Suspense>`, bo parametrów nie ma podczas budowania.

</details>

<details><summary>Co robi startTransition przy router.push?</summary>

Oznacza nawigację jako niepilną: React dalej pokazuje bieżący ekran, a `isPending` mówi, że nowy się ładuje. Bez tego przy każdej zmianie mógłby mignąć fallback.

</details>

<details><summary>Jak uniknąć wyścigu przy szybkim pisaniu?</summary>

Debounce ogranicza liczbę nawigacji, a router i tak pokazuje wynik dla **ostatniego** URL. Starsze renderowania zostają porzucone, więc nie trzeba ręcznie anulować zapytań jak przy `fetch` na kliencie.

</details>
