## Kontekst

Na rozmowach na juniora prawie zawsze pada zadanie z danymi: „masz tablicę obiektów, policz / pogrupuj / przekształć”. Sprawdza `map`, `filter`, `reduce` i to, czy umiesz zmieniać dane **bez mutacji**, co w Reakcie jest kluczowe.

Kodujesz w `exercise.js`. Każda funkcja dostaje tablicę pozycji koszyka:

```js
{ id: 1, name: "Klawiatura", category: "peripherals", price: 199.99, qty: 1 }
```

Plac zabaw pokazuje listę testów: ✓ zaliczony, ✗ błąd z opisem, ○ jeszcze niezaimplementowane.

## Wymagania

- [ ] `cartTotal(items)` – suma `price × qty`, zaokrąglona do 2 miejsc po przecinku. Pusty koszyk = `0`.
- [ ] `itemCount(items)` – łączna liczba sztuk.
- [ ] `uniqueCategories(items)` – kategorie bez powtórzeń, alfabetycznie.
- [ ] `groupByCategory(items)` – obiekt `{ kategoria: [pozycje] }`.
- [ ] `applyDiscount(items, percent)` – **nowa** tablica z cenami niższymi o `percent`%, zaokrąglonymi. Oryginał zostaje nietknięty. Rabat spoza 0–100 → `RangeError`.
- [ ] `mostExpensive(items)` – pozycja z najwyższą ceną jednostkową, a dla pustej tablicy `null`.
- [ ] `formatPrice(value)` – `12.5` → `"12.50 zł"`.
- [ ] Bez pętli `for`: użyj metod tablic.

## Bonus

- [ ] Napisz `groupByCategory` na dwa sposoby: przez `reduce` i przez `Object.groupBy`.
- [ ] Dodaj `removeItem(items, id)` i `changeQty(items, id, qty)` bez mutacji (dokładnie tak aktualizuje się stan w Reakcie).

## Na co patrzy rekruter

- czy wybierasz właściwą metodę (`map` przekształca, `filter` wybiera, `reduce` składa w jedną wartość),
- czy podajesz wartość początkową do `reduce`,
- czy rozumiesz, że `{ ...item }` kopiuje obiekt, a `item.price = ...` zmienia oryginał,
- czy wiesz, czemu ceny trzeba zaokrąglać.

## Pytania follow-up

<details><summary>Czym różni się map od forEach?</summary>

`map` zwraca nową tablicę z wynikami funkcji. `forEach` niczego nie zwraca i służy do efektów ubocznych. W JSX listę renderujesz przez `map`, bo potrzebujesz tablicy elementów.

</details>

<details><summary>Dlaczego w Reakcie nie wolno mutować stanu?</summary>

React porównuje stary i nowy stan przez referencję (`Object.is`). Jeśli zmienisz obiekt w miejscu, referencja jest ta sama, więc React uzna, że nic się nie zmieniło, i może nie odświeżyć widoku. Nowa tablica i nowe obiekty sygnalizują zmianę.

</details>

<details><summary>Dlaczego 0.1 + 0.2 !== 0.3?</summary>

Liczby w JS to liczby zmiennoprzecinkowe w zapisie binarnym (IEEE 754), a 0.1 nie da się zapisać dokładnie. Przy pieniądzach zaokrąglamy wynik albo liczymy w groszach jako liczbach całkowitych.

</details>

<details><summary>Co się stanie, gdy wywołasz reduce na pustej tablicy bez wartości początkowej?</summary>

Rzuci `TypeError: Reduce of empty array with no initial value`. Dlatego w `cartTotal` podajemy `0`. W `mostExpensive` najpierw sprawdzamy pustą tablicę.

</details>

<details><summary>Spread {...item} to kopia płytka czy głęboka?</summary>

Płytka: kopiuje tylko pierwszy poziom. Zagnieżdżone obiekty i tablice dalej są współdzielone. Do głębokiej kopii służy np. `structuredClone`.

</details>
