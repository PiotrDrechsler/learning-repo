## Context

“The feed has thousands of entries. We don't want a ‘Show more’ button, just loading as you scroll.” You write it in **JavaScript**.

API: `GET /api/posts?page=1&limit=10` → `{ items, page, totalPages, hasMore }`, delay 400–900 ms.
Pages > 1 return **503** in ~15% of cases (on purpose). Add `&stable=1` if you want to turn that off for a while.

## Requirements

- [ ] The first page loads right after entering.
- [ ] At the end of the list there is an invisible “sentinel” observed by an `IntersectionObserver`. When it comes into view, we fetch the next page.
- [ ] There are never two parallel requests for the next pages and never duplicate posts.
- [ ] On error: a message and a “Try again” button that retries **the same** page.
- [ ] When `hasMore === false`: “That's all (X posts)”, and the observer stops loading.
- [ ] The observer is disconnected in the cleanup.

## Bonus

- [ ] Extract a `useInfiniteList(fetchPage)` hook returning `{ items, status, hasMore, loadMore, retry }`.
- [ ] `rootMargin: "200px"` so loading starts before the user reaches the very end.
- [ ] Skeletons instead of a “Loading…” text.

## What the interviewer looks at

- how you prevent double loading (ref vs state, and why state isn't enough here),
- whether the observer isn't needlessly recreated for every new page,
- whether you leave a stale closure in the observer callback,
- whether you can say when virtualization would be needed.

## Follow-up questions

<details><summary>Why might a “loading” flag in useState not be enough?</summary>

The observer callback can fire twice before React renders the new state, and the callback sees the value from its closure anyway. `useRef` gives you a synchronous flag you check and set immediately.

</details>

<details><summary>IntersectionObserver vs a scroll listener — which is better?</summary>

IntersectionObserver works asynchronously, doesn't require calling `getBoundingClientRect` on every event and doesn't need throttling. A scroll listener is simpler in old browsers, but it's easy to kill performance with it.

</details>

<details><summary>When would you add virtualization (e.g. react-window / TanStack Virtual)?</summary>

When the DOM grows to thousands of nodes and scrolling starts to stutter. Virtualization renders only the visible rows, while infinite scroll is only responsible for fetching data. The two are often used together.

</details>

<details><summary>Offset vs cursor pagination — what's the risk of offsets with infinite scroll?</summary>

If a new entry appears at the top of the list while you scroll, the offset shifts and you get a duplicate or lose an item. A cursor (`after=<id>`) is resilient to such changes.

</details>
