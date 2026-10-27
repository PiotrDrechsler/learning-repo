"use client";

import { useEffect, useReducer, useRef, useState } from "react";

const STORAGE_KEY = "exercise-002:todos";
const FILTERS = {
  all: { label: "Wszystkie", test: () => true },
  active: { label: "Aktywne", test: (t) => !t.done },
  done: { label: "Zrobione", test: (t) => t.done },
};

function reducer(todos, action) {
  switch (action.type) {
    case "load":
      return action.todos;
    case "add":
      return [...todos, { id: crypto.randomUUID(), text: action.text, done: false }];
    case "toggle":
      return todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "toggleAll": {
      const allDone = todos.every((t) => t.done);
      return todos.map((t) => ({ ...t, done: !allDone }));
    }
    case "edit":
      return action.text
        ? todos.map((t) => (t.id === action.id ? { ...t, text: action.text } : t))
        : todos.filter((t) => t.id !== action.id);
    case "remove":
      return todos.filter((t) => t.id !== action.id);
    case "clearCompleted":
      return todos.filter((t) => !t.done);
    default:
      throw new Error(`Nieznana akcja: ${action.type}`);
  }
}

function readTodos() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function pluralizeTasks(n) {
  if (n === 1) return "zadanie";
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return "zadania";
  return "zadań";
}

function TodoItem({ todo, dispatch }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const closing = useRef(false); // chroni przed podwójnym zapisem (Enter/Escape + blur przy odmontowaniu)

  const finish = (save) => {
    if (closing.current) return;
    closing.current = true;
    if (save) dispatch({ type: "edit", id: todo.id, text: draft.trim() });
    setEditing(false);
  };

  return (
    <li className="row">
      <input type="checkbox" checked={todo.done} onChange={() => dispatch({ type: "toggle", id: todo.id })} aria-label={`Zrobione: ${todo.text}`} />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => finish(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") finish(true);
            if (e.key === "Escape") finish(false);
          }}
        />
      ) : (
        <span
          style={{ flex: 1, textDecoration: todo.done ? "line-through" : "none", opacity: todo.done ? 0.6 : 1 }}
          onDoubleClick={() => {
            closing.current = false;
            setDraft(todo.text);
            setEditing(true);
          }}
        >
          {todo.text}
        </span>
      )}
      <button type="button" onClick={() => dispatch({ type: "remove", id: todo.id })} aria-label={`Usuń: ${todo.text}`}>
        Usuń
      </button>
    </li>
  );
}

export default function Solution() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  // Wczytanie po zamontowaniu (w Next.js unikamy w ten sposób błędu hydracji).
  useEffect(() => {
    dispatch({ type: "load", todos: readTodos() });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return; // nie nadpisuj zapisanych danych pustą listą przed wczytaniem
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // brak miejsca / tryb prywatny
    }
  }, [todos, loaded]);

  const visible = todos.filter(FILTERS[filter].test); // stan pochodny, liczony w renderze
  const remaining = todos.filter((t) => !t.done).length;
  const hasCompleted = todos.some((t) => t.done);

  const add = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    dispatch({ type: "add", text: value });
    setText("");
  };

  return (
    <div className="stack">
      <form className="row" onSubmit={add}>
        {todos.length > 0 && (
          <input
            type="checkbox"
            checked={todos.every((t) => t.done)}
            onChange={() => dispatch({ type: "toggleAll" })}
            aria-label="Zaznacz wszystkie"
          />
        )}
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Co jest do zrobienia?" style={{ flex: 1 }} />
        <button type="submit">Dodaj</button>
      </form>

      <div className="row">
        {Object.entries(FILTERS).map(([key, { label }]) => (
          <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="muted">{todos.length === 0 ? "Brak zadań." : "Nic w tym filtrze."}</p>
      ) : (
        <ul>
          {visible.map((todo) => (
            <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
          ))}
        </ul>
      )}

      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="muted">
          Zostało {remaining} {pluralizeTasks(remaining)}
        </span>
        <button type="button" disabled={!hasCompleted} onClick={() => dispatch({ type: "clearCompleted" })}>
          Usuń zrobione
        </button>
      </div>
    </div>
  );
}
