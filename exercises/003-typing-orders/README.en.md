## Context

“There's `any` everywhere in this project. Type the orders module so the compiler catches mistakes for us.” A typical first TypeScript task in a junior interview.

You code in `exercise.ts`. Two things check your work:

1. **Tests in the playground**: whether the functions work.
2. **The compiler**: `npm run typecheck:tasks` checks the `types.check.ts` file. Correct code must compile, and every line marked `@ts-expect-error` must be a type error. As long as you leave `any`, the compiler reports “Unused '@ts-expect-error' directive”.

## Requirements

- [ ] `OrderStatus` – a union: `"new" | "paid" | "shipped" | "cancelled"`.
- [ ] `OrderItem` – `productId`, `name`, `price`, `qty` (all required, numbers and text).
- [ ] `Order` – `id`, `customer`, `items`, `status` and an **optional** `note`.
- [ ] `orderTotal(order)` – the sum of `price × qty`, rounded to 2 decimal places.
- [ ] `statusLabel(status)` – a Polish label: Nowe, Opłacone, Wysłane, Anulowane. Use a `switch` with an exhaustiveness check via `never`.
- [ ] `filterByStatus(orders, status)`.
- [ ] `updateStatus(order, status)` – a **new** object. A cancelled order can't be changed (throw an `Error`).
- [ ] `first(items)` – a generic: returns `number | undefined` for `number[]` and `Order | undefined` for `Order[]`.
- [ ] `countByStatus(orders)` – a `Record<OrderStatus, number>`, including zeros.
- [ ] Zero `any` in the finished file.

## Bonus

- [ ] Derive `OrderStatus` from an `as const` array, so you have both the list of values and the type from one source.
- [ ] Mark parameters as read-only (`readonly Order[]`, `Readonly<Order>`).

## What the interviewer looks at

- whether you know the difference between `type` and `interface` and can justify your choice,
- whether you understand an optional field (`note?: string`) and that its type is `string | undefined`,
- whether the generic is really generic (`<T>`), not `unknown` or `any`,
- whether you know what `never` is for in the switch's `default`.

## Follow-up questions

<details><summary>type or interface — when to use which?</summary>

Both describe an object's shape. An `interface` can be extended (`extends`) and declarations merge, and its errors are often more readable. A `type` is needed for unions, conditional and mapped types. Many teams use `interface` for objects and `type` for the rest. Consistency is what matters.

</details>

<details><summary>Why const unhandled: never = status in the switch?</summary>

Once you handle every member of the union, the type left in `default` is `never`. If someone adds a new status (e.g. `"returned"`), the type stops being `never` and the compiler points to the place that doesn't handle it.

</details>

<details><summary>any vs unknown — what's the difference?</summary>

`any` turns checking off: you can do anything with the value. `unknown` also accepts any value, but before using it you must narrow the type (e.g. `typeof`, `instanceof`). It's the safe choice for external data, e.g. from `JSON.parse`.

</details>

<details><summary>Do TypeScript types exist at runtime?</summary>

No. Types are erased during compilation. That's why data from an API still has to be validated at runtime (by hand or with a library like Zod), while types only describe assumptions.

</details>

<details><summary>What is Record&lt;K, V&gt; useful for?</summary>

It describes an object that has a key for **every** member of `K`. `Record<OrderStatus, number>` forces all four statuses, so you can't forget the zero for a missing one.

</details>
