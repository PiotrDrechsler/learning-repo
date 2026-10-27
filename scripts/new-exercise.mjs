// Tworzy szkielet nowego ćwiczenia.
// Użycie: npm run new -- nazwa-cwiczenia [ts|js]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dir = path.join(root, "exercises");
const [name, lang = "ts"] = process.argv.slice(2);

if (!name || !/^[a-z0-9-]+$/.test(name) || !["ts", "js"].includes(lang)) {
  console.error("Użycie: npm run new -- nazwa-cwiczenia [ts|js]   (małe litery, cyfry, myślniki)");
  process.exit(1);
}

const last = fs
  .readdirSync(dir)
  .filter((f) => /^\d{3}-/.test(f))
  .map((f) => Number(f.slice(0, 3)))
  .reduce((a, b) => Math.max(a, b), 0);
const number = String(last + 1).padStart(3, "0");
const folder = `${number}-${name}`;
const target = path.join(dir, folder);
const ext = lang === "ts" ? "tsx" : "jsx";

fs.mkdirSync(target);
fs.writeFileSync(
  path.join(target, "meta.json"),
  JSON.stringify(
    {
      title: "Tytuł ćwiczenia",
      summary: "Jedno zdanie: co trzeba zbudować.",
      level: "mid",
      lang,
      minutes: 30,
      tags: [],
      added: new Date().toISOString().slice(0, 10),
    },
    null,
    2,
  ) + "\n",
);
fs.writeFileSync(
  path.join(target, "README.md"),
  `## Kontekst\n\nOpis sytuacji z rozmowy.\n\n## Wymagania\n\n- [ ] ...\n\n## Bonus\n\n- ...\n\n## Pytania follow-up\n\n<details><summary>Pytanie?</summary>\n\nOdpowiedź.\n\n</details>\n`,
);
const component = `"use client";\n\nexport default function Exercise() {\n  return <div>TODO</div>;\n}\n`;
fs.writeFileSync(path.join(target, `Exercise.${ext}`), component);
fs.writeFileSync(path.join(target, `solution.${ext}`), component.replace("Exercise()", "Solution()"));
console.log(`✓ Utworzono exercises/${folder}`);
