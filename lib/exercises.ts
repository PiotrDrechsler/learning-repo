import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export type Level = "junior+" | "mid" | "mid+";
export type Lang = "ts" | "js";

export interface ExerciseMeta {
  /** Nazwa folderu, np. "001-debounced-user-search". Służy też jako URL. */
  slug: string;
  number: string;
  title: string;
  summary: string;
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

function readMeta(slug: string): ExerciseMeta {
  const raw = fs.readFileSync(path.join(EXERCISES_DIR, slug, "meta.json"), "utf8");
  const meta = JSON.parse(raw) as Omit<ExerciseMeta, "slug" | "number">;
  return { ...meta, slug, number: slug.slice(0, 3) };
}

function findFile(slug: string, base: string): string {
  const dir = path.join(EXERCISES_DIR, slug);
  for (const ext of [".tsx", ".jsx", ".ts", ".js"]) {
    if (fs.existsSync(path.join(dir, base + ext))) return base + ext;
  }
  throw new Error(`Brak pliku ${base}.(tsx|jsx) w exercises/${slug}`);
}

export function getAllExercises(): ExerciseMeta[] {
  return listFolders().map(readMeta);
}

export function getExercise(slug: string): ExerciseDetail | null {
  if (!FOLDER_RE.test(slug) || !listFolders().includes(slug)) return null;
  const meta = readMeta(slug);
  const dir = path.join(EXERCISES_DIR, slug);
  const readme = fs.readFileSync(path.join(dir, "README.md"), "utf8");
  const exerciseFile = findFile(slug, "Exercise");
  const solutionFile = findFile(slug, "solution");
  return {
    ...meta,
    readmeHtml: marked.parse(readme, { async: false }) as string,
    exerciseFile,
    solutionFile,
    solutionCode: fs.readFileSync(path.join(dir, solutionFile), "utf8"),
  };
}

export function getNeighbours(slug: string): { prev: ExerciseMeta | null; next: ExerciseMeta | null } {
  const all = getAllExercises();
  const i = all.findIndex((e) => e.slug === slug);
  return { prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
}
