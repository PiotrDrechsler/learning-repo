"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "nauka-react:done";
const EVENT = "nauka-react:progress";

function read(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Lista zrobionych ćwiczeń zapisana w localStorage (tylko w tej przeglądarce). */
export function useProgress() {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(read());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVENT, sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // np. tryb prywatny - trudno, postęp nie zostanie zapamiętany
    }
    setDone(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const isDone = useCallback((slug: string) => done.includes(slug), [done]);

  return { done, isDone, toggle };
}
