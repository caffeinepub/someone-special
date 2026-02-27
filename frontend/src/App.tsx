import React from 'react';
import { Heart } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import FloatingPetals from './components/FloatingPetals';
import HeartCanvas from './components/HeartCanvas';
import AddHeartForm from './components/AddHeartForm';
import PersonalGreeting from './components/PersonalGreeting';
import AdminGreetingEditor from './components/AdminGreetingEditor';
import { useGetAllHeartNotes } from './hooks/useQueries';

const App: React.FC = () => {
  const { data: notes = [], isLoading } = useGetAllHeartNotes();

  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'someone-special'
  );

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-x-hidden">
      {/* Ambient floating petals */}
      <FloatingPetals />

      {/* Subtle radial gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.93 0.05 15 / 0.4) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Header ── */}
      <header className="relative z-10 pt-8 pb-4 text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 fill-primary text-primary opacity-70" />
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-sans font-medium">
            A little something
          </span>
          <Heart className="w-5 h-5 fill-primary text-primary opacity-70" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight">
          For Someone{' '}
          <span
            className="italic"
            style={{ color: 'oklch(0.55 0.18 15)' }}
          >
            Special
          </span>
        </h1>
        <p className="mt-3 font-serif italic text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
          Each heart holds a message written just for you
        </p>
      </header>

      {/* ── Hero Banner ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mt-4 mb-6">
        <div className="rounded-3xl overflow-hidden shadow-rose-lg">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Romantic banner with rose petals and warm bokeh lights"
            className="w-full h-auto object-cover"
            style={{ maxHeight: '320px', objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* ── Personal Greeting ── */}
      <PersonalGreeting />

      {/* ── Main Content ── */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 pb-12">
        {/* Instruction text */}
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground font-sans">
            ✨ Click on any heart to reveal its hidden message ✨
          </p>
        </div>

        {/* Heart Canvas */}
        <section
          className="relative rounded-3xl border border-border bg-card/60 backdrop-blur-sm shadow-xs overflow-visible mb-10"
          style={{ minHeight: '520px' }}
          aria-label="Heart notes canvas"
        >
          {/* Subtle inner gradient */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.97 0.012 15 / 0.5) 0%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <Heart
                    key={i}
                    className="w-6 h-6 fill-primary text-primary animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p className="font-serif italic text-muted-foreground text-sm">
                Loading your hearts...
              </p>
            </div>
          ) : (
            <HeartCanvas notes={notes} />
          )}
        </section>

        {/* Add Heart Form + Admin Greeting Editor */}
        <section className="flex flex-col items-center gap-6" aria-label="Add a heart note">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-16 bg-border" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans">
              Leave your mark
            </span>
            <div className="h-px w-16 bg-border" />
          </div>
          <AddHeartForm />

          {/* Divider */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs text-muted-foreground font-sans uppercase tracking-widest">
              or
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <AdminGreetingEditor />
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border py-6 px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
            <span>© {new Date().getFullYear()}</span>
            <span>·</span>
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-primary text-primary inline-block" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default App;
