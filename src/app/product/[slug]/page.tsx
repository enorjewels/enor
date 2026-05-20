import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/products';
import { ProductGallery }   from '@/components/product/ProductGallery';
import { ProductDetail }    from '@/components/product/ProductDetail';
import { ComplementaryGrid }from '@/components/product/ComplementaryGrid';
import { ProductStory }     from '@/components/product/ProductStory';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Not Found' };
  return {
    title:       product.name,
    description: product.subtitle ?? product.description.slice(0, 160),
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <nav
        className="px-12 py-4 text-[11px] uppercase tracking-widest border-b"
        style={{ borderColor: 'rgba(125,32,53,0.08)', color: 'var(--berry)' }}
        aria-label="Breadcrumb"
      >
        <a href="/">En or</a>
        <span className="mx-2 opacity-40">/</span>
        <a href="/shop">Fine Jewellery</a>
        <span className="mx-2 opacity-40">/</span>
        <span style={{ color: 'var(--noir)' }}>{product.name}</span>
      </nav>

      {/* Two-column product layout */}
      <div
        className="grid"
        style={{ gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 72px)' }}
      >
        <ProductGallery images={product.images} name={product.name} />
        <ProductDetail product={product as any} />
      </div>

      {/* Below the fold */}
      <ComplementaryGrid currentSlug={product.slug} category={product.category as any} />
      <ProductStory story={product.story} name={product.name} />
    </>
  );
}
