// CategoryGrid — 2×2 grid linking to each category
import Link from 'next/link';

const CATEGORIES = [
  { href: '/shop?category=FINE',          label: 'Fine Jewellery',  sub: 'Rings, bangles, pendants' },
  { href: '/shop?category=TRADITIONAL',   label: 'Traditional',     sub: 'Temple, kundan, polki' },
  { href: '/shop?category=GIFTS',         label: 'Gifts',           sub: 'Ready to give, ready to love' },
  { href: '/shop?category=MADE_TO_ORDER', label: 'Made to Order',   sub: 'Yours, from sketch to setting' },
];

export function CategoryGrid() {
  return (
    <section className="grid grid-cols-2 gap-[2px]" aria-label="Shop by category">
      {CATEGORIES.map(({ href, label, sub }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col justify-end px-12 py-14 min-h-[340px] relative overflow-hidden"
          style={{ background: 'var(--parchment)' }}
          data-cursor="hover"
        >
          <p className="font-serif italic font-light text-display-sm mb-1 transition-transform duration-600 group-hover:-translate-y-1"
            style={{ color: 'var(--noir)', transitionTimingFunction: 'var(--ease-luxury)' }}>
            {label}
          </p>
          <p className="text-[13px] tracking-wide opacity-60" style={{ color: 'var(--berry)' }}>
            {sub}
          </p>
          <span className="absolute bottom-14 right-12 text-[11px] uppercase tracking-[0.14em] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--burgundy)' }}>
            Shop →
          </span>
        </Link>
      ))}
    </section>
  );
}
