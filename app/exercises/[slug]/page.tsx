import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DoneToggle from "@/components/DoneToggle";
import { getExercise, getNeighbours } from "@/lib/exercises";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale.server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const exercise = getExercise(slug, locale);
  return { title: exercise ? `${exercise.number}. ${exercise.title} · ${t.meta.title}` : t.meta.title };
}

export default async function ExercisePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const exercise = getExercise(slug, locale);
  if (!exercise) notFound();
  const { prev, next } = getNeighbours(slug, locale);
  const filePath = `exercises/${exercise.slug}/${exercise.exerciseFile}`;

  return (
    <article className="exercise-page">
      <Link href="/" className="back-link">
        {t.exercise.back}
      </Link>

      <header className="exercise-header">
        <span className="exercise-number big">{exercise.number}</span>
        <div>
          <h1>{exercise.title}</h1>
          <div className="exercise-tags">
            <span className={`pill pill-${exercise.lang}`}>{exercise.lang.toUpperCase()}</span>
            <span className="pill">{exercise.level}</span>
            <span className="pill">⏱ {t.exercise.minutes(exercise.minutes)}</span>
            {exercise.tags.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="actions">
        <Link href={`/play/${exercise.slug}`} className="button button-primary">
          {t.exercise.start}
        </Link>
        <DoneToggle slug={exercise.slug} />
      </div>

      <p className="file-hint">
        {t.exercise.fileHintBefore} <code>{filePath}</code>. {t.exercise.fileHintMiddle} <code>git restore {filePath}</code>
      </p>

      <div className="prose" dangerouslySetInnerHTML={{ __html: exercise.readmeHtml }} />

      <details className="solution">
        <summary>{t.exercise.showSolution}</summary>
        <p>
          <Link href={`/play/${exercise.slug}?solution=1`}>{t.exercise.runSolution}</Link>
        </p>
        <pre>
          <code>{exercise.solutionCode}</code>
        </pre>
      </details>

      <nav className="pager" aria-label={t.exercise.neighbours}>
        {prev ? (
          <Link href={`/exercises/${prev.slug}`}>
            ← {prev.number}. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/exercises/${next.slug}`}>
            {next.number}. {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
