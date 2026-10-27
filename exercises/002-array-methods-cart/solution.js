// Przykładowe rozwiązanie zadania 002.

/**
 * @typedef {{ id: number, name: string, category: string, price: number, qty: number }} CartItem
 */

/** Zaokrąglenie do groszy: liczby zmiennoprzecinkowe nie są dokładne (0.1 + 0.2 !== 0.3). */
const round2 = (value) => Math.round(value * 100) / 100;

/** @param {CartItem[]} items */
export function cartTotal(items) {
  return round2(items.reduce((sum, item) => sum + item.price * item.qty, 0));
}

/** @param {CartItem[]} items */
export function itemCount(items) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

/** @param {CartItem[]} items */
export function uniqueCategories(items) {
  return [...new Set(items.map((item) => item.category))].sort();
}

/** @param {CartItem[]} items */
export function groupByCategory(items) {
  return items.reduce((groups, item) => {
    (groups[item.category] ??= []).push(item);
    return groups;
  }, /** @type {Record<string, CartItem[]>} */ ({}));
}

/**
 * @param {CartItem[]} items
 * @param {number} percent
 */
export function applyDiscount(items, percent) {
  if (typeof percent !== "number" || percent < 0 || percent > 100) {
    throw new RangeError(`Rabat musi być w przedziale 0–100, otrzymano ${percent}`);
  }
  // Spread tworzy NOWE obiekty: oryginalne pozycje zostają nietknięte.
  return items.map((item) => ({ ...item, price: round2(item.price * (1 - percent / 100)) }));
}

/** @param {CartItem[]} items */
export function mostExpensive(items) {
  if (items.length === 0) return null;
  return items.reduce((best, item) => (item.price > best.price ? item : best));
}

/** @param {number} value */
export function formatPrice(value) {
  return `${value.toFixed(2)} zł`;
}
