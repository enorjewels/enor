# En or — Next.js Storefront

Luxury jewellery e-commerce. Built with Next.js 14 App Router, Supabase, Stripe, and a fully locked-in brand system.

## Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router), Tailwind |
| Database    | Supabase (Postgres) + Prisma ORM  |
| Payments    | Stripe Checkout + Stripe Tax      |
| Email       | Resend                            |
| Images      | Cloudinary                        |
| Cache       | Upstash Redis                     |
| DNS         | Cloudflare                        |
| Domain      | enor.ca (CIRA)                    |
| Analytics   | Plausible                         |
| Hosting     | Vercel                            |

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
```
Fill in all values in `.env.local` — see comments in the file.

### 3. Database
```bash
# Push schema to Supabase
npm run db:push

# Open Prisma Studio to seed data
npm run db:studio
```

### 4. Stripe webhook (local dev)
```bash
# Install Stripe CLI and forward events
stripe listen --forward-to localhost:3000/api/webhook
```
Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 5. Run dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Nav, CartDrawer, Cursor)
│   ├── page.tsx                # Homepage
│   ├── shop/
│   │   └── page.tsx            # Product listing with filters
│   ├── product/
│   │   └── [slug]/page.tsx     # Product detail page
│   └── api/
│       ├── checkout/route.ts   # Stripe Checkout session creation
│       └── webhook/route.ts    # Stripe post-payment webhook
├── components/
│   ├── layout/                 # Nav, HeroSection, CategoryGrid, StorySection
│   ├── product/                # ProductGallery, ProductDetail, ProductGrid, FilterRail, ControlBar
│   ├── cart/                   # CartDrawer
│   └── ui/                    # Cursor, MarqueeBand, TrustPillars
├── hooks/
│   └── useCart.ts              # Zustand cart store (persisted)
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── stripe.ts               # Stripe client singleton
│   └── products.ts             # Data access layer
├── styles/
│   └── globals.css             # Brand tokens + Tailwind
└── types/
    └── index.ts                # Shared types + formatPrice helper
prisma/
└── schema.prisma               # Full data model
```

## Brand Tokens

All brand colours and fonts are available as CSS variables and Tailwind classes:

```css
var(--cream)     /* #FAF7F2 */
var(--parchment) /* #F5EDE8 */
var(--blush)     /* #D4A090 */
var(--rose)      /* #B85A6A */
var(--burgundy)  /* #7D2035 */
var(--noir)      /* #1A0A0D */
var(--berry)     /* #9E7A82 */
var(--bordeaux)  /* #2A1218 */
var(--abyss)     /* #0F0608 */
```

Tailwind: `bg-burgundy`, `text-noir`, `bg-parchment`, etc.

## Deployment

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add all env vars in Vercel project settings
4. Add Stripe webhook endpoint: `https://enor.ca/api/webhook`
5. Set Cloudflare DNS: A record pointing `enor.ca` → Vercel IP
