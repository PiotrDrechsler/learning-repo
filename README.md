# NAUKA REACT

Ćwiczenia przed rekrutacją na frontend: **React, JavaScript, TypeScript i Next.js**.
Każde zadanie wygląda jak na rozmowie: limit czasu, konkretne wymagania, bonusy, „na co patrzy rekruter” i pytania follow-up z odpowiedziami. Interfejs i treści są po polsku i po angielsku (przełącznik **PL / EN** w prawym górnym rogu).

Stack aplikacji: **Next.js (App Router) + React 19 + TypeScript**.

## Start

```bash
npm install
npm run dev
```

Otwórz http://localhost:3000.

## Kategorie zadań

| Kategoria | Gdzie kodujesz | Jak sprawdzasz |
| --- | --- | --- |
| **React** | `exercises/<nr>-<nazwa>/Exercise.tsx` (albo `.jsx`) | komponent renderuje się na placu zabaw |
| **JavaScript** | `exercises/<nr>-<nazwa>/exercise.js` | testy uruchamiają się na placu zabaw po każdym zapisie |
| **TypeScript** | `exercises/<nr>-<nazwa>/exercise.ts` | testy na placu zabaw + `npm run typecheck:tasks` (testy typów) |
| **Next.js** | `app/sandbox/<nr>-task/` (prawdziwe trasy App Routera) | strona w ramce na placu zabaw albo w nowej karcie |

Rozwiązania leżą obok: `solution.*` w folderze zadania albo `app/sandbox/<nr>-solution/` dla Next.js.

## Aktualne zadania (poziom junior)

| # | Kategoria | Zadanie | Czas |
| --- | --- | --- | --- |
| 001 | React | Lista zadań z filtrami i localStorage | 25 min |
| 002 | JavaScript | Koszyk zakupów: metody tablic | 25 min |
| 003 | TypeScript | Typy dla zamówień w sklepie | 25 min |
| 004 | Next.js | Lista i szczegóły produktu w App Routerze | 30 min |

Wcześniejsze, trudniejsze zadania (mid) są na gałęzi [`archiwum`](https://github.com/PiotrDrechsler/learning-repo/tree/archiwum).

## Jak ćwiczyć

1. Na stronie głównej znajdź zadanie. Wyszukiwarka: `/` albo `Ctrl/Cmd + K`, strzałki ↑↓ i Enter. Szuka w obu językach, ignoruje polskie znaki. Filtry: kategoria, poziom, status.
2. Przeczytaj treść i kliknij **Start: podgląd na żywo i timer**.
3. Koduj w **VS Code** (albo innym edytorze). Na placu zabaw po lewej masz treść zadania i listę plików (klik otwiera plik w VS Code), a po prawej podgląd na żywo: komponent, wizualizację z testami albo stronę Next.js. Po zapisie pliku (`Ctrl + S`) podgląd odświeża się sam.
4. Po czasie porównaj z zakładką **Rozwiązanie** i przejdź przez pytania follow-up na głos.
5. Oznacz zadanie jako zrobione (postęp zapisuje się w przeglądarce).

## Gałęzie: main = puste zadania, gałąź = Twoje rozwiązanie

Na `main` wszystkie zadania są w wersji startowej. Każde podejście do zadania robisz na osobnej gałęzi z datą rozpoczęcia:

```bash
npm run task -- 001          # tworzy i przełącza na: 001-todo-with-filters/RRRR-MM-DD
# ... kodujesz ...
git add -A
git commit -m "001: moje rozwiązanie"
git switch main              # wracasz do pustych zadań
```

Lista Twoich podejść: `git branch`. Powrót do starego podejścia: `git switch 001-todo-with-filters/2026-10-27`.
Drugie podejście do tego samego zadania innego dnia dostanie nową gałąź z nową datą, więc możesz porównać postępy (`git diff gałąź1 gałąź2`).

Reset zadania do wersji startowej:

```bash
git restore exercises/002-array-methods-cart/exercise.js
# zadanie Next.js (usuwa też pliki, które dodałeś, np. loading.tsx):
git restore app/sandbox/004-task && git clean -fd app/sandbox/004-task
```


## Język interfejsu (PL / EN)

- teksty interfejsu: `lib/i18n.ts` (słownik `pl` i `en`, TypeScript pilnuje, żeby klucze były identyczne),
- tytuł i opis ćwiczenia: `meta.json` → `"title": { "pl": "...", "en": "..." }`,
- treść ćwiczenia: `README.md` (polski) i `README.en.md` (angielski).

## Struktura

```
exercises/
  002-array-methods-cart/
    meta.json        tytuł i opis (pl/en), kategoria, poziom, czas, tagi
    README.md        treść zadania (PL)
    README.en.md     treść zadania (EN)
    exercise.js      tu kodujesz
    solution.js      przykładowe rozwiązanie
    tests.js         testy uruchamiane na placu zabaw
  _registry.generated.ts   generowany automatycznie (npm run registry)
app/                 strony aplikacji i mock API
app/sandbox/         trasy zadań Next.js: <nr>-task (Twoje) i <nr>-solution
lib/testing.ts       mini-biblioteka testów (expect, toBe, toEqual, toThrow…)
scripts/             generator rejestru i szkieletu nowego ćwiczenia
```

## Nowe ćwiczenie

```bash
npm run new -- nazwa-cwiczenia react ts       # komponent React (ts albo js)
npm run new -- nazwa-cwiczenia javascript     # funkcje + testy
npm run new -- nazwa-cwiczenia typescript     # funkcje + testy
npm run new -- nazwa-cwiczenia nextjs         # trasy w app/sandbox
```
