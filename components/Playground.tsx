"use client";

import { Component, useState, type ErrorInfo, type ReactNode } from "react";
import { registry } from "@/exercises/_registry.generated";
import { useI18n } from "./I18nProvider";
import Timer from "./Timer";

type Props = {
  slug: string;
  minutes: number;
  mode: "exercise" | "solution";
  file: string;
};

export default function Playground({ slug, minutes, mode, file }: Props) {
  const { t } = useI18n();
  const entry = registry[slug];
  // Klucz do ręcznego "zresetuj komponent" (remount bez przeładowania strony).
  const [runId, setRunId] = useState(0);

  if (!entry) {
    return (
      <div className="stage-error">
        {t.play.missingBefore} <code>{slug}</code> {t.play.missingAfter} <code>npm run registry</code> {t.play.missingEnd}{" "}
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
            {t.play.remount}
          </button>
        </div>
      </div>
      <div className="stage">
        <ErrorBoundary key={`${mode}-${runId}`} crashedLabel={t.play.crashed} retryLabel={t.play.tryAgain}>
          <View />
        </ErrorBoundary>
      </div>
    </>
  );
}

type BoundaryProps = { children: ReactNode; crashedLabel: string; retryLabel: string };

class ErrorBoundary extends Component<BoundaryProps, { error: Error | null }> {
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
          <strong>{this.props.crashedLabel}</strong>
          <pre>{this.state.error.message}</pre>
          <button type="button" className="button" onClick={() => this.setState({ error: null })}>
            {this.props.retryLabel}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
