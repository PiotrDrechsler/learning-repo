// Testy TYPÓW. Nie uruchamia ich plac zabaw, tylko kompilator:  npm run typecheck:tasks
// Dopóki w exercise.ts są `any`, linie z @ts-expect-error nie są błędami,
// więc TypeScript zgłosi "Unused '@ts-expect-error' directive". Gdy typy są dobre, plik przechodzi bez błędów.
import { countByStatus, first, statusLabel, updateStatus, type Order, type OrderItem, type OrderStatus } from "./exercise";

const order: Order = {
  id: 1,
  customer: "Ania",
  items: [{ productId: 1, name: "Mysz", price: 89.5, qty: 2 }],
  status: "new",
};

// ---------- To MUSI się kompilować ----------
export const label: string = statusLabel("paid");
export const firstNumber: number | undefined = first([1, 2, 3]);
export const firstOrder: Order | undefined = first([order]);
export const counts: Record<OrderStatus, number> = countByStatus([order]);
export const note: string | undefined = order.note;
export const withNote: Order = { ...order, note: "Dzwonić przed dostawą" };

// ---------- Każda linia pod @ts-expect-error MUSI być błędem typu ----------

// @ts-expect-error status spoza listy
statusLabel("lost");

// @ts-expect-error zamówienie bez wymaganego pola customer
export const missingCustomer: Order = { id: 2, items: [], status: "new" };

// @ts-expect-error first zwraca T | undefined, więc nie przypiszesz wyniku do samego number
export const surelyNumber: number = first([1, 2, 3]);

// @ts-expect-error price musi być liczbą
export const badItem: OrderItem = { productId: 1, name: "Mysz", price: "89.50", qty: 1 };

// @ts-expect-error updateStatus przyjmuje tylko istniejące statusy
updateStatus(order, "returned");

// @ts-expect-error note to tekst, nie liczba
export const numericNote: Order = { ...order, note: 42 };
