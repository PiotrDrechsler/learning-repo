// Generuje exercises/_registry.generated.ts: mapę slug -> { Exercise, Solution }.
// Uruchamia się samo przed `npm run dev` i `npm run build`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dir = path.join(root, "exercises");
const FOLDER_RE = /^\d{3}-[a-z0-9-]+$/;

const findBase = (folder, base) =>
  [".tsx", ".jsx", ".ts", ".js"].some((ext) => fs.existsSync(path.join(dir, folder, base + ext)));

const folders = fs
  .readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && FOLDER_RE.test(d.name))
  .map((d) => d.name)
  .sort();

const imports = [];
const entries = [];
for (const folder of folders) {
  const n = folder.slice(0, 3);
  if (!findBase(folder, "Exercise") || !findBase(folder, "solution")) {
    console.warn(`⚠ Pomijam ${folder}: brak pliku Exercise.* albo solution.*`);
    continue;
  }
  imports.push(`import Exercise${n} from "./${folder}/Exercise";`);
  imports.push(`import Solution${n} from "./${folder}/solution";`);
  entries.push(`  "${folder}": { Exercise: Exercise${n}, Solution: Solution${n} },`);
}

const out = `// AUTO-GENERATED przez scripts/gen-registry.mjs — nie edytuj ręcznie.
import type { ComponentType } from "react";
${imports.join("\n")}

export const registry: Record<string, { Exercise: ComponentType; Solution: ComponentType }> = {
${entries.join("\n")}
};
`;

const target = path.join(dir, "_registry.generated.ts");
const previous = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
if (previous !== out) fs.writeFileSync(target, out);
console.log(`✓ Rejestr ćwiczeń: ${entries.length}`);
