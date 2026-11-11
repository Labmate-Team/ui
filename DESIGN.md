# Design System

## Overview

LabMate: a low-poly, two-ink language for people and agents working on one project. Every shape is straight edges and flat planes — corners are chamfered (top-left and bottom-right), circles become octagons, and there are no drop shadows or gradient washes. Two inks build the structure; colour appears only when it means something. `AGENTS.md` is the contract; this file is the quick visual summary.

## Colors

- **Ink scale** (structure): Ink `#0A0A0A` · Graphite `#262626` · Slate `#474747` · Steel `#6B6B6B` · Ash `#A3A3A3` · Fog `#D4D4D4` · Mist `#EDEDED` · Paper `#FFFFFF`, plus wells `#F4F4F4` / `#E3E3E3`.
- **Pulse** (lime `#C8F135`): alive — running, current, live. The brand (`--brand`, `variant="brand"`), confirmations, the Switch "on" track.
- **Spark** (coral `#FF6B4A`): a human is needed. Destructive actions, errors, waiting-on-you.
- **Accents are fills, never text on Paper.** Ink text sits on top (`--on-accent`). A card holds at most one Pulse and one Spark element.
- **Status** (`--status-*`, always with a glyph): not started (wells) · ongoing (Pulse) ▶ · paused (amber) ❚❚ · completed (blue) ✓ · failed (Spark) ✕ · halted (Graphite, Paper glyph) ■.
- **Selection** is Ink (Checkbox / Radio / Slider / Progress). Blue is reserved for *completed*.
- **Dark mode** is derived: Ink and Paper swap surface roles; accents and status planes keep their values and Ink text.
- There is one palette — no `data-color-scheme` variants.

## Typography

- **Space Grotesk** for the interface; **JetBrains Mono** for IDs (`LAB-nnn`), metrics, labels and logs. Hosts load the fonts; the library names the families.
- Scale: display 56 · H1 32 (`text-heading`) · H2 20 (`text-title`) · body 15 / lh 1.55 (`text-body`) · control 15 · label 14 · caption 12.
- Mono roles: `text-label-mono` (11px, 500, UPPERCASE, +8%) and `text-data` (12px, +6%, tabular).
- Weights: 600 titles · 500 labels / buttons / chips · 400 body.

## Elevation

Flat, always. Floating menus, popovers, dialogs and panels are separated by a **1.5px Ink border** (and the scrim, for modals) — never by a shadow. The shadow tokens resolve to `none`; `--shadow-hairline` survives only as the inset frame of secondary buttons.

## Shape & size

- Chamfers: chip 4 · control 8 · card 12 · panel 16 (`rounded-sm` / `rounded-md` / `rounded-xl` / `rounded-panel`).
- Base stroke 1.5px (`--stroke`), base grid 8px, permitted angles 30° / 45° / 60°.
- Controls are 44px tall by default (`sm` 36, `lg` 48); icon buttons 44 × 44 with an `aria-label`.

## Components

> The per-component notes below predate the LabMate pass in places (radii, heights, colours). Where they disagree with the sections above or with `AGENTS.md`, those win.

### Base Atoms

- **Avatars**: `MateAvatar` — a human is a Paper octagon with an Ink outline and one Ink corner facet at the bottom-right; an agent is an Ink hexagon whose top-left plane is Pulse (LabMate §5). Never a circle; generic `Avatar` (`rounded-full`) renders as an octagon.
- **Badges**: 4px radius (`rounded-sm`). Default uses `secondary/secondary-foreground` with `border-border`. Secondary uses `accent/foreground`. Destructive, success, and warning map to global status tokens. Outline uses `background/border/foreground`. Supports `size="sm"` (`text-[11px] px-2`) alongside default.
- **BadgeCount**: Numeric counter, `h-[18px] min-w-[18px] px-1`, `text-[11px]` mono; chamfered like a chip (4px), never a circle. Values above 99 display as "99+".
- **Buttons**:
  - Default / Primary: 8px radius, charcoal fill (`--btn-primary`) with hover/press ramps on the pseudo-element shell. This is the standard high-emphasis action; `default` and `primary` are visual aliases.
  - Outline / Secondary: 8px radius, transparent rest state with a 1px inset ring, gray hover fill, and shell-only press scale. `outline` and `secondary` are visual aliases.
  - Ghost: No chrome at rest; soft gray hover fill. Use for toolbar/icon actions that should not carry standalone affordance. Two resting marks still apply: an icon-only ghost rests on a Mist plate, a text ghost is underlined (§7.13). `bare` drops both, for cells of a framed group (GraphZoom) whose frame already reads as the control.
  - Destructive: Text/icon turns destructive on hover with a light destructive hover fill; avoid solid red buttons for normal destructive actions.
  - Link: Muted text by default, foreground on hover, with underline feedback. Avoid brand purple for ordinary text links.
  - Grouped (`ButtonGroup`): Unified outer border (`border-border`, 8px radius). Internal items divided by `border-r` or `border-b`, no individual borders or radiuses.
  - Brand: Use `variant="brand"` only for rare brand-colored actions (for example the chat Send button), following brand scarcity.
