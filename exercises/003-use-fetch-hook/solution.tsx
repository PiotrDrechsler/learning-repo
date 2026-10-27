"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Post = { id: number; title: string; body: string; author: string; likes: number };

type FetchState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: T | null; error: null } // data = poprzednie dane (keepPreviousData)
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };

type UseFetchResult<T> = FetchState<T> & { refetch: () => void };

const cache = new Map<string, unknown>();

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    return body.message ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ status: "idle", data: null, error: null });
  const [nonce, setNonce] = useState(0);
  const forceRef = useRef(false); // true = refetch, pomiń cache

  useEffect(() => {
    if (url === null) {
      setState({ status: "idle", data: null, error: null });
      return;
    }

    const force = forceRef.current;
    forceRef.current = false;
    if (!force && cache.has(url)) {
      setState({ status: "success", data: cache.get(url) as T, error: null });
      return;
    }

    const controller = new AbortController();
    setState((prev) => ({ status: "loading", data: prev.data, error: null }));

    (async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(await readError(res));
        const data = (await res.json()) as T;
        cache.set(url, data);
        setState({ status: "success", data, error: null });
      } catch (err) {
        if (controller.signal.aborted) return;
        setState({ status: "error", data: null, error: err instanceof Error ? err.message : "Nieznany błąd" });
      }
    })();

    return () => controller.abort();
  }, [url, nonce]);

  const refetch = useCallback(() => {
    forceRef.current = true;
    setNonce((n) => n + 1);
  }, []);
  return { ...state, refetch };
}

export default function Solution() {
  const [id, setId] = useState(1);
  const result = useFetch<Post>(Number.isInteger(id) && id > 0 ? `/api/posts/${id}` : null);

  return (
    <div className="stack">
      <div className="row">
        <button type="button" onClick={() => setId((n) => Math.max(1, (n || 1) - 1))} aria-label="Poprzedni post">
          −
        </button>
        <input
          type="number"
          min={1}
          value={Number.isNaN(id) ? "" : id}
          onChange={(e) => setId(e.target.valueAsNumber)}
          aria-label="Id posta"
          style={{ width: 90 }}
        />
        <button type="button" onClick={() => setId((n) => (n || 0) + 1)} aria-label="Następny post">
          +
        </button>
        <button type="button" onClick={result.refetch} disabled={result.status === "idle"}>
          ↻ Odśwież
        </button>
        {result.status === "loading" && <span className="muted">Ładowanie…</span>}
      </div>

      {result.status === "idle" && <p className="muted">Podaj dodatnie id posta.</p>}

      {result.status === "error" && (
        <p className="error" role="alert">
          {result.error}
        </p>
      )}

      {result.data && (
        <article style={{ opacity: result.status === "loading" ? 0.5 : 1, transition: "opacity .15s" }}>
          <h3 style={{ margin: "0 0 4px" }}>{result.data.title}</h3>
          <p className="muted" style={{ margin: "0 0 8px" }}>
            {result.data.author} · ♥ {result.data.likes}
          </p>
          <p style={{ margin: 0 }}>{result.data.body}</p>
        </article>
      )}
    </div>
  );
}
