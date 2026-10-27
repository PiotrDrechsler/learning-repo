"use client";

// Wizualizacja zadania 002. Tego pliku NIE edytujesz: korzysta z Twoich funkcji z exercise.js
// i pokazuje ich wynik na żywo. Zmieniaj ilości i rabat, żeby zobaczyć, jak reagują funkcje.

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Show, Stat, attempt } from "@/lib/preview-helpers";

const START = [
  { id: 1, name: "Klawiatura", category: "peripherals", price: 199.99, qty: 1 },
  { id: 2, name: "Mysz", category: "peripherals", price: 89.5, qty: 2 },
  { id: 3, name: "Kabel HDMI", category: "cables", price: 19.99, qty: 3 },
  { id: 4, name: "Monitor", category: "displays", price: 899, qty: 1 },
];

const L = {
  pl: { title: "Koszyk", item: "Produkt", price: "Cena", qty: "Ilość", after: "Po rabacie", discount: "Rabat", groups: "Grupy kategorii", mutated: "⚠ applyDiscount zmienił oryginalny koszyk! Zwróć nowe obiekty.", reset: "Przywróć koszyk", top: "najdroższy" },
  en: { title: "Cart", item: "Product", price: "Price", qty: "Qty", after: "Discounted", discount: "Discount", groups: "Category groups", mutated: "⚠ applyDiscount changed the original cart! Return new objects.", reset: "Reset cart", top: "most expensive" },
};

export default function CartPreview({ impl }) {
  const { locale } = useI18n();
  const l = L[locale];
  const [items, setItems] = useState(START);
  const [percent, setPercent] = useState(10);

  // Zmiana ilości bez mutacji (dokładnie tak, jak ćwiczysz w zadaniu).
  const changeQty = (id, delta) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)).filter((i) => i.qty > 0));

  // Kopia, żeby sprawdzić, czy applyDiscount nie zmienia przekazanego koszyka.
  const probe = structuredClone(items);
  const discounted = attempt(() => impl.applyDiscount(probe, percent));
  const mutated = probe.some((p, i) => p.price !== items[i].price);
  const discountedById = discounted.ok && Array.isArray(discounted.value) ? new Map(discounted.value.map((i) => [i.id, i.price])) : null;

  const top = attempt(() => impl.mostExpensive(items));
  const fmt = (v) => {
    const r = attempt(() => impl.formatPrice(v));
    return r.ok ? r.value : `${v}`;
  };

  return (
    <div className="pv">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3 className="pv-title">🛒 {l.title}</h3>
        <button type="button" onClick={() => setItems(START)}>
          {l.reset}
        </button>
      </div>

      <table className="pv-table">
        <thead>
          <tr>
            <th>{l.item}</th>
            <th>{l.price}</th>
            <th>{l.qty}</th>
            <th>{l.after}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={top.ok && top.value?.id === item.id ? "pv-highlight" : ""}>
              <td>
                {item.name} <span className="muted">· {item.category}</span>
                {top.ok && top.value?.id === item.id && <span className="pv-badge">{l.top}</span>}
              </td>
              <td>{fmt(item.price)}</td>
              <td>
                <span className="row" style={{ gap: 4, flexWrap: "nowrap" }}>
                  <button type="button" onClick={() => changeQty(item.id, -1)} aria-label="−">
                    −
                  </button>
                  <strong style={{ minWidth: 18, textAlign: "center" }}>{item.qty}</strong>
                  <button type="button" onClick={() => changeQty(item.id, 1)} aria-label="+">
                    +
                  </button>
                </span>
              </td>
              <td>
                {discountedById ? (
                  fmt(discountedById.get(item.id))
                ) : (
                  <Show result={discounted}>{() => null}</Show>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <label className="row">
        <span>
          {l.discount}: <strong>{percent}%</strong>
        </span>
        <input type="range" min={0} max={100} step={5} value={percent} onChange={(e) => setPercent(Number(e.target.value))} style={{ flex: 1 }} />
      </label>
      {mutated && <p className="pv-error">{l.mutated}</p>}

      <div className="pv-stats">
        <Stat fn="cartTotal(items)" result={attempt(() => impl.cartTotal(items))}>
          {(v) => fmt(v)}
        </Stat>
        <Stat fn="itemCount(items)" result={attempt(() => impl.itemCount(items))}>
          {(v) => String(v)}
        </Stat>
        <Stat fn="mostExpensive(items)" result={top}>
          {(v) => (v ? v.name : "null")}
        </Stat>
        <Stat fn="uniqueCategories(items)" result={attempt(() => impl.uniqueCategories(items))}>
          {(v) => (
            <span className="row" style={{ gap: 4 }}>
              {v.map((c) => (
                <span key={c} className="pv-chip">
                  {c}
                </span>
              ))}
            </span>
          )}
        </Stat>
      </div>

      <div className="pv-stat">
        <code className="pv-fn">groupByCategory(items)</code>
        <Show result={attempt(() => impl.groupByCategory(items))}>
          {(groups) => (
            <div className="pv-groups">
              {Object.entries(groups).map(([category, list]) => (
                <div key={category} className="pv-group">
                  <strong>{category}</strong>
                  <ul>
                    {list.map((i) => (
                      <li key={i.id}>
                        {i.name} × {i.qty}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}
