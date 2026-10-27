import { defineTests, expect } from "@/lib/testing";
import type * as Impl from "./solution";

type Order = Impl.Order;

const ORDERS: Order[] = [
  {
    id: 1,
    customer: "Ania",
    status: "paid",
    items: [
      { productId: 1, name: "Mysz", price: 89.5, qty: 2 },
      { productId: 2, name: "Kabel HDMI", price: 19.99, qty: 3 },
    ],
  },
  { id: 2, customer: "Bartek", status: "shipped", items: [{ productId: 3, name: "Monitor", price: 899, qty: 1 }] },
  { id: 3, customer: "Celina", status: "paid", items: [], note: "Zostawić u sąsiada" },
  { id: 4, customer: "Darek", status: "cancelled", items: [{ productId: 1, name: "Mysz", price: 89.5, qty: 1 }] },
];

const orders = () => structuredClone(ORDERS);

export default defineTests<typeof Impl>([
  { name: "orderTotal: suma price × qty, zaokrąglona", run: (m) => expect(m.orderTotal(orders()[0])).toBe(238.97) },
  { name: "orderTotal: zamówienie bez pozycji = 0", run: (m) => expect(m.orderTotal(orders()[2])).toBe(0) },
  {
    name: "statusLabel: polska etykieta dla każdego statusu",
    run: (m) => {
      expect(m.statusLabel("new")).toBe("Nowe");
      expect(m.statusLabel("paid")).toBe("Opłacone");
      expect(m.statusLabel("shipped")).toBe("Wysłane");
      expect(m.statusLabel("cancelled")).toBe("Anulowane");
    },
  },
  {
    name: "filterByStatus: tylko zamówienia o danym statusie",
    run: (m) => expect(m.filterByStatus(orders(), "paid").map((o) => o.id)).toEqual([1, 3]),
  },
  {
    name: "updateStatus: zwraca nowy obiekt i nie zmienia oryginału",
    run: (m) => {
      const original = orders()[0];
      const updated = m.updateStatus(original, "shipped");
      expect(updated.status).toBe("shipped");
      expect(original.status).toBe("paid");
      expect(updated === original).toBe(false);
    },
  },
  {
    name: "updateStatus: anulowanego zamówienia nie da się zmienić",
    run: (m) => {
      m.updateStatus(orders()[0], "shipped"); // zwykła zmiana ma działać (starter rzuci tu "TODO")
      expect(() => m.updateStatus(orders()[3], "paid")).toThrow(Error);
    },
  },
  {
    name: "first: pierwszy element albo undefined",
    run: (m) => {
      expect(m.first([5, 6, 7])).toBe(5);
      expect(m.first(["a"])).toBe("a");
      expect(m.first([])).toBe(undefined);
    },
  },
  {
    name: "countByStatus: wszystkie statusy, także z zerem",
    run: (m) => expect(m.countByStatus(orders())).toEqual({ new: 0, paid: 2, shipped: 1, cancelled: 1 }),
  },
]);
