# Implementation Notes - V3 Updates

## 1. Light Mode Enhancements (Blueprint Style)
**Visual Pop:** Light mode previously looked "washed out" because neon colors don't contrast well with white.
**Changes:**
- Switched Light Mode variables to use **Deep Pigmented Colors** (Royal Blue instead of Neon Cyan, Deep Purple instead of Lavender).
- Increased **Border Thickness** (2px vs 1px) in Light Mode to define shapes clearly.
- Added **Drop Shadows** (box-shadow) to nodes in Light Mode to simulate depth (Material Design/Neumorphism style).
- SVG Flow lines now use darker, opaque colors (`#0369a1`) in Light Mode so they are clearly visible against the white background.

## 2. Detailed Data Flow (Brainstorming Style)
**Design:** Abandoned the simple vertical list for the "Data Flow Logic" view.
**New Layout:** **"Bento Grid" / Masonry Layout**. 
- The Data Flow Logic is now a grid of variable-sized interactive cards (`bento-card`).
- Important steps span 2 columns (`span-2`).
**Content:** Instructed Gemini to generate "Technical Specs", "Latency Constraints", and "Protocol Details" inside these cards, making them look like dense brainstorming notes or system specification cards.

## 3. Classic Mode Richness
**Change:** The Neon Grid style prompts have been updated.
- Now, every node is required to have a **subtitle** and a **bullet list of technical specs** (e.g., "JSON", "REST", "Async") visible directly on the card.
- This prevents empty "box-only" diagrams and adds immediate value.

## 4. PNG Export Fix (Layering)
**Issue:** `html2canvas` handles transparency poorly, often stacking layers on top of each other (e.g., text on top of lines on top of background) in a way that looks broken.
**Fix:** 
- In `LivePreview.tsx`, we now detect the current theme (`--bg-main`).
- We force pass this specific hex code (e.g., `#ffffff` or `#09090b`) as the `backgroundColor` option to `html2canvas`.
- This forces the library to "flatten" the image onto an opaque canvas, solving the layering artifact issue.

## 5. Background Cleanup
**Change:** Removed all CSS grid/dot patterns from the generated HTML background.
- The background is now a solid, clean color to allow the detailed components and flow lines to stand out without visual noise.
