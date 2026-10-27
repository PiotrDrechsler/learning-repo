"use client";

import { useEffect, useState } from "react";

type User = { id: number; name: string; email: string; city: string };
type UsersResponse = { results: User[]; total: number };

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: UsersResponse };

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function Solution() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });
  const [retry, setRetry] = useState(0);
  const debounced = useDebouncedValue(query.trim(), 300);

  useEffect(() => {
    if (!debounced) {
      setState({ status: "idle" });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(`/api/users?q=${encodeURIComponent(debounced)}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Błąd serwera (${res.status})`);
        return (await res.json()) as UsersResponse;
      })
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return; // nieaktualne zapytanie
        setState({ status: "error", message: error instanceof Error ? error.message : "Nieznany błąd" });
      });

    // Cleanup: nowa fraza albo odmontowanie przerywa stary request -> brak wyścigu.
    return () => controller.abort();
  }, [debounced, retry]);

  return (
    <div className="stack">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj użytkownika…"
        aria-label="Szukaj użytkownika"
      />

      {state.status === "idle" && <p className="muted">Wpisz frazę, np. „anna” albo „kraków”.</p>}
      {state.status === "loading" && <p className="muted" aria-live="polite">Szukam…</p>}
      {state.status === "error" && (
        <div className="row" role="alert">
          <span className="error">{state.message}</span>
          <button type="button" onClick={() => setRetry((n) => n + 1)}>
            Spróbuj ponownie
          </button>
        </div>
      )}
      {state.status === "success" &&
        (state.data.results.length === 0 ? (
          <p className="muted">Brak wyników dla „{debounced}”.</p>
        ) : (
          <>
            <ul>
              {state.data.results.map((user) => (
                <li key={user.id}>
                  <strong>
                    <Highlight text={user.name} query={debounced} />
                  </strong>{" "}
                  <span className="muted">
                    · {user.email} · {user.city}
                  </span>
                </li>
              ))}
            </ul>
            <p className="muted">Znaleziono {state.data.total}</p>
          </>
        ))}
    </div>
  );
}
