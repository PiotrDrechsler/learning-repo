"use client";

import { useState, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

// TODO: zaimplementuj modal zgodnie z README.
function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default function Exercise() {
  const [open, setOpen] = useState(false);

  return (
    <div className="stack">
      <p>Ustawienia konta</p>
      <div className="row">
        <button type="button" onClick={() => setOpen(true)}>
          Usuń konto
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Usunąć konto?">
        <p>Tej operacji nie da się cofnąć.</p>
      </Modal>
    </div>
  );
}
