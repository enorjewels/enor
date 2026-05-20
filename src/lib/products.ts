import { prisma } from '@/lib/prisma';
import type { Category } from '@/types';

/** Fetch a single product by slug — includes images + variants */
export async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      images:   { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { isDefault: 'desc' } },
    },
  });
}

/** Fetch products for the shop listing — filter + sort */
export async function getProducts(opts: {
  category?: Category;
  metal?:    string;
  minPrice?: number; // cents
  maxPrice?: number; // cents
  sort?:     'price_asc' | 'price_desc' | 'newest' | 'featured';
  page?:     number;
  limit?:    number;
}) {
  const { category, sort = 'featured', page = 1, limit = 12 } = opts;

  const where = {
    isPublished: true,
    ...(category ? { category } : {}),
  };

  const orderBy =
    sort === 'price_asc'  ? { variants: { _min: { priceCad: 'asc'  as const } } } :
    sort === 'price_desc' ? { variants: { _min: { priceCad: 'desc' as const } } } :
    sort === 'newest'     ? { createdAt: 'desc' as const } :
    /* featured */          { isFeatured: 'desc' as const };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
      include: {
        images:   { where: { isPrimary: true }, take: 2 },
        variants: { orderBy: { isDefault: 'desc' }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, pages: Math.ceil(total / limit) };
}

/** Featured products for homepage */
export async function getFeaturedProducts(limit = 3) {
  return prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    take: limit,
    include: {
      images:   { where: { isPrimary: true }, take: 1 },
      variants: { orderBy: { isDefault: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
  });
}
