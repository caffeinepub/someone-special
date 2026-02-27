import React from 'react';
import { X, Heart, Pencil, Trash2 } from 'lucide-react';
import type { HeartNote } from '../backend';

interface NoteCardProps {
  note: HeartNote;
  onClose: () => void;
  onEdit?: (note: HeartNote) => void;
  onDelete?: (id: string) => void;
  style?: React.CSSProperties;
  openUpward?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClose, onEdit, onDelete, style, openUpward = false }) => {
  const date = new Date(Number(note.timestamp) / 1_000_000);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="note-appear absolute z-50 w-72 max-w-[90vw]"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Arrow pointer — top when opening downward, bottom when opening upward */}
      {!openUpward && (
        <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 border-l border-t border-rose-200"
          style={{ backgroundColor: '#fff7f5' }} />
      )}
      {openUpward && (
        <div className="absolute -bottom-2 left-6 w-4 h-4 rotate-45 border-r border-b border-rose-200"
          style={{ backgroundColor: '#fff7f5' }} />
      )}

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#fff7f5',
          border: '1px solid #f5c6c6',
          boxShadow: '0 8px 32px rgba(180, 60, 60, 0.18), 0 2px 8px rgba(180, 60, 60, 0.10)',
        }}
      >
        {/* Decorative top strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              {note.creator && (
                <span
                  className="text-xs font-medium italic"
                  style={{ color: '#9b3a5a' }}
                >
                  from {note.creator}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="transition-colors rounded-full p-0.5 hover:bg-rose-100"
              style={{ color: '#9b3a5a' }}
              aria-label="Close note"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message */}
          <p
            className="font-serif text-base leading-relaxed mb-4 whitespace-pre-wrap"
            style={{ color: '#2d1a1a' }}
          >
            {note.message}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: '#7a3a4a' }}
            >
              {formattedDate}
            </span>
            <div className="flex gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(note)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-rose-100"
                  style={{ color: '#9b3a5a' }}
                  aria-label="Edit note"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-100"
                  style={{ color: '#c0392b' }}
                  aria-label="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
