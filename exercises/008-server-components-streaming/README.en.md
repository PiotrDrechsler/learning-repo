## Context

A typical “performance debugging” task in a Next.js interview. The interviewer: “This product page takes 4 seconds to load and sometimes crashes entirely. Fix it without changing the data API.”

Page: `/sandbox/008-task/[id]`. Data (from `@/lib/sandbox-data`, server only):

| Function | Time | Notes |
| --- | --- | --- |
| `getProduct(id)` | ~0.3 s | missing product = `undefined` |
| `getReviews(id)` | ~1.5 s | always throws for product **13** |
| `getRecommendations(id)` | ~2.5 s | |

The current version calls them **one after another** (a waterfall) and shows anything only after ~4.3 s.

## Requirements

- [ ] Product info appears after ~0.3 s, without waiting for reviews and recommendations.
- [ ] Reviews and recommendations **stream** in, each section with its own skeleton (`<Suspense>`).
- [ ] The slow requests start **in parallel**, not one after another. The whole page is ready in ~2.5 s, not ~4.3 s.
- [ ] `loading.tsx` for the segment: an instant skeleton when navigating between products.
- [ ] A missing product (`/999`) and an invalid id (`/abc`) → `notFound()` and a custom `not-found.tsx` (status 404).
- [ ] A reviews error (`/13`) → `error.tsx` with a “Try again” button.
- [ ] The browser tab title = the product name (`generateMetadata`).

## Bonus

- [ ] `generateMetadata` and the page fetch the product once, not twice (React's `cache`).
- [ ] A reviews error breaks only the reviews section and the rest of the page stays (a custom error boundary around the section).
- [ ] Explain out loud what the user sees at every moment for `/1` and for `/13`.

## What the interviewer looks at

- whether you understand that consecutive `await`s in a Server Component are a waterfall,
- whether you know where to put `<Suspense>` boundaries and why `loading.tsx` is Suspense too,
- whether `error.tsx` is a client component and why it has to be,
- whether you know that `params` is a promise in recent Next.js versions (`await params`).

## Follow-up questions

<details><summary>How does Promise.all differ from passing a promise to a component inside Suspense?</summary>

`await Promise.all([...])` also removes the waterfall, but the page still waits for the **slowest** request. When you start requests immediately and await them only in components wrapped in `<Suspense>`, each section appears as soon as its data is ready (streaming).

</details>

<details><summary>Why does error.tsx need "use client"?</summary>

An error boundary is a browser-side mechanism (the “an error happened” state, the `reset` button). Server Components have no state or event handlers.

</details>

<details><summary>Why router.refresh() next to reset() in error.tsx?</summary>

The error happened while rendering on the server. `reset()` only clears the boundary state and re-renders what the client already has. `router.refresh()` asks the server for a fresh result, so the retry actually means something.

</details>

<details><summary>What does React's cache() do and how is it different from fetch caching?</summary>

`cache(fn)` memoizes a function's result for the same arguments **within a single request** (deduplication). The Next.js data cache (`fetch` options, `use cache`) keeps results **across** requests and needs a revalidation strategy.

</details>

<details><summary>When could this page be static?</summary>

If product data changed rarely: `generateStaticParams` for popular ids plus revalidation (ISR / revalidate). Reviews could stay dynamic and stream separately.

</details>
