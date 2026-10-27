## Context

“A customer wants to send a friend a link to a filtered product list. Right now the filters disappear on refresh.” A question about **state in the URL** comes up in almost every Next.js interview.

Page: `/sandbox/010-task`. Data: `listProducts({ q, category, sort, page, perPage })` (~0.4 s) from `@/lib/sandbox-data`, plus the `CATEGORIES` and `SORTS` constants.

## Requirements

- [ ] State in the address: `?q=&category=&sort=&page=`. A refresh and a shared link show the same thing.
- [ ] The page (a Server Component) reads `searchParams` and fetches the data itself. No `fetch` from the client.
- [ ] The search box updates the URL with a **300 ms debounce**. Typing doesn't add a history entry for every character (`replace`).
- [ ] Changing the category or sorting adds a history entry (`push`), so “Back” undoes the filter.
- [ ] Changing a filter goes back to page 1.
- [ ] Pagination is plain `<Link>`s that keep the other parameters, with the current page marked.
- [ ] Junk in the URL (`?page=-3&sort=xyz&category=fridges`) doesn't crash the page but falls back to defaults.
- [ ] There's a visible loading state (`useTransition` or `<Suspense>`).

## Bonus

- [ ] Default values don't end up in the URL (`sort=relevance`, `page=1`).
- [ ] The search input syncs with the URL after “Back”, but doesn't wipe text the user is still typing.
- [ ] `<Suspense key={...}>` so you see a skeleton instead of stale results after changing filters.

## What the interviewer looks at

- whether the URL is the single source of truth, not a copy of state in `useState`,
- whether you understand `push` vs `replace` from the user's point of view,
- whether you validate parameters like any user input,
- whether you know that `searchParams` makes the page dynamic (rendered on every request).

## Follow-up questions

<details><summary>Why keep filters in the URL rather than in useState or Context?</summary>

The URL survives a refresh, can be shared and bookmarked, works with Back/Forward and is readable by the server, so data can be fetched in a Server Component without an extra API.

</details>

<details><summary>Client-side useSearchParams vs searchParams in page.tsx — what's the difference?</summary>

`searchParams` in `page.tsx` is server data (a promise in recent versions) used to fetch data. `useSearchParams` reads the URL in a client component. On a static page it needs a `<Suspense>` boundary, because the parameters don't exist at build time.

</details>

<details><summary>What does startTransition do around router.push?</summary>

It marks the navigation as non-urgent: React keeps showing the current screen, and `isPending` tells you the new one is loading. Without it a fallback could flash on every change.

</details>

<details><summary>How do you avoid races when typing fast?</summary>

Debounce limits the number of navigations, and the router shows the result for the **latest** URL anyway. Older renders are abandoned, so you don't need to cancel requests manually as with a client-side `fetch`.

</details>
