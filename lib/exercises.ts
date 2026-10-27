import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { DEFAULT_LOCALE, LOCALES, pick, type Locale, type Localized } from "./i18n";

export type Level = "junior+" | "mid" | "mid+";
export type Lang = "ts" | "js";

/** Kształt meta.json. Tytuł i opis mogą być zwykłym tekstem albo obiektem { pl, en }. */
interface RawMeta {
  title: Localized | string;
  summary: Localized | string;
  level: Level;
  lang: Lang;
  minutes: number;
  tags: string[];
  added: string;
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
  level: Level;
  lang: Lang;
  /** Limit czasu jak na rozmowie, w minutach. */
  minutes: number;
  tags: string[];
  /** Data dodania w formacie RRRR-MM-DD. */
  added: string;
}

export interface ExerciseDetail extends ExerciseMeta {
  readmeHtml: string;
  exerciseFile: string;
  solutionFile: string;
  solutionCode: string;
}

const EXERCISES_DIR = path.join(process.cwd(), "exercises");
const FOLDER_RE = /^\d{3}-[a-z0-9-]+$/;

function listFolders(): string[] {
  return fs
    .readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && FOLDER_RE.test(d.name))
    .map((d) => d.name)
    .sort();
}

function readMeta(slug: string, locale: Locale): ExerciseMeta {
  const raw = JSON.parse(fs.readFileSync(path.join(EXERCISES_DIR, slug, "meta.json"), "utf8")) as RawMeta;
  const searchText = LOCALES.map((l) => `${pick(raw.title, l)} ${pick(raw.summary, l)}`).join(" ");
  return {
    slug,
    number: slug.slice(0, 3),
    title: pick(raw.title, locale),
    summary: pick(raw.summary, locale),
    searchText,
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
    if (fs.existsSync(path.join(dir, base + ext))) return base + ext;
  }
  throw new Error(`Brak pliku ${base}.(tsx|jsx) w exercises/${slug}`);
}

/** README.md to wersja polska, README.<język>.md to tłumaczenia. Brak tłumaczenia = polski. */
function readReadme(slug: string, locale: Locale): string {
  const dir = path.join(EXERCISES_DIR, slug);
  const localized = path.join(dir, `README.${locale}.md`);
  if (locale !== DEFAULT_LOCALE && fs.existsSync(localized)) return fs.readFileSync(localized, "utf8");
  return fs.readFileSync(path.join(dir, "README.md"), "utf8");
}

export function getAllExercises(locale: Locale): ExerciseMeta[] {
  return listFolders().map((slug) => readMeta(slug, locale));
}

export function getExercise(slug: string, locale: Locale): ExerciseDetail | null {
  if (!FOLDER_RE.test(slug) || !listFolders().includes(slug)) return null;
  const meta = readMeta(slug, locale);
  const dir = path.join(EXERCISES_DIR, slug);
  const exerciseFile = findFile(slug, "Exercise");
  const solutionFile = findFile(slug, "solution");
  return {
    ...meta,
    readmeHtml: marked.parse(readReadme(slug, locale), { async: false }) as string,
    exerciseFile,
    solutionFile,
    solutionCode: fs.readFileSync(path.join(dir, solutionFile), "utf8"),
  };
}

export function getNeighbours(slug: string, locale: Locale): { prev: ExerciseMeta | null; next: ExerciseMeta | null } {
  const all = getAllExercises(locale);
  const i = all.findIndex((e) => e.slug === slug);
  return { prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
}
