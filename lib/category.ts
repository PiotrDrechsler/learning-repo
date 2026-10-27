import type { ExerciseCategory } from "./exercises";

export const CATEGORIES: ExerciseCategory[] = ["react", "javascript", "typescript", "nextjs"];

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  react: "React",
  javascript: "JavaScript",
  typescript: "TypeScript",
  nextjs: "Next.js",
};

/** Dodatkowe słowa, po których wyszukiwarka znajdzie kategorię. */
export const CATEGORY_SEARCH_WORDS: Record<ExerciseCategory, string> = {
  react: "react",
  javascript: "javascript js",
  typescript: "typescript ts typy types",
  nextjs: "nextjs next.js next app-router",
};
