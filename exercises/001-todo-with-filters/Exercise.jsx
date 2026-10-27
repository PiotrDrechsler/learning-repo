"use client";

import { useState } from "react";

function pluralizeTasks(n) {
  if (n === 1) return "zadanie";

  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  ) {
    return "zadania";
  }

  return "zadań";
}

export default function Exercise() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const remaining = todos.filter((todo) => !todo.done).length;

  function handleSubmit(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: value, done: false },
    ]);
    setText("");
  }

  function clearTodoList() {
    setTodos([]);
  }

  function toggleTodoItem(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  function removeTodoItem(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <div className="stack">
      <form className="row" onSubmit={handleSubmit}>
        <input
          value={text}
          aria-label="Nowe zadanie"
          onChange={(e) => setText(e.target.value)}
          placeholder="Co jest do zrobienia?"
        />
        <button type="submit">Dodaj</button>
      </form>
      {todos.length === 0 ? (
        <p className="muted">Brak zadań.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="row">
              <input
                type="checkbox"
                aria-label={`Zrobione: ${todo.text}`}
                checked={todo.done}
                onChange={() => toggleTodoItem(todo.id)}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.done ? "line-through" : "none",
                  opacity: todo.done ? 0.5 : 1,
                }}
              >
                {todo.text}
              </span>
              <button
                type="button"
                onClick={() => removeTodoItem(todo.id)}
                aria-label={`Usuń: ${todo.text}`}
                title={`Usuń: ${todo.text}`}
                style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="muted">
            Zostało {remaining} {pluralizeTasks(remaining)}
          </span>
          <button
            type="button"
            onClick={clearTodoList}
            style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
          >
            Wyczyść listę
          </button>
        </div>
      )}
    </div>
  );
}
