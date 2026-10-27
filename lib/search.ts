import type { ExerciseMeta } from "./exercises";

/** Małe litery, bez polskich znaków: "Łódź" -> "lodz". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export interface SearchHit {
  exercise: ExerciseMeta;
  score: number;
}

/**
 * Każde słowo zapytania musi pasować do któregoś pola (AND).
 * Trafienia w tytuł ważą najwięcej, potem tagi, potem opis. Szuka w obu językach naraz.
 */
export function searchExercises(exercises: ExerciseMeta[], query: string): SearchHit[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return exercises.map((exercise) => ({ exercise, score: 0 }));

  const hits: SearchHit[] = [];
  for (const exercise of exercises) {
    const title = normalize(exercise.title);
    const tags = exercise.tags.map(normalize);
    const summary = normalize(exercise.searchText); // tytuły i opisy w obu językach
    const stackWords = exercise.stack === "nextjs" ? "nextjs next.js next app-router" : "react";
    const extra = normalize(`${exercise.number} ${exercise.level} ${exercise.lang} ${stackWords} ${exercise.slug}`);

    let score = 0;
    let allMatched = true;
    for (const token of tokens) {
      let tokenScore = 0;
      if (title.includes(token)) tokenScore += title.split(/\W+/).some((w) => w.startsWith(token)) ? 4 : 3;
      if (tags.some((t) => t === token)) tokenScore += 3;
      else if (tags.some((t) => t.includes(token))) tokenScore += 2;
      if (summary.includes(token)) tokenScore += 1;
      if (extra.includes(token)) tokenScore += 1;
      if (tokenScore === 0) {
        allMatched = false;
        break;
      }
      score += tokenScore;
    }
    if (allMatched) hits.push({ exercise, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.exercise.number.localeCompare(b.exercise.number));
}
