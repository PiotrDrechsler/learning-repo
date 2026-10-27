"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useI18n } from "./I18nProvider";

type FileState = {
  /** Treść w edytorze. */
  draft: string;
  /** Treść zapisana na dysku (do wykrywania niezapisanych zmian). */
  saved: string;
  exists: boolean;
  status: "loading" | "idle" | "saving" | "error";
  error?: string;
};

type Props = {
  slug: string;
  files: string[];
  newFiles?: string[];
  /** Tryb tylko do odczytu (rozwiązanie): treść podana z góry, bez zapisu. */
  readOnlyFiles?: { path: string; code: string }[];
};

const INDENT = "  ";

/** Edytor plików ćwiczenia. Zapis trafia na dysk przez /api/files, a Next.js przeładowuje podgląd sam. */
export default function CodeEditor({ slug, files, newFiles = [], readOnlyFiles }: Props) {
  const { t } = useI18n();
  const readOnly = Boolean(readOnlyFiles);
  const paths = readOnly ? readOnlyFiles!.map((f) => f.path) : files;
  const [active, setActive] = useState(paths[0]);
  const [state, setState] = useState<Record<string, FileState>>({});
  const [confirmReset, setConfirmReset] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const patch = useCallback(
    (file: string, change: Partial<FileState>) =>
      setState((prev) => ({ ...prev, [file]: { ...(prev[file] as FileState), ...change } })),
    [],
  );

  // Klucz zamiast tablic w zależnościach: po odświeżeniu danych z serwera dostajemy nowe tablice
  // z tą samą zawartością i nie chcemy wtedy kasować niezapisanych zmian.
  const filesKey = files.join("|");
  const readOnlyKey = readOnlyFiles ? readOnlyFiles.map((f) => f.path + f.code.length).join("|") : "";

  // Wczytanie plików (albo treści rozwiązania w trybie tylko do odczytu).
  useEffect(() => {
    if (readOnlyFiles) {
      setState(
        Object.fromEntries(
          readOnlyFiles.map((f) => [f.path, { draft: f.code, saved: f.code, exists: true, status: "idle" as const }]),
        ),
      );
      return;
    }
    let cancelled = false;
    setState(Object.fromEntries(files.map((f) => [f, { draft: "", saved: "", exists: true, status: "loading" as const }])));
    for (const file of files) {
      fetch(`/api/files?slug=${encodeURIComponent(slug)}&path=${encodeURIComponent(file)}`)
        .then(async (res) => {
          const body = await res.json();
          if (!res.ok) throw new Error(body.message ?? `HTTP ${res.status}`);
          return body as { content: string; exists: boolean };
        })
        .then(({ content, exists }) => {
          if (!cancelled) patch(file, { draft: content, saved: exists ? content : "", exists, status: "idle" });
        })
        .catch((error: Error) => {
          if (!cancelled) patch(file, { status: "error", error: error.message });
        });
    }
    return () => {
      cancelled = true;
    };
    // files/readOnlyFiles celowo przez klucze powyżej
  }, [slug, filesKey, readOnlyKey, patch]);

  const current = state[active];
  const dirty = Boolean(current && current.status !== "loading" && (current.draft !== current.saved || !current.exists));

  const save = useCallback(async () => {
    if (readOnly || !current || current.status === "loading") return;
    const file = active;
    const content = current.draft;
    patch(file, { status: "saving", error: undefined });
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, path: file, content }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? `HTTP ${res.status}`);
      patch(file, { saved: content, exists: true, status: "idle" });
    } catch (error) {
      patch(file, { status: "error", error: error instanceof Error ? error.message : String(error) });
    }
  }, [readOnly, current, active, slug, patch]);

  const reset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    setConfirmReset(false);
    const file = active;
    patch(file, { status: "saving" });
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, path: file, action: "reset" }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? `HTTP ${res.status}`);
      patch(file, { draft: body.content, saved: body.exists ? body.content : "", exists: body.exists, status: "idle" });
    } catch (error) {
      patch(file, { status: "error", error: error instanceof Error ? error.message : String(error) });
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      void save();
      return;
    }
    if (readOnly) return;
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value } = el;

    if (e.key === "Tab") {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      if (start === end && !e.shiftKey) {
        apply(value.slice(0, start) + INDENT + value.slice(end), start + INDENT.length);
        return;
      }
      // Wcięcie / cofnięcie wcięcia kilku linii naraz.
      const block = value.slice(lineStart, end);
      const changed = e.shiftKey
        ? block.replace(/^ {1,2}/gm, "")
        : block.replace(/^/gm, INDENT);
      const next = value.slice(0, lineStart) + changed + value.slice(end);
      apply(next, start === end ? Math.max(lineStart, start + (changed.length - block.length)) : lineStart, lineStart + changed.length);
      return;
    }

    if (e.key === "Enter" && start === end) {
      // Zachowaj wcięcie poprzedniej linii (+1 poziom po { ( [).
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      const indent = line.match(/^\s*/)?.[0] ?? "";
      const extra = /[{([]\s*$/.test(line) ? INDENT : "";
      const insert = `\n${indent}${extra}`;
      apply(value.slice(0, start) + insert + value.slice(end), start + insert.length);
    }
  };

  const apply = (next: string, selStart: number, selEnd = selStart) => {
    patch(active, { draft: next });
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.selectionStart = selStart;
        el.selectionEnd = selEnd;
      }
    });
  };

  const lineCount = (current?.draft ?? "").split("\n").length;

  let statusText = "";
  if (readOnly) statusText = t.editor.readOnly;
  else if (!current || current.status === "loading") statusText = t.editor.loading;
  else if (current.status === "saving") statusText = t.editor.saving;
  else if (current.status === "error") statusText = `${t.editor.error} ${current.error ?? ""}`;
  else if (dirty) statusText = t.editor.unsaved;
  else statusText = t.editor.saved;

  return (
    <section className="editor" aria-label={t.editor.label}>
      <div className="editor-tabs" role="tablist">
        {paths.map((file) => {
          const s = state[file];
          const fileDirty = s && s.status !== "loading" && (s.draft !== s.saved || !s.exists);
          return (
            <button
              key={file}
              type="button"
              role="tab"
              aria-selected={file === active}
              className={`editor-tab${file === active ? " is-active" : ""}`}
              onClick={() => setActive(file)}
              title={file}
            >
              {shortName(file, paths)}
              {!readOnly && fileDirty && <span className="editor-dot" aria-label={t.editor.unsaved} />}
            </button>
          );
        })}
      </div>

      {!readOnly && current && !current.exists && newFiles.includes(active) && (
        <p className="editor-note">{t.editor.newFileHint}</p>
      )}

      <div className="editor-body">
        <div className="editor-gutter" ref={gutterRef} aria-hidden>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={current?.draft ?? ""}
          onChange={(e) => patch(active, { draft: e.target.value })}
          onKeyDown={onKeyDown}
          onScroll={(e) => {
            if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop;
          }}
          readOnly={readOnly || !current || current.status === "loading"}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          aria-label={active}
        />
      </div>

      <div className="editor-footer">
        <span className={`editor-status${current?.status === "error" ? " is-error" : dirty ? " is-dirty" : ""}`} role="status">
          {statusText}
        </span>
        {!readOnly && (
          <div className="row">
            <span className="muted editor-hint">{t.editor.shortcut}</span>
            <button type="button" className="button" onClick={reset} disabled={!current || current.status !== "idle"}>
              {confirmReset ? t.editor.resetConfirm : t.editor.reset}
            </button>
            <button type="button" className="button button-primary" onClick={save} disabled={!dirty || current?.status === "saving"}>
              {t.editor.save}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** Najkrótsza nazwa, która odróżnia plik od pozostałych: "page.tsx" albo "[id]/page.tsx". */
function shortName(file: string, all: string[]): string {
  const parts = file.split("/");
  for (let n = 1; n <= parts.length; n++) {
    const name = parts.slice(-n).join("/");
    if (all.filter((f) => f.endsWith(name)).length === 1) return name;
  }
  return file;
}
