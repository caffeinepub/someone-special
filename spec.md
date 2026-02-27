# Specification

## Summary
**Goal:** Allow users to drag and reposition heart icons anywhere on the HeartCanvas, with positions persisted to the backend.

**Planned changes:**
- Add drag-and-drop interaction to each heart on HeartCanvas so it follows the cursor while dragging and drops to a new position
- Distinguish between a click (opens NoteCard popup) and a drag (repositions heart) so existing popup behavior is preserved
- Add an `updatePosition(id, x, y)` function to the backend HeartNote actor that updates a note's stored x/y coordinates (as percentages)
- Add a `useUpdateHeartPosition` mutation hook in useQueries.ts that calls the backend function and invalidates the heartNotes query cache on success

**User-visible outcome:** Users can click and drag any heart on the canvas to move it to their desired location; the new position is saved and persists after page refresh, while all existing functionality (add, edit, delete, NoteCard popup) remains unchanged.
