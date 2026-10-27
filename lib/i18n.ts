// Słowniki UI. Plik bez zależności od serwera, więc używają go i serwer, i klient.

export const LOCALES = ["pl", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pl";
export const LOCALE_COOKIE = "lang";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Tekst w obu językach, np. tytuł ćwiczenia w meta.json. */
export type Localized = Record<Locale, string>;

const pl = {
  meta: {
    title: "NAUKA REACT",
    description: "Ćwiczenia live coding z Reacta przed rekrutacją.",
  },
  header: {
    tagline: "live coding przed rekrutacją",
    language: "Język",
  },
  home: {
    title: "Ćwiczenia",
    intro: "Zadania jak z rozmowy technicznej: limit czasu, konkretne wymagania i pytania, które padają po kodzie. Wybierz zadanie, odpal timer i koduj w pliku",
    introEnd: "danego ćwiczenia.",
  },
  browser: {
    placeholder: "Szukaj: debounce, modal, hook, ts, mid…",
    searchLabel: "Szukaj ćwiczeń",
    category: "Kategoria",
    level: "Poziom",
    status: "Status",
    all: "wszystkie",
    todo: "do zrobienia",
    done: "zrobione",
    popularTags: "Popularne tagi",
    results: (shown: number, total: number, done: number) => `${shown} z ${total} · zrobione ${done}/${total}`,
    keyboardHint: "↑↓ wybór, Enter otwiera, Esc czyści",
    doneBadge: "✓ zrobione",
    emptyBefore: (query: string) => (query ? `Nic nie pasuje do „${query}”. Spróbuj innego słowa albo` : "Nic nie pasuje do filtrów. Możesz"),
    clearFilters: "wyczyść filtry",
  },
  exercise: {
    back: "← Wszystkie ćwiczenia",
    start: "▶ Start: edytor, podgląd i timer",
    markDone: "Oznacz jako zrobione",
    isDone: "✓ Zrobione",
    fileHintBefore: "Kodujesz w pliku",
    filesHint: "Kodujesz w plikach (zadanie Next.js, każdy plik to część trasy w app/sandbox):",
    testsHint: "Plac zabaw uruchamia testy z pliku tests po każdym zapisie.",
    restoreHint: "Chcesz zacząć od zera?",
    fileHintMiddle: "Edytujesz go w edytorze na placu zabaw albo w VS Code. Chcesz zacząć od zera?",
    showSolution: "Pokaż przykładowe rozwiązanie (spoiler!)",
    runSolution: "Uruchom rozwiązanie na placu zabaw →",
    neighbours: "Sąsiednie ćwiczenia",
    minutes: (n: number) => `${n} min`,
  },
  play: {
    back: "← Treść zadania",
    version: "Wersja",
    yours: "Twoja wersja",
    solution: "Rozwiązanie",
    remount: "↻ Remount",
    missingBefore: "Brak ćwiczenia",
    missingAfter: "w rejestrze. Uruchom",
    missingEnd: "(robi się samo przy",
    crashed: "Komponent rzucił błąd:",
    tryAgain: "Spróbuj ponownie",
    reload: "↻ Przeładuj",
    openNewTab: "Otwórz w nowej karcie ↗",
    frameTitle: "Podgląd strony z zadaniem",
  },
  editor: {
    label: "Edytor kodu",
    task: "Treść zadania",
    save: "Zapisz",
    saving: "Zapisuję…",
    saved: "Zapisano ✓",
    unsaved: "Niezapisane zmiany",
    loading: "Wczytuję plik…",
    reset: "Przywróć start",
    resetConfirm: "Na pewno? Kliknij jeszcze raz",
    newFile: "nowy plik",
    newFileHint: "Tego pliku jeszcze nie ma. Zapisz, a Next.js od razu go użyje.",
    readOnly: "Rozwiązanie (tylko do odczytu)",
    shortcut: "Ctrl + S zapisuje, Tab wcina",
    devOnly: "Zapis działa tylko w trybie deweloperskim (npm run dev).",
    error: "Nie udało się zapisać:",
    preview: "Podgląd",
  },
  tests: {
    summary: (passed: number, total: number) => `Zaliczone: ${passed} z ${total}`,
    allPassed: "Wszystkie testy przechodzą 🎉",
    running: "Uruchamiam testy…",
    rerun: "↻ Uruchom ponownie",
    notStarted: "jeszcze niezaimplementowane",
    typeHint: "Typy sprawdzisz poleceniem",
  },
  timer: {
    start: (minutes: number) => `▶ Start (${minutes} min)`,
    resume: "▶ Wznów",
    pause: "❚❚ Pauza",
    reset: "Reset",
  },
};

export type Dictionary = typeof pl;

const en: Dictionary = {
  meta: {
    title: "LEARN REACT",
    description: "React live coding exercises for job interviews.",
  },
  header: {
    tagline: "live coding interview prep",
    language: "Language",
  },
  home: {
    title: "Exercises",
    intro: "Tasks like in a technical interview: a time limit, concrete requirements and the questions that come after the code. Pick a task, start the timer and code in the exercise's",
    introEnd: "file.",
  },
  browser: {
    placeholder: "Search: debounce, modal, hook, ts, mid…",
    searchLabel: "Search exercises",
    category: "Category",
    level: "Level",
    status: "Status",
    all: "all",
    todo: "to do",
    done: "done",
    popularTags: "Popular tags",
    results: (shown: number, total: number, done: number) => `${shown} of ${total} · done ${done}/${total}`,
    keyboardHint: "↑↓ select, Enter opens, Esc clears",
    doneBadge: "✓ done",
    emptyBefore: (query: string) => (query ? `Nothing matches “${query}”. Try another word or` : "Nothing matches the filters. You can"),
    clearFilters: "clear filters",
  },
  exercise: {
    back: "← All exercises",
    start: "▶ Start: editor, preview and timer",
    markDone: "Mark as done",
    isDone: "✓ Done",
    fileHintBefore: "You code in",
    filesHint: "You code in these files (a Next.js task, each file is part of a route in app/sandbox):",
    testsHint: "The playground runs the tests from the tests file after every save.",
    restoreHint: "Want to start over?",
    fileHintMiddle: "Edit it in the playground editor or in VS Code. Want to start over?",
    showSolution: "Show a sample solution (spoiler!)",
    runSolution: "Run the solution in the playground →",
    neighbours: "Neighbouring exercises",
    minutes: (n: number) => `${n} min`,
  },
  play: {
    back: "← Task description",
    version: "Version",
    yours: "Your version",
    solution: "Solution",
    remount: "↻ Remount",
    missingBefore: "Exercise",
    missingAfter: "is not in the registry. Run",
    missingEnd: "(it runs automatically with",
    crashed: "The component threw an error:",
    tryAgain: "Try again",
    reload: "↻ Reload",
    openNewTab: "Open in a new tab ↗",
    frameTitle: "Task page preview",
  },
  editor: {
    label: "Code editor",
    task: "Task",
    save: "Save",
    saving: "Saving…",
    saved: "Saved ✓",
    unsaved: "Unsaved changes",
    loading: "Loading file…",
    reset: "Restore starter",
    resetConfirm: "Sure? Click again",
    newFile: "new file",
    newFileHint: "This file doesn't exist yet. Save it and Next.js will pick it up right away.",
    readOnly: "Solution (read-only)",
    shortcut: "Ctrl + S saves, Tab indents",
    devOnly: "Saving only works in development mode (npm run dev).",
    error: "Couldn't save:",
    preview: "Preview",
  },
  tests: {
    summary: (passed: number, total: number) => `Passed: ${passed} of ${total}`,
    allPassed: "All tests pass 🎉",
    running: "Running tests…",
    rerun: "↻ Run again",
    notStarted: "not implemented yet",
    typeHint: "Check the types with",
  },
  timer: {
    start: (minutes: number) => `▶ Start (${minutes} min)`,
    resume: "▶ Resume",
    pause: "❚❚ Pause",
    reset: "Reset",
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { pl, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Wybiera tekst w danym języku, z polskim jako zapasowym. */
export function pick(text: Localized | string, locale: Locale): string {
  return typeof text === "string" ? text : (text[locale] ?? text[DEFAULT_LOCALE]);
}
