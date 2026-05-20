'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCart';

const NAV_LINKS = [
  { href: '/shop?category=FINE',         label: 'Fine Jewellery' },
  { href: '/shop?category=TRADITIONAL',  label: 'Traditional' },
  { href: '/shop?category=MADE_TO_ORDER',label: 'Made to Order' },
  { href: '/shop?category=GIFTS',        label: 'Gifts' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, openCart } = useCartStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 grid items-center transition-all duration-400"
      style={{
        gridTemplateColumns: 'auto 1fr auto',
        padding:             scrolled ? '10px 28px' : '14px 28px',
        background:          'color-mix(in oklab, var(--cream) 78%, transparent)',
        backdropFilter:      'blur(18px) saturate(1.2)',
        borderBottom:        '1px solid color-mix(in oklab, var(--noir) 10%, transparent)',
      }}
    >
      {/* Logo — always hard left */}
      <Link href="/" className="font-serif italic font-light" style={{ lineHeight: 0.82, letterSpacing: '-0.02em', fontSize: 28 }}>
        <span className="block" style={{ color: 'var(--noir)' }}>En</span>
        <span className="block" style={{ color: 'var(--burgundy)', paddingLeft: '0.45em' }}>or</span>
      </Link>

      {/* Centre links */}
      <nav className="flex gap-9 justify-center" aria-label="Main navigation">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="relative py-1.5 text-[11px] uppercase tracking-[0.22em] font-normal
              after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-current
              after:scale-x-0 after:origin-left after:transition-transform after:duration-500
              hover:after:scale-x-100"
            style={{ transitionTimingFunction: 'var(--ease-luxury)' }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex gap-[18px] items-center text-[11px] uppercase tracking-[0.22em]">
        <button className="opacity-70 hover:opacity-100 transition-opacity" data-cursor="hover">
          Search
        </button>
        <Link href="/account" className="opacity-70 hover:opacity-100 transition-opacity" data-cursor="hover">
          Account
        </Link>
        <button
          onClick={openCart}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-noir rounded-full transition-colors hover:bg-noir hover:text-cream"
          style={{ borderColor: 'var(--noir)' }}
          data-cursor="hover"
          aria-label={`Open bag — ${itemCount} items`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--burgundy)' }}
            aria-hidden="true"
          />
          Bag {itemCount > 0 && `(${itemCount})`}
        </button>
      </div>
    </header>
  );
}
