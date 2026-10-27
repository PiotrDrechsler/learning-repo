import Link from "next/link";
import { notFound } from "next/navigation";
import Playground from "@/components/Playground";
import { getExercise } from "@/lib/exercises";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ solution?: string }>;
};

export default async function PlayPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { solution } = await searchParams;
  const exercise = getExercise(slug);
  if (!exercise) notFound();

  const showSolution = solution === "1";

  return (
    <div className="play-page">
      <Link href={`/exercises/${slug}`} className="back-link">
        ← Treść zadania
      </Link>
      <h1>
        {exercise.number}. {exercise.title}
      </h1>
      <div className="mode-switch" role="tablist" aria-label="Wersja">
        <Link href={`/play/${slug}`} role="tab" aria-selected={!showSolution} className={!showSolution ? "is-selected" : ""}>
          Twoja wersja
        </Link>
        <Link href={`/play/${slug}?solution=1`} role="tab" aria-selected={showSolution} className={showSolution ? "is-selected" : ""}>
          Rozwiązanie
        </Link>
      </div>
      <Playground
        slug={slug}
        minutes={exercise.minutes}
        mode={showSolution ? "solution" : "exercise"}
        file={`exercises/${slug}/${showSolution ? exercise.solutionFile : exercise.exerciseFile}`}
      />
    </div>
  );
}
