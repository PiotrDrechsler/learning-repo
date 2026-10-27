## Kontekst

„Feed ma tysiące wpisów. Nie chcemy przycisku «Pokaż więcej», tylko doładowywanie przy przewijaniu”. Piszesz w **JavaScripcie**.

API: `GET /api/posts?page=1&limit=10` → `{ items, page, totalPages, hasMore }`, opóźnienie 400–900 ms.
Strony > 1 w ~15% przypadków zwracają **503** (celowo). Dodaj `&stable=1`, jeśli chcesz to na chwilę wyłączyć.

## Wymagania

- [ ] Pierwsza strona ładuje się od razu po wejściu.
- [ ] Na końcu listy jest niewidoczny „sentinel” obserwowany przez `IntersectionObserver`. Gdy wejdzie w widok, dociągamy kolejną stronę.
- [ ] Nigdy nie ma dwóch równoległych requestów o kolejne strony i nigdy nie ma duplikatów postów.
- [ ] Przy błędzie: komunikat i przycisk „Spróbuj ponownie”, który ponawia **tę samą** stronę.
- [ ] Gdy `hasMore === false`: „To już wszystko (X postów)”, obserwator przestaje dociągać.
- [ ] Observer jest odłączany w cleanupie.

## Bonus

- [ ] Wydziel hook `useInfiniteList(fetchPage)` zwracający `{ items, status, hasMore, loadMore, retry }`.
- [ ] `rootMargin: "200px"`, żeby dociągać zanim użytkownik dojedzie do samego końca.
- [ ] Szkielety (skeletony) zamiast tekstu „Ładowanie…”.

## Na co patrzy rekruter

- jak blokujesz podwójne ładowanie (ref vs stan, i dlaczego stan tu nie wystarcza),
- czy observer nie jest tworzony od nowa przy każdej nowej stronie bez potrzeby,
- czy nie zostawiasz stale closure w callbacku obserwatora,
- czy umiesz powiedzieć, kiedy potrzebna byłaby wirtualizacja.

## Pytania follow-up

<details><summary>Dlaczego flaga „ładuję” w useState może nie wystarczyć?</summary>

Callback obserwatora może odpalić się dwa razy, zanim React wyrenderuje nowy stan, a callback i tak widzi wartość z domknięcia. `useRef` daje synchroniczną flagę, którą sprawdzasz i ustawiasz natychmiast.

</details>

<details><summary>IntersectionObserver vs nasłuchiwanie scroll — co lepsze?</summary>

IntersectionObserver działa asynchronicznie poza głównym wątkiem obliczeń layoutu, nie wymaga liczenia `getBoundingClientRect` przy każdym evencie i nie trzeba go throttlować. Scroll listener jest prostszy w starych przeglądarkach, ale łatwo nim zabić wydajność.

</details>

<details><summary>Kiedy dodałbyś wirtualizację (np. react-window / TanStack Virtual)?</summary>

Gdy w DOM robią się tysiące węzłów i przewijanie zaczyna klatkować. Wirtualizacja renderuje tylko widoczne wiersze, a infinite scroll odpowiada tylko za dociąganie danych. Często używa się obu naraz.

</details>

<details><summary>Paginacja offsetowa vs kursorowa — czym grozi offset przy infinite scroll?</summary>

Jeśli w trakcie przewijania na górze listy pojawi się nowy wpis, offset przesunie się i dostaniesz duplikat albo zgubisz element. Kursor (`after=<id>`) jest odporny na takie zmiany.

</details>
