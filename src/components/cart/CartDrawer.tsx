'use client';

import { useCartStore } from '@/hooks/useCart';
import { formatPrice }  from '@/types';
import Image from 'next/image';

export function CartDrawer() {
  const { isOpen, closeCart, items, totalCad, removeItem, updateQty } = useCartStore();

  async function handleCheckout() {
    const res = await fetch('/api/checkout', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ cartItems: items }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-[420px]"
        style={{
          background:  'var(--cream)',
          transform:   isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition:  'transform 0.4s var(--ease-luxury)',
          borderLeft:  '1px solid rgba(125,32,53,0.12)',
        }}
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-6"
          style={{ borderBottom: '1px solid rgba(125,32,53,0.1)' }}
        >
          <h2 className="font-serif italic font-light text-xl" style={{ color: 'var(--noir)' }}>
            Your Bag
          </h2>
          <button
            onClick={closeCart}
            className="text-[11px] uppercase tracking-[0.14em] opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close bag"
          >
            Close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <p className="font-serif italic text-2xl font-light" style={{ color: 'var(--berry)' }}>
                Your bag is empty.
              </p>
              <p className="text-[13px] tracking-wide" style={{ color: 'var(--berry)' }}>
                Wear what moves you.
              </p>
              <a
                href="/shop"
                className="mt-4 text-[11px] uppercase tracking-[0.14em] border-b pb-0.5"
                style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
                onClick={closeCart}
              >
                Browse pieces →
              </a>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex gap-4"
                  style={{ borderBottom: '1px solid rgba(125,32,53,0.08)', paddingBottom: '1.5rem' }}
                >
                  <div className="relative w-20 h-24 flex-shrink-0 rounded overflow-hidden" style={{ background: 'var(--parchment)' }}>
                    <Image src={item.image} alt={item.imageAlt} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <p className="font-serif italic font-light text-[16px]" style={{ color: 'var(--noir)' }}>
                        {item.name}
                      </p>
                      <p className="text-[12px] tracking-wide mt-0.5" style={{ color: 'var(--berry)' }}>
                        {item.karat} {item.metal.replace('_', ' ')}
                        {item.size ? ` · Size ${item.size}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQty(item.variantId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border rounded-full text-sm opacity-60 hover:opacity-100"
                          style={{ borderColor: 'rgba(125,32,53,0.3)' }}
                        >−</button>
                        <span className="text-[13px] w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.variantId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border rounded-full text-sm opacity-60 hover:opacity-100"
                          style={{ borderColor: 'rgba(125,32,53,0.3)' }}
                        >+</button>
                      </div>
                      <span className="font-serif text-[16px]">{formatPrice(item.priceCad * item.quantity)}</span>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="self-start text-[10px] uppercase tracking-[0.14em] opacity-40 hover:opacity-100 transition-opacity mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-8 py-6 space-y-4"
            style={{ borderTop: '1px solid rgba(125,32,53,0.1)' }}
          >
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--berry)' }}>
                Subtotal
              </span>
              <span className="font-serif text-2xl font-light">{formatPrice(totalCad)}</span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--berry)' }}>
              Taxes (GST/HST/PST) calculated at checkout. Free shipping on orders over CA$500.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full py-4 text-[12px] uppercase tracking-[0.14em] transition-colors"
              style={{ background: 'var(--noir)', color: 'var(--cream)' }}
            >
              Proceed to Checkout
            </button>
            <button
              onClick={closeCart}
              className="w-full py-3 text-[11px] uppercase tracking-[0.14em] border transition-colors hover:border-burgundy"
              style={{ borderColor: 'rgba(125,32,53,0.25)', color: 'var(--noir)' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
