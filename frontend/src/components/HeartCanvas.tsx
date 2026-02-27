import { useState, useRef, useCallback, useEffect } from "react";
import { Heart } from "lucide-react";
import { HeartNote } from "../backend";
import NoteCard from "./NoteCard";
import { useUpdateHeartPosition } from "../hooks/useQueries";

interface HeartCanvasProps {
  notes: HeartNote[];
}

const HEART_SIZE = 32;
const CARD_WIDTH = 288;
const CARD_HEIGHT_ESTIMATE = 160;

// Minimum pixel movement to count as a drag (not a click)
const DRAG_THRESHOLD = 6;

interface CardLayout {
  translateX: number;
  openUpward: boolean;
  openLeftward: boolean;
}

interface DragState {
  noteId: string;
  startMouseX: number;
  startMouseY: number;
  startPctX: number;
  startPctY: number;
  hasMoved: boolean;
  // Live position while dragging (percentages)
  currentPctX: number;
  currentPctY: number;
}

function computeCardLayout(
  heartEl: HTMLElement,
  containerEl: HTMLElement
): CardLayout {
  const heartRect = heartEl.getBoundingClientRect();
  const containerRect = containerEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const heartCenterX = heartRect.left + heartRect.width / 2;

  const spaceBelow = vh - heartRect.bottom;
  const openUpward = spaceBelow < CARD_HEIGHT_ESTIMATE + 20;

  const heartLeftInContainer = heartRect.left - containerRect.left;
  const idealCardLeft = heartLeftInContainer + heartRect.width / 2 - CARD_WIDTH / 2;

  const MARGIN = 8;
  const containerLeft = containerRect.left;

  let cardLeftViewport = containerLeft + idealCardLeft;
  let cardRightViewport = cardLeftViewport + CARD_WIDTH;

  let clampedCardLeft = idealCardLeft;

  if (cardLeftViewport < MARGIN) {
    clampedCardLeft = idealCardLeft + (MARGIN - cardLeftViewport);
  } else if (cardRightViewport > vw - MARGIN) {
    clampedCardLeft = idealCardLeft - (cardRightViewport - (vw - MARGIN));
  }

  const translateX = clampedCardLeft;
  const cardCenterX = containerLeft + clampedCardLeft + CARD_WIDTH / 2;
  const openLeftward = cardCenterX < heartCenterX;

  return { translateX, openUpward, openLeftward };
}

