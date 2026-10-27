// Wspólny layout tras z zadaniami Next.js (app/sandbox/*).
// Strony pokazują się w ramce placu zabaw, więc chowamy nagłówek aplikacji i dajemy bazowe style ".stage".
const SANDBOX_CSS = `
  .site-header { display: none; }
  .site-main { max-width: none; padding: 0; }
  .sandbox.stage { border: 0; border-radius: 0; min-height: 100vh; }
`;

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SANDBOX_CSS }} />
      <div className="stage sandbox">{children}</div>
    </>
  );
}
