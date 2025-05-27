import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
      <div className="mb-8">
        <h1 
          className="text-8xl font-bold mb-2 glitch-effect" 
          data-text="404"
        >
          404
        </h1>
        <div className="cyberpunk-border p-6 my-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-secondary">SYSTEM ERROR</h2>
          <p className="terminal-text mb-6">
            &gt; CONNECTION_LOST<br />
            &gt; ATTEMPTING TO RECONNECT...<br />
            &gt; FAILED<br />
            &gt; MISSING_RESOURCE_DETECTED<br />
            &gt; PAGE_NOT_FOUND
          </p>
          <p className="mb-8">
            The digital realm you&apos;re searching for has been corrupted or never existed.
          </p>
        </div>
        <div className="mt-8">
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-primary text-background font-bold transition-all hover:bg-background hover:text-primary hover:neon-text border border-primary"
          >
            RETURN TO HOME
          </Link>
        </div>
      </div>
    </main>
  );
} 