import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-control font-semibold transition-all disabled:pointer-events-none disabled:opacity-40 data-[loading]:opacity-100 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/30 cursor-pointer',
  {
    variants: {
      variant: {
        // DEFAULT is the app-wide high-emphasis button. Keep it visually identical
        // to `primary` so existing <Button> / variant="default" call sites do not
        // keep the old bg-secondary button around.
        default:
          'text-background',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active transition-colors duration-150',
        // OUTLINE is the app-wide bordered/standalone action. Keep it visually
        // identical to `secondary`; the ring/fill/press model lives in style.css.
        outline:
          'bg-transparent text-foreground',
        // SECONDARY = ported verbatim from the tuned bench: transparent at rest
        // with a 1px inset ring; hover fills + ring drops; press scales. ALL of
        // that lives on the ::before shell in style.css (data-variant="secondary")
        // — the old bg-accent/border library look is intentionally cut.
        secondary: 'bg-transparent text-foreground',
        // GHOST = ported verbatim: no chrome at rest; hover fills gray-3, press
        // scales. Interaction on ::before (style.css, data-variant="ghost").
        ghost: 'text-foreground',
        // QUIET = in-field state/peek toggle (password / secret reveal): no chrome
        // at rest and none on hover — the glyph itself shifts muted→foreground, so
        // the field stays one clean rectangle instead of sprouting a second hover
        // chip. Ghost earns its chip for discrete actions (Clear); quiet is for
        // low-stakes peeks. No ::before shell (it's keyed off data-variant="ghost").
        quiet: 'text-muted-foreground hover:text-foreground',
        // LINK variants mirror the contract bench:
        // - link: fade-in underline on hover
        // - link-static: underline always visible, only color brightens
        // - link-draw: underline draws left-to-right, reserved for rare landing CTAs
        link:
          'relative gap-1 text-muted-foreground transition-colors hover:text-foreground',
        'link-static':
          'gap-1 text-muted-foreground underline underline-offset-4 decoration-muted-foreground transition-colors hover:text-foreground hover:decoration-foreground',
        'link-draw':
          'relative gap-1 text-muted-foreground hover:text-foreground',
        // PRIMARY = high-emphasis CHARCOAL CTA (the tuned star). Fill + ALL
        // interaction (hover lighten, press scale / block color-press, loading
        // hold) live on a ::before shell in style.css, keyed off
        // data-variant="primary", so the press-scale never moves the label.
        primary: 'text-background',
        // BRAND = the scheme brand color. This used to be `primary`; it's now an
        // explicit variant for the rare brand CTA (e.g. chat Send) per the
        // brand-scarcity rule. Fill + hover/press live on a ::before shell in
        // style.css (data-variant="brand"), mirroring primary/ghost, so the press
        // scales the fill while the glyph stays put.
        brand: 'text-brand-foreground',
      },
      size: {
        default: 'h-11 px-5 py-2 has-[>svg]:px-4',
        sm: 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-11',
        'icon-sm': 'size-9',
        // ICON-XS = the 24px plate for icon actions INSIDE a dense card (an annotation
        // card's edit / withdraw / resolve). Not a page control: the 44px touch target
        // (§7.14) stays the rule everywhere else. The plate is 24px with the chip chamfer
        // and the 16px glyph (the smallest rung of the icon ladder, §6), and the click area
        // is exactly the plate (no invisible margin).
        'icon-xs': 'size-6 rounded-sm',
        'icon-lg': 'size-12',
        // TEXT = inline/compact affordance. Uses the base text-control (14px) type —
        // the standard button text size — so it reads as real clickable text, with a
        // 12px icon (size-3): the text-scale rung of the icon ladder (16 control / 14
        // in-field / 12 text & badge), so the glyph sits one notch under the cap height
        // and reads quietly instead of as a chunky control icon. rounded-sm (6px) is
        // the compact-chip radius (NOT a control's rounded-md, NOT an invented
        // rounded-xs). Horizontal padding stays tight (px-1.5); vertical is py-[0.3125rem] (≈5px) —
        // a hair more than py-1 so the ghost hover/press chip breathes ever so slightly
        // above/below the text without ballooning into a tall pill. leading-none is
        // REQUIRED: text-control otherwise drags in a 20px line-height that inflates
        // the box and makes the chip look tall — and left the height context-dependent
        // (a crumb inherited a tight line-height while a bare TextButton did not, so
        // they rendered different heights). Pinning the line-height to the text height
        // makes the box stable everywhere. Pairs with variant="ghost" to get "clickable
        // text with a hover chip" (see <TextButton>); the ghost ::before hover/press
        // chrome from style.css applies unchanged.
        text: 'h-auto gap-1.5 rounded-sm px-1.5 py-[0.3125rem] leading-none [&_svg:not([class*=size-])]:size-3',
      },
      // SHAPE is orthogonal to size: size sets the box (height + padding), shape
      // only overrides the corner. `circle` turns any size into a pill/round by
      // forcing rounded-full over the size's rounded-md — the house pattern for a
      // round icon button (paired with size="icon"/"icon-sm") was to hand-write
      // `class="rounded-full"` on every call site; this makes it a first-class prop
      // so the corner is owned, not re-typed. Because buttonClass runs through cn()
      // (tailwind-merge), the later rounded-full wins over any earlier rounded-md.
      shape: {
        default: '',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default',
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>

// Single source of truth for the variant/size axes. cva 0.7.1 does not expose
// its `.config` at runtime, so the keys are mirrored here next to the cva call
// (keep them in sync). Consumed by the showcase specs and the dev component wall
// so neither hand-maintains its own list.
export const buttonVariantKeys = [
  'default',
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
  'link-static',
  'link-draw',
  'brand',
] as const satisfies readonly NonNullable<ButtonVariants['variant']>[]

export const buttonSizeKeys = [
  'default',
  'sm',
  'lg',
  'icon',
  'icon-sm',
  'icon-xs',
  'icon-lg',
  'text',
] as const satisfies readonly NonNullable<ButtonVariants['size']>[]

export const buttonShapeKeys = [
  'default',
  'circle',
] as const satisfies readonly NonNullable<ButtonVariants['shape']>[]
