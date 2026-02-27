import { useState } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import { HeartNote } from "../backend";
import { useDeleteHeartNote } from "../hooks/useQueries";
import EditNoteModal from "./EditNoteModal";

interface NoteCardProps {
  note: HeartNote;
  onClose: () => void;
  /** Pixel offset to translate the card horizontally so it stays in viewport */
  translateX: number;
  /** Whether the card should appear above the heart (true) or below (false) */
  openUpward: boolean;
  /** Whether the card should appear to the left of the heart center */
  openLeftward: boolean;
  /** Heart icon size in px, used to offset the card vertically */
  heartSize: number;
}

export default function NoteCard({
  note,
  onClose,
  translateX,
  openUpward,
  openLeftward,
  heartSize,
}: NoteCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const deleteNote = useDeleteHeartNote();

  const handleDelete = async () => {
    if (!confirm("Remove this heart?")) return;
    try {
      await deleteNote.mutateAsync(note.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const formattedDate = new Date(
    Number(note.timestamp) / 1_000_000
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Arrow horizontal position: points back toward the heart center
  // The card is 288px wide (w-72). The arrow should be near the side
  // closest to the heart.
  const CARD_WIDTH = 288;
  // clamp arrow so it's always inside the card
  const arrowLeft = Math.max(
    16,
    Math.min(CARD_WIDTH - 16, CARD_WIDTH / 2 - translateX)
  );

  const cardStyle: React.CSSProperties = {
    position: "absolute",
    width: CARD_WIDTH,
    maxWidth: "90vw",
    zIndex: 50,
    transform: `translateX(${translateX}px)`,
    ...(openUpward
      ? { bottom: heartSize + 10 }
      : { top: heartSize + 10 }),
    left: 0,
  };

  return (
    <>
      <div style={cardStyle} className="note-appear">
        {/* Arrow pointing toward the heart */}
        {openUpward ? (
          // Arrow at bottom of card pointing down
          <div
            style={{ left: arrowLeft - 8 }}
            className="absolute bottom-[-8px] w-4 h-4 overflow-hidden pointer-events-none"
          >
            <div
              className="w-3 h-3 rotate-45 border-r border-b border-rose-200"
              style={{ background: "#fff7f5", marginTop: -6, marginLeft: 2 }}
            />
          </div>
        ) : (
          // Arrow at top of card pointing up
          <div
            style={{ left: arrowLeft - 8 }}
            className="absolute top-[-8px] w-4 h-4 overflow-hidden pointer-events-none"
          >
            <div
              className="w-3 h-3 rotate-45 border-l border-t border-rose-200"
              style={{ background: "#fff7f5", marginTop: 6, marginLeft: 2 }}
            />
          </div>
        )}

        {/* Card body */}
        <div
          className="rounded-2xl border border-rose-200 shadow-rose-lg p-4"
          style={{
            background: "#fff7f5",
            color: "#7f1d1d",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <p
              className="font-serif text-sm leading-relaxed flex-1"
              style={{ color: "#7f1d1d" }}
            >
              {note.message}
            </p>
            <button
              onClick={onClose}
              className="shrink-0 text-rose-300 hover:text-rose-500 transition-colors mt-0.5"
            >
              <X size={14} />
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-rose-100">
            <div>
              <p
                className="text-xs font-sans font-semibold"
                style={{ color: "#be123c" }}
              >
                {note.creator}
              </p>
              <p className="text-xs font-sans" style={{ color: "#9f1239" }}>
                {formattedDate}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-1.5 rounded-lg hover:bg-rose-100 transition-colors"
                title="Edit"
              >
                <Edit2 size={12} style={{ color: "#be123c" }} />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteNote.isPending}
                className="p-1.5 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
                title="Delete"
              >
                {deleteNote.isPending ? (
                  <span
                    className="inline-block w-3 h-3 border border-rose-300 border-t-rose-600 rounded-full animate-spin"
                  />
                ) : (
                  <Trash2 size={12} style={{ color: "#be123c" }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditNoteModal
          note={note}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
