## Context

A short warm-up task, or the first 20 minutes of an interview. It tests component API design: what's a prop and what's internal state. You write it in **JavaScript**.

## Requirements

- [ ] API: `<StarRating value={number} onChange={(n) => void} max={5} readOnly={false} />`.
- [ ] The component is **controlled**: the selected rating lives in the parent. Internally you keep only the hover preview.
- [ ] Hovering highlights the stars up to the cursor. Moving away restores the value.
- [ ] Clicking the currently selected star clears the rating (0).
- [ ] Keyboard: left/right arrows change the rating by 1, Home → 1, End → max.
- [ ] `readOnly`: no hover, no clicks, no focus.
- [ ] Accessibility: a screen reader announces e.g. “Rating: 3 of 5”.
- [ ] Demo: two components: an editable one with the text “Your rating: X” and a `readOnly` one with a rating of 4.

## Bonus

- [ ] Half stars in `readOnly` mode (e.g. an average of 3.5).
- [ ] A `labels` prop, e.g. `["poor", "meh", "ok", "good", "great"]`, shown with the preview.

## What the interviewer looks at

- whether you copy the `value` prop into state (the classic “derived state” mistake),
- whether the component can be used in a form and reset from the outside,
- whether the semantics make sense: `radiogroup` + `radio` or `slider`.

## Follow-up questions

<details><summary>Controlled vs uncontrolled — how do you support both modes?</summary>

Accept `value` and `defaultValue`. If `value !== undefined`, the component is controlled. Otherwise it keeps its own state initialized from `defaultValue`. That's how `<input>` works.

</details>

<details><summary>Why is useState(props.value) usually a mistake?</summary>

State is initialized only once. When the parent changes `value` (e.g. a form reset), the component still shows the old value. Two sources of truth drift apart.

</details>

<details><summary>Which ARIA role: radiogroup or slider?</summary>

Both are valid. `radiogroup` with `radio` fits a few discrete options and gives each star a clear description. `slider` with `aria-valuenow` / `aria-valuemax` is simpler with a single focusable element.

</details>
