## Context

A classic mid-level interview task. The interviewer says: “Build a user search field. The API is slow and we don't want to fire a request on every keystroke.”

API: `GET /api/users?q=<phrase>` → `{ results: User[], total: number }`, where `User = { id, name, email, city }`.
Responses arrive with a random delay of **150–1200 ms**, so an older request can come back *after* a newer one. `q=error` returns 500.

## Requirements

- [ ] A controlled `<input>`; the request fires only **300 ms** after the last keystroke (debounce).
- [ ] An empty phrase (after `trim()`) sends no request and clears the results.
- [ ] The screen always shows results for the **current** phrase: abort the previous request (`AbortController`) or ignore stale responses.
- [ ] States: loading, error (with a “Try again” button), no results, results list.
- [ ] Each result shows the full name, e-mail and city; below the list, “Found X”.
- [ ] No console warnings and no setState after unmount.

## Bonus

- [ ] Extract the logic into a `useDebouncedValue(value, delay)` hook.
- [ ] Highlight the matched part of the name with `<mark>`.
- [ ] Arrow-key navigation through the results.

## What the interviewer looks at

- whether you understand **why** the `useEffect` cleanup is needed (timer and request),
- whether you spot the race condition without a hint,
- whether you type the API response instead of using `any` everywhere,
- whether the state is minimal (e.g. you don't store “number of results” separately when it derives from the data).

## Follow-up questions

<details><summary>What is the difference between debounce and throttle? When do you use each?</summary>

Debounce runs the action only after N ms of silence (search, autosave). Throttle runs the action at most once every N ms during continuous events (scroll, resize, drag).

</details>

<details><summary>What happens if you don't abort the previous request?</summary>

Responses can arrive in a different order than the requests, so a slow response for “an” overwrites the fresh results for “anna”. Fixes: an `AbortController` in the effect cleanup, or an `ignore` flag / comparing a request id.

</details>

<details><summary>Why shouldn't an AbortError be shown as an error?</summary>

We aborted the request ourselves because it became stale. That's not a failure but the expected flow, so we ignore `error.name === "AbortError"`.

</details>

<details><summary>How would you do this with React Query / SWR? What do you gain?</summary>

A query key `['users', debouncedQuery]` and `enabled: !!debouncedQuery`. You get caching, deduplication, cancellation through `signal`, retries and `placeholderData`/`keepPreviousData` so the list doesn't flicker.

</details>

<details><summary>Can useDeferredValue replace debounce?</summary>

Not really. `useDeferredValue` defers *rendering* of the expensive part of the UI, but it doesn't limit the number of requests. You still need debounce for the network.

</details>
