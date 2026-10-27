import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { getExercise } from "@/lib/exercises";
import { templateFor } from "@/lib/file-templates";

// Odczyt i zapis plików ćwiczeń z edytora w przeglądarce.
// Działa TYLKO w trybie deweloperskim i TYLKO dla plików wymienionych w danym ćwiczeniu.

export const dynamic = "force-dynamic";

const ROOT = process.cwd();
const run = promisify(execFile);

type Target = { abs: string; rel: string; isNew: boolean };

function devOnly(): Response | null {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ message: "Zapis plików działa tylko w trybie deweloperskim (npm run dev)." }, { status: 403 });
  }
  return null;
}

/** Plik musi należeć do ćwiczenia i leżeć wewnątrz projektu. */
function resolveTarget(slug: unknown, file: unknown): Target | null {
  if (typeof slug !== "string" || typeof file !== "string") return null;
  const exercise = getExercise(slug, "pl");
  if (!exercise || !exercise.files.includes(file)) return null;
  const abs = path.resolve(ROOT, file);
  if (!abs.startsWith(ROOT + path.sep)) return null;
  return { abs, rel: file, isNew: exercise.newFiles.includes(file) };
}

async function readOrNull(abs: string): Promise<string | null> {
  try {
    return await fs.readFile(abs, "utf8");
  } catch {
    return null;
  }
}

/** GET /api/files?slug=...&path=...  ->  { content, exists } */
export async function GET(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;
  const { searchParams } = new URL(request.url);
  const target = resolveTarget(searchParams.get("slug"), searchParams.get("path"));
  if (!target) return Response.json({ message: "Niedozwolony plik." }, { status: 400 });

  const content = await readOrNull(target.abs);
  return Response.json({ content: content ?? templateFor(target.rel), exists: content !== null });
}

/**
 * POST /api/files  { slug, path, content }               -> zapis
 * POST /api/files  { slug, path, action: "reset" }       -> wersja startowa z gita (nowy plik: usunięcie)
 */
export async function POST(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;

  let body: { slug?: unknown; path?: unknown; content?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Niepoprawne dane." }, { status: 400 });
  }
  const target = resolveTarget(body.slug, body.path);
  if (!target) return Response.json({ message: "Niedozwolony plik." }, { status: 400 });

  try {
    if (body.action === "reset") {
      if (target.isNew) {
        await fs.rm(target.abs, { force: true });
        return Response.json({ content: templateFor(target.rel), exists: false });
      }
      const { stdout } = await run("git", ["show", `HEAD:${target.rel}`], { cwd: ROOT, maxBuffer: 5 * 1024 * 1024 });
      await fs.writeFile(target.abs, stdout, "utf8");
      return Response.json({ content: stdout, exists: true });
    }

    if (typeof body.content !== "string" || body.content.length > 500_000) {
      return Response.json({ message: "Niepoprawna treść pliku." }, { status: 400 });
    }
    await fs.mkdir(path.dirname(target.abs), { recursive: true });
    await fs.writeFile(target.abs, body.content, "utf8");
    return Response.json({ ok: true, exists: true });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Błąd zapisu." }, { status: 500 });
  }
}
