import Image from 'next/image';
import Link  from 'next/link';
import { formatPrice } from '@/types';
import type { Product } from '@/types';

interface Props { products: Product[]; }

export function FeaturedGrid({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="px-9 py-20">
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="font-serif italic font-light text-display-sm" style={{ color: 'var(--noir)' }}>
          New arrivals
        </h2>
        <Link
          href="/shop"
          className="text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--burgundy)' }}
        >
          View all pieces →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {products.map(product => {
          const img     = product.images[0];
          const variant = product.variants[0];
          return (
            <Link key={product.id} href={`/product/${product.slug}`} className="group" data-cursor="hover">
              <div
                className="relative overflow-hidden rounded mb-4"
                style={{ aspectRatio: '4/5', background: 'var(--parchment)' }}
              >
                {img && (
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.name}
                    fill
                    className="object-cover transition-transform duration-800 group-hover:scale-[1.04]"
                    sizes="33vw"
                  />
                )}
              </div>
              <div className="flex justify-between items-baseline">
                <p className="font-serif italic font-light text-[18px]" style={{ color: 'var(--noir)' }}>
                  {product.name}
                </p>
                {variant && (
                  <p className="font-serif font-light text-[16px]">{formatPrice(variant.priceCad)}</p>
                )}
              </div>
              {product.subtitle && (
                <p className="text-[12px] mt-1" style={{ color: 'var(--berry)' }}>{product.subtitle}</p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
