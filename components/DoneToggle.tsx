"use client";

import { useProgress } from "@/lib/useProgress";

export default function DoneToggle({ slug }: { slug: string }) {
  const { isDone, toggle } = useProgress();
  const done = isDone(slug);
  return (
    <button type="button" className={`button${done ? " button-done" : ""}`} aria-pressed={done} onClick={() => toggle(slug)}>
      {done ? "✓ Zrobione" : "Oznacz jako zrobione"}
    </button>
  );
}
