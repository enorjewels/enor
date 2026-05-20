'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from './ImageUploader';
import { VariantBuilder } from './VariantBuilder';
import type { VariantRow } from './VariantBuilder';
import type { Product, ProductImage } from '@/types';

const CATEGORIES = [
  { value: 'FINE',          label: 'Fine Jewellery' },
  { value: 'TRADITIONAL',   label: 'Traditional' },
  { value: 'GIFTS',         label: 'Gifts' },
  { value: 'MADE_TO_ORDER', label: 'Made to Order' },
];

const AVAILABLE_TAGS = ['new', 'best-loved', 'low-stock', 'sale', 'featured'];

interface Props { product?: Product & { images: ProductImage[]; variants: any[] }; }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function variantsToRows(variants: any[]): VariantRow[] {
  return variants.map(v => ({
    id:             v.id,
    metal:          v.metal,
    karat:          v.karat,
    size:           v.size       ?? '',
    weightGrams:    v.weightGrams?.toString() ?? '',
    priceCad:       (v.priceCad / 100).toString(),
    comparePriceCad:(v.comparePriceCad ? v.comparePriceCad / 100 : '').toString(),
    sku:            v.sku,
    stock:          v.stock.toString(),
    isDefault:      v.isDefault,
  }));
}

export function ProductForm({ product }: Props) {
  const router  = useRouter();
  const isNew   = !product;

  const [name,        setName]       = useState(product?.name        ?? '');
  const [slug,        setSlug]       = useState(product?.slug        ?? '');
  const [subtitle,    setSubtitle]   = useState(product?.subtitle    ?? '');
  const [description, setDesc]       = useState(product?.description ?? '');
  const [story,       setStory]      = useState(product?.story       ?? '');
  const [careNote,    setCareNote]   = useState(product?.careNote    ?? '');
  const [category,    setCategory]   = useState(product?.category    ?? 'FINE');
  const [tags,        setTags]       = useState<string[]>(product?.tags ?? []);
  const [isFeatured,  setFeatured]   = useState(product?.isFeatured  ?? false);
  const [isPublished, setPublished]  = useState(product?.isPublished ?? false);

  const [variants,    setVariants]   = useState<VariantRow[]>(
    product?.variants?.length ? variantsToRows(product.variants) : []
  );
  const [images,      setImages]     = useState<ProductImage[]>(product?.images ?? []);

  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  function toggleTag(tag: string) {
    setTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]);
  }

  async function handleSave(publish: boolean) {
    setError('');
    if (!name.trim())     { setError('Product name is required.'); return; }
    if (!slug.trim())     { setError('Slug is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }
    if (!variants.length) { setError('Add at least one variant.'); return; }
    if (variants.some(v => !v.priceCad || !v.sku)) {
      setError('Each variant needs a price and SKU.'); return;
    }

    setSaving(true);
    const body = {
      name, slug, subtitle, description, story, careNote,
      category, tags, isFeatured,
      isPublished: publish,
    };

    let productId = product?.id;

    try {
      if (isNew) {
        const res  = await fetch('/api/admin/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        productId = data.id;
      } else {
        const res = await fetch(`/api/admin/products/${product!.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      }

      // Save variants
      await fetch(`/api/admin/products/${productId}/variants`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variants: variants.map(v => ({
            ...v,
            priceCad:        Math.round(parseFloat(v.priceCad) * 100),
            comparePriceCad: v.comparePriceCad ? Math.round(parseFloat(v.comparePriceCad) * 100) : null,
            weightGrams:     v.weightGrams ? parseFloat(v.weightGrams) : null,
            stock:           parseInt(v.stock) || 0,
            size:            v.size || null,
          })),
        }),
      });

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  const SECTION = 'mb-8 p-6 bg-white border border-[rgba(125,32,53,0.1)]';
  const LABEL   = 'block text-[11px] uppercase tracking-[0.12em] mb-2';
  const INPUT   = 'w-full px-3 py-2.5 text-[14px] border bg-transparent outline-none focus:border-[#7D2035] transition-colors';
  const TEXTAREA = `${INPUT} resize-none`;

  return (
    <div className="max-w-5xl">
      {error && (
        <div className="mb-6 px-4 py-3 text-[13px]" style={{ background: 'rgba(184,90,106,0.1)', color: 'var(--rose)', border: '1px solid rgba(184,90,106,0.25)' }}>
          {error}
        </div>
      )}

      {/* Images — first so you see it immediately */}
      <div className={SECTION}>
        <h2 className="text-[13px] uppercase tracking-[0.14em] mb-5" style={{ color: 'var(--berry)' }}>
          Images
        </h2>
        {isNew && !product?.id ? (
          <p className="text-[13px]" style={{ color: 'var(--berry)' }}>
            Save the product first, then come back to upload images.
          </p>
        ) : (
          <ImageUploader
            productId={product!.id}
            initial={images}
            onChange={setImages}
          />
        )}
      </div>

      {/* Core info */}
      <div className={SECTION}>
        <h2 className="text-[13px] uppercase tracking-[0.14em] mb-5" style={{ color: 'var(--berry)' }}>
          Product Info
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={LABEL} style={{ color: 'var(--berry)' }}>Name *</label>
            <input
              type="text" value={name} placeholder="Soleil Ring"
              onChange={e => { setName(e.target.value); if (isNew) setSlug(slugify(e.target.value)); }}
              className={INPUT} style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)' }}
            />
          </div>
          <div>
            <label className={LABEL} style={{ color: 'var(--berry)' }}>Slug *</label>
            <input
              type="text" value={slug} placeholder="soleil-ring"
              onChange={e => setSlug(slugify(e.target.value))}
              className={INPUT} style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)' }}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className={LABEL} style={{ color: 'var(--berry)' }}>Subtitle</label>
          <input
            type="text" value={subtitle} placeholder="Halo constellation, 18K gold, natural gemstones"
            onChange={e => setSubtitle(e.target.value)}
            className={INPUT} style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)' }}
          />
        </div>
        <div className="mb-4">
          <label className={LABEL} style={{ color: 'var(--berry)' }}>Description *</label>
          <textarea
            rows={4} value={description} placeholder="18K rose gold band set with seven natural rubies…"
            onChange={e => setDesc(e.target.value)}
            className={TEXTAREA} style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)' }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL} style={{ color: 'var(--berry)' }}>Story (editorial copy)</label>
            <textarea
              rows={4} value={story} placeholder="The Soleil Ring began as a sketch of morning light…"
              onChange={e => setStory(e.target.value)}
              className={TEXTAREA} style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)' }}
            />
          </div>
          <div>
            <label className={LABEL} style={{ color: 'var(--berry)' }}>Care Note</label>
            <textarea
              rows={4} value={careNote} placeholder="Polish with a soft chamois cloth…"
              onChange={e => setCareNote(e.target.value)}
              className={TEXTAREA} style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)' }}
            />
          </div>
        </div>
      </div>

      {/* Category & Tags */}
      <div className={SECTION}>
        <h2 className="text-[13px] uppercase tracking-[0.14em] mb-5" style={{ color: 'var(--berry)' }}>
          Category & Tags
        </h2>
        <div className="mb-4">
          <label className={LABEL} style={{ color: 'var(--berry)' }}>Category *</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value} type="button"
                onClick={() => setCategory(value)}
                className="px-4 py-2 text-[12px] uppercase tracking-[0.1em] border transition-colors"
                style={{
                  borderColor: category === value ? 'var(--burgundy)' : 'rgba(125,32,53,0.2)',
                  background:  category === value ? 'rgba(125,32,53,0.08)' : 'none',
                  color:       category === value ? 'var(--burgundy)' : 'var(--noir)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className={LABEL} style={{ color: 'var(--berry)' }}>Tags</label>
          <div className="flex gap-2 flex-wrap">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag} type="button"
                onClick={() => toggleTag(tag)}
                className="px-3.5 py-1.5 text-[11px] uppercase tracking-[0.1em] rounded-full border transition-colors"
                style={{
                  borderColor: tags.includes(tag) ? 'var(--burgundy)' : 'rgba(125,32,53,0.2)',
                  background:  tags.includes(tag) ? 'var(--burgundy)' : 'none',
                  color:       tags.includes(tag) ? 'var(--cream)'    : 'var(--noir)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-[13px]">
            <input type="checkbox" checked={isFeatured} onChange={e => setFeatured(e.target.checked)} />
            <span style={{ color: 'var(--noir)' }}>Featured on homepage</span>
          </label>
        </div>
      </div>

      {/* Variants */}
      <div className={SECTION}>
        <h2 className="text-[13px] uppercase tracking-[0.14em] mb-5" style={{ color: 'var(--berry)' }}>
          Variants
        </h2>
        <VariantBuilder initial={variants} onChange={setVariants} />
      </div>

      {/* Save bar */}
      <div
        className="flex items-center gap-4 px-6 py-4 sticky bottom-0"
        style={{ background: 'white', borderTop: '1px solid rgba(125,32,53,0.12)' }}
      >
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-6 py-2.5 text-[12px] uppercase tracking-[0.12em] border transition-colors disabled:opacity-50"
          style={{ borderColor: 'rgba(125,32,53,0.3)', color: 'var(--noir)' }}
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-6 py-2.5 text-[12px] uppercase tracking-[0.12em] transition-colors disabled:opacity-50"
          style={{ background: 'var(--burgundy)', color: 'var(--cream)' }}
        >
          {saving ? 'Saving…' : 'Save & Publish'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="ml-auto text-[12px] opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--noir)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
