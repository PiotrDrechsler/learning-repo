## Context

“Add comments under an article. No separate API, use Server Actions.” A very common App Router interview task, because it checks the server/client boundary and the new React 19 hooks.

Page: `/sandbox/009-task`. Data (from `@/lib/sandbox-data`): `getComments()`, `addComment(author, text)` (~0.8 s), `deleteComment(id)`. Data lives in server memory and disappears on restart.

## Requirements

- [ ] A Server Action in `actions.ts` (`"use server"`) adds a comment from the form data (`FormData`).
- [ ] Validation **on the server**: name 2–40 characters, comment 3–280 characters, the word “spam” rejected.
- [ ] Errors go back to the form and show **next to the fields**. Entered values don't disappear after an error.
- [ ] The form uses `useActionState`. While submitting, the button is disabled and shows “Sending…”.
- [ ] After success the list refreshes (`revalidatePath`) and the fields are cleared.
- [ ] The form works even before JavaScript loads (progressive enhancement: `action={...}`, not `onSubmit`).

## Bonus

- [ ] A new comment appears immediately, faded, before the server responds (`useOptimistic`).
- [ ] Deleting a comment with a Server Action that takes an argument via `.bind(null, id)`, with a separate “…” state for each button (`useFormStatus`).
- [ ] The same validation function on the client (for optimism) and on the server (as the final word).

## What the interviewer looks at

- whether you validate on the server, not only in the browser,
- whether you know what can't be exported from a `"use server"` file,
- whether you understand that `useFormStatus` works only in a component **inside** the `<form>`,
- whether you can explain how a Server Action differs from a Route Handler (`route.ts`).

## Follow-up questions

<details><summary>What is a Server Action from the network's point of view?</summary>

It's a server function that Next.js exposes as a POST endpoint with an implicit identifier. A form or a client call sends a request, and the framework serializes the arguments and the result. It's a public endpoint, so always check permissions and inputs.

</details>

<details><summary>useActionState vs useFormStatus — what is each for?</summary>

`useActionState` holds the action's **result** (e.g. validation errors) and gives you `isPending`. `useFormStatus` reads the submission state of the **nearest parent form**, so it fits buttons as separate components.

</details>

<details><summary>What happens to useOptimistic when the action fails?</summary>

Optimistic state lives only until the action (transition) ends. Afterwards React goes back to the real data from props. If saving failed, the entry simply disappears and you show an error.

</details>

<details><summary>revalidatePath vs router.refresh() — how do they differ?</summary>

`revalidatePath` runs on the server: it invalidates the cache for the path, and the Server Action's response carries the fresh result right away. `router.refresh()` runs on the client and refetches the current route, but doesn't clear the server's data cache.

</details>

<details><summary>When would you still use a Route Handler instead of a Server Action?</summary>

When the endpoint is called from outside this app (a mobile app, a webhook, a public API), when you need GET with HTTP caching, or full control over the response status and headers.

</details>
