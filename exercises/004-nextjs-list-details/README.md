## Kontekst

„Zbuduj w Next.js listę produktów i stronę szczegółów”. To najczęstsze juniorskie zadanie z App Routera: sprawdza, czy rozumiesz routing oparty na folderach i różnicę między komponentem serwerowym a klienckim.

Kodujesz w folderze `app/sandbox/004-task/`. Dane (tylko po stronie serwera, z `@/lib/sandbox-data`):

| Funkcja | Zwraca |
| --- | --- |
| `listProducts({ perPage: 12 })` | `{ items, total, page, totalPages }` |
| `getProduct(id)` | produkt albo `undefined` (~0,6 s) |

Produkt: `{ id, name, category, price, rating, stock, description }`.

## Wymagania

- [ ] `/sandbox/004-task` – lista 12 produktów (nazwa, kategoria, cena). Strona jest **async Server Component** i pobiera dane bezpośrednio.
- [ ] Każdy produkt to `<Link>` do `/sandbox/004-task/[id]`.
- [ ] `/sandbox/004-task/[id]` – szczegóły: nazwa, cena, ocena, dostępność, opis i link „Wróć do listy”.
- [ ] `[id]/loading.tsx` – szkielet widoczny podczas ładowania produktu.
- [ ] Nieistniejący produkt (`/999`) i błędne id (`/abc`) → `notFound()` i własny `[id]/not-found.tsx`.
- [ ] `layout.tsx` – wspólny nagłówek „Sklep” z linkiem do listy, widoczny na liście i w szczegółach.
- [ ] Ani jednego `"use client"`.

## Bonus

- [ ] `generateMetadata`: tytuł karty przeglądarki = nazwa produktu.
- [ ] `generateStaticParams` dla 12 produktów z listy, żeby ich strony były gotowe już po buildzie.
- [ ] Sprawdź w narzędziach deweloperskich (Network), że przejście lista → szczegóły nie przeładowuje całej strony.

## Na co patrzy rekruter

- czy wiesz, że w App Routerze trasa to folder z `page.tsx`, a `[id]` to segment dynamiczny,
- czy pobierasz dane w Server Component, a nie przez `useEffect`,
- czy używasz `<Link>`, a nie `<a>`,
- czy pamiętasz, że `params` to obietnica (`await params`).

## Pytania follow-up

<details><summary>Czym różni się Server Component od Client Component?</summary>

Server Component renderuje się na serwerze: może być `async`, czytać bazę i sekrety, a jego kod nie trafia do przeglądarki. Nie ma stanu ani obsługi zdarzeń. Client Component (`"use client"`) działa też w przeglądarce, więc może mieć `useState`, `onClick` i efekty. W App Routerze domyślnie wszystko jest serwerowe.

</details>

<details><summary>Kiedy dodałbyś "use client"?</summary>

Gdy komponent potrzebuje interakcji albo API przeglądarki: stanu, zdarzeń, efektów, `localStorage`, hooków typu `useRouter`. Dyrektywę stawia się jak najniżej w drzewie, żeby do przeglądarki szło jak najmniej JavaScriptu.

</details>

<details><summary>Co robi layout.tsx i czym różni się od template.tsx?</summary>

Layout otacza strony segmentu i **zachowuje stan** przy nawigacji między nimi (nie montuje się od nowa). `template.tsx` wygląda podobnie, ale tworzy się na nowo przy każdej nawigacji, co przydaje się np. do animacji wejścia.

</details>

<details><summary>Co daje Link w porównaniu ze zwykłym &lt;a&gt;?</summary>

Nawigację po stronie klienta bez przeładowania całej strony (layout i jego stan zostają) oraz prefetch: Next.js pobiera dane trasy, gdy link pojawi się na ekranie, więc przejście jest szybsze.

</details>

<details><summary>Jak działa loading.tsx?</summary>

Next.js automatycznie owija stronę segmentu w `<Suspense>` i używa `loading.tsx` jako fallbacku. Szkielet pokazuje się od razu po kliknięciu, a treść „wpada”, gdy serwer ją wyrenderuje.

</details>
