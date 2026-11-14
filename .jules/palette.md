## 2025-05-10 - Express Landing Page Color Contrast and Semantic Landmarks
**Learning:** Hardcoded text colors (#333, #555, #759) directly over dark/gradient backgrounds fail WCAG AA contrast standards, and justified body text reduces legibility for users with dyslexia.
**Action:** Wrap landing page content in semantic `<main>`, place text on clean high-contrast card containers with left-aligned body text, and include explicit meta descriptions.

## 2026-10-30 - Express Landing Page Health Action Button & Animated Status Dot
**Learning:** Minimal bot landing pages often lack direct navigation to active API monitoring endpoints like `/health`. Adding an explicit `:focus-visible` styled action button with `aria-label` along with a subtle CSS pulse animation on the status indicator improves navigation and provides visual confirmation of live operation.
**Action:** Always complement static landing pages with accessible focus-styled action buttons to health endpoints and animated status dots.
