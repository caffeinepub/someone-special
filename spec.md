# Specification

## Summary
**Goal:** Fix the regression introduced in Version 7 that caused all heart notes to disappear from the HeartCanvas.

**Planned changes:**
- Investigate and fix the frontend data-fetching logic (useQueries hook) to correctly retrieve heart notes from the backend and render them on the canvas.
- Verify the backend CRUD functions (list, add, get, edit, delete) are working correctly and returning stored heart note data.
- Ensure backend stable state is intact and no data was lost due to the Version 7 upgrade; restore or migrate data if necessary.

**User-visible outcome:** All previously created heart notes reappear on the HeartCanvas after page load, persist across refreshes, and newly added hearts appear immediately after creation.
