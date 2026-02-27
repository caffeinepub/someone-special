import React, { useState, useEffect } from 'react';
import { Heart, Loader2, X } from 'lucide-react';
import type { HeartNote } from '../backend';
import { useEditHeartNote } from '../hooks/useQueries';

interface EditNoteModalProps {
  note: HeartNote | null;
  onClose: () => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ note, onClose }) => {
  const [message, setMessage] = useState('');
  const editNote = useEditHeartNote();

  useEffect(() => {
    if (note) setMessage(note.message);
  }, [note]);

  if (!note) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await editNote.mutateAsync({ id: note.id, newMessage: message.trim() });
      onClose();
    } catch (err) {
      console.error('Failed to edit note:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-note p-6 w-full max-w-md animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-primary text-primary" />
            <h3 className="font-serif text-lg text-foreground">Edit Heart Note</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-accent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-sans resize-none"
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">{message.length}/300</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all text-sm font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editNote.isPending || !message.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-sans font-medium shadow-rose"
            >
              {editNote.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;
