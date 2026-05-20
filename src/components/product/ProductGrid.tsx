import Image from 'next/image';
import Link  from 'next/link';
import { formatPrice } from '@/types';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  page:     number;
  pages:    number;
}

export function ProductGrid({ products, page, pages }: Props) {
  return (
    <div>
      <div className="grid gap-[30px_24px]" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {products.map((product) => {
          const variant   = product.variants[0];
          const primary   = product.images.find(i => i.isPrimary);
          const secondary = product.images[1];

          return (
            <article key={product.id} className="group relative" style={{ perspective: '1200px' }}>
              <Link href={`/product/${product.slug}`} data-cursor="hover">
                {/* Image */}
                <div
                  className="relative overflow-hidden rounded-[6px] mb-3"
                  style={{ aspectRatio: '4/5', background: 'var(--parchment)' }}
                >
                  {primary && (
                    <Image
                      src={primary.url}
                      alt={primary.altText ?? product.name}
                      fill
                      className="object-cover transition-all duration-800 group-hover:opacity-0"
                      style={{ transitionTimingFunction: 'var(--ease-luxury)' }}
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  )}
                  {secondary && (
                    <Image
                      src={secondary.url}
                      alt=""
                      fill
                      className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  )}

                  {/* Tags */}
                  {product.tags.includes('new') && (
                    <span
                      className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.22em] px-2.5 py-1.5 rounded-full"
                      style={{ background: 'var(--burgundy)', color: 'var(--cream)' }}
                    >
                      New
                    </span>
                  )}

                  {/* Hover quick actions */}
                  <div className="absolute left-3 right-3 bottom-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <button
                      className="flex-1 py-2.5 text-[10px] uppercase tracking-[0.22em] rounded-full"
                      style={{ background: 'var(--noir)', color: 'var(--cream)' }}
                      data-cursor="add"
                      data-label="Quick add"
                    >
                      Quick add
                    </button>
                    <button
                      className="flex-1 py-2.5 text-[10px] uppercase tracking-[0.22em] rounded-full"
                      style={{ background: 'rgba(250,247,242,0.8)', color: 'var(--noir)' }}
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex justify-between items-baseline">
                  <p className="font-serif italic font-light text-[17px]" style={{ color: 'var(--noir)' }}>
                    {product.name}
                  </p>
                  {variant && (
                    <p className="font-serif font-light text-[15px]">{formatPrice(variant.priceCad)}</p>
                  )}
                </div>
                {product.subtitle && (
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--berry)' }}>
                    {product.subtitle}
                  </p>
                )}
              </Link>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center mt-16">
          <div className="flex gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <a
                key={p}
                href={`?page=${p}`}
                className="w-10 h-10 flex items-center justify-center text-[12px] border transition-colors"
                style={{
                  borderColor: p === page ? 'var(--burgundy)' : 'rgba(125,32,53,0.2)',
                  background:  p === page ? 'var(--burgundy)' : 'none',
                  color:       p === page ? 'var(--cream)'    : 'var(--noir)',
                }}
              >
                {p}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
