import { getProducts } from '@/lib/products';
import Image from 'next/image';
import Link  from 'next/link';
import { formatPrice } from '@/types';
import type { Category } from '@/types';

interface ComplementaryProps {
  currentSlug: string;
  category:    Category;
}

export async function ComplementaryGrid({ currentSlug, category }: ComplementaryProps) {
  const { items } = await getProducts({ category, limit: 5 });
  const related = items.filter(p => p.slug !== currentSlug).slice(0, 4);
  if (!related.length) return null;

  return (
    <section
      className="px-12 py-[72px]"
      style={{ background: 'var(--parchment)', borderTop: '1px solid rgba(125,32,53,0.1)' }}
    >
      <div className="flex items-baseline justify-between mb-10">
        <h2 className="font-serif italic font-light text-display-sm" style={{ color: 'var(--noir)' }}>
          Wears well with
        </h2>
        <Link
          href={`/shop?category=${category}`}
          className="text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--burgundy)' }}
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-[2px]">
        {related.map(product => {
          const img     = product.images[0];
          const variant = product.variants[0];
          return (
            <Link key={product.id} href={`/product/${product.slug}`} className="group" style={{ background: 'var(--cream)' }}>
              <div className="overflow-hidden" style={{ aspectRatio: '3/4' }}>
                {img && (
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.name}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="px-4 py-3.5 pb-5">
                <p className="font-serif italic font-light text-[16px]" style={{ color: 'var(--noir)' }}>
                  {product.name}
                </p>
                <p className="text-[11px] mt-0.5 mb-2.5" style={{ color: 'var(--berry)' }}>
                  {product.subtitle}
                </p>
                {variant && (
                  <p className="text-[14px]" style={{ color: 'var(--noir)' }}>
                    {formatPrice(variant.priceCad)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── ProductStory ─────────────────────────────────────────

interface StoryProps {
  story: string | null;
  name:  string;
}

export function ProductStory({ story, name }: StoryProps) {
  if (!story) return null;
  return (
    <section
      className="grid grid-cols-2 min-h-[480px]"
      style={{ background: 'var(--bordeaux)' }}
    >
      <div style={{ background: 'rgba(0,0,0,0.2)' }} aria-hidden="true" />
      <div className="flex flex-col justify-center px-16 py-20">
        <p className="text-[10px] uppercase tracking-[0.18em] mb-6" style={{ color: 'var(--blush)' }}>
          The Craft
        </p>
        <h2 className="font-serif italic font-light text-display-sm mb-5" style={{ color: 'var(--cream)' }}>
          The story of the<br />{name}.
        </h2>
        <p className="text-[14px] leading-[1.8] max-w-[40ch] mb-8" style={{ color: 'rgba(250,247,242,0.65)' }}>
          {story}
        </p>
        <a
          href="/story"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--blush)' }}
        >
          Our ateliers →
        </a>
      </div>
    </section>
  );
}
