## Context

“We have three different modals in the app and each behaves differently. Write one component that becomes the base for all of them.” The interviewer checks your knowledge of the DOM, refs, effects and accessibility.

## Requirements

- [ ] API: `<Modal open={boolean} onClose={() => void} title="...">{children}</Modal>`. The component is **controlled**.
- [ ] Rendered through `createPortal` into `document.body`.
- [ ] Closes on **Escape** and on a backdrop click. Clicking the modal content does **not** close it.
- [ ] `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title.
- [ ] When opened, focus moves into the modal. Tab and Shift+Tab cycle only inside it (focus trap).
- [ ] When closed, focus returns to the element that opened the modal.
- [ ] While the modal is open, the page underneath doesn't scroll.
- [ ] Demo: a “Delete account” button opens a confirmation modal with “Cancel” / “Delete” buttons.

## Bonus

- [ ] An `initialFocusRef` prop to choose what gets focus first (e.g. “Cancel” for destructive actions).
- [ ] Enter and exit animation without libraries.
- [ ] Compare with the native `<dialog>` and `showModal()`: what do you get for free?

## What the interviewer looks at

- whether `onClose` in the effect dependencies re-attaches listeners on every render (and whether you know how to fix it),
- whether you distinguish `e.target` from `e.currentTarget` for backdrop clicks,
- whether you clean everything up (listener, body overflow),
- whether you think about the keyboard and screen readers at all.

## Follow-up questions

<details><summary>Why a portal if you can just use position: fixed?</summary>

A parent with `overflow: hidden`, `transform` or its own `z-index` (a new stacking context) can clip or cover the modal. A portal renders the DOM outside the parent's tree, while React events still bubble through the component tree.

</details>

<details><summary>Do events from a portal bubble to the parent in the React tree or the DOM tree?</summary>

In the **React** tree. An `onClick` on the parent component will catch a click inside the modal even though in the DOM the modal lives in `body`. This sometimes surprises people, e.g. when closing dropdowns.

</details>

<details><summary>What does the native dialog.showModal() give you?</summary>

The top layer (no z-index fights), `inert` on the rest of the page, Escape (the `cancel` event), `::backdrop` and correct semantics. Focus trapping and focus restore are largely handled by the browser.

</details>

<details><summary>How do you avoid re-attaching the listener when onClose is a new function on every render?</summary>

Keep the latest `onClose` in a ref updated in an effect (the “latest ref” pattern), or use `useEffectEvent` from React 19.2. Then the listener is attached only when `open` changes.

</details>
