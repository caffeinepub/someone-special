import React, { useState, useEffect } from 'react';
import { MessageSquare, Loader2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { usePersonalGreeting, useUpdatePersonalGreeting } from '../hooks/useQueries';

const AdminGreetingEditor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: currentMessage } = usePersonalGreeting();
  const updateGreeting = useUpdatePersonalGreeting();

  // Pre-fill draft when current message loads
  useEffect(() => {
    if (currentMessage !== undefined) {
      setDraft(currentMessage);
    }
  }, [currentMessage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;

    try {
      await updateGreeting.mutateAsync(draft.trim());
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to update greeting:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground rounded-full shadow-note hover:shadow-rose transition-all duration-200 hover:scale-105 font-sans text-sm font-medium"
        >
          <MessageSquare className="w-4 h-4 text-primary" />
          <span>Edit Site Message</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-note p-6 w-full animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg text-foreground">Site Message</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Collapse editor"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {showSuccess ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <p className="font-serif text-foreground italic">Message saved with love ♥</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Your personal greeting
                </label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a personal message for your visitors..."
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-sans resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {draft.length}/200
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setDraft(currentMessage ?? '');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all text-sm font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateGreeting.isPending || !draft.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-sans font-medium shadow-rose"
                >
                  {updateGreeting.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Message</span>
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

export default AdminGreetingEditor;
