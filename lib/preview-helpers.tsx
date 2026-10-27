"use client";

import type { ReactNode } from "react";

// Pomocniki do wizualizacji zadań JavaScript/TypeScript (pliki preview.* w folderach ćwiczeń).
// Każda funkcja z Twojego modułu jest wołana przez attempt(), więc niezaimplementowana ("TODO")
// albo błędna funkcja nie wywraca całego podglądu, tylko pokazuje znacznik w swoim miejscu.

export type Attempt<T> = { ok: true; value: T } | { ok: false; todo: boolean; message: string };

export function attempt<T>(fn: () => T): Attempt<T> {
  try {
    return { ok: true, value: fn() };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, todo: message.startsWith("TODO"), message };
  }
}

/** Pokazuje wynik albo znacznik "TODO" / błąd. */
export function Show<T>({ result, children }: { result: Attempt<T>; children: (value: T) => ReactNode }) {
  if (result.ok) return <>{children(result.value)}</>;
  return (
    <span className={result.todo ? "pv-todo" : "pv-error"} title={result.message}>
      {result.todo ? result.message.replace(/^TODO:?\s*/, "TODO ") : `✗ ${result.message}`}
    </span>
  );
}

/** Kafelek z nazwą funkcji i jej wynikiem. */
export function Stat<T>({ fn, result, children }: { fn: string; result: Attempt<T>; children: (value: T) => ReactNode }) {
  return (
    <div className="pv-stat">
      <code className="pv-fn">{fn}</code>
      <div className="pv-value">
        <Show result={result}>{children}</Show>
      </div>
    </div>
  );
}
