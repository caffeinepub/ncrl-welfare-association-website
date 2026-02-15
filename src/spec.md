# Specification

## Summary
**Goal:** Allow admins to edit/update existing notices and events (not just create/delete), end-to-end across backend APIs, frontend data hooks, and the admin UI.

**Planned changes:**
- Add admin-gated backend update methods to modify an existing Notice by id (category, title, content, date) and an existing Event by id (eventType, title, description, date, isPast), with errors for missing ids consistent with current delete behavior.
- Add React Query mutation hooks (`useUpdateNotice`, `useUpdateEvent`) and ensure query invalidation refreshes the notices list and both upcoming/past event lists after create/update/delete.
- Add an Edit action in the admin notices/events tables that opens a pre-filled dialog, saves via the update mutations, shows success/error toasts, and updates the displayed lists accordingly (English UI text).

**User-visible outcome:** Admins can click Edit on a notice or event, adjust fields in a dialog, save changes, and immediately see updated notices and events (including moving events between Upcoming and Past when `isPast` changes).
