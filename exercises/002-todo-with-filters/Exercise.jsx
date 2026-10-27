"use client";

import { useState } from "react";

// Kształt zadania: { id: string, text: string, done: boolean }
// TODO: zaimplementuj listę zgodnie z README.
export default function Exercise() {
  const [text, setText] = useState("");

  return (
    <div className="stack">
      <form className="row" onSubmit={(e) => e.preventDefault()}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Co jest do zrobienia?" />
        <button type="submit">Dodaj</button>
      </form>
      <p className="muted">Brak zadań.</p>
    </div>
  );
}
