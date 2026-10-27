## Context

“Build a product list and a details page in Next.js.” This is the most common junior App Router task: it checks whether you understand folder-based routing and the difference between server and client components.

You code in the `app/sandbox/004-task/` folder. Data (server only, from `@/lib/sandbox-data`):

| Function | Returns |
| --- | --- |
| `listProducts({ perPage: 12 })` | `{ items, total, page, totalPages }` |
| `getProduct(id)` | a product or `undefined` (~0.6 s) |

Product: `{ id, name, category, price, rating, stock, description }`.

## Requirements

- [ ] `/sandbox/004-task` – a list of 12 products (name, category, price). The page is an **async Server Component** and fetches data directly.
- [ ] Each product is a `<Link>` to `/sandbox/004-task/[id]`.
- [ ] `/sandbox/004-task/[id]` – details: name, price, rating, availability, description and a “Back to list” link.
- [ ] `[id]/loading.tsx` – a skeleton shown while the product loads.
- [ ] A missing product (`/999`) and an invalid id (`/abc`) → `notFound()` and a custom `[id]/not-found.tsx`.
- [ ] `layout.tsx` – a shared “Shop” header with a link to the list, visible on both the list and the details.
- [ ] Not a single `"use client"`.

## Bonus

- [ ] `generateMetadata`: the browser tab title = the product name.
- [ ] `generateStaticParams` for the 12 listed products, so their pages are ready right after the build.
- [ ] Check in the dev tools (Network) that going from list to details doesn't reload the whole page.

## What the interviewer looks at

- whether you know that an App Router route is a folder with `page.tsx` and `[id]` is a dynamic segment,
- whether you fetch data in a Server Component rather than with `useEffect`,
- whether you use `<Link>` rather than `<a>`,
- whether you remember that `params` is a promise (`await params`).

## Follow-up questions

<details><summary>How does a Server Component differ from a Client Component?</summary>

A Server Component renders on the server: it can be `async`, read the database and secrets, and its code isn't sent to the browser. It has no state or event handlers. A Client Component (`"use client"`) also runs in the browser, so it can have `useState`, `onClick` and effects. In the App Router everything is server by default.

</details>

<details><summary>When would you add "use client"?</summary>

When a component needs interaction or browser APIs: state, events, effects, `localStorage`, hooks like `useRouter`. Put the directive as low in the tree as possible, so as little JavaScript as possible goes to the browser.

</details>

<details><summary>What does layout.tsx do and how is it different from template.tsx?</summary>

A layout wraps the segment's pages and **keeps its state** when navigating between them (it doesn't remount). `template.tsx` looks similar but is recreated on every navigation, which is useful e.g. for enter animations.

</details>

<details><summary>What does Link give you compared with a plain &lt;a&gt;?</summary>

Client-side navigation without reloading the whole page (the layout and its state stay) and prefetching: Next.js fetches the route's data when the link appears on screen, so the transition is faster.

</details>

<details><summary>How does loading.tsx work?</summary>

Next.js automatically wraps the segment's page in `<Suspense>` and uses `loading.tsx` as the fallback. The skeleton shows right after the click, and the content streams in once the server has rendered it.

</details>
