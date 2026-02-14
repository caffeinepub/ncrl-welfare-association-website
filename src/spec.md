# Specification

## Summary
**Goal:** Ensure the Gallery never appears empty on fresh deploy/upgrade, persist gallery data across upgrades, and unblock admin access by making the user’s Principal ID visible and providing a safe admin bootstrap path.

**Planned changes:**
- Backend: On deploy/upgrade, automatically seed the gallery with a small fixed set of placeholder Gallery items when the gallery is empty (idempotent; items deletable via existing admin delete).
- Backend: Fix gallery state persistence across canister upgrades, including preserving items and maintaining the next ID allocator value; add a migration file only if required.
- Frontend: When a logged-in user is denied admin access, display their Internet Identity Principal ID in a copyable format (English text only; no changes to restricted frontend paths).
- Backend: Add a documented, deterministic mechanism to bootstrap/restore admin privileges when no working admin is available.

**User-visible outcome:** Visitors see placeholder items instead of an empty Gallery on fresh deploys, gallery content remains after upgrades, non-admin users can copy their Principal ID from the Access Denied screen, and admin access can be safely recovered to regain access to the Admin dashboard.
