import React, { useState } from 'react';
import { Plus, Heart, Loader2, Check } from 'lucide-react';
import { useAddHeartNote } from '../hooks/useQueries';

interface AddHeartFormProps {
  onSuccess?: () => void;
}

const AddHeartForm: React.FC<AddHeartFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [creator, setCreator] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const addNote = useAddHeartNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const id = `heart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const position: [number, number] = [
      0.08 + Math.random() * 0.84,
      0.08 + Math.random() * 0.84,
    ];

    try {
      await addNote.mutateAsync({
        id,
        creator: creator.trim() || 'Anonymous',
        message: message.trim(),
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
        position,
      });

      setMessage('');
      setCreator('');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 1800);
      onSuccess?.();
    } catch (err) {
      console.error('Failed to add heart note:', err);
    }
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full shadow-rose hover:shadow-rose-lg transition-all duration-200 hover:scale-105 font-sans text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add a Heart Note</span>
          <Heart className="w-4 h-4 fill-primary-foreground opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-note p-6 w-full max-w-md mx-auto animate-scale-in">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 fill-primary text-primary" />
            <h3 className="font-serif text-lg text-foreground">Leave a Heart Note</h3>
          </div>

          {showSuccess ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <p className="font-serif text-foreground italic">Heart added with love ♥</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  placeholder="e.g. Your name..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-sans"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Your message <span className="text-primary">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something from the heart..."
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-sans resize-none"
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {message.length}/300
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); setMessage(''); setCreator(''); }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all text-sm font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addNote.isPending || !message.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-sans font-medium shadow-rose"
                >
                  {addNote.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-primary-foreground" />
                      <span>Add Heart</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AddHeartForm;
