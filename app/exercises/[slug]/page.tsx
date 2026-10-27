import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DoneToggle from "@/components/DoneToggle";
import { getAllExercises, getExercise, getNeighbours } from "@/lib/exercises";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllExercises().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exercise = getExercise(slug);
  return { title: exercise ? `${exercise.number}. ${exercise.title} · NAUKA REACT` : "NAUKA REACT" };
}

export default async function ExercisePage({ params }: Props) {
  const { slug } = await params;
  const exercise = getExercise(slug);
  if (!exercise) notFound();
  const { prev, next } = getNeighbours(slug);

  return (
    <article className="exercise-page">
      <Link href="/" className="back-link">
        ← Wszystkie ćwiczenia
      </Link>

      <header className="exercise-header">
        <span className="exercise-number big">{exercise.number}</span>
        <div>
          <h1>{exercise.title}</h1>
          <div className="exercise-tags">
            <span className={`pill pill-${exercise.lang}`}>{exercise.lang.toUpperCase()}</span>
            <span className="pill">{exercise.level}</span>
            <span className="pill">⏱ {exercise.minutes} min</span>
            {exercise.tags.map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="actions">
        <Link href={`/play/${exercise.slug}`} className="button button-primary">
          ▶ Start: plac zabaw z timerem
        </Link>
        <DoneToggle slug={exercise.slug} />
      </div>

      <p className="file-hint">
        Kodujesz w pliku <code>exercises/{exercise.slug}/{exercise.exerciseFile}</code>. Zapisz plik, a plac zabaw
        odświeży się sam. Chcesz zacząć od zera? <code>git restore exercises/{exercise.slug}/{exercise.exerciseFile}</code>
      </p>

      <div className="prose" dangerouslySetInnerHTML={{ __html: exercise.readmeHtml }} />

      <details className="solution">
        <summary>Pokaż przykładowe rozwiązanie (spoiler!)</summary>
        <p>
          <Link href={`/play/${exercise.slug}?solution=1`}>Uruchom rozwiązanie na placu zabaw →</Link>
        </p>
        <pre>
          <code>{exercise.solutionCode}</code>
        </pre>
      </details>

      <nav className="pager" aria-label="Sąsiednie ćwiczenia">
        {prev ? <Link href={`/exercises/${prev.slug}`}>← {prev.number}. {prev.title}</Link> : <span />}
        {next ? <Link href={`/exercises/${next.slug}`}>{next.number}. {next.title} →</Link> : <span />}
      </nav>
    </article>
  );
}
