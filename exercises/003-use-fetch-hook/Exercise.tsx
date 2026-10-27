"use client";

import { useState } from "react";

type Post = { id: number; title: string; body: string; author: string; likes: number };

// TODO: zaimplementuj hook zgodnie z README.
function useFetch<T>(url: string | null) {
  return {
    status: "idle" as const,
    data: null as T | null,
    error: null as string | null,
    refetch: () => {},
  };
}

export default function Exercise() {
  const [id, setId] = useState(1);
  const { status } = useFetch<Post>(`/api/posts/${id}`);

  return (
    <div className="stack">
      <div className="row">
        <button type="button" onClick={() => setId((n) => n - 1)}>
          −
        </button>
        <input type="number" value={id} onChange={(e) => setId(Number(e.target.value))} style={{ width: 90 }} />
        <button type="button" onClick={() => setId((n) => n + 1)}>
          +
        </button>
      </div>
      <p className="muted">status: {status}</p>
    </div>
  );
}
