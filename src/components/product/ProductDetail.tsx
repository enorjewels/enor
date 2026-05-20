'use client';

import { useState } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice, METAL_LABELS } from '@/types';
import type { Product, ProductVariant } from '@/types';

interface Props { product: Product; }

const ACCORDION_ITEMS = [
  {
    title: 'Details & Composition',
    key:   'details',
    body:  (p: Product) => p.description,
  },
  {
    title: 'Craftsmanship',
    key:   'craft',
    body:  () => 'Hand-set in our Jaipur atelier. Each stone is individually inspected and placed by a master setter with over 20 years of experience. Allow 5–7 business days for sizing.',
  },
  {
    title: 'Delivery & Returns',
    key:   'delivery',
    body:  () => 'Free insured shipping across Canada (5–8 business days). Express 2-day available at checkout. Returns accepted within 30 days of delivery — unworn, in original packaging. Made-to-order items are final sale.',
  },
  {
    title: 'Care Instructions',
    key:   'care',
    body:  (p: Product) => p.careNote ?? 'Polish with a soft chamois cloth. Avoid contact with perfume, chlorine, and ultrasonic cleaners. Store in the provided suede pouch.',
  },
];

export function ProductDetail({ product }: Props) {
  const defaultVariant = product.variants.find(v => v.isDefault) ?? product.variants[0];
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(defaultVariant);
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [openAcc,       setOpenAcc]       = useState<string | null>(null);
  const [notification,  setNotification]  = useState('');

  const { addItem } = useCartStore();

  // Group variants by metal
  const metals = [...new Set(product.variants.map(v => v.metal))];
  // Sizes for the active metal
  const sizesForMetal = product.variants.filter(v => v.metal === activeVariant.metal && v.size);

  const hasSizes = sizesForMetal.length > 0;

  function handleAddToBag() {
    if (hasSizes && !selectedSize) {
      setNotification('Please select a ring size');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    const variant = hasSizes
      ? product.variants.find(v => v.metal === activeVariant.metal && v.size === selectedSize)!
      : activeVariant;

    addItem({
      variantId:   variant.id,
      productId:   product.id,
      productSlug: product.slug,
      name:        product.name,
      metal:       variant.metal,
      karat:       variant.karat,
      size:        variant.size,
      priceCad:    variant.priceCad,
      quantity:    1,
      image:       product.images[0]?.url ?? '',
      imageAlt:    product.images[0]?.altText ?? product.name,
    });
    setNotification(`${product.name} added to bag`);
    setTimeout(() => setNotification(''), 3000);
  }

  return (
    <div
      className="flex flex-col px-14 py-13 overflow-y-auto"
      style={{ borderLeft: '1px solid rgba(125,32,53,0.1)', gap: 0 }}
    >
      {/* Tags */}
      <div className="flex items-center gap-3 mb-5">
        {product.tags.includes('new') && (
          <span className="text-[10px] uppercase tracking-[0.14em] px-2.5 py-1" style={{ background: 'var(--burgundy)', color: 'var(--cream)' }}>
            New
          </span>
        )}
        <span className="text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 border" style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}>
          Fine Jewellery
        </span>
      </div>

      {/* Name */}
      <h1 className="font-serif italic font-light text-display-md mb-1.5" style={{ color: 'var(--noir)' }}>
        {product.name}
      </h1>
      {product.subtitle && (
        <p className="font-serif font-light text-base mb-7" style={{ color: 'var(--berry)' }}>
          {product.subtitle}
        </p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3.5 mb-2">
        <span className="font-serif font-light text-[30px]">{formatPrice(activeVariant.priceCad)}</span>
        {activeVariant.comparePriceCad && (
          <span className="text-[18px] line-through opacity-60" style={{ color: 'var(--berry)' }}>
            {formatPrice(activeVariant.comparePriceCad)}
          </span>
        )}
      </div>
      <p className="text-[11px] mb-7" style={{ color: 'var(--berry)' }}>
        Price includes applicable taxes &amp; duties. Free shipping on orders over CA$500.
      </p>

      <div className="h-px mb-6" style={{ background: 'rgba(125,32,53,0.12)' }} />

      {/* Metal selector */}
      <p className="text-[10px] uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--berry)' }}>
        Metal — <span className="font-light not-italic" style={{ color: 'var(--noir)' }}>
          {METAL_LABELS[activeVariant.metal]}
        </span>
      </p>
      <div className="flex gap-2 mb-6">
        {metals.map((metal) => (
          <button
            key={metal}
            onClick={() => { setActiveVariant(product.variants.find(v => v.metal === metal)!); setSelectedSize(null); }}
            className="flex items-center gap-2 px-3.5 py-2.5 border text-[12px] tracking-[0.06em] transition-colors"
            style={{
              borderColor: activeVariant.metal === metal ? 'var(--burgundy)' : 'rgba(125,32,53,0.2)',
              background:  activeVariant.metal === metal ? 'rgba(125,32,53,0.05)' : 'none',
            }}
          >
            {metal.replace('_GOLD', '').replace('_', ' ')} Gold
          </button>
        ))}
      </div>

      {/* Size selector */}
      {hasSizes && (
        <>
          <p className="text-[10px] uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--berry)' }}>
            Ring Size — <span style={{ color: 'var(--noir)' }}>{selectedSize ?? 'Select'}</span>
          </p>
          <div className="flex gap-1.5 flex-wrap mb-2">
            {sizesForMetal.map((v) => (
              <button
                key={v.size}
                onClick={() => v.stock > 0 && setSelectedSize(v.size!)}
                disabled={v.stock === 0}
                className="w-11 h-11 flex items-center justify-center border text-[13px] transition-colors"
                style={{
                  borderColor: selectedSize === v.size ? 'var(--burgundy)' : 'rgba(125,32,53,0.2)',
                  background:  selectedSize === v.size ? 'rgba(125,32,53,0.05)' : 'none',
                  opacity:     v.stock === 0 ? 0.3 : 1,
                  textDecoration: v.stock === 0 ? 'line-through' : 'none',
                  cursor:      v.stock === 0 ? 'not-allowed' : 'none',
                }}
              >
                {v.size}
              </button>
            ))}
          </div>
          <a href="#" className="text-[11px] mt-2 mb-7 block" style={{ color: 'var(--burgundy)', textDecoration: 'underline' }}>
            Size guide →
          </a>
        </>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-2.5 mb-7">
        <button
          onClick={handleAddToBag}
          className="py-4 text-[12px] uppercase tracking-[0.14em] transition-colors"
          style={{ background: 'var(--noir)', color: 'var(--cream)' }}
          data-cursor="add"
          data-label="Add"
        >
          Add to Bag
        </button>
        <button
          className="py-4 text-[12px] uppercase tracking-[0.14em] border transition-colors"
          style={{ borderColor: 'rgba(125,32,53,0.3)', color: 'var(--noir)' }}
        >
          Virtual Try-On
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className="mb-4 px-4 py-3 text-[12px] tracking-wide"
          style={{ background: 'rgba(125,32,53,0.06)', color: 'var(--noir)', borderLeft: '2px solid var(--burgundy)' }}
        >
          {notification}
        </div>
      )}

      {/* Trust pillars */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          ['Certified Gold',   'BIS Hallmarked, conflict-free gemstones.'],
          ['Secure Checkout',  'Stripe encrypted, CAD billing.'],
          ['Free Shipping',    'On all orders over CA$500.'],
          ['30-Day Returns',   'Easy, no-questions return policy.'],
        ].map(([title, body]) => (
          <div key={title} className="p-3 text-[11px] leading-[1.5]" style={{ background: 'rgba(245,237,232,0.5)' }}>
            <strong className="block font-normal tracking-[0.05em] mb-0.5">{title}</strong>
            <span style={{ color: 'var(--berry)' }}>{body}</span>
          </div>
        ))}
      </div>

      {/* Accordion */}
      <div style={{ borderTop: '1px solid rgba(125,32,53,0.12)' }}>
        {ACCORDION_ITEMS.map(({ title, key, body }) => (
          <div key={key} style={{ borderBottom: '1px solid rgba(125,32,53,0.12)' }}>
            <button
              className="flex justify-between items-center w-full py-4"
              onClick={() => setOpenAcc(openAcc === key ? null : key)}
            >
              <span className="font-serif font-light text-[15px] tracking-[0.04em]">{title}</span>
              <span
                className="text-lg transition-transform duration-300"
                style={{
                  color: 'var(--burgundy)',
                  transform: openAcc === key ? 'rotate(45deg)' : 'none',
                }}
              >+</span>
            </button>
            {openAcc === key && (
              <div className="pb-4 text-[13px] leading-[1.7]" style={{ color: 'var(--berry)' }}>
                {body(product)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
