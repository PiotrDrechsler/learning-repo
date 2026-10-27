## Kontekst

Krótkie zadanie na rozgrzewkę albo na pierwsze 20 minut rozmowy. Sprawdza projektowanie API komponentu: co jest propsem, a co stanem wewnętrznym. Piszesz w **JavaScripcie**.

## Wymagania

- [ ] API: `<StarRating value={number} onChange={(n) => void} max={5} readOnly={false} />`.
- [ ] Komponent jest **kontrolowany**: wybrana ocena żyje u rodzica. Wewnętrznie trzymasz tylko podgląd po najechaniu.
- [ ] Najechanie myszą podświetla gwiazdki do kursora. Zjechanie przywraca wartość.
- [ ] Kliknięcie w aktualnie wybraną gwiazdkę czyści ocenę (0).
- [ ] Klawiatura: strzałki w lewo/prawo zmieniają ocenę o 1, Home → 1, End → max.
- [ ] `readOnly`: brak hovera, kliknięć i focusu.
- [ ] Dostępność: czytnik ekranu usłyszy np. „Ocena: 3 z 5”.
- [ ] Demo: dwa komponenty: edytowalny z tekstem „Twoja ocena: X” oraz `readOnly` z oceną 4.

## Bonus

- [ ] Połówki gwiazdek w trybie `readOnly` (np. średnia 3.5).
- [ ] Prop `labels`, np. `["słabo", "tak sobie", "ok", "dobrze", "super"]`, wyświetlany przy podglądzie.

## Na co patrzy rekruter

- czy nie kopiujesz propsa `value` do stanu (klasyczny błąd „derived state”),
- czy komponent da się użyć w formularzu i zresetować z zewnątrz,
- czy semantyka ma sens: `radiogroup` + `radio` albo `slider`.

## Pytania follow-up

<details><summary>Komponent kontrolowany vs niekontrolowany — jak dać oba tryby?</summary>

Przyjąć `value` i `defaultValue`. Jeśli `value !== undefined`, komponent jest kontrolowany. W przeciwnym razie trzyma własny stan zainicjowany z `defaultValue`. Tak działa `<input>`.

</details>

<details><summary>Dlaczego useState(props.value) to zwykle błąd?</summary>

Stan inicjuje się tylko raz. Gdy rodzic zmieni `value` (np. reset formularza), komponent dalej pokaże starą wartość. Dwa źródła prawdy rozjeżdżają się.

</details>

<details><summary>Jaką rolę ARIA wybrać: radiogroup czy slider?</summary>

Oba są poprawne. `radiogroup` z `radio` pasuje do kilku dyskretnych opcji i daje czytelny opis każdej gwiazdki. `slider` z `aria-valuenow` / `aria-valuemax` jest prostszy przy jednym fokusowalnym elemencie.

</details>
