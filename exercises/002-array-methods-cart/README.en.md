## Context

Junior interviews almost always include a data task: “you have an array of objects, count / group / transform it”. It checks `map`, `filter`, `reduce` and whether you can change data **without mutation**, which is key in React.

You code in `exercise.js`. Every function receives an array of cart items:

```js
{ id: 1, name: "Klawiatura", category: "peripherals", price: 199.99, qty: 1 }
```

The playground shows the list of tests: ✓ passed, ✗ failed with a description, ○ not implemented yet.

## Requirements

- [ ] `cartTotal(items)` – the sum of `price × qty`, rounded to 2 decimal places. An empty cart = `0`.
- [ ] `itemCount(items)` – the total number of units.
- [ ] `uniqueCategories(items)` – categories without duplicates, sorted alphabetically.
- [ ] `groupByCategory(items)` – an object `{ category: [items] }`.
- [ ] `applyDiscount(items, percent)` – a **new** array with prices lowered by `percent`%, rounded. The original stays untouched. A discount outside 0–100 → `RangeError`.
- [ ] `mostExpensive(items)` – the item with the highest unit price, and `null` for an empty array.
- [ ] `formatPrice(value)` – `12.5` → `"12.50 zł"`.
- [ ] No `for` loops: use array methods.

## Bonus

- [ ] Write `groupByCategory` in two ways: with `reduce` and with `Object.groupBy`.
- [ ] Add `removeItem(items, id)` and `changeQty(items, id, qty)` without mutation (exactly how state is updated in React).

## What the interviewer looks at

- whether you pick the right method (`map` transforms, `filter` selects, `reduce` folds into one value),
- whether you pass an initial value to `reduce`,
- whether you understand that `{ ...item }` copies the object while `item.price = ...` changes the original,
- whether you know why prices need rounding.

## Follow-up questions

<details><summary>What's the difference between map and forEach?</summary>

`map` returns a new array with the function's results. `forEach` returns nothing and is meant for side effects. In JSX you render lists with `map`, because you need an array of elements.

</details>

<details><summary>Why must you not mutate state in React?</summary>

React compares old and new state by reference (`Object.is`). If you change an object in place, the reference is the same, so React assumes nothing changed and may not update the view. A new array and new objects signal the change.

</details>

<details><summary>Why is 0.1 + 0.2 !== 0.3?</summary>

Numbers in JS are binary floating-point numbers (IEEE 754), and 0.1 can't be represented exactly. With money we round the result or calculate in cents as integers.

</details>

<details><summary>What happens if you call reduce on an empty array without an initial value?</summary>

It throws `TypeError: Reduce of empty array with no initial value`. That's why `cartTotal` passes `0`. In `mostExpensive` we check for an empty array first.

</details>

<details><summary>Is spread {...item} a shallow or a deep copy?</summary>

Shallow: it copies only the first level. Nested objects and arrays are still shared. For a deep copy use e.g. `structuredClone`.

</details>
