"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { ExerciseMeta, Lang, Level, Stack } from "@/lib/exercises";
import { searchExercises } from "@/lib/search";
import { STACK_LABELS } from "@/lib/stack";
import { useProgress } from "@/lib/useProgress";
import { useI18n } from "./I18nProvider";

type Status = "all" | "todo" | "done";

const LEVELS: Level[] = ["junior+", "mid", "mid+"];
const LANGS: Lang[] = ["ts", "js"];
const STACKS: Stack[] = ["react", "nextjs"];

export default function ExerciseBrowser({ exercises }: { exercises: ExerciseMeta[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDone, done } = useProgress();
  const { t } = useI18n();
  const b = t.browser;

  const [query, setQuery] = useState("");
  const [stack, setStack] = useState<Stack | "all">("all");
  const [lang, setLang] = useState<Lang | "all">("all");
  const [level, setLevel] = useState<Level | "all">("all");
  const [status, setStatus] = useState<Status>("all");
  const [active, setActive] = useState(0);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    return searchExercises(exercises, deferredQuery)
      .map((h) => h.exercise)
      .filter((e) => stack === "all" || e.stack === stack)
      .filter((e) => lang === "all" || e.lang === lang)
      .filter((e) => level === "all" || e.level === level)
      .filter((e) => status === "all" || (status === "done" ? isDone(e.slug) : !isDone(e.slug)));
  }, [exercises, deferredQuery, stack, lang, level, status, isDone]);

  useEffect(() => setActive(0), [deferredQuery, stack, lang, level, status]);

  // "/" albo Ctrl/Cmd+K ustawia kursor w wyszukiwarce
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /input|textarea|select/i.test(e.target.tagName);
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      router.push(`/exercises/${results[active].slug}`);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  };

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    exercises.forEach((e) => e.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [exercises]);

  const doneCount = exercises.filter((e) => done.includes(e.slug)).length;

  return (
    <section>
      <div className="search-box">
        <svg className="search-icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder={b.placeholder}
          aria-label={b.searchLabel}
          aria-controls="exercise-results"
          autoComplete="off"
        />
        <kbd className="search-kbd">/</kbd>
      </div>

      <div className="filters">
        <FilterGroup
          label={b.stack}
          allLabel={b.all}
          value={stack}
          options={["all", ...STACKS] as (Stack | "all")[]}
          labels={STACK_LABELS}
          onChange={setStack}
        />
        <FilterGroup label={b.lang} allLabel={b.all} value={lang} options={["all", ...LANGS] as (Lang | "all")[]} onChange={setLang} />
        <FilterGroup label={b.level} allLabel={b.all} value={level} options={["all", ...LEVELS] as (Level | "all")[]} onChange={setLevel} />
        <FilterGroup
          label={b.status}
          allLabel={b.all}
          value={status}
          options={["all", "todo", "done"] as Status[]}
          labels={{ todo: b.todo, done: b.done }}
          onChange={setStatus}
        />
      </div>

      <div className="tag-cloud" aria-label={b.popularTags}>
        {allTags.map((tag) => (
          <button key={tag} type="button" className="tag tag-button" onClick={() => setQuery(tag)}>
            #{tag}
          </button>
        ))}
      </div>

      <p className="results-meta">
        {b.results(results.length, exercises.length, doneCount)}
        <span className="hint"> · {b.keyboardHint}</span>
      </p>

      <ol id="exercise-results" className="exercise-list">
        {results.map((e, i) => (
          <li key={e.slug}>
            <Link
              href={`/exercises/${e.slug}`}
              className={`exercise-card${i === active ? " is-active" : ""}${isDone(e.slug) ? " is-done" : ""}`}
              onMouseEnter={() => setActive(i)}
            >
              <span className="exercise-number">{e.number}</span>
              <span className="exercise-body">
                <span className="exercise-title">
                  {e.title}
                  {isDone(e.slug) && <span className="done-badge">{b.doneBadge}</span>}
                </span>
                <span className="exercise-summary">{e.summary}</span>
                <span className="exercise-tags">
                  <span className={`pill pill-${e.stack}`}>{STACK_LABELS[e.stack]}</span>
                  <span className={`pill pill-${e.lang}`}>{e.lang.toUpperCase()}</span>
                  <span className="pill">{e.level}</span>
                  <span className="pill">{e.minutes} min</span>
                  {e.tags.map((t) => (
                    <span key={t} className="tag">
                      #{t}
                    </span>
                  ))}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {results.length === 0 && (
        <div className="empty">
          {b.emptyBefore(query.trim())}{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setQuery("");
              setStack("all");
              setLang("all");
              setLevel("all");
              setStatus("all");
            }}
          >
            {b.clearFilters}
          </button>
          .
        </div>
      )}
    </section>
  );
}

function FilterGroup<T extends string>({
  label,
  allLabel,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: T;
  options: T[];
  labels?: Partial<Record<T, string>>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="filter-group" role="group" aria-label={label}>
      <span className="filter-label">{label}</span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`chip${option === value ? " is-selected" : ""}`}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {labels?.[option] ?? (option === "all" ? allLabel : option)}
        </button>
      ))}
    </div>
  );
}
