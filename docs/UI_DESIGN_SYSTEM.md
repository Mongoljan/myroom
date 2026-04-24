# MyRoom UI Design System

Customer-facing booking site. This is an independent design system from `Hotel_front`.

Authoritative tokens live in [src/styles/design-tokens.css](../src/styles/design-tokens.css) and are exposed through `tailwind.config.ts`.

---

## Brand

- **Primary**: Teal (`--color-primary-600 = #0d9488` for CTAs; `--color-primary-500 = #14b8a6` for accents).
- Neutral gray scale, semantic success/warning/error already defined in tokens.
- Use semantic Tailwind classes (`bg-primary`, `text-foreground`, `bg-muted`, `text-muted-foreground`) — never hardcode hex or raw `gray-*` shades for structural UI. Raw colors are allowed only for per-icon brand accents inside rich content (e.g. facility icons).

---

## Typography Scale

| Use                           | Class                              |
|-------------------------------|------------------------------------|
| Page hero / H1                | `text-3xl md:text-4xl font-semibold` |
| Section heading               | `text-xl font-semibold`            |
| Card title                    | `text-base font-semibold`          |
| Sub-section heading           | `text-sm font-semibold`            |
| Body                          | `text-sm`                          |
| Secondary / helper            | `text-sm text-muted-foreground`    |
| Dense meta (price labels etc) | `text-xs text-muted-foreground`    |

`font-bold` is reserved for **price numerics and hero marketing headlines only**. All other emphasis uses `font-semibold`.

---

## Spacing Primitives

- Page padding (public routes): `px-4 md:px-6 lg:px-8`
- Vertical rhythm between sections: `space-y-6` (mobile) / `space-y-8` (lg)
- Card inner padding: `p-4 md:p-5`
- Form field rhythm: `space-y-4`
- Button row: `flex items-center gap-3`

Never stack a `mb-*` on an element whose parent already defines a `space-y-*`. Rely on the parent.

---

## Cards & Surfaces

```tsx
<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
  <div className="p-4 md:p-5 space-y-4">{/* content */}</div>
</div>
```

- Search hotel cards: rounded-xl, shadow-sm, hover:shadow-md, `transition-shadow`.
- Modal / dialog: `max-w-[640px] rounded-2xl p-6`.

---

## Buttons

| Variant   | Classes (baseline)                                              |
|-----------|-----------------------------------------------------------------|
| Primary   | `bg-primary text-primary-foreground hover:bg-primary/90`        |
| Secondary | `bg-secondary text-secondary-foreground hover:bg-secondary/80`  |
| Outline   | `border bg-background hover:bg-muted`                           |
| Ghost     | `hover:bg-muted`                                                |

Sizes: `h-9 px-3 text-sm` (default) · `h-10 px-4` (lg / CTA) · `h-8 px-2 text-xs` (sm).
Icons inside buttons: `h-4 w-4`, positioned with `mr-2`/`ml-2`.

---

## Forms

- Single source of truth for form styling is shared input / label components — never re-style an input with ad-hoc classes in a page.
- Label: `text-sm font-medium`.
- Help text: `text-xs text-muted-foreground`.
- Error text: `text-xs text-destructive`.

---

## Images

- Always use `<Image>` from `next/image` or the shared `SafeImage` component. **Never** raw `<img>` in user-visible surfaces — this project is public and LCP-sensitive.
- `SafeImage` uses `NEXT_PUBLIC_MEDIA_BASE_URL` (falls back to `NEXT_PUBLIC_API_BASE_URL`). Do not hardcode `dev.kacc.mn` or any other host.

---

## Performance Rules (enforceable)

1. **Context providers** (`AuthContext`, `ThemeContext`, `ToastContext`): the value must always be wrapped in `useMemo`; callbacks in `useCallback`. Any new provider must follow the same pattern.
2. **Lists of cards** (search results, hotel lists, wishlist): the card component must be wrapped in `React.memo`.
3. **Heavy third-party libs** (Google Maps, rich editors): import via `next/dynamic` with `ssr: false` and load on user intent — never at module scope.
4. **Images**: `<img>` is forbidden for hotel/room/avatar images. Use `SafeImage` or `next/image`.
5. **Inline object / array literals** for memoized child props must live in `useMemo`.

---

## Reusable Components (prefer these — do not re-implement)

- `components/common/SafeImage` — next/image with fallback + env-aware URL resolution.
- `components/common/GoogleMapModal` — lazy-loaded map modal.
- `components/search/HotelImageGallery` — carousel + modal viewer.
- `components/search/BookingStyleHotelCard` — primary search-result card (memoized).

---

## Anti-Patterns

- ❌ Raw hex colors (`#14b8a6`) in JSX — use the Tailwind alias.
- ❌ Duplicating card / button patterns across pages.
- ❌ `useEffect` that re-fetches the same resource on every mount without a cache.
- ❌ Long stacks of `useState` for a single form — use `useReducer` or react-hook-form.
- ❌ Inline arrow functions passed to `React.memo`'d children.
