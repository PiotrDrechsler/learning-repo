# NAUKA REACT

Ćwiczenia **live coding** z Reacta przed rekrutacją (poziom strong junior / mid).
Każde zadanie wygląda jak na rozmowie: limit czasu, konkretne wymagania, bonusy, „na co patrzy rekruter” i pytania follow-up z odpowiedziami.

Stack: **Next.js (App Router) + React 19**, zadania w **TypeScript** i **JavaScript**.

## Start

```bash
npm install
npm run dev
```

Otwórz http://localhost:3000.

## Jak ćwiczyć

1. Na stronie głównej znajdź zadanie. Wyszukiwarka: `/` albo `Ctrl/Cmd + K`, strzałki ↑↓ i Enter. Szuka po tytule, tagach, opisie, numerze, poziomie (`mid`) i języku (`ts`, `js`), ignoruje polskie znaki.
2. Przeczytaj treść i kliknij **Start: plac zabaw z timerem**.
3. Koduj w `exercises/<numer-nazwa>/Exercise.tsx` (albo `.jsx`). Strona odświeża się sama po zapisie.
4. Po czasie porównaj z zakładką **Rozwiązanie** i przejdź przez pytania follow-up na głos.
5. Oznacz zadanie jako zrobione (postęp zapisuje się w przeglądarce).

Reset zadania do wersji startowej:

```bash
git restore exercises/001-debounced-user-search/Exercise.tsx
```

Wskazówka: rób każde podejście na osobnej gałęzi (`git switch -c 001-podejscie-1`), wtedy zostaje historia Twoich rozwiązań.

## Mock API (do zadań)

| Endpoint | Opis |
| --- | --- |
| `GET /api/users?q=&limit=` | Użytkownicy, losowe opóźnienie 150–1200 ms (wyścigi odpowiedzi!), `q=error` → 500 |
| `GET /api/posts?page=&limit=` | Posty z paginacją, strony > 1 czasem zwracają 503, `&stable=1` to wyłącza |
| `GET /api/posts/:id` | Jeden post, 404 dla id spoza 1–87 |

## Struktura

```
exercises/
  001-debounced-user-search/
    meta.json      tytuł, opis, poziom, język, limit czasu, tagi
    README.md      treść zadania i pytania follow-up
    Exercise.tsx   tu kodujesz
    solution.tsx   przykładowe rozwiązanie
  _registry.generated.ts   generowany automatycznie (npm run registry)
app/               strony Next.js i mock API
components/        wyszukiwarka, plac zabaw, timer
scripts/           generator rejestru i szkieletu nowego ćwiczenia
```

## Nowe ćwiczenie

```bash
npm run new -- nazwa-cwiczenia ts   # albo js
```

Tworzy kolejny numerowany folder z szablonem. Rejestr odświeża się sam przy `npm run dev` / `npm run build`.

## Lista ćwiczeń

| # | Zadanie | Język | Poziom | Czas |
| --- | --- | --- | --- | --- |
| 001 | Wyszukiwarka użytkowników z debounce | TS | mid | 30 min |
| 002 | Lista zadań z filtrami i localStorage | JS | junior+ | 25 min |
| 003 | Własny hook useFetch&lt;T&gt; | TS | mid | 30 min |
| 004 | Dostępny modal z portalem | TS | mid | 35 min |
| 005 | Infinite scroll z IntersectionObserver | JS | mid | 35 min |
| 006 | Komponent oceny gwiazdkami | JS | junior+ | 20 min |
| 007 | Stoper z międzyczasami | TS | junior+ | 20 min |
