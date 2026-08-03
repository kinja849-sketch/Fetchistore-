---
name: ui-design
description: >
  Clarkson structural reference + NovaTrend visual language for Fetchistore's
  public storefront and product surfaces. Use this skill whenever building or
  modifying any UI component.
---

# UI Design Skill — Fetchistore

This skill defines the **two design contracts** that govern every UI surface in Fetchistore.

---

## 1. Structural Reference — Clarkson Webflow Ecommerce

**File:** `references/clarkson-home.html`

The Clarkson HTML is the **section-order and layout blueprint** for the public storefront.
Re-implement in React + Tailwind + shadcn/ui. Do not invent a different information architecture.

### Canonical section order (home page)

1. **Navbar** — Left: Shop · About · Press | Center: Logo | Right: Social icons + Cart
2. **Hero** — Large heading + blurb + CTA button ("Shop now")
3. **New Arrivals** — Section title + 4-column product card grid + "Shop All" CTA
4. **Trending Banner** — Full-width image with overlay heading + CTA
5. **Top Sellers** — Section title + 4-column product card grid + "Shop All" CTA
6. **Collection Banners** ("Just For You") — Two side-by-side collection cards with image + overlay CTA
7. **Subscribe + Image Strip** — Newsletter form + 4-image gallery row + "Follow on Instagram"
8. **Footer** — 4-column grid: Logo | Company links | Useful links | Newsletter
9. **Mobile nav overlay** — Slide-in menu for small screens

### Product card pattern (from Clarkson)

```
┌─────────────────────┐
│   [Product Image]   │
├─────────────────────┤
│  Title              │
│  Description        │
│  $Price  ~~$Old~~   │
└─────────────────────┘
```

### Fetchistore additions to the card

- **Condition badge** — `new`, `like_new`, `good`, `fair` (colored pill)
- **Distance** — "2.3 km away" when buyer location is known
- **"Near you" affordance** — optional visual indicator for close-proximity items

---

## 2. Visual Language — NovaTrend Reference

**File:** `references/novatrend-reference.png`

The NovaTrend screenshot defines the **look and feel** contract.

### Visual principles

| Aspect | Rule |
| --- | --- |
| Backgrounds | Clean white / light gray (#F9FAFB or similar) |
| Cards | Soft shadow, rounded corners (12–16px), white background |
| Typography | Inter font family, clear hierarchy (headings bold 600–700, body 400) |
| Colors | Neutral base + single accent (warm orange/coral for CTAs and badges) |
| Product images | Strong, square/portrait, object-fit cover, subtle hover scale |
| CTAs | Solid filled buttons (accent color), uppercase small-caps for nav |
| Spacing | Generous — mobile-first, comfortable padding/gaps |
| Icons | lucide-react, consistent stroke weight |

### NovaTrend-specific patterns visible in the reference

1. **Top announcement bar** — thin banner with promos, dark background, white text
2. **Trust bar** — 4-icon row: Free Shipping · Secure Payments · Easy Returns · 24/7 Support
3. **Category cards** — Circular or rounded images with label + "Shop Now" link
4. **Hero with floating product cards** — Dynamic layout with product mini-cards overlaying the hero image
5. **Best Sellers with detail expansion** — Larger left card + right-side product grid with "Quick Look" buttons
6. **Collection banners** — Full-bleed image sections with overlay text

### Fetchistore design merge

Combine Clarkson's **structure** with NovaTrend's **visual treatment**:

- Keep Clarkson section order and layout grid
- Apply NovaTrend colors, typography, card styling, and micro-interactions
- Add Fetchistore-specific elements: condition badges, distance indicators, trust bar (adapted for proximity + delivery messaging)

### Trust bar messaging (Fetchistore)

| Icon | Label | Subtext |
| --- | --- | --- |
| Truck | Seller Delivery | Direct to your door |
| Shield | Secure Payments | Card, bank, e-wallet, COD |
| MapPin | Near You | Proximity-first discovery |
| Headphones | Customer Support | We're here to help |

---

## 3. Component library

Use **shadcn/ui** as the base component kit:

- `Button`, `Card`, `Badge`, `Input`, `Sheet`, `Dialog`, `Tabs`, `Select`, `Separator`
- Extend with custom components: `ProductCard`, `ConditionBadge`, `DistanceIndicator`, `TrustBar`, `CategoryCard`

### Tailwind theme extensions

```ts
// tailwind.config.ts (key extensions)
{
  colors: {
    brand: {
      DEFAULT: '#E8553A',   // warm coral/orange accent
      light: '#FFF0ED',
      dark: '#C4412A',
    },
    surface: {
      DEFAULT: '#FFFFFF',
      muted: '#F9FAFB',
      dark: '#1A1A1A',
    }
  },
  borderRadius: {
    card: '12px',
    pill: '9999px',
  },
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
  }
}
```

---

## 4. Condition badge styles

| Condition | Color | Label |
| --- | --- | --- |
| `new` | Green (#22C55E bg, white text) | New |
| `like_new` | Blue (#3B82F6 bg, white text) | Like New |
| `good` | Amber (#F59E0B bg, white text) | Good |
| `fair` | Gray (#6B7280 bg, white text) | Fair |

---

## 5. Responsive breakpoints

Follow Tailwind defaults, mobile-first:

- `sm` (640px) — single column → 2-col product grid
- `md` (768px) — mobile nav → desktop nav
- `lg` (1024px) — 2-col → 3-col product grid
- `xl` (1280px) — 3-col → 4-col product grid (matches Clarkson)

---

## Checklist for any UI implementation

- [ ] Section order matches Clarkson structure
- [ ] Visual treatment matches NovaTrend language
- [ ] Product cards include: image, title, condition badge, price, distance (when available)
- [ ] CTAs use brand accent color
- [ ] Mobile-first responsive layout
- [ ] shadcn/ui components used where applicable
- [ ] Inter font loaded
- [ ] Accessible (semantic HTML, ARIA labels, keyboard navigation)
