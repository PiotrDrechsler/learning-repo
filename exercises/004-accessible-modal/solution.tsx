"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Modal({ open, onClose, title, children, initialFocusRef }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // "Latest ref": najnowszy onClose bez podpinania listenera od nowa co render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    (initialFocusRef?.current ?? dialog?.querySelector<HTMLElement>(FOCUSABLE) ?? dialog)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, initialFocusRef]);

  if (!open) return null;

  return createPortal(
    <div
      onMouseDown={(e) => {
        // tylko klik w samo tło, nie w treść (target === currentTarget)
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgb(0 0 0 / 0.45)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 1000,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          background: "var(--surface)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "20px 22px",
          width: "min(420px, 100%)",
          boxShadow: "0 20px 50px rgb(0 0 0 / 0.25)",
          outline: "none",
        }}
      >
        <h2 id={titleId} style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default function Solution() {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="stack">
      <p>Ustawienia konta</p>
      <div className="row">
        <button type="button" onClick={() => setOpen(true)}>
          Usuń konto
        </button>
        {deleted && <span className="muted">Konto „usunięte” (demo).</span>}
      </div>
      <p className="muted">Sprawdź: Tab / Shift+Tab, Escape, klik w tło, focus po zamknięciu.</p>

      <Modal open={open} onClose={() => setOpen(false)} title="Usunąć konto?" initialFocusRef={cancelRef}>
        <p style={{ marginTop: 0 }}>Tej operacji nie da się cofnąć. Wszystkie dane zostaną usunięte.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button
            ref={cancelRef}
            type="button"
            onClick={() => setOpen(false)}
            style={{ font: "inherit", padding: "7px 13px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleted(true);
              setOpen(false);
            }}
            style={{ font: "inherit", padding: "7px 13px", borderRadius: 8, border: 0, background: "var(--danger)", color: "#fff" }}
          >
            Usuń
          </button>
        </div>
      </Modal>
    </div>
  );
}
