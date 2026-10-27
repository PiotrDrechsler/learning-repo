## Kontekst

Pytanie o timer pada bardzo często, bo w kilka minut wychodzi, czy kandydat rozumie domknięcia, `useRef` i cleanup efektów.

## Wymagania

- [ ] Wyświetlacz w formacie `mm:ss.cs` (setne sekundy), np. `01:07.42`.
- [ ] Przyciski: **Start** / **Pauza** (jeden przycisk przełączany), **Okrążenie**, **Reset**.
- [ ] Pauza i wznowienie nie gubią czasu.
- [ ] „Okrążenie” dodaje międzyczas: numer, czas okrążenia i czas łączny. Najnowsze na górze.
- [ ] Reset jest możliwy tylko podczas pauzy i czyści też okrążenia.
- [ ] Czas liczony z `Date.now()` / `performance.now()`, a **nie** przez dodawanie `+10` w każdym ticku (interwały dryfują i zwalniają w tle).
- [ ] Interwał czyszczony przy pauzie i odmontowaniu.

## Bonus

- [ ] Najszybsze okrążenie na zielono, najwolniejsze na czerwono (gdy są co najmniej 2).
- [ ] Skróty klawiszowe: Spacja start/pauza, L okrążenie, R reset.
- [ ] Zamiast `setInterval` użyj `requestAnimationFrame`.

## Na co patrzy rekruter

- czy w `setInterval` nie czytasz zmiennej stanu z pierwszego renderu (stale closure),
- co trzymasz w stanie (to, co wyświetlasz), a co w refie (id interwału, czas startu),
- czy wiesz, czemu w StrictMode efekt odpala się dwa razy w dev i czy Twój kod to wytrzymuje.

## Pytania follow-up

<details><summary>Co to jest stale closure i jak go tu dostać?</summary>

`setInterval(() => setTime(time + 10), 10)` w efekcie z pustą tablicą zależności. Callback domyka `time` z pierwszego renderu, więc zawsze ustawia `0 + 10`. Naprawa: aktualizacja funkcyjna `setTime(t => t + 10)`, ref albo liczenie z czasu startu.

</details>

<details><summary>Dlaczego timer liczony przez +10 co 10 ms się spóźnia?</summary>

`setInterval` gwarantuje *minimalne* opóźnienie, nie dokładne. Główny wątek bywa zajęty, a w nieaktywnej karcie przeglądarka dławi timery do ~1 s. Różnica `Date.now() - start` zawsze daje prawdziwy czas.

</details>

<details><summary>Po co StrictMode podwójnie odpala efekty w trybie dev?</summary>

Żeby wyłapać efekty bez poprawnego cleanupu. Montowanie → sprzątanie → montowanie symuluje np. powrót do ekranu. Jeśli po tym działają dwa interwały naraz, brakuje `clearInterval` w cleanupie.

</details>
