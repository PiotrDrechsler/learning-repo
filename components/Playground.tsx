"use client";

import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { components, suites } from "@/exercises/_registry.generated";
import { runTests, type TestResult } from "@/lib/testing";
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
  const entry = components[slug];
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

/** Plac zabaw dla zadań Next.js: prawdziwa trasa z app/sandbox w ramce, z timerem i przeładowaniem. */
export function FramePlayground({ slug, minutes, src }: { slug: string; minutes: number; src: string }) {
  const { t } = useI18n();
  const [frameKey, setFrameKey] = useState(0);

  return (
    <>
      <div className="play-toolbar">
        <Timer storageKey={`timer:${slug}`} minutes={minutes} />
        <div className="play-toolbar-right">
          <code className="play-file">{src}</code>
          <button type="button" className="button" onClick={() => setFrameKey((n) => n + 1)}>
            {t.play.reload}
          </button>
          <a className="button" href={src} target="_blank" rel="noreferrer">
            {t.play.openNewTab}
          </a>
        </div>
      </div>
      <iframe key={`${src}-${frameKey}`} className="sandbox-frame" src={src} title={t.play.frameTitle} />
    </>
  );
}

/** Plac zabaw dla zadań JavaScript/TypeScript: uruchamia testy na Twoim module (albo na rozwiązaniu). */
export function TestPlayground({
  slug,
  minutes,
  mode,
  file,
  showTypeHint,
}: Props & { showTypeHint: boolean }) {
  const { t } = useI18n();
  const suite = suites[slug];
  const impl = suite ? (mode === "solution" ? suite.solution : suite.exercise) : null;
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [runId, setRunId] = useState(0);

  // Po zapisie pliku HMR podmienia moduł, więc zmienia się `impl` i testy lecą od nowa.
  useEffect(() => {
    if (!suite || !impl) return;
    let cancelled = false;
    setResults(null);
    runTests(suite.tests, impl).then((r) => {
      if (!cancelled) setResults(r);
    });
    return () => {
      cancelled = true;
    };
  }, [suite, impl, runId]);

  if (!suite) {
    return (
      <div className="stage-error">
        {t.play.missingBefore} <code>{slug}</code> {t.play.missingAfter} <code>npm run registry</code> {t.play.missingEnd}{" "}
        <code>npm run dev</code>).
      </div>
    );
  }

  const Preview = suite.preview;
  const passed = results?.filter((r) => r.ok).length ?? 0;
  const total = suite.tests.length;

  return (
    <>
      <div className="play-toolbar">
        <Timer storageKey={`timer:${slug}`} minutes={minutes} />
        <div className="play-toolbar-right">
          <code className="play-file">{file}</code>
          <button type="button" className="button" onClick={() => setRunId((n) => n + 1)}>
            {t.tests.rerun}
          </button>
        </div>
      </div>
      {Preview && (
        <div className="stage pv-stage">
          <ErrorBoundary key={`preview-${mode}-${runId}`} crashedLabel={t.play.crashed} retryLabel={t.play.tryAgain}>
            <Preview impl={impl} />
          </ErrorBoundary>
        </div>
      )}
      <div className="stage">
        {results === null ? (
          <p className="muted">{t.tests.running}</p>
        ) : (
          <>
            <p className={`test-summary${passed === total ? " is-ok" : ""}`} aria-live="polite">
              {passed === total ? t.tests.allPassed : t.tests.summary(passed, total)}
            </p>
            <div className="test-bar" aria-hidden>
              <span style={{ width: `${(passed / total) * 100}%` }} />
            </div>
            <ul className="test-list">
              {results.map((r) => (
                <li key={r.name} className={r.ok ? "is-ok" : r.todo ? "is-todo" : "is-fail"}>
                  <span className="test-icon" aria-hidden>
                    {r.ok ? "✓" : r.todo ? "○" : "✗"}
                  </span>
                  <span>
                    {r.name}
                    {!r.ok && <span className="test-message">{r.todo ? t.tests.notStarted : r.message}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        {showTypeHint && (
          <p className="muted" style={{ marginBottom: 0 }}>
            {t.tests.typeHint} <code>npm run typecheck:tasks</code>
          </p>
        )}
      </div>
    </>
  );
}
