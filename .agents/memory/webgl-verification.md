---
name: WebGL verification
description: Distinguishing capture-browser graphics limitations from engine failures.
---

Do not conclude that the 3D engine is broken solely because the standard screenshot browser cannot create a WebGL context.

**Why:** The screenshot environment failed to create WebGL 2 while a Chromium session with software WebGL rendered the same scene and passed object-control checks.

**How to apply:** Verify the actual scene in a browser with working WebGL, and separately verify that unsupported browsers receive an explicit compatibility message rather than an uncaught renderer error.
