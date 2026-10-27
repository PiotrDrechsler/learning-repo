"use client"; // error.tsx musi być komponentem klienckim (to error boundary)

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ProductError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Błąd powstał na serwerze, więc samo reset() wyrenderowałoby ponownie ten sam wynik.
  // router.refresh() pobiera świeży payload z serwera, reset() czyści stan boundary.
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <div className="stack" role="alert">
      <h2 style={{ margin: 0 }}>Coś poszło nie tak</h2>
      {/* W produkcji message z serwera jest ukryty, zostaje tylko digest do logów. */}
      <p className="error">{error.message || "Nieznany błąd"}</p>
      <div className="row">
        <button type="button" onClick={retry} disabled={isPending}>
          {isPending ? "Ponawiam…" : "Spróbuj ponownie"}
        </button>
      </div>
    </div>
  );
}
