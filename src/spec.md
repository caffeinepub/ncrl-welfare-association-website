# Specification

## Summary
**Goal:** Enable the provided Internet Identity Principal to access the Admin Dashboard and allow admins to upload local image files when creating Gallery items.

**Planned changes:**
- Grant admin permissions to Internet Identity Principal `bivov-zoivv-elizs-vxwob-drkj7-3idkg-ay4cf-tugyq-vy2rd-oretd-vae` so they can manage Notices, Events, and Gallery items without authorization errors.
- Update the Admin Dashboard Gallery management form to support selecting a local image file, converting it to a Data URL, and storing it in the existing `imageUrl` field when adding a gallery item.
- Add basic client-side validation for uploaded images (image type and reasonable size limit) with clear English error messages.

**User-visible outcome:** The specified Principal can open `/admin` and manage Notices/Events/Gallery items, and admins can upload an image file for new Gallery items without pasting an external URL, with validation feedback when files are invalid.
