## Context

The timer question comes up very often, because within a few minutes it shows whether the candidate understands closures, `useRef` and effect cleanup.

## Requirements

- [ ] A display in `mm:ss.cs` format (hundredths of a second), e.g. `01:07.42`.
- [ ] Buttons: **Start** / **Pause** (one toggling button), **Lap**, **Reset**.
- [ ] Pausing and resuming don't lose time.
- [ ] “Lap” adds a lap time: number, lap time and total time. Newest on top.
- [ ] Reset is possible only while paused and also clears the laps.
- [ ] Time is computed from `Date.now()` / `performance.now()`, **not** by adding `+10` on every tick (intervals drift and slow down in background tabs).
- [ ] The interval is cleared on pause and on unmount.

## Bonus

- [ ] The fastest lap in green, the slowest in red (when there are at least 2).
- [ ] Keyboard shortcuts: Space start/pause, L lap, R reset.
- [ ] Use `requestAnimationFrame` instead of `setInterval`.

## What the interviewer looks at

- whether `setInterval` doesn't read a state variable from the first render (stale closure),
- what you keep in state (what you display) and what in a ref (interval id, start time),
- whether you know why StrictMode runs effects twice in dev and whether your code survives it.

## Follow-up questions

<details><summary>What is a stale closure and how do you get one here?</summary>

`setInterval(() => setTime(time + 10), 10)` in an effect with an empty dependency array. The callback closes over `time` from the first render, so it always sets `0 + 10`. Fix: a functional update `setTime(t => t + 10)`, a ref, or computing from the start time.

</details>

<details><summary>Why does a timer counted with +10 every 10 ms fall behind?</summary>

`setInterval` guarantees a *minimum* delay, not an exact one. The main thread can be busy, and in an inactive tab the browser throttles timers to ~1 s. The difference `Date.now() - start` always gives the real time.

</details>

<details><summary>Why does StrictMode run effects twice in dev?</summary>

To catch effects without a proper cleanup. Mount → cleanup → mount simulates e.g. returning to a screen. If two intervals run at once afterwards, the `clearInterval` in the cleanup is missing.

</details>
