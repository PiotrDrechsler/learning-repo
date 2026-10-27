"use client";

import { useState } from "react";

// API: GET /api/posts?page=1&limit=10 -> { items, page, totalPages, hasMore }
// Post: { id, title, body, author, likes }
// TODO: zaimplementuj infinite scroll zgodnie z README.
export default function Exercise() {
  const [posts] = useState([]);

  return (
    <div className="stack">
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <p className="muted">Tu pojawią się posty.</p>
    </div>
  );
}
