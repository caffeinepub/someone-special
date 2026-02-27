import React, { useMemo } from 'react';

interface Petal {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: number;
}

const FloatingPetals: React.FC = () => {
  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${8 + Math.random() * 14}px`,
      duration: `${7 + Math.random() * 8}s`,
      delay: `${Math.random() * 10}s`,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            top: '-20px',
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            '--petal-duration': petal.duration,
            '--petal-delay': petal.delay,
          } as React.CSSProperties}
        >
          <svg viewBox="0 0 24 24" fill="oklch(0.72 0.18 15)" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FloatingPetals;
