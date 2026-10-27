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
2. Przeczytaj treść i kliknij **Start: plac zabaw z timerem**.
3. Koduj w **edytorze na placu zabaw** (lewa kolumna): `Ctrl + S` zapisuje plik na dysk, a podgląd po prawej (komponent, testy albo strona Next.js) odświeża się sam. Możesz też edytować te same pliki w VS Code. „Przywróć start” cofa plik do wersji startowej.
4. Po czasie porównaj z zakładką **Rozwiązanie** i przejdź przez pytania follow-up na głos.
5. Oznacz zadanie jako zrobione (postęp zapisuje się w przeglądarce).

Reset zadania do wersji startowej:

```bash
git restore exercises/002-array-methods-cart/exercise.js
# zadanie Next.js (usuwa też pliki, które dodałeś, np. loading.tsx):
git restore app/sandbox/004-task && git clean -fd app/sandbox/004-task
```

Wskazówka: każde podejście rób na osobnej gałęzi (`git switch -c 002-podejscie-1`), wtedy zostaje historia Twoich rozwiązań.

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
