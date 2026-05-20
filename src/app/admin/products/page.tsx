import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ProductsTable } from '@/components/admin/ProductsTable';

export const metadata = { title: 'Products' };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      images:   { where: { isPrimary: true }, take: 1 },
      variants: true,
    },
  });

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-tight" style={{ color: 'var(--noir)' }}>
            Products
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--berry)' }}>
            {products.length} total · {products.filter(p => p.isPublished).length} live
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 text-[12px] uppercase tracking-[0.12em]"
          style={{ background: 'var(--burgundy)', color: 'var(--cream)' }}
        >
          + New Product
        </Link>
      </div>

      <ProductsTable products={products as any} />
    </div>
  );
}
