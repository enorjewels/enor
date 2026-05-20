import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getStats() {
  const [total, published, draft, orders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true  } }),
    prisma.product.count({ where: { isPublished: false } }),
    prisma.order.count({ where: { status: 'PAID' } }),
  ]);
  return { total, published, draft, orders };
}

async function getRecentProducts() {
  return prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 8,
    include: {
      images:   { where: { isPrimary: true }, take: 1 },
      variants: { orderBy: { isDefault: 'desc' }, take: 1 },
    },
  });
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentProducts()]);

  const STAT_CARDS = [
    { label: 'Total Products',   value: stats.total,     href: '/admin/products' },
    { label: 'Live',             value: stats.published, href: '/admin/products?status=published' },
    { label: 'Draft',            value: stats.draft,     href: '/admin/products?status=draft' },
    { label: 'Orders (paid)',    value: stats.orders,    href: '/admin/orders' },
  ];

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-light tracking-tight" style={{ color: 'var(--noir)' }}>
            Dashboard
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--berry)' }}>
            Manage your En or catalogue
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

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        {STAT_CARDS.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="p-6 transition-shadow hover:shadow-md"
            style={{ background: 'white', border: '1px solid rgba(125,32,53,0.1)' }}
          >
            <p className="text-[11px] uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--berry)' }}>
              {label}
            </p>
            <p className="text-4xl font-light font-serif" style={{ color: 'var(--noir)' }}>
              {value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent products */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[13px] uppercase tracking-[0.14em]" style={{ color: 'var(--berry)' }}>
            Recent Products
          </h2>
          <Link href="/admin/products" className="text-[12px]" style={{ color: 'var(--burgundy)' }}>
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {recent.map(product => {
            const img     = product.images[0];
            const variant = product.variants[0];
            return (
              <Link
                key={product.id}
                href={`/admin/products/edit/${product.id}`}
                className="group p-3 transition-shadow hover:shadow-md"
                style={{ background: 'white', border: '1px solid rgba(125,32,53,0.1)' }}
              >
                {/* Thumbnail */}
                <div
                  className="w-full mb-3 rounded overflow-hidden"
                  style={{ aspectRatio: '1', background: 'var(--parchment)' }}
                >
                  {img && (
                    <img src={img.url} alt={product.name} className="w-full h-full object-cover" />
                  )}
                </div>

                <p className="text-[14px] font-medium truncate" style={{ color: 'var(--noir)' }}>
                  {product.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[12px]" style={{ color: 'var(--berry)' }}>
                    {variant ? `CA$${(variant.priceCad / 100).toLocaleString()}` : 'No price'}
                  </p>
                  <span
                    className="text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
                    style={{
                      background: product.isPublished ? 'rgba(125,32,53,0.1)' : 'rgba(158,122,130,0.15)',
                      color:      product.isPublished ? 'var(--burgundy)'      : 'var(--berry)',
                    }}
                  >
                    {product.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
