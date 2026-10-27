"use client";

import { useProgress } from "@/lib/useProgress";
import { useI18n } from "./I18nProvider";

export default function DoneToggle({ slug }: { slug: string }) {
  const { isDone, toggle } = useProgress();
  const { t } = useI18n();
  const done = isDone(slug);
  return (
    <button type="button" className={`button${done ? " button-done" : ""}`} aria-pressed={done} onClick={() => toggle(slug)}>
      {done ? t.exercise.isDone : t.exercise.markDone}
    </button>
  );
}
