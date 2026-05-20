import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = { title: 'Edit Product' };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where:   { id: params.id },
    include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true },
  });
  if (!product) notFound();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-light tracking-tight mb-2" style={{ color: 'var(--noir)' }}>
        Edit Product
      </h1>
      <p className="text-[13px] mb-8" style={{ color: 'var(--berry)' }}>
        {product.name}
      </p>
      <ProductForm product={product as any} />
    </div>
  );
}
