'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/types';

interface Props {
  images: ProductImage[];
  name:   string;
}

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div
      className="sticky top-[72px] grid overflow-hidden"
      style={{
        height:               'calc(100vh - 72px)',
        gridTemplateColumns:  '80px 1fr',
        gridTemplateRows:     '1fr',
        gap:                  '3px',
        background:           'var(--parchment)',
      }}
    >
      {/* Thumbnail strip */}
      <div className="flex flex-col gap-[3px] overflow-y-auto">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className="flex-shrink-0 h-[88px] overflow-hidden transition-all"
            style={{
              background:  'var(--cream)',
              borderLeft:  `2px solid ${active === i ? 'var(--burgundy)' : 'transparent'}`,
            }}
            aria-label={`View image ${i + 1}`}
            data-cursor="hover"
          >
            <Image
              src={img.url}
              alt={img.altText ?? name}
              width={80}
              height={88}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative overflow-hidden group">
        {images[active] && (
          <Image
            src={images[active].url}
            alt={images[active].altText ?? name}
            fill
            className="object-cover transition-transform duration-800 group-hover:scale-[1.03]"
            priority={active === 0}
            sizes="50vw"
          />
        )}
        <div
          className="absolute bottom-5 left-5 font-serif italic text-[13px] tracking-[0.05em]"
          style={{ color: 'var(--bordeaux)', opacity: 0.6 }}
          aria-live="polite"
        >
          {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </div>
        <div
          className="absolute bottom-5 right-5 text-[10px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--berry)', opacity: 0.7 }}
        >
          Hover to zoom
        </div>
      </div>
    </div>
  );
}
