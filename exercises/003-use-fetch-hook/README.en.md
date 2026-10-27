## Context

“We don't use React Query yet. Write a hook the whole team will use for fetching data.” What matters is the hook's API and types, not the fetch itself.

API: `GET /api/posts/:id` → `{ id, title, body, author, likes }`, delay 300–900 ms. Ids outside 1–87 return **404** with `{ message }`.

## Requirements

- [ ] `useFetch<T>(url: string | null)` returns `{ status, data, error, refetch }`.
- [ ] `status` is the union `"idle" | "loading" | "success" | "error"`. `url === null` means `"idle"` (nothing is fetched).
- [ ] A non-2xx response is an error carrying the server's `message`, if there is one.
- [ ] Changing `url` aborts the previous request. So does unmounting.
- [ ] `refetch()` fetches the same URL again.
- [ ] Demo: a numeric input with the post id, −/+ buttons, a post card, loading and error states, a “Refresh” button.

## Bonus

- [ ] When moving to another post, show the **previous** data slightly faded instead of an empty screen (like `keepPreviousData`).
- [ ] Make the return type a discriminated union so that after `if (status === "success")` TypeScript knows `data: T`.
- [ ] A simple module-level cache in a `Map`.

## What the interviewer looks at

- whether the hook is truly generic and knows nothing about `Post`,
- whether there's no race when clicking “+” quickly,
- whether you understand why `refetch` must be stable (`useCallback`) or why it doesn't matter,
- whether you can say what this hook lacks compared to React Query.

## Follow-up questions

<details><summary>Why not make the useEffect callback async directly?</summary>

`useEffect` expects the callback to return a cleanup function or nothing. An `async` function always returns a Promise, so the cleanup would be lost. Define an async function inside and call it (or use `.then`).

</details>

<details><summary>What does this hook lack compared to React Query / SWR?</summary>

A cache shared between components, request deduplication, invalidation after mutations, retry with backoff, refetching when the tab regains focus, cache garbage collection, devtools and Suspense support.

</details>

<details><summary>How would this look in the Next.js App Router without a hook?</summary>

In a Server Component you can `const post = await fetch(...)` directly in the component and handle loading and errors with `loading.tsx` and `error.tsx` (Suspense and an error boundary). A client hook is needed for data that depends on interaction.

</details>

<details><summary>Why a discriminated union instead of separate isLoading / isError flags?</summary>

Separate flags allow impossible states (e.g. `isLoading && isError`). A union enforces exactly one state, and TypeScript narrows the types in each branch.

</details>
