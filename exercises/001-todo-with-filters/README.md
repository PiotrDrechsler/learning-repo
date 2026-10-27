## Kontekst

„Zrób todo listę” brzmi banalnie, ale rekruter patrzy tu na fundamenty: jak trzymasz stan, czy go nie mutujesz, czy rozumiesz klucze i stan pochodny. Piszesz w **JavaScripcie**.

## Wymagania

- [ ] Formularz z inputem i przyciskiem „Dodaj”. Enter też dodaje. Puste i same spacje są ignorowane.
- [ ] Każde zadanie: checkbox (zrobione), tekst, przycisk „Usuń”.
- [ ] Filtry: **Wszystkie / Aktywne / Zrobione**. Przefiltrowana lista **nie jest** trzymana w osobnym stanie.
- [ ] Licznik „Zostało X zadań” (z poprawną odmianą: 1 zadanie, 2 zadania, 5 zadań).
- [ ] Przycisk „Usuń zrobione”, nieaktywny, gdy nie ma czego usuwać.
- [ ] Lista przetrwa odświeżenie strony (localStorage).

## Bonus

- [ ] Podwójne kliknięcie w tekst włącza edycję: Enter zapisuje, Escape anuluje, pusty tekst usuwa zadanie.
- [ ] Przepisz logikę na `useReducer` (akcje: add, toggle, remove, edit, clearCompleted).
- [ ] „Zaznacz wszystkie” jednym checkboxem.

## Na co patrzy rekruter

- `key={todo.id}`, a nie indeks tablicy, i umiesz wytłumaczyć, czemu,
- brak mutacji (`push`, `todo.done = !todo.done`),
- leniwa inicjalizacja stanu z localStorage (`useState(() => ...)`) i odporność na zepsuty JSON,
- czytelne nazwy i małe funkcje.

## Pytania follow-up

<details><summary>Dlaczego klucz z indeksu jest tu złym pomysłem?</summary>

Po usunięciu lub filtrowaniu elementy przesuwają się, więc React dopasuje stan (np. tryb edycji, wartość niekontrolowanego inputa, focus) do złego elementu. Stabilne `id` jednoznacznie identyfikuje element między renderami.

</details>

<details><summary>Po co leniwa inicjalizacja useState(() => read())?</summary>

Funkcja wykona się tylko przy pierwszym renderze. `useState(read())` czytałby localStorage przy każdym renderze, choć wynik i tak jest ignorowany.

</details>

<details><summary>W Next.js odczyt localStorage przy pierwszym renderze może dać błąd hydracji. Dlaczego i jak to obejść?</summary>

Serwer nie ma localStorage, więc wyrenderuje pustą listę, a klient pełną: HTML się nie zgadza. Rozwiązania: wczytać dane w `useEffect` po zamontowaniu, renderować komponent tylko po stronie klienta (`dynamic(..., { ssr: false })`) albo użyć `useSyncExternalStore` z `getServerSnapshot`.

</details>

<details><summary>Kiedy useReducer zamiast useState?</summary>

Gdy kolejne stany zależą od poprzednich w kilku miejscach, akcji jest dużo albo chcesz przetestować logikę jako czystą funkcję bez renderowania komponentu.

</details>
