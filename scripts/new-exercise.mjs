// Tworzy szkielet nowego ćwiczenia.
// Użycie: npm run new -- nazwa-cwiczenia [react|javascript|typescript|nextjs] [ts|js]
//   react       -> Exercise.(tsx|jsx) + solution.(tsx|jsx)      (domyślnie ts)
//   javascript  -> exercise.js + solution.js + tests.js
//   typescript  -> exercise.ts + solution.ts + tests.ts
//   nextjs      -> meta.json + README, a trasy w app/sandbox/<numer>-task i <numer>-solution
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dir = path.join(root, "exercises");
const [name, category = "react", langArg] = process.argv.slice(2);
const CATEGORIES = ["react", "javascript", "typescript", "nextjs"];

if (!name || !/^[a-z0-9-]+$/.test(name) || !CATEGORIES.includes(category) || (langArg && !["ts", "js"].includes(langArg))) {
  console.error("Użycie: npm run new -- nazwa-cwiczenia [react|javascript|typescript|nextjs] [ts|js]");
  process.exit(1);
}

const lang = category === "javascript" ? "js" : category === "typescript" || category === "nextjs" ? "ts" : (langArg ?? "ts");

const last = fs
  .readdirSync(dir)
  .filter((f) => /^\d{3}-/.test(f))
  .map((f) => Number(f.slice(0, 3)))
  .reduce((a, b) => Math.max(a, b), 0);
const number = String(last + 1).padStart(3, "0");
const folder = `${number}-${name}`;
const target = path.join(dir, folder);
const write = (file, content) => fs.writeFileSync(path.join(target, file), content);

fs.mkdirSync(target);

const meta = {
  title: { pl: "Tytuł ćwiczenia", en: "Exercise title" },
  summary: { pl: "Jedno zdanie: co trzeba zbudować.", en: "One sentence: what to build." },
  category,
  level: "junior",
  lang,
  minutes: 30,
  tags: [],
  added: new Date().toISOString().slice(0, 10),
};
if (category === "nextjs") {
  Object.assign(meta, {
    route: `/sandbox/${number}-task`,
    solutionRoute: `/sandbox/${number}-solution`,
    files: [`app/sandbox/${number}-task/page.tsx`],
    solutionFiles: [`app/sandbox/${number}-solution/page.tsx`],
  });
}
write("meta.json", JSON.stringify(meta, null, 2) + "\n");

write(
  "README.md",
  "## Kontekst\n\nSytuacja z rozmowy.\n\n## Wymagania\n\n- [ ] ...\n\n## Bonus\n\n- [ ] ...\n\n## Na co patrzy rekruter\n\n- ...\n\n## Pytania follow-up\n\n<details><summary>Pytanie?</summary>\n\nOdpowiedź.\n\n</details>\n",
);
write(
  "README.en.md",
  "## Context\n\nThe interview situation.\n\n## Requirements\n\n- [ ] ...\n\n## Bonus\n\n- [ ] ...\n\n## What the interviewer looks at\n\n- ...\n\n## Follow-up questions\n\n<details><summary>Question?</summary>\n\nAnswer.\n\n</details>\n",
);

if (category === "react") {
  const ext = lang === "ts" ? "tsx" : "jsx";
  const component = (fn) => `"use client";\n\nexport default function ${fn}() {\n  return <div>TODO</div>;\n}\n`;
  write(`Exercise.${ext}`, component("Exercise"));
  write(`solution.${ext}`, component("Solution"));
} else if (category === "javascript" || category === "typescript") {
  const ext = lang;
  write(`exercise.${ext}`, `export function example(value) {\n  throw new Error("TODO: example");\n}\n`.replace("(value)", ext === "ts" ? "(value: number): number" : "(value)"));
  write(`solution.${ext}`, `export function example(value) {\n  return value * 2;\n}\n`.replace("(value)", ext === "ts" ? "(value: number): number" : "(value)"));
  write(
    `tests.${ext}`,
    `import { defineTests, expect } from "@/lib/testing";\n\nexport default defineTests([\n  { name: "example: podwaja liczbę", run: (m) => expect(m.example(2)).toBe(4) },\n]);\n`.replace(
      "(m)",
      ext === "ts" ? "(m: any)" : "(m)",
    ),
  );
} else {
  for (const kind of ["task", "solution"]) {
    const routeDir = path.join(root, "app", "sandbox", `${number}-${kind}`);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, "page.tsx"), `export default function Page() {\n  return <p>TODO</p>;\n}\n`);
  }
}

console.log(`✓ Utworzono exercises/${folder} (${category}, ${lang})`);
