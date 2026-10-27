// Generuje exercises/_registry.generated.ts:
// - components: zadania React (Exercise + solution jako komponenty),
// - suites: zadania JavaScript/TypeScript (moduł z funkcjami, rozwiązanie i testy).
// Zadania Next.js mają własne trasy w app/sandbox i nie trafiają do rejestru.
// Uruchamia się samo przed `npm run dev` i `npm run build`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dir = path.join(root, "exercises");
const FOLDER_RE = /^\d{3}-[a-z0-9-]+$/;

const has = (folder, base) =>
  [".tsx", ".jsx", ".ts", ".js"].some((ext) => fs.existsSync(path.join(dir, folder, base + ext)));

const folders = fs
  .readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && FOLDER_RE.test(d.name))
  .map((d) => d.name)
  .sort();

const imports = [];
const components = [];
const suites = [];

for (const folder of folders) {
  const n = folder.slice(0, 3);
  const meta = JSON.parse(fs.readFileSync(path.join(dir, folder, "meta.json"), "utf8"));
  const category = meta.category ?? "react";

  if (category === "nextjs") continue;

  if (category === "javascript" || category === "typescript") {
    if (!has(folder, "exercise") || !has(folder, "solution") || !has(folder, "tests")) {
      console.warn(`⚠ Pomijam ${folder}: brak exercise.*, solution.* albo tests.*`);
      continue;
    }
    imports.push(`import * as Exercise${n} from "./${folder}/exercise";`);
    imports.push(`import * as Solution${n} from "./${folder}/solution";`);
    imports.push(`import Tests${n} from "./${folder}/tests";`);
    suites.push(`  "${folder}": { exercise: Exercise${n}, solution: Solution${n}, tests: Tests${n} },`);
    continue;
  }

  if (!has(folder, "Exercise") || !has(folder, "solution")) {
    console.warn(`⚠ Pomijam ${folder}: brak Exercise.* albo solution.*`);
    continue;
  }
  imports.push(`import Exercise${n} from "./${folder}/Exercise";`);
  imports.push(`import Solution${n} from "./${folder}/solution";`);
  components.push(`  "${folder}": { Exercise: Exercise${n}, Solution: Solution${n} },`);
}

const out = `// AUTO-GENERATED przez scripts/gen-registry.mjs — nie edytuj ręcznie.
import type { ComponentType } from "react";
import type { TestCase } from "@/lib/testing";
${imports.join("\n")}

export const components: Record<string, { Exercise: ComponentType; Solution: ComponentType }> = {
${components.join("\n")}
};

export const suites: Record<string, { exercise: unknown; solution: unknown; tests: TestCase[] }> = {
${suites.join("\n")}
};
`;

const target = path.join(dir, "_registry.generated.ts");
const previous = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
if (previous !== out) fs.writeFileSync(target, out);
console.log(`✓ Rejestr: ${components.length} komponentów, ${suites.length} zestawów testów`);
