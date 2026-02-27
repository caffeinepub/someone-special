import React from 'react';
import { Heart } from 'lucide-react';
import { usePersonalGreeting } from '../hooks/useQueries';

const DEFAULT_MESSAGE = 'Welcome to your love-filled online sanctuary!';

const PersonalGreeting: React.FC = () => {
  const { data: message, isLoading } = usePersonalGreeting();

  const displayMessage = message && message.trim() ? message : DEFAULT_MESSAGE;

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="h-px flex-1 max-w-[60px] bg-primary/30" />
        <Heart className="w-4 h-4 fill-primary text-primary opacity-60" />
        <div className="h-px flex-1 max-w-[60px] bg-primary/30" />
      </div>

      {isLoading ? (
        <div className="h-8 flex items-center justify-center">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <p
          className="font-serif italic text-xl sm:text-2xl leading-relaxed"
          style={{ color: 'oklch(0.45 0.14 15)' }}
        >
          &ldquo;{displayMessage}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-center gap-3 mt-2">
        <div className="h-px flex-1 max-w-[60px] bg-primary/30" />
        <Heart className="w-4 h-4 fill-primary text-primary opacity-60" />
        <div className="h-px flex-1 max-w-[60px] bg-primary/30" />
      </div>
    </div>
  );
};

export default PersonalGreeting;
