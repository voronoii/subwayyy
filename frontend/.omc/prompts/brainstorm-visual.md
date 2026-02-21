# Visual Design Brainstorm: Minecraft-style Grass Field for Nutrition App

Design a visual concept for a "메뉴 잔디밭" (Menu Grass Field) page in a Korean mobile nutrition calculator app.

## Context
- App: subwayyy.kr — franchise nutrition calculator (Subway, Salady, Poke All Day)
- Users: Korean 20-30대 dieters
- Current design: Clean, minimal, mobile-first (Toss/Baemin style, green accent #34C759)
- Tech: Next.js, pure CSS (no Tailwind, no UI libs)

## The Feature
When users calculate their meal's nutrition, they can "plant" it as a grass block on a shared field. Each planted menu appears as a Minecraft-style grass block with a pixel cat on top. Tapping the cat reveals the menu combination.

## Design Requirements
1. The grass field page layout — how to arrange blocks on mobile (430px max)?
2. Minecraft grass block visual — CSS-only pixel art or canvas? Color variations by calorie intensity?
3. Pixel cat designs — different colors for each brand. How to render them? CSS pixel art? SVG? Emoji?
4. Speech bubble interaction — tap cat → bubble with menu names + calories
5. Planting animation — what happens when you "plant" a new menu?
6. Empty state — what does the field look like when there are few entries?
7. How to blend Minecraft pixel aesthetic with the existing clean/minimal design without clashing?

Give concrete visual specifications:
- Colors, sizes, spacing
- Animation descriptions
- Layout approach (CSS Grid? Flexbox? Canvas?)
- How to make pixel art cats in CSS/SVG (provide example code if possible)

Focus on mobile-first (430px width). The implementation should use pure CSS + minimal JS (no heavy game engines).
