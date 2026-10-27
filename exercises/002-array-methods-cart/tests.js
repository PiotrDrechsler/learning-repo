import { defineTests, expect } from "@/lib/testing";

const CART = [
  { id: 1, name: "Klawiatura", category: "peripherals", price: 199.99, qty: 1 },
  { id: 2, name: "Mysz", category: "peripherals", price: 89.5, qty: 2 },
  { id: 3, name: "Kabel HDMI", category: "cables", price: 19.99, qty: 3 },
  { id: 4, name: "Monitor", category: "displays", price: 899, qty: 1 },
];

// Każdy test dostaje świeżą kopię, żeby mutacja w jednym nie psuła kolejnych.
const cart = () => structuredClone(CART);

export default defineTests([
  { name: "cartTotal: suma price × qty, zaokrąglona do groszy", run: (m) => expect(m.cartTotal(cart())).toBe(1337.96) },
  { name: "cartTotal: pusty koszyk = 0", run: (m) => expect(m.cartTotal([])).toBe(0) },
  { name: "itemCount: łączna liczba sztuk", run: (m) => expect(m.itemCount(cart())).toBe(7) },
  {
    name: "uniqueCategories: bez powtórzeń, alfabetycznie",
    run: (m) => expect(m.uniqueCategories(cart())).toEqual(["cables", "displays", "peripherals"]),
  },
  {
    name: "groupByCategory: pozycje pogrupowane po kategorii",
    run: (m) => {
      const groups = m.groupByCategory(cart());
      const ids = Object.fromEntries(Object.entries(groups).map(([k, items]) => [k, items.map((i) => i.id)]));
      expect(ids).toEqual({ peripherals: [1, 2], cables: [3], displays: [4] });
    },
  },
  {
    name: "applyDiscount: ceny niższe o 10%, zaokrąglone",
    run: (m) => expect(m.applyDiscount(cart(), 10).map((i) => i.price)).toEqual([179.99, 80.55, 17.99, 809.1]),
  },
  {
    name: "applyDiscount: NIE zmienia oryginalnej tablicy ani obiektów",
    run: (m) => {
      const original = cart();
      const result = m.applyDiscount(original, 50);
      expect(original.map((i) => i.price)).toEqual([199.99, 89.5, 19.99, 899]);
      expect(result === original).toBe(false);
      expect(result[0] === original[0]).toBe(false);
    },
  },
  {
    name: "applyDiscount: rabat spoza 0–100 rzuca RangeError",
    run: (m) => {
      expect(() => m.applyDiscount(cart(), 150)).toThrow(RangeError);
      expect(() => m.applyDiscount(cart(), -5)).toThrow(RangeError);
    },
  },
  { name: "mostExpensive: najwyższa cena jednostkowa", run: (m) => expect(m.mostExpensive(cart())?.id).toBe(4) },
  { name: "mostExpensive: pusty koszyk = null", run: (m) => expect(m.mostExpensive([])).toBe(null) },
  {
    name: "formatPrice: zawsze dwa miejsca po przecinku",
    run: (m) => {
      expect(m.formatPrice(12.5)).toBe("12.50 zł");
      expect(m.formatPrice(0)).toBe("0.00 zł");
      expect(m.formatPrice(1337.96)).toBe("1337.96 zł");
    },
  },
]);
