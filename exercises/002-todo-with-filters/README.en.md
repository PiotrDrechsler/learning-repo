## Context

“Build a todo list” sounds trivial, but the interviewer is checking fundamentals here: how you hold state, whether you mutate it, whether you understand keys and derived state. You write it in **JavaScript**.

## Requirements

- [ ] A form with an input and an “Add” button. Enter also adds. Empty and whitespace-only input is ignored.
- [ ] Each task: a checkbox (done), the text and a “Delete” button.
- [ ] Filters: **All / Active / Done**. The filtered list is **not** kept in separate state.
- [ ] A counter “X tasks left” (with correct pluralization).
- [ ] A “Clear completed” button, disabled when there is nothing to clear.
- [ ] The list survives a page refresh (localStorage).

## Bonus

- [ ] Double-clicking the text enters edit mode: Enter saves, Escape cancels, empty text deletes the task.
- [ ] Rewrite the logic with `useReducer` (actions: add, toggle, remove, edit, clearCompleted).
- [ ] “Toggle all” with a single checkbox.

## What the interviewer looks at

- `key={todo.id}`, not the array index, and you can explain why,
- no mutation (`push`, `todo.done = !todo.done`),
- lazy state initialization from localStorage (`useState(() => ...)`) and resilience to broken JSON,
- readable names and small functions.

## Follow-up questions

<details><summary>Why is using the index as a key a bad idea here?</summary>

After deleting or filtering, items shift, so React matches state (edit mode, an uncontrolled input's value, focus) to the wrong item. A stable `id` identifies an item unambiguously between renders.

</details>

<details><summary>Why lazy initialization with useState(() => read())?</summary>

The function runs only on the first render. `useState(read())` would read localStorage on every render even though the result is ignored.

</details>

<details><summary>In Next.js, reading localStorage during the first render can cause a hydration error. Why, and how do you avoid it?</summary>

The server has no localStorage, so it renders an empty list while the client renders a full one: the HTML doesn't match. Fixes: load the data in `useEffect` after mount, render the component only on the client (`dynamic(..., { ssr: false })`), or use `useSyncExternalStore` with `getServerSnapshot`.

</details>

<details><summary>When would you use useReducer instead of useState?</summary>

When next states depend on previous ones in several places, when there are many actions, or when you want to test the logic as a pure function without rendering a component.

</details>
