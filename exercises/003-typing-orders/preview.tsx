"use client";

// Wizualizacja zadania 003. Tego pliku NIE edytujesz: korzysta z Twoich funkcji z exercise.ts.
// Klikaj przyciski na kartach, żeby zmieniać statusy przez updateStatus.

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Show, Stat, attempt } from "@/lib/preview-helpers";
import type * as Impl from "./solution";

type Order = Impl.Order;
type Status = Impl.OrderStatus;

const STATUSES: Status[] = ["new", "paid", "shipped", "cancelled"];
const NEXT: Partial<Record<Status, Status>> = { new: "paid", paid: "shipped" };

const START: Order[] = [
  { id: 1, customer: "Ania", status: "paid", items: [{ productId: 1, name: "Mysz", price: 89.5, qty: 2 }, { productId: 2, name: "Kabel HDMI", price: 19.99, qty: 3 }] },
  { id: 2, customer: "Bartek", status: "shipped", items: [{ productId: 3, name: "Monitor", price: 899, qty: 1 }] },
  { id: 3, customer: "Celina", status: "new", items: [{ productId: 4, name: "Klawiatura", price: 199.99, qty: 1 }], note: "Zostawić u sąsiada" },
  { id: 4, customer: "Darek", status: "cancelled", items: [{ productId: 1, name: "Mysz", price: 89.5, qty: 1 }] },
  { id: 5, customer: "Ewa", status: "new", items: [{ productId: 5, name: "Słuchawki", price: 349, qty: 1 }] },
];

const L = {
  pl: { title: "Zamówienia", next: "Dalej →", cancel: "Anuluj", reset: "Przywróć", first: "first(orders)", total: "Suma", empty: "brak" },
  en: { title: "Orders", next: "Next →", cancel: "Cancel", reset: "Reset", first: "first(orders)", total: "Total", empty: "none" },
};

export default function OrdersPreview({ impl }: { impl: typeof Impl }) {
  const { locale } = useI18n();
  const l = L[locale];
  const [orders, setOrders] = useState<Order[]>(START);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const change = (order: Order, status: Status) => {
    const result = attempt(() => impl.updateStatus(order, status));
    if (result.ok) {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? result.value : o)));
      setErrors((prev) => ({ ...prev, [order.id]: "" }));
    } else {
      setErrors((prev) => ({ ...prev, [order.id]: result.message }));
    }
  };

  const counts = attempt(() => impl.countByStatus(orders));

  return (
    <div className="pv">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3 className="pv-title">📦 {l.title}</h3>
        <button
          type="button"
          onClick={() => {
            setOrders(START);
            setErrors({});
          }}
        >
          {l.reset}
        </button>
      </div>

      <div className="pv-board">
        {STATUSES.map((status) => {
          const column = attempt(() => impl.filterByStatus(orders, status));
          const label = attempt(() => impl.statusLabel(status));
          return (
            <section key={status} className={`pv-column pv-status-${status}`}>
              <header>
                <Show result={label}>{(v) => <strong>{v}</strong>}</Show>{" "}
                <span className="muted">
                  <Show result={counts}>{(c) => `(${c[status]})`}</Show>
                </span>
              </header>
              <Show result={column}>
                {(list) =>
                  list.length === 0 ? (
                    <p className="muted" style={{ margin: 0 }}>
                      {l.empty}
                    </p>
                  ) : (
                    list.map((order) => (
                      <article key={order.id} className="pv-card">
                        <div className="row" style={{ justifyContent: "space-between" }}>
                          <strong>
                            #{order.id} {order.customer}
                          </strong>
                          <Show result={attempt(() => impl.orderTotal(order))}>{(v) => `${v.toFixed(2)} zł`}</Show>
                        </div>
                        {order.note && <div className="muted">📝 {order.note}</div>}
                        <div className="row" style={{ gap: 6, marginTop: 6 }}>
                          {NEXT[order.status] && (
                            <button type="button" onClick={() => change(order, NEXT[order.status]!)}>
                              {l.next}
                            </button>
                          )}
                          <button type="button" onClick={() => change(order, order.status === "cancelled" ? "paid" : "cancelled")}>
                            {order.status === "cancelled" ? "→ paid" : l.cancel}
                          </button>
                        </div>
                        {errors[order.id] && <div className="pv-error">{errors[order.id]}</div>}
                      </article>
                    ))
                  )
                }
              </Show>
            </section>
          );
        })}
      </div>

      <div className="pv-stats">
        <Stat fn={l.first} result={attempt(() => impl.first(orders))}>
          {(v) => (v ? `#${v.id} ${v.customer}` : "undefined")}
        </Stat>
        <Stat fn="first([])" result={attempt(() => impl.first([]))}>
          {(v) => String(v)}
        </Stat>
        <Stat fn="countByStatus(orders)" result={counts}>
          {(v) => <code>{JSON.stringify(v)}</code>}
        </Stat>
      </div>
    </div>
  );
}
