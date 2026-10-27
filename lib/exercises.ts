import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { DEFAULT_LOCALE, LOCALES, pick, type Locale, type Localized } from "./i18n";

export type Level = "junior" | "junior+" | "mid" | "mid+";
export type Lang = "ts" | "js";
export type ExerciseCategory = "react" | "javascript" | "typescript" | "nextjs";
/**
 * Jak zadanie działa na placu zabaw (wynika z kategorii):
 * component = komponent React renderowany na scenie,
 * functions = czyste funkcje sprawdzane testami,
 * route = prawdziwa trasa Next.js z app/sandbox w ramce.
 */
export type ExerciseKind = "component" | "functions" | "route";

export function kindOf(category: ExerciseCategory): ExerciseKind {
  if (category === "nextjs") return "route";
  if (category === "javascript" || category === "typescript") return "functions";
  return "component";
}

/** Kształt meta.json. Tytuł i opis mogą być zwykłym tekstem albo obiektem { pl, en }. */
interface RawMeta {
  title: Localized | string;
  summary: Localized | string;
  category?: ExerciseCategory;
  level: Level;
  lang: Lang;
  minutes: number;
  tags: string[];
  added: string;
  /** Tylko nextjs: adres strony z zadaniem i z rozwiązaniem. */
  route?: string;
  solutionRoute?: string;
  /** Tylko nextjs: pliki do edycji i pliki rozwiązania (ścieżki od katalogu głównego repo). */
  files?: string[];
  solutionFiles?: string[];
}

export interface ExerciseMeta {
  /** Nazwa folderu, np. "001-debounced-user-search". Służy też jako URL. */
  slug: string;
  number: string;
  /** Tytuł i opis w wybranym języku. */
  title: string;
  summary: string;
  /** Tytuły i opisy we wszystkich językach: wyszukiwarka znajdzie zadanie po polsku i po angielsku. */
  searchText: string;
  category: ExerciseCategory;
  kind: ExerciseKind;
  level: Level;
  lang: Lang;
  /** Limit czasu jak na rozmowie, w minutach. */
  minutes: number;
  tags: string[];
  /** Data dodania w formacie RRRR-MM-DD. */
  added: string;
}

export interface SourceFile {
  path: string;
  code: string;
}

export interface ExerciseDetail extends ExerciseMeta {
  readmeHtml: string;
  /** Pliki, w których kodujesz (ścieżki od katalogu głównego repo). */
  files: string[];
  solution: SourceFile[];
  /** Tylko nextjs. */
  route: string | null;
  solutionRoute: string | null;
}

const ROOT = process.cwd();
const EXERCISES_DIR = path.join(ROOT, "exercises");
const FOLDER_RE = /^\d{3}-[a-z0-9-]+$/;

function listFolders(): string[] {
  return fs
    .readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && FOLDER_RE.test(d.name))
    .map((d) => d.name)
    .sort();
}

function readRaw(slug: string): RawMeta {
  return JSON.parse(fs.readFileSync(path.join(EXERCISES_DIR, slug, "meta.json"), "utf8")) as RawMeta;
}

function toMeta(slug: string, raw: RawMeta, locale: Locale): ExerciseMeta {
  return {
    slug,
    number: slug.slice(0, 3),
    title: pick(raw.title, locale),
    summary: pick(raw.summary, locale),
    searchText: LOCALES.map((l) => `${pick(raw.title, l)} ${pick(raw.summary, l)}`).join(" "),
    category: raw.category ?? "react",
    kind: kindOf(raw.category ?? "react"),
    level: raw.level,
    lang: raw.lang,
    minutes: raw.minutes,
    tags: raw.tags,
    added: raw.added,
  };
}

function findFile(slug: string, base: string): string {
  const dir = path.join(EXERCISES_DIR, slug);
  for (const ext of [".tsx", ".jsx", ".ts", ".js"]) {
    if (fs.existsSync(path.join(dir, base + ext))) return `exercises/${slug}/${base}${ext}`;
  }
  throw new Error(`Brak pliku ${base}.(tsx|jsx) w exercises/${slug}`);
}

function readSource(relativePath: string): SourceFile {
  const full = path.join(ROOT, relativePath);
  const code = fs.existsSync(full) ? fs.readFileSync(full, "utf8") : `// Brak pliku: ${relativePath}`;
  return { path: relativePath, code };
}

/** README.md to wersja polska, README.<język>.md to tłumaczenia. Brak tłumaczenia = polski. */
function readReadme(slug: string, locale: Locale): string {
  const dir = path.join(EXERCISES_DIR, slug);
  const localized = path.join(dir, `README.${locale}.md`);
  if (locale !== DEFAULT_LOCALE && fs.existsSync(localized)) return fs.readFileSync(localized, "utf8");
  return fs.readFileSync(path.join(dir, "README.md"), "utf8");
}

export function getAllExercises(locale: Locale): ExerciseMeta[] {
  return listFolders().map((slug) => toMeta(slug, readRaw(slug), locale));
}

export function getExercise(slug: string, locale: Locale): ExerciseDetail | null {
  if (!FOLDER_RE.test(slug) || !listFolders().includes(slug)) return null;
  const raw = readRaw(slug);
  const meta = toMeta(slug, raw, locale);

  // component: Exercise.tsx + solution.tsx; functions: exercise.ts + solution.ts + tests.ts; route: pliki z meta.json
  const files =
    meta.kind === "route" ? (raw.files ?? []) : [findFile(slug, meta.kind === "functions" ? "exercise" : "Exercise")];
  const solutionPaths = meta.kind === "route" ? (raw.solutionFiles ?? []) : [findFile(slug, "solution")];

  return {
    ...meta,
    readmeHtml: marked.parse(readReadme(slug, locale), { async: false }) as string,
    files,
    solution: solutionPaths.map(readSource),
    route: raw.route ?? null,
    solutionRoute: raw.solutionRoute ?? null,
  };
}

export function getNeighbours(slug: string, locale: Locale): { prev: ExerciseMeta | null; next: ExerciseMeta | null } {
  const all = getAllExercises(locale);
  const i = all.findIndex((e) => e.slug === slug);
  return { prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
}
