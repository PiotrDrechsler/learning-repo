"use client";

import { useEffect, useRef, useState } from "react";

type Lap = { n: number; lapMs: number; totalMs: number };

function format(ms: number): string {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const s = Math.floor(totalCs / 100) % 60;
  const m = Math.floor(totalCs / 6000);
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

export default function Solution() {
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0); // to, co wyświetlamy
  const [laps, setLaps] = useState<Lap[]>([]);

  const startedAtRef = useRef(0); // performance.now() w chwili (wz)nowienia
  const accumulatedRef = useRef(0); // czas sprzed ostatniej pauzy

  useEffect(() => {
    if (!running) return;
    startedAtRef.current = performance.now();
    let frame = 0;
    const tick = () => {
      setElapsedMs(accumulatedRef.current + performance.now() - startedAtRef.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      // zapamiętaj czas przy pauzie (i przy odmontowaniu)
      accumulatedRef.current += performance.now() - startedAtRef.current;
      setElapsedMs(accumulatedRef.current);
    };
  }, [running]);

  const currentTotal = () => (running ? accumulatedRef.current + performance.now() - startedAtRef.current : accumulatedRef.current);

  const toggle = () => setRunning((r) => !r);

  const lap = () => {
    if (!running) return;
    const totalMs = currentTotal();
    setLaps((prev) => {
      const previousTotal = prev[0]?.totalMs ?? 0;
      return [{ n: prev.length + 1, lapMs: totalMs - previousTotal, totalMs }, ...prev];
    });
  };

  const reset = () => {
    if (running) return;
    accumulatedRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
  };

  // Skróty: Spacja, L, R. Handler w refie, żeby nie podpinać listenera co render.
  const handlersRef = useRef({ toggle, lap, reset });
  useEffect(() => {
    handlersRef.current = { toggle, lap, reset };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        handlersRef.current.toggle();
      } else if (e.key.toLowerCase() === "l") handlersRef.current.lap();
      else if (e.key.toLowerCase() === "r") handlersRef.current.reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const lapTimes = laps.map((l) => l.lapMs);
  const fastest = laps.length >= 2 ? Math.min(...lapTimes) : null;
  const slowest = laps.length >= 2 ? Math.max(...lapTimes) : null;

  return (
    <div className="stack">
      <div style={{ fontFamily: "var(--mono)", fontSize: 48, fontWeight: 700, fontVariantNumeric: "tabular-nums" }} aria-live="off">
        {format(elapsedMs)}
      </div>
      <div className="row">
        <button type="button" onClick={toggle}>
          {running ? "Pauza" : elapsedMs > 0 ? "Wznów" : "Start"}
        </button>
        <button type="button" onClick={lap} disabled={!running}>
          Okrążenie
        </button>
        <button type="button" onClick={reset} disabled={running || (elapsedMs === 0 && laps.length === 0)}>
          Reset
        </button>
        <span className="muted">Spacja · L · R</span>
      </div>
      {laps.length > 0 && (
        <ol>
          {laps.map((l) => (
            <li
              key={l.n}
              className="row"
              style={{
                justifyContent: "space-between",
                fontFamily: "var(--mono)",
                color: l.lapMs === fastest ? "var(--ok)" : l.lapMs === slowest ? "var(--danger)" : undefined,
              }}
            >
              <span>Okrążenie {l.n}</span>
              <span>{format(l.lapMs)}</span>
              <span className="muted">{format(l.totalMs)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
