import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = { title: 'New Product' };

export default function NewProductPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-light tracking-tight mb-8" style={{ color: 'var(--noir)' }}>
        New Product
      </h1>
      <ProductForm />
    </div>
  );
}
