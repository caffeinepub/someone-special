import { useState } from "react";
import { Heart, Plus, X } from "lucide-react";
import { useAddHeartNote } from "../hooks/useQueries";

export default function AddHeartForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [creator, setCreator] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = useAddHeartNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please write a message before adding your heart.");
      return;
    }

    const id = `heart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const position: [number, number] = [
      Math.random() * 80 + 10,
      Math.random() * 70 + 15,
    ];

    try {
      await addNote.mutateAsync({
        id,
        creator: creator.trim() || "Anonymous",
        message: message.trim(),
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
        position,
      });

      setShowSuccess(true);
      setMessage("");
      setCreator("");
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to add heart note:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="text-5xl animate-heart-pulse">💖</div>
        <p className="font-serif text-rose-600 text-lg italic">
          Your heart has been added!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-sans font-medium rounded-full shadow-rose transition-colors duration-200"
        >
          <Plus size={18} />
          Add Your Heart
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm border border-rose-200 rounded-2xl p-5 shadow-rose-lg w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-rose-500 fill-rose-400" />
              <span className="font-serif text-rose-700 font-semibold">
                Leave a Heart
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError(null);
                setMessage("");
                setCreator("");
              }}
              className="text-rose-300 hover:text-rose-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-sans font-medium text-rose-600 mb-1">
                Your Message <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Write something from the heart…"
                rows={3}
                className="w-full px-3 py-2 text-sm font-sans text-rose-900 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 placeholder:text-rose-300 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-rose-600 mb-1">
                Your Name (optional)
              </label>
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="Anonymous"
                className="w-full px-3 py-2 text-sm font-sans text-rose-900 bg-rose-50 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 placeholder:text-rose-300"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-sans">{error}</p>
            )}

            <button
              type="submit"
              disabled={addNote.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-sans font-medium rounded-full shadow-rose transition-colors duration-200"
            >
              {addNote.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Heart size={16} className="fill-white" />
                  Add Heart
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
