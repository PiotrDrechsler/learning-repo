// Zadanie 003: typy dla zamówień. Treść w README.
// 1. Zamień każde `any` na właściwy typ.
// 2. Zaimplementuj funkcje (testy na placu zabaw).
// 3. Sprawdź typy: npm run typecheck:tasks (plik types.check.ts musi przejść bez błędów).

// TODO: status zamówienia: "new" | "paid" | "shipped" | "cancelled"
export type OrderStatus = any;

// TODO: pozycja zamówienia: productId, name, price, qty (wszystko wymagane)
export type OrderItem = any;

// TODO: zamówienie: id, customer, items, status oraz OPCJONALNA notatka note
export type Order = any;

/** Suma price * qty, zaokrąglona do 2 miejsc. */
export function orderTotal(order: any): number {
  throw new Error("TODO: orderTotal");
}

/** "new" -> "Nowe", "paid" -> "Opłacone", "shipped" -> "Wysłane", "cancelled" -> "Anulowane" */
export function statusLabel(status: any): string {
  throw new Error("TODO: statusLabel");
}

/** Zamówienia o danym statusie. */
export function filterByStatus(orders: any[], status: any): any[] {
  throw new Error("TODO: filterByStatus");
}

/** NOWY obiekt z nowym statusem. Anulowanego zamówienia nie da się już zmienić (rzuć Error). */
export function updateStatus(order: any, status: any): any {
  throw new Error("TODO: updateStatus");
}

/** Pierwszy element tablicy albo undefined. Ma działać dla tablicy DOWOLNEGO typu (generyk). */
export function first(items: any[]): any {
  throw new Error("TODO: first");
}

/** Liczba zamówień w każdym statusie, także zerowa: { new: 0, paid: 2, shipped: 1, cancelled: 0 } */
export function countByStatus(orders: any[]): any {
  throw new Error("TODO: countByStatus");
}
