// Przykładowe rozwiązanie zadania 003.

// Tablica "as const" daje jednocześnie listę wartości do iteracji i typ unii.
export const ORDER_STATUSES = ["new", "paid", "shipped", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number]; // "new" | "paid" | "shipped" | "cancelled"

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: number;
  customer: string;
  items: OrderItem[];
  status: OrderStatus;
  note?: string; // opcjonalne: typ to string | undefined
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export function orderTotal(order: Order): number {
  return round2(order.items.reduce((sum, item) => sum + item.price * item.qty, 0));
}

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "new":
      return "Nowe";
    case "paid":
      return "Opłacone";
    case "shipped":
      return "Wysłane";
    case "cancelled":
      return "Anulowane";
    default: {
      // Gdy ktoś doda nowy status do unii, tu pojawi się błąd kompilacji: wszystkie przypadki muszą być obsłużone.
      const unhandled: never = status;
      throw new Error(`Nieznany status: ${String(unhandled)}`);
    }
  }
}

export function filterByStatus(orders: readonly Order[], status: OrderStatus): Order[] {
  return orders.filter((order) => order.status === status);
}

export function updateStatus(order: Readonly<Order>, status: OrderStatus): Order {
  if (order.status === "cancelled") {
    throw new Error(`Zamówienie ${order.id} jest anulowane i nie można zmienić jego statusu.`);
  }
  return { ...order, status };
}

export function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

export function countByStatus(orders: readonly Order[]): Record<OrderStatus, number> {
  const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const order of orders) counts[order.status] += 1;
  return counts;
}