export default function HeartCanvas({ notes }: HeartCanvasProps) {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [cardLayouts, setCardLayouts] = useState<Record<string, CardLayout>>({});
  // Optimistic positions while dragging (overrides note.position)
  const [dragPositions, setDragPositions] = useState<Record<string, [number, number]>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const heartRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dragStateRef = useRef<DragState | null>(null);

  const updatePosition = useUpdateHeartPosition();

  // ── Mouse move handler (attached to window during drag) ──────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const drag = dragStateRef.current;
    if (!drag || !containerRef.current) return;

    const dx = e.clientX - drag.startMouseX;
    const dy = e.clientY - drag.startMouseY;

    if (!drag.hasMoved && Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;

    drag.hasMoved = true;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newPctX = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const newPctY = ((e.clientY - containerRect.top) / containerRect.height) * 100;

    // Clamp to [1, 99] so hearts stay within the canvas
    const clampedX = Math.min(99, Math.max(1, newPctX));
    const clampedY = Math.min(99, Math.max(1, newPctY));

    drag.currentPctX = clampedX;
    drag.currentPctY = clampedY;

    setDragPositions((prev) => ({
      ...prev,
      [drag.noteId]: [clampedX, clampedY],
    }));
  }, []);

  // ── Mouse up handler (attached to window during drag) ────────────────────
  const handleMouseUp = useCallback(() => {
    const drag = dragStateRef.current;
    if (!drag) return;

    if (drag.hasMoved) {
      // Persist new position to backend
      updatePosition.mutate(
        { id: drag.noteId, newPosition: [drag.currentPctX, drag.currentPctY] },
        {
          onSuccess: () => {
            // Clear optimistic override once backend confirms
            setDragPositions((prev) => {
              const next = { ...prev };
              delete next[drag.noteId];
              return next;
            });
          },
        }
      );
      // Close any open card after a drag
      setActiveNoteId(null);
    }

    dragStateRef.current = null;

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, updatePosition]);

  // ── Mouse down on a heart ────────────────────────────────────────────────
  const handleHeartMouseDown = useCallback(
    (e: React.MouseEvent, note: HeartNote) => {
      // Only respond to primary button
      if (e.button !== 0) return;
      e.preventDefault();

      const [startPctX, startPctY] = note.position;

      dragStateRef.current = {
        noteId: note.id,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startPctX,
        startPctY,
        hasMoved: false,
        currentPctX: startPctX,
        currentPctY: startPctY,
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  // ── Click handler (only fires when not dragging) ─────────────────────────
  const handleHeartClick = useCallback(
    (noteId: string) => {
      // If a drag just finished, ignore the synthetic click
      if (dragStateRef.current?.hasMoved) return;

      if (activeNoteId === noteId) {
        setActiveNoteId(null);
        return;
      }

      const heartEl = heartRefs.current[noteId];
      const containerEl = containerRef.current;

      if (heartEl && containerEl) {
        const layout = computeCardLayout(heartEl, containerEl);
        setCardLayouts((prev) => ({ ...prev, [noteId]: layout }));
      }

      setActiveNoteId(noteId);
    },
    [activeNoteId]
  );

  // ── Touch support ────────────────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, note: HeartNote) => {
      const touch = e.touches[0];
      const [startPctX, startPctY] = note.position;

      dragStateRef.current = {
        noteId: note.id,
        startMouseX: touch.clientX,
        startMouseY: touch.clientY,
        startPctX,
        startPctY,
        hasMoved: false,
        currentPctX: startPctX,
        currentPctY: startPctY,
      };

      const onTouchMove = (ev: TouchEvent) => {
        const drag = dragStateRef.current;
        if (!drag || !containerRef.current) return;
        const t = ev.touches[0];
        const dx = t.clientX - drag.startMouseX;
        const dy = t.clientY - drag.startMouseY;

        if (!drag.hasMoved && Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;
        drag.hasMoved = true;
        ev.preventDefault();

        const containerRect = containerRef.current.getBoundingClientRect();
        const newPctX = ((t.clientX - containerRect.left) / containerRect.width) * 100;
        const newPctY = ((t.clientY - containerRect.top) / containerRect.height) * 100;
        const clampedX = Math.min(99, Math.max(1, newPctX));
        const clampedY = Math.min(99, Math.max(1, newPctY));

        drag.currentPctX = clampedX;
        drag.currentPctY = clampedY;

        setDragPositions((prev) => ({
          ...prev,
          [drag.noteId]: [clampedX, clampedY],
        }));
      };

      const onTouchEnd = () => {
        const drag = dragStateRef.current;
        if (!drag) return;

        if (drag.hasMoved) {
          updatePosition.mutate(
            { id: drag.noteId, newPosition: [drag.currentPctX, drag.currentPctY] },
            {
              onSuccess: () => {
                setDragPositions((prev) => {
                  const next = { ...prev };
                  delete next[drag.noteId];
                  return next;
                });
              },
            }
          );
          setActiveNoteId(null);
        } else {
          // Treat as click
          handleHeartClick(drag.noteId);
        }

        dragStateRef.current = null;
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      };

      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    },
    [handleHeartClick, updatePosition]
  );

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const isDraggingAny = dragStateRef.current !== null;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 480,
        background: "transparent",
        cursor: isDraggingAny ? "grabbing" : "default",
        userSelect: "none",
      }}
    >
      {notes.map((note) => {
        // Use optimistic drag position if available, otherwise use stored position
        const [x, y] = dragPositions[note.id] ?? note.position;
        const isActive = activeNoteId === note.id;
        const isDraggingThis = dragStateRef.current?.noteId === note.id && dragStateRef.current?.hasMoved;
        const layout = cardLayouts[note.id] ?? {
          translateX: 0,
          openUpward: false,
          openLeftward: false,
        };

        return (
          <div
            key={note.id}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: isDraggingThis ? 50 : isActive ? 40 : 1,
              transition: isDraggingThis ? "none" : "left 0.15s ease, top 0.15s ease",
            }}
          >
            {/* Heart button */}
            <button
              ref={(el) => {
                heartRefs.current[note.id] = el;
              }}
              onMouseDown={(e) => handleHeartMouseDown(e, note)}
              onClick={() => handleHeartClick(note.id)}
              onTouchStart={(e) => handleTouchStart(e, note)}
              className="relative group focus:outline-none"
              style={{ cursor: isDraggingThis ? "grabbing" : "grab" }}
              title={note.creator}
              aria-label={`Heart from ${note.creator}`}
            >
              <Heart
                size={HEART_SIZE}
                className={`
                  transition-transform duration-200
                  ${isActive
                    ? "fill-rose-600 text-rose-600 scale-125"
                    : isDraggingThis
                    ? "fill-rose-500 text-rose-500 scale-110 drop-shadow-lg"
                    : "fill-rose-400 text-rose-400 hover:fill-rose-500 hover:text-rose-500 hover:scale-110 animate-heart-float"
                  }
                `}
              />
            </button>

            {/* Note card */}
            {isActive && !isDraggingThis && (
              <NoteCard
                note={note}
                onClose={() => setActiveNoteId(null)}
                translateX={layout.translateX}
                openUpward={layout.openUpward}
                openLeftward={layout.openLeftward}
                heartSize={HEART_SIZE}
              />
            )}
          </div>
        );
      })}

      {notes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-serif text-rose-300 italic text-lg">
            No hearts yet — be the first to leave one 💕
          </p>
        </div>
      )}
    </div>
  );
}