- **In-capsule icon affordance** (the X on a tag/chip, a clear button inside a pill): a small icon button (`size-4`, `size-3` lucide glyph) that **follows the shape of its host container**. This is a deliberate split from the standalone ghost icon Button:
  - Inside a **rounded-rectangle** surface (toolbar, input row, card) the hover chip is a **rounded rectangle** (matches the host's `rounded-md`).
  - Inside a chip, the hover chip echoes the chip's chamfer (4px) — there are no pills or circles in this language.
  - **Colour is never hand-rolled.** The hover fill deepens along the *same ramp the host capsule is built from*: a gray chip (`--accent-gray-soft-active`) deepens to that ramp's next stop (`--accent-gray-border`). Do not borrow the standalone ghost `--btn-ghost-hover` here — it is tuned for a white page and disappears on an already-tinted chip. Icon is `muted-foreground` at rest, `foreground` on hover/focus.
- **Inputs**: Flat. Ink frame at rest (1.5px), pure `background` fill, 8px chamfer. Text sizes via the `size` prop. Focus: a 2px Ink outline with a 2px gap (visible on Paper and on Pulse), the same for every focusable control; errors turn the edge Spark.
- **Checkboxes/Radios**: Flat, soft background (`bg-background`). 1px `border`. The checked state marker (tick/dot) is `foreground` (charcoal), avoiding brand colors.
- **Separators**: Uniformly use the 1px `border` color. Do not use padding/margins that detach them from the container edges (e.g., use full width `border-b` in menus instead of `<Separator mx-1>`).
- **Skeleton**: Flat `bg-muted` block, `rounded-lg`. The loading shimmer is a **single synchronized seam** across a whole cluster (avatar + lines read as one loading surface, never independent per-block pulses) — the "one paper, many windows" model. Implementation lives entirely in `style.css` on `[data-slot="skeleton"]`: a two-close-gray gradient (`--muted` → `--skeleton-mid` → `--muted`) on a **viewport-anchored** sheet (`background-attachment: fixed`), tiled at `--skeleton-tile` (640px) and repeated, animated by exactly one tile width so it loops seamlessly. Because every block samples the *same* viewport-anchored sheet by its own position, the seam stays in sync without any wrapper component. Tile narrower than a typical row → a fresh seam revisits each cluster every cycle (short gap, not a viewport-wide wait). Tune speed via the `2s` duration, gap via `--skeleton-tile`. Reduced-motion freezes to flat `--muted`. **Two deliberate trade-offs of the `fixed` technique**: (1) iOS Safari ignores `background-attachment: fixed` and degrades to element-anchored — the shimmer still animates but loses cross-block sync there; (2) a `transform`/`filter`/`will-change` ancestor re-anchors the `fixed` sheet to that box instead of the viewport (sync holds within the subtree, but tile size/gap is then relative to that box). Both are acceptable for a Chromium desktop-first product; **do not "fix" this into a per-element gradient** — that reintroduces the independent-pulse look this avoids.

### Containers & Layouts

- **Cards**: Paper with a Fog border, 12px chamfer, no shadow (§7.6). Selected: 2px Ink border and a Pulse corner triangle at the top-left.
- **Alerts**: Banners (§7.8). `confirm` is a Pulse banner with a 1.5px Ink border; `destructive` is a Spark banner with Ink text. Accents are fills, never text on Paper.
- **Collapsible**: Flat sub-panels. `bg-background` inside a `border-border` container, items divided by `border-b` (no bottom border on last child). Uses `font-mono` for code-related items.
- **Dropdowns / Popovers / Comboboxes**:
  - `bg-background` with a 1.5px Ink border, no shadow.
  - 8px outer radius.
  - Items use 4px inner radius and `text-sm font-normal text-foreground`.
  - Hover states use `bg-accent` and `text-foreground` (no brand color tints).
  - Group separators must be full-bleed `border-b`.
- **Breadcrumb**: Minimalist. 14px icons, 4px-6px gaps. Active page is `text-foreground font-normal`, inactive is `text-muted-foreground`.
- **Sidebar**:
  - Container uses `primary-foreground` background.
  - Active items use a `sidebar-accent` background and `font-medium` weight (no colored indicator bar or ring).

### Items

- Global: `rounded-lg` (8px), `p-4`, `shadow-none`, `gap-4`.
- Variants:
  - Default: `bg-background`, no border.
  - Outline: `bg-background` + `border border-border`.
  - Muted: `bg-accent`, no border.

### Pagination

- Default page buttons: `bg-background border border-border text-foreground`, `rounded-lg`, `size-9`.
- Active/current page: `bg-foreground text-background border-foreground` (black bg, white text — no brand purple).
- Hover: `hover:bg-accent`.
- Disabled: `opacity-50 text-muted-foreground`.
- Previous/Next: ghost style, transparent bg, hover `bg-accent`.

### Complex / Domain Specific

- **GhostGraph**: the loading graph — Start → task → goal → milestone → project goal in their not-started planes (Paper / Well / Well-deep, Fog edges; Start keeps Ink + Pulse) on one Ash rail, drawn from `graph-node/geometry.ts`. `animated` runs the tracing light (R §10.53: a 56px Pulse bead with an 18px bloom, 3.4s cycle) and each node flashes to Pulse as it passes; `animated: false` is the still graph for a skeleton. Reduced motion shows the still graph. Always on the Mist canvas; the caller gives the status text (the svg is `aria-hidden`). `orientation="vertical"` stands the same five nodes on a vertical rail at their sheet sizes, Start at the bottom and the project goal at the top (the panel's level sheets read bottom to top with labels on the left); `GHOST_GRAPH_VERTICAL_NODES` gives each node's centre and left edge. In both orientations the rail runs down the middle of the component's own box, and each node's flash is timed from its place on the rail (one formula, `lightDelay` in `ghost-graph/nodes.ts`).
- **Sonner (Toast Notifications)**: Paper with a 1.5px Ink frame, no shadow, panel chamfer. Success is a Pulse banner, error a Spark banner, both with Ink text and icon. States: default, loading, success, info, warning, error.
- **Table**: Wrapped in a container with `border border-border rounded-sm` (6px). Header row height 41px with `py-[10px]`, data rows 38px with `py-[8.5px]`. Footer uses `bg-muted/50`. Empty state centers an icon + `text-muted-foreground` message in `h-[204px]`. Caption is centered `text-sm text-muted-foreground`.
- **TagsInput**: Flat design. `rounded-lg` (no shadow). Focus state uses `ring-ring/20 ring-2` (not `ring-[3px]`).
- **Chat Input (Main Area)**:
  - Flat container (`shadow-none`), `border-border`, 10px radius.
  - Divided horizontally by top/bottom 1px borders (`border-t`, `border-b`).
  - Send button uniquely retains `bg-primary` for high conversion focus.
  - Model selector (Badge style) floats inside the top border area, using `bg-accent` or `bg-background` depending on state.
- **OTP Input (PinInput)**: Flat group built on reka-ui `PinInput`. Each cell is `size-9 bg-background text-sm shadow-none`. The first cell gets `border border-border rounded-l-lg`, middle cells use `border-y border-r border-border` (no left border to avoid doubling), and the last cell adds `rounded-r-lg`. Focus state applies `border-2 border-ring` (dark ring, not primary purple). Supports an optional `PinInputSeparator` between groups.

## AI Image Generation & Component Reuse Rules

To ensure visual consistency when generating images or extrapolating designs via AI based on this system, strictly adhere to the following composition rules:

1. **The "Flat Atom" Law:** If it's a basic interactive element (button, badge, input, toggle, checkbox), it **cannot** have a shadow. It must rely on tokenized borders and background contrast (`--background` vs `--accent` vs `--foreground`).
2. **The "Menu Underline" Law:** Whenever rendering a list of items inside a container (Dropdowns, Comboboxes, Sidebar Sub-menus, Collapsibles), items must be divided by a full-width, 1px horizontal line (`border-b`), terminating cleanly on the last item. Do not leave floating separators with margins.
3. **The "Monochrome Hover" Law:** Focus and hover states for secondary items must use `bg-accent` and `text-foreground`. Never apply the brand purple (`#8b56e3`) as a background highlight for menus.
4. **No elevation:** There are no shadows at any level (LabMate §2.3). A standalone focal piece (login, central card) is set apart by a 1.5px Ink border and space, never by a shadow.
5. **The "Brand Scarcity" Law:** The scheme brand color (`--brand` / `--primary`) is the most expensive pixel on the screen. It can only be used for:
   - The absolute primary completion action on a screen (e.g., the Chat "Send" button).
   - Micro-indicators of "current active state" (e.g., a 2px vertical bar next to an active sidebar menu item, or a 5px status dot).

## Do's and Don'ts

- **Do** use `bg-secondary` with `border-border` for standard filled controls; reserve `bg-primary` / `bg-brand` for explicit brand actions and high-emphasis CTAs.
- **Don't** use `shadow-sm` on buttons, inputs, or alerts. Keep atomic components strictly flat.
- **Don't** use shadows anywhere — not even on focal cards; a 1.5px Ink border carries the separation.
- **Don't** use colored backgrounds for Alert or Badge variants (like `bg-red-50`). Keep them white and use text/icon color to convey meaning (or solid red for destructive badges).
- **Do** maintain the 1px `#e5e5e5` (`--border`) across all structural dividing lines, ensuring they connect edge-to-edge (no floating separators).
- **Don't** use primary colors for hover or active states in standard dropdowns and menus; stick to `bg-accent` and `text-foreground`.
