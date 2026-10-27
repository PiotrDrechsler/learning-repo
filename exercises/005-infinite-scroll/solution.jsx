"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LIMIT = 10;

async function fetchPage(page) {
  const res = await fetch(`/api/posts?page=${page}&limit=${LIMIT}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

function useInfiniteList(loader) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const nextPageRef = useRef(1);
  const loadingRef = useRef(false); // synchroniczna blokada podwójnego ładowania
  const hasMoreRef = useRef(true);
  const failedRef = useRef(false); // po błędzie nie dociągamy automatycznie, tylko przez "Spróbuj ponownie"

  const load = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    failedRef.current = false;
    setStatus("loading");
    setError(null);
    try {
      const data = await loader(nextPageRef.current);
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...data.items.filter((p) => !seen.has(p.id))];
      });
      nextPageRef.current = data.page + 1;
      hasMoreRef.current = data.hasMore;
      setHasMore(data.hasMore);
      setStatus("idle");
    } catch (err) {
      failedRef.current = true;
      setError(err.message);
      setStatus("error");
    } finally {
      loadingRef.current = false;
    }
  }, [loader]);

  const loadMore = useCallback(() => {
    if (!failedRef.current) load();
  }, [load]);

  return { items, status, error, hasMore, loadMore, retry: load };
}

function SkeletonRow() {
  return (
    <li aria-hidden>
      <div style={{ height: 14, width: "60%", background: "var(--surface-2)", borderRadius: 4, marginBottom: 6 }} />
      <div style={{ height: 12, width: "90%", background: "var(--surface-2)", borderRadius: 4 }} />
    </li>
  );
}

export default function Solution() {
  const { items, status, error, hasMore, loadMore, retry } = useInfiniteList(fetchPage);
  const sentinelRef = useRef(null);

  // Najnowsze loadMore w refie: observer tworzymy raz, a callback zawsze woła aktualną funkcję.
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreRef.current();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  // Sentinel wciąż widoczny po doładowaniu (krótka lista na dużym ekranie)? Dociągnij kolejną stronę.
  useEffect(() => {
    if (status !== "idle" || !hasMore) return;
    const node = sentinelRef.current;
    if (node && node.getBoundingClientRect().top < window.innerHeight + 200) loadMore();
  }, [status, hasMore, items.length, loadMore]);

  return (
    <div className="stack">
      <p className="muted" style={{ margin: 0 }}>
        Załadowano {items.length} postów. Przewiń stronę w dół.
      </p>
      <ul>
        {items.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <div className="muted">
              {post.author} · ♥ {post.likes}
            </div>
          </li>
        ))}
        {status === "loading" && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}
      </ul>

      {status === "error" && (
        <div className="row" role="alert">
          <span className="error">{error}</span>
          <button type="button" onClick={retry}>
            Spróbuj ponownie
          </button>
        </div>
      )}

      {!hasMore && <p className="muted">To już wszystko ({items.length} postów).</p>}

      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden />
    </div>
  );
}
