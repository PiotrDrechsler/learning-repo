## Kontekst

„Mamy w aplikacji trzy różne modale i każdy działa inaczej. Napisz jeden komponent, który będzie bazą dla wszystkich”. Rekruter sprawdza znajomość DOM, refów, efektów i dostępności.

## Wymagania

- [ ] API: `<Modal open={boolean} onClose={() => void} title="...">{children}</Modal>`. Komponent **kontrolowany**.
- [ ] Renderowany przez `createPortal` do `document.body`.
- [ ] Zamyka się na **Escape** i po kliknięciu w tło. Kliknięcie w treść modala go **nie** zamyka.
- [ ] `role="dialog"`, `aria-modal="true"`, `aria-labelledby` wskazujące na tytuł.
- [ ] Po otwarciu focus trafia do modala. Tab i Shift+Tab krążą tylko wewnątrz (focus trap).
- [ ] Po zamknięciu focus wraca do elementu, który modal otworzył.
- [ ] Gdy modal jest otwarty, strona pod spodem się nie przewija.
- [ ] Demo: przycisk „Usuń konto” otwiera modal z potwierdzeniem i przyciskami „Anuluj” / „Usuń”.

## Bonus

- [ ] Prop `initialFocusRef`, żeby wskazać, co ma dostać focus na start (np. „Anuluj” przy akcjach niszczących).
- [ ] Animacja wejścia i wyjścia bez bibliotek.
- [ ] Porównaj z natywnym `<dialog>` i `showModal()`: co dostajesz za darmo?

## Na co patrzy rekruter

- czy `onClose` w zależnościach efektu nie powoduje ponownego podpinania listenerów co render (i czy wiesz, jak temu zaradzić),
- czy odróżniasz `e.target` od `e.currentTarget` przy klikaniu w tło,
- czy sprzątasz wszystko w cleanupie (listener, overflow na body),
- czy w ogóle myślisz o klawiaturze i czytnikach ekranu.

## Pytania follow-up

<details><summary>Po co portal, skoro można dać position: fixed?</summary>

Rodzic z `overflow: hidden`, `transform` albo własnym `z-index` (nowy stacking context) potrafi przyciąć lub przykryć modal. Portal renderuje DOM poza drzewem rodzica, a zdarzenia React dalej bąbelkują po drzewie komponentów.

</details>

<details><summary>Zdarzenia z portalu bąbelkują do rodzica w drzewie React czy w drzewie DOM?</summary>

W drzewie **React**. `onClick` na komponencie-rodzicu złapie kliknięcie w modalu, choć w DOM modal jest w `body`. Czasem to zaskakuje, np. przy zamykaniu dropdownów.

</details>

<details><summary>Co daje natywny dialog.showModal()?</summary>

Top layer (bez walki z z-index), `inert` na reszcie strony, Escape (zdarzenie `cancel`), `::backdrop`, poprawną semantykę. Focus trap i powrót focusu są w dużej mierze obsługiwane przez przeglądarkę.

</details>

<details><summary>Jak uniknąć ponownego podpinania listenera, gdy onClose to nowa funkcja co render?</summary>

Trzymać najnowszy `onClose` w refie aktualizowanym w efekcie (wzorzec „latest ref”) albo użyć `useEffectEvent` z Reacta 19.2. Listener podpinamy wtedy tylko przy zmianie `open`.

</details>
