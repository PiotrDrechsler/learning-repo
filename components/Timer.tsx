"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

type TimerState = { startedAt: number | null; elapsed: number };

const fmt = (ms: number) => {
  const total = Math.floor(Math.abs(ms) / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
};

function load(key: string): TimerState {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw) as TimerState;
  } catch {
    // brak dostępu do storage - zaczynamy od zera
  }
  return { startedAt: null, elapsed: 0 };
}

/** Odliczanie jak na rozmowie. Stan przetrwa odświeżenie strony (sessionStorage). */
export default function Timer({ minutes, storageKey }: { minutes: number; storageKey: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<TimerState>({ startedAt: null, elapsed: 0 });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => setState(load(storageKey)), [storageKey]);

  // Zapis w akcjach, a nie w efekcie: efekt zapisu w StrictMode nadpisałby stan przed wczytaniem.
  const save = (next: TimerState) => {
    setState(next);
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignorujemy
    }
  };

  const running = state.startedAt !== null;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsed = state.elapsed + (state.startedAt !== null ? now - state.startedAt : 0);
  const remaining = minutes * 60_000 - elapsed;
  const over = remaining < 0;
  const progress = Math.min(1, elapsed / (minutes * 60_000));

  const start = () => {
    if (state.startedAt !== null) return;
    const t = Date.now();
    setNow(t);
    save({ ...state, startedAt: t });
  };
  const pause = () => {
    if (state.startedAt === null) return;
    save({ startedAt: null, elapsed: state.elapsed + Date.now() - state.startedAt });
  };
  const reset = () => save({ startedAt: null, elapsed: 0 });

  return (
    <div className={`timer${over ? " is-over" : ""}`}>
      <span className="timer-value" aria-live="off">
        {over ? `+${fmt(remaining)}` : fmt(remaining)}
      </span>
      <span className="timer-bar" aria-hidden>
        <span style={{ width: `${progress * 100}%` }} />
      </span>
      {running ? (
        <button type="button" className="button" onClick={pause}>
          {t.timer.pause}
        </button>
      ) : (
        <button type="button" className="button button-primary" onClick={start}>
          {elapsed > 0 ? t.timer.resume : t.timer.start(minutes)}
        </button>
      )}
      <button type="button" className="button" onClick={reset} disabled={elapsed === 0 && !running}>
        {t.timer.reset}
      </button>
    </div>
  );
}
