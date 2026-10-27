// Zadanie 002: koszyk zakupów. Uzupełnij funkcje zgodnie z README.
// Plac zabaw uruchamia testy z tests.js po każdym zapisie tego pliku.

/**
 * @typedef {{ id: number, name: string, category: string, price: number, qty: number }} CartItem
 */

/** Suma price * qty dla wszystkich pozycji, zaokrąglona do 2 miejsc po przecinku. */
export function cartTotal(items) {
  throw new Error("TODO: cartTotal");
}

/** Łączna liczba sztuk w koszyku. */
export function itemCount(items) {
  throw new Error("TODO: itemCount");
}

/** Lista kategorii bez powtórzeń, posortowana alfabetycznie. */
export function uniqueCategories(items) {
  throw new Error("TODO: uniqueCategories");
}

/** Obiekt: kategoria -> tablica pozycji z tej kategorii. */
export function groupByCategory(items) {
  throw new Error("TODO: groupByCategory");
}

/** NOWA tablica z cenami obniżonymi o percent %, zaokrąglonymi do 2 miejsc. Nie zmieniaj oryginału. */
export function applyDiscount(items, percent) {
  throw new Error("TODO: applyDiscount");
}

/** Pozycja z najwyższą ceną jednostkową albo null dla pustego koszyka. */
export function mostExpensive(items) {
  throw new Error("TODO: mostExpensive");
}

/** 12.5 -> "12.50 zł" */
export function formatPrice(value) {
  throw new Error("TODO: formatPrice");
}
