## Kontekst

„W projekcie wszędzie jest `any`. Otypuj moduł zamówień tak, żeby kompilator łapał błędy za nas”. Typowe pierwsze zadanie z TypeScriptu na rozmowie na juniora.

Kodujesz w `exercise.ts`. Sprawdzają Cię dwie rzeczy:

1. **Testy na placu zabaw**: czy funkcje działają.
2. **Kompilator**: `npm run typecheck:tasks` sprawdza plik `types.check.ts`. Poprawny kod musi się kompilować, a każda linia oznaczona `@ts-expect-error` musi być błędem typu. Dopóki zostawiasz `any`, kompilator zgłosi „Unused '@ts-expect-error' directive”.

## Wymagania

- [ ] `OrderStatus` – unia: `"new" | "paid" | "shipped" | "cancelled"`.
- [ ] `OrderItem` – `productId`, `name`, `price`, `qty` (wszystkie wymagane, liczby i tekst).
- [ ] `Order` – `id`, `customer`, `items`, `status` oraz **opcjonalne** `note`.
- [ ] `orderTotal(order)` – suma `price × qty`, zaokrąglona do 2 miejsc.
- [ ] `statusLabel(status)` – polska etykieta: Nowe, Opłacone, Wysłane, Anulowane. Użyj `switch` z kontrolą wyczerpania przez `never`.
- [ ] `filterByStatus(orders, status)`.
- [ ] `updateStatus(order, status)` – **nowy** obiekt. Anulowanego zamówienia nie da się zmienić (rzuć `Error`).
- [ ] `first(items)` – generyk: dla `number[]` zwraca `number | undefined`, dla `Order[]` zwraca `Order | undefined`.
- [ ] `countByStatus(orders)` – `Record<OrderStatus, number>`, także z zerami.
- [ ] Zero `any` w gotowym pliku.

## Bonus

- [ ] Wyprowadź `OrderStatus` z tablicy `as const`, żeby mieć i listę wartości, i typ z jednego źródła.
- [ ] Oznacz parametry tylko do odczytu (`readonly Order[]`, `Readonly<Order>`).

## Na co patrzy rekruter

- czy znasz różnicę między `type` a `interface` i umiesz uzasadnić wybór,
- czy rozumiesz pole opcjonalne (`note?: string`) i to, że jego typ to `string | undefined`,
- czy generyk jest naprawdę generyczny (`<T>`), a nie `unknown` albo `any`,
- czy wiesz, po co jest `never` w `default` switcha.

## Pytania follow-up

<details><summary>type czy interface — kiedy co?</summary>

Oba opiszą kształt obiektu. `interface` można rozszerzać (`extends`) i scalać deklaracje, a błędy bywają czytelniejsze. `type` jest potrzebny do unii, typów warunkowych i mapowanych. Wiele zespołów używa `interface` dla obiektów i `type` dla reszty. Ważna jest konsekwencja.

</details>

<details><summary>Po co const unhandled: never = status w switchu?</summary>

Gdy obsłużysz wszystkie warianty unii, w `default` zostaje typ `never`. Jeśli ktoś doda nowy status (np. `"returned"`), typ przestanie być `never` i kompilator wskaże miejsce, którego nie obsłużono.

</details>

<details><summary>any vs unknown — czym się różnią?</summary>

`any` wyłącza sprawdzanie: możesz zrobić z wartością cokolwiek. `unknown` też przyjmie każdą wartość, ale zanim jej użyjesz, musisz zawęzić typ (np. `typeof`, `instanceof`). To bezpieczny wybór dla danych z zewnątrz, np. z `JSON.parse`.

</details>

<details><summary>Czy typy TypeScriptu istnieją w czasie działania programu?</summary>

Nie. Typy są usuwane przy kompilacji. Dlatego dane z API i tak trzeba walidować w runtime (ręcznie albo biblioteką typu Zod), a typy opisują tylko założenia.

</details>

<details><summary>Do czego przydaje się Record&lt;K, V&gt;?</summary>

Opisuje obiekt, który ma klucz dla **każdego** elementu `K`. `Record<OrderStatus, number>` wymusza wszystkie cztery statusy, więc nie zapomnisz o zerze dla brakującego.

</details>
