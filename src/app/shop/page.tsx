import type { Metadata } from 'next';
import { getProducts } from '@/lib/products';
import { ProductGrid }  from '@/components/product/ProductGrid';
import { FilterRail }   from '@/components/product/FilterRail';
import { ControlBar }   from '@/components/product/ControlBar';
import type { Category } from '@/types';

export const metadata: Metadata = {
  title:       'All Pieces',
  description: 'Browse the En or collection — fine jewellery, traditional, gifts and made-to-order pieces.',
};

interface SearchParams {
  category?: string;
  sort?:     string;
  page?:     string;
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const page     = Number(searchParams.page) || 1;
  const sort     = (searchParams.sort as 'price_asc' | 'price_desc' | 'newest' | 'featured') || 'featured';
  const category = searchParams.category as Category | undefined;

  const { items, total, pages } = await getProducts({ category, sort, page, limit: 12 });

  return (
    <>
      {/* Editorial heading */}
      <div className="px-9 pt-[120px] pb-14">
        <div className="grid grid-cols-[1.4fr_1fr] gap-10 items-end">
          <h1
            className="font-serif font-light text-display-2xl m-0"
            style={{ color: 'var(--noir)' }}
          >
            All <em className="italic" style={{ color: 'var(--burgundy)' }}>Pieces</em>
          </h1>
          <p className="text-[16px] leading-[1.7] max-w-[42ch] pb-6" style={{ color: 'rgba(26,10,13,0.78)' }}>
            Every piece is cast in solid gold — no plating, no shortcuts.
            Hallmarked, weighed, and set by hand in our Jaipur atelier.
          </p>
        </div>
      </div>

      {/* Sticky control bar */}
      <ControlBar total={total} currentSort={sort} />

      {/* Main: rail + grid */}
      <div
        className="grid gap-10 px-9 py-10 pb-20"
        style={{ gridTemplateColumns: '240px 1fr' }}
      >
        <FilterRail />
        <ProductGrid products={items} page={page} pages={pages} />
      </div>
    </>
  );
}
