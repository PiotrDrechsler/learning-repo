"use client";

import { Component, useState, type ErrorInfo, type ReactNode } from "react";
import { registry } from "@/exercises/_registry.generated";
import Timer from "./Timer";

type Props = {
  slug: string;
  minutes: number;
  mode: "exercise" | "solution";
  file: string;
};

export default function Playground({ slug, minutes, mode, file }: Props) {
  const entry = registry[slug];
  // Klucz do ręcznego "zresetuj komponent" (remount bez przeładowania strony).
  const [runId, setRunId] = useState(0);

  if (!entry) {
    return (
      <div className="stage-error">
        Brak ćwiczenia <code>{slug}</code> w rejestrze. Uruchom <code>npm run registry</code> (robi się samo przy{" "}
        <code>npm run dev</code>).
      </div>
    );
  }

  const View = mode === "solution" ? entry.Solution : entry.Exercise;

  return (
    <>
      <div className="play-toolbar">
        <Timer storageKey={`timer:${slug}`} minutes={minutes} />
        <div className="play-toolbar-right">
          <code className="play-file">{file}</code>
          <button type="button" className="button" onClick={() => setRunId((n) => n + 1)}>
            ↻ Remount
          </button>
        </div>
      </div>
      <div className="stage">
        <ErrorBoundary key={`${mode}-${runId}`}>
          <View />
        </ErrorBoundary>
      </div>
    </>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Błąd w ćwiczeniu:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="stage-error" role="alert">
          <strong>Komponent rzucił błąd:</strong>
          <pre>{this.state.error.message}</pre>
          <button type="button" className="button" onClick={() => this.setState({ error: null })}>
            Spróbuj ponownie
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
