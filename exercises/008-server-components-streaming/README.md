## Kontekst

Typowe zadanie „debugowania wydajności” na rozmowie z Next.js. Rekruter: „Ta strona produktu ładuje się 4 sekundy i czasem cała się wywraca. Napraw ją, nie zmieniając API danych”.

Strona: `/sandbox/008-task/[id]`. Dane (z `@/lib/sandbox-data`, tylko po stronie serwera):

| Funkcja | Czas | Uwagi |
| --- | --- | --- |
| `getProduct(id)` | ~0,3 s | brak produktu = `undefined` |
| `getReviews(id)` | ~1,5 s | dla produktu **13** zawsze rzuca błąd |
| `getRecommendations(id)` | ~2,5 s | |

Obecna wersja woła je **po kolei** (waterfall) i pokazuje cokolwiek dopiero po ~4,3 s.

## Wymagania

- [ ] Informacje o produkcie pojawiają się po ~0,3 s, bez czekania na opinie i rekomendacje.
- [ ] Opinie i rekomendacje dociągają się **strumieniowo**, każda sekcja z własnym szkieletem (`<Suspense>`).
- [ ] Wolne zapytania startują **równolegle**, a nie jedno po drugim. Cała strona gotowa w ~2,5 s, nie ~4,3 s.
- [ ] `loading.tsx` dla segmentu: natychmiastowy szkielet przy przejściu między produktami.
- [ ] Nieistniejący produkt (`/999`) i niepoprawne id (`/abc`) → `notFound()` i własny `not-found.tsx` (status 404).
- [ ] Błąd opinii (`/13`) → `error.tsx` z przyciskiem „Spróbuj ponownie”.
- [ ] Tytuł karty przeglądarki = nazwa produktu (`generateMetadata`).

## Bonus

- [ ] `generateMetadata` i strona pobierają produkt raz, a nie dwa razy (`cache` z Reacta).
- [ ] Błąd opinii psuje tylko sekcję opinii, a reszta strony zostaje (własny error boundary wokół sekcji).
- [ ] Opisz na głos, co zobaczy użytkownik w każdej milisekundzie dla `/1` i dla `/13`.

## Na co patrzy rekruter

- czy rozumiesz, że `await` jedno pod drugim w Server Component to waterfall,
- czy wiesz, gdzie postawić granice `<Suspense>` i dlaczego `loading.tsx` to też Suspense,
- czy `error.tsx` jest komponentem klienckim i czemu musi nim być,
- czy wiesz, że `params` jest w nowych wersjach Next.js obietnicą (`await params`).

## Pytania follow-up

<details><summary>Czym różni się Promise.all od przekazania obietnicy do komponentu w Suspense?</summary>

`await Promise.all([...])` też usuwa waterfall, ale strona i tak czeka na **najwolniejsze** zapytanie. Gdy startujesz zapytania od razu, a czekasz na nie dopiero w komponentach otoczonych `<Suspense>`, każda sekcja pokazuje się, gdy tylko jej dane są gotowe (streaming).

</details>

<details><summary>Dlaczego error.tsx musi mieć "use client"?</summary>

Error boundary to mechanizm działający w przeglądarce (stan „wystąpił błąd”, przycisk `reset`). Server Components nie mają stanu ani obsługi zdarzeń.

</details>

<details><summary>Po co router.refresh() obok reset() w error.tsx?</summary>

Błąd powstał podczas renderowania na serwerze. `reset()` tylko czyści stan boundary i renderuje ponownie to, co klient ma w pamięci. `router.refresh()` prosi serwer o świeży wynik, więc ponowienie ma sens.

</details>

<details><summary>Co robi cache() z Reacta i czym różni się od cache w fetch?</summary>

`cache(fn)` zapamiętuje wynik funkcji dla tych samych argumentów **w obrębie jednego requestu** (deduplikacja). Cache danych Next.js (opcje `fetch`, `use cache`) trzyma wyniki **między** requestami i wymaga strategii odświeżania.

</details>

<details><summary>Kiedy ta strona mogłaby być statyczna?</summary>

Gdyby dane produktów zmieniały się rzadko: `generateStaticParams` dla popularnych id plus odświeżanie (ISR / revalidate). Opinie mogą zostać dynamiczne i streamowane osobno.

</details>
