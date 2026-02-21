---
provider: "gemini"
agent_role: "designer"
model: "gemini-3-pro-preview"
prompt_id: "bc3ed37b"
timestamp: "2026-02-21T07:07:44.417Z"
---

# Visual Design Brainstorm: Menu Grass Field ("메뉴 잔디밭")

This proposal outlines a "Digital Garden" concept where nutrition data is visualized as a growing collection of Minecraft-style voxel blocks. The design blends the retro charm of pixel art with the app's existing clean, modern Korean UI (Toss/Baemin style).

## 1. Core Concept: The Isometric Garden
Instead of a flat list, the "Field" is a scrollable, isometric grid. It feels like a mini-world.
*   **Metaphor:** "Planting" a healthy meal.
*   **Vibe:** Stardew Valley meets Minimalist Dashboard.
*   **Blending Aesthetics:** Keep the outer UI (header, bottom sheet, typography) vector-based and clean (Apple/Toss style). Keep the *inner* content (grass, cats) strictly pixel-art. This contrast is trendy and visually separating.

## 2. Layout Strategy (Mobile First: 360px ~ 430px)
To achieve the Minecraft look without WebGL, we use **CSS Isometric Projection**.

*   **Grid System:** A CSS Grid or Flexbox container rotated to simulate 2.5D.
*   **Columns:** 3 columns on mobile. This allows blocks to be large enough to see the cat details (approx 100px-120px wide).
*   **Scroll:** Infinite vertical scroll. Newest meals are "planted" at the top (or bottom, depending on metaphor).

### Visual Structure
```text
[   Sticky Header (Clean UI)   ]
--------------------------------
      / \   / \   / \
     |Cat| |Cat| |Cat|  <-- Row 1 (Newest)
      \ /   \ /   \ /
    / \   / \   / \
   |Cat| |Cat| |   |    <-- Row 2
    \ /   \ /   \ /
--------------------------------
[ Fixed Bottom Nav (Clean UI) ]
```

## 3. Visual Specifications

### A. The Minecraft Grass Block (CSS-Only)
Instead of a true 3D cube which can be buggy with z-index on mobile lists, use a **2D graphic composed of CSS shapes** or a pre-rendered SVG that *looks* 3D.
*   **Recommendation:** Use CSS `::before` and `::after` on a `div` to create the top, left, and right faces of the block.
*   **Dimensions:** 80px x 80px (Total bounding box).
*   **Color Palette (Calorie Heatmap):**
    *   **Standard (Healthy/Avg):** `Top: #5DBC65`, `Side: #4CA854`, `Dark Side: #3B8C40` (Classic Grass)
    *   **Low Cal (Light):** `Top: #8CE095` (Fresh sprout look)
    *   **High Cal (Heavy):** `Top: #E0C068` (Dryer grass or "Hay" block style)

### B. The Pixel Cats (SVG)
Use SVGs optimized for pixel art (using `shape-rendering: crisp-edges`). This is lighter than images and allows color recoloring via CSS classes.
*   **Resolution:** Design on a 16x16 or 32x32 grid.
*   **Brand Variations:**
    *   **Subway:** Green Cat (Classic Subway Green) with a tiny yellow sub hat.
    *   **Salady:** Orange Tabby (Salady Orange accent).
    *   **Poke:** Blue/Pink Cat (Fresh seafood vibe).

### C. The Speech Bubble (Interaction)
When tapped, the bubble should **NOT** be pixel art. It should be the clean app style to ensure text readability.
*   **Style:** White background, soft shadow (`box-shadow: 0 4px 12px rgba(0,0,0,0.1)`), rounded corners (16px), pretending to be a modern UI tooltip floating over a retro game.
*   **Pointer:** A simple triangle pointing down to the cat.

## 4. Implementation Details (Code Examples)

### The Isometric Block (Pure CSS)
This method creates a performant CSS block without complex 3D transforms that break scrolling.

```css
/* Container for the grid */
.field-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 40px 10px;
  /* Perspective trick could be applied here, but flat isometric icons are safer */
}

/* The Block Component */
.iso-block {
  position: relative;
  width: 80px;
  height: 80px; /* Adjust based on aspect ratio */
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy */
  z-index: 1;
}

/* Click/Active State */
.iso-block:active {
  transform: scale(0.95) translateY(2px);
}

/* The Cat - Positioned on top */
.pixel-cat {
  position: absolute;
  top: -25px; /* Stand on top of the block */
  left: 50%;
  transform: translateX(-50%);
  width: 48px; /* Cat size */
  image-rendering: pixelated; /* Critical for pixel art look */
  z-index: 10;
  animation: idle-bounce 2s infinite ease-in-out;
}

/* Simple keyframe for idle animation */
@keyframes idle-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}
```

### SVG Pixel Cat Example
A raw SVG string allows you to inline it and change colors dynamically.
```xml
<!-- Simple 8-bit style cat head -->
<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Main Fur Color (Dynamic Class) -->
  <path class="cat-fur" d="M2 10v4h12v-4h-2v-2h-1v-2h-1v-1h-4v1h-1v2h-1v2z" fill="#333" />
  <!-- Eyes -->
  <rect x="5" y="8" width="2" height="2" fill="#fff"/>
  <rect x="9" y="8" width="2" height="2" fill="#fff"/>
  <rect x="6" y="9" width="1" height="1" fill="#000"/>
  <rect x="10" y="9" width="1" height="1" fill="#000"/>
</svg>
```

## 5. Animations & Interaction

### Planting Animation
When a user adds a menu:
1.  **Fall In:** The block falls from the top of the screen (`transform: translateY(-200px)` to `0`).
2.  **Squash & Stretch:** Upon landing, the block compresses slightly (`scaleY(0.8)`) then springs back (`scaleY(1.05)` -> `1`).
3.  **Dust Effect:** A small CSS particle burst (3-4 small squares) fades out at the base.

### Tap Interaction
*   **State:** The tapped block gets `z-index: 100` temporarily.
*   **Feedback:** A clean "pop" sound effect (optional) and the Speech Bubble fades in with `opacity: 0` -> `1` and `transform: translateY(10px)` -> `0`.

## 6. Empty State
If the user has no entries:
*   **Visual:** A single "Dirt Block" (tilled soil) in the center with a "Ghost Cat" (semi-transparent).
*   **CTA:** A floating pixel-art arrow pointing to the block saying "첫 메뉴를 심어보세요!" (Plant your first menu!).
*   **Background:** A faint grid pattern to suggest where future blocks will go.

## 7. Integration Plan
1.  **Create Assets:** Generate 3 SVG cats (Subway, Salady, Poke) and 1 isometric grass block (SVG or CSS).
2.  **Build Component:** `MenuBlock.tsx` (takes `brand`, `calories`, `menuName` as props).
3.  **Build Layout:** `GrassField.tsx` (Grid container).
4.  **Connect Data:** Map the existing user history to the blocks.

This approach honors the "Toss" aesthetic by keeping the interactive layer clean and high-fidelity, while the "Content" layer brings the fun, gamified "Minecraft" element.