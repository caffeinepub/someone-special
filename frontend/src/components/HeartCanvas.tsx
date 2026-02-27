import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { HeartNote } from '../backend';
import NoteCard from './NoteCard';

interface HeartCanvasProps {
  notes: HeartNote[];
  onEdit?: (note: HeartNote) => void;
  onDelete?: (id: string) => void;
}

interface HeartConfig {
  floatDuration: string;
  floatDelay: string;
  pulseDuration: string;
  pulseDelay: string;
  size: number;
  animationType: 'float' | 'pulse';
}

function getHeartConfig(id: string): HeartConfig {
  // Deterministic pseudo-random based on id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  return {
    floatDuration: `${2.5 + (abs % 20) / 5}s`,
    floatDelay: `${(abs % 15) / 5}s`,
    pulseDuration: `${1.8 + (abs % 12) / 6}s`,
    pulseDelay: `${(abs % 10) / 5}s`,
    size: 48 + (abs % 32),
    animationType: abs % 2 === 0 ? 'float' : 'pulse',
  };
}

const HeartCanvas: React.FC<HeartCanvasProps> = ({ notes, onEdit, onDelete }) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeartClick = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveNoteId(prev => prev === id ? null : id);
  }, []);

  const handleClose = useCallback(() => {
    setActiveNoteId(null);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveNoteId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: '520px' }}
    >
      {notes.map((note) => {
        const config = getHeartConfig(note.id);
        const [xPct, yPct] = note.position;
        const isActive = activeNoteId === note.id;

        // Clamp positions to keep hearts visible
        const clampedX = Math.max(5, Math.min(90, xPct * 100));
        const clampedY = Math.max(5, Math.min(90, yPct * 100));

        // If the heart is in the lower 45% of the canvas, open the card upward
        const openUpward = clampedY > 55;

        return (
          <div
            key={note.id}
            className="absolute"
            style={{
              left: `${clampedX}%`,
              top: `${clampedY}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isActive ? 40 : 10,
            }}
          >
            {/* Heart button */}
            <button
              onClick={(e) => handleHeartClick(note.id, e)}
              className={`
                relative group cursor-pointer transition-transform duration-200
                ${config.animationType === 'float' ? 'heart-float' : 'heart-pulse'}
                ${isActive ? 'scale-125' : 'hover:scale-110'}
              `}
              style={{
                '--float-duration': config.floatDuration,
                '--float-delay': config.floatDelay,
                '--pulse-duration': config.pulseDuration,
                '--pulse-delay': config.pulseDelay,
                width: config.size,
                height: config.size,
              } as React.CSSProperties}
              aria-label={`Open note: ${note.message.slice(0, 30)}...`}
            >
              <img
                src="/assets/generated/heart-icon.dim_128x128.png"
                alt="Heart note"
                className="w-full h-full object-contain drop-shadow-md"
                style={{
                  filter: isActive
                    ? 'drop-shadow(0 0 12px oklch(0.65 0.22 15 / 0.8))'
                    : 'drop-shadow(0 2px 6px oklch(0.55 0.18 15 / 0.4))',
                }}
              />
              {/* Tooltip on hover */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans">
                Click to read ♥
              </span>
            </button>

            {/* Note card — opens below or above depending on position */}
            {isActive && activeNote && (
              <NoteCard
                note={activeNote}
                onClose={handleClose}
                onEdit={onEdit}
                onDelete={onDelete}
                openUpward={openUpward}
                style={
                  openUpward
                    ? {
                        bottom: config.size + 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }
                    : {
                        top: config.size + 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }
                }
              />
            )}
          </div>
        );
      })}

      {notes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="text-6xl mb-4 opacity-30">💝</div>
          <p className="font-serif text-muted-foreground text-lg italic">
            No hearts yet...
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Add the first heart note below
          </p>
        </div>
      )}
    </div>
  );
};

export default HeartCanvas;
