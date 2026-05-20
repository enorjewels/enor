'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product, ProductVariant, ProductImage } from '@/types';

interface Row extends Product {
  variants: ProductVariant[];
  images:   ProductImage[];
}

interface Props { products: Row[]; }

export function ProductsTable({ products: initial }: Props) {
  const [products, setProducts] = useState(initial);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading,  setLoading]  = useState<string | null>(null);
  const router = useRouter();

  // Toggle published
  async function togglePublished(id: string, current: boolean) {
    setLoading(id);
    await fetch(`/api/admin/products/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ isPublished: !current }),
    });
    setProducts(p => p.map(r => r.id === id ? { ...r, isPublished: !current } : r));
    setLoading(null);
  }

  // Delete single
  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts(p => p.filter(r => r.id !== id));
    setSelected(s => { s.delete(id); return new Set(s); });
  }

  // Bulk publish/unpublish/delete
  async function bulkAction(action: 'publish' | 'unpublish' | 'delete') {
    if (action === 'delete' && !confirm(`Delete ${selected.size} products?`)) return;
    const ids = [...selected];
    await Promise.all(ids.map(id =>
      action === 'delete'
        ? fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
        : fetch(`/api/admin/products/${id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ isPublished: action === 'publish' }),
          })
    ));
    if (action === 'delete') {
      setProducts(p => p.filter(r => !ids.includes(r.id)));
    } else {
      setProducts(p => p.map(r => ids.includes(r.id) ? { ...r, isPublished: action === 'publish' } : r));
    }
    setSelected(new Set());
  }

  const allSelected = products.length > 0 && selected.size === products.length;

  const CELL = 'px-4 py-3 text-[13px]';
  const TH   = 'px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-left font-normal';

  return (
    <div>
      {/* Bulk bar */}
      {selected.size > 0 && (
        <div
          className="flex items-center gap-4 px-4 py-3 mb-4 text-[12px]"
          style={{ background: 'rgba(125,32,53,0.08)', border: '1px solid rgba(125,32,53,0.15)' }}
        >
          <span style={{ color: 'var(--burgundy)' }}>{selected.size} selected</span>
          <button onClick={() => bulkAction('publish')}   className="hover:underline" style={{ color: 'var(--noir)' }}>Publish</button>
          <button onClick={() => bulkAction('unpublish')} className="hover:underline" style={{ color: 'var(--noir)' }}>Unpublish</button>
          <button onClick={() => bulkAction('delete')}    className="hover:underline" style={{ color: 'var(--rose)'  }}>Delete</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto opacity-50 hover:opacity-100">✕ Clear</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid rgba(125,32,53,0.1)' }}>
        <table className="w-full border-collapse">
          <thead style={{ borderBottom: '1px solid rgba(125,32,53,0.1)' }}>
            <tr>
              <th className={TH} style={{ width: 40, color: 'var(--berry)' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(products.map(p => p.id)))}
                />
              </th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Product</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Category</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Variants</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Price from</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Status</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              const img       = product.images[0];
              const minPrice  = product.variants.length
                ? Math.min(...product.variants.map(v => v.priceCad))
                : null;

              return (
                <tr
                  key={product.id}
                  style={{ borderBottom: i < products.length - 1 ? '1px solid rgba(125,32,53,0.07)' : 'none' }}
                >
                  {/* Checkbox */}
                  <td className={CELL}>
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => {
                        const next = new Set(selected);
                        next.has(product.id) ? next.delete(product.id) : next.add(product.id);
                        setSelected(next);
                      }}
                    />
                  </td>

                  {/* Product */}
                  <td className={CELL}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded flex-shrink-0 overflow-hidden"
                        style={{ background: 'var(--parchment)' }}
                      >
                        {img && <img src={img.url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--noir)' }}>{product.name}</p>
                        <p className="text-[11px]" style={{ color: 'var(--berry)' }}>{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className={CELL} style={{ color: 'var(--berry)' }}>
                    {product.category.replace('_', ' ')}
                  </td>

                  {/* Variants */}
                  <td className={CELL} style={{ color: 'var(--berry)' }}>
                    {product.variants.length}
                  </td>

                  {/* Price */}
                  <td className={CELL} style={{ color: 'var(--noir)' }}>
                    {minPrice ? `CA$${(minPrice / 100).toLocaleString()}` : '—'}
                  </td>

                  {/* Status toggle */}
                  <td className={CELL}>
                    <button
                      onClick={() => togglePublished(product.id, product.isPublished)}
                      disabled={loading === product.id}
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.1em] transition-all"
                      style={{
                        background: product.isPublished ? 'rgba(125,32,53,0.12)' : 'rgba(158,122,130,0.12)',
                        color:      product.isPublished ? 'var(--burgundy)'       : 'var(--berry)',
                        opacity:    loading === product.id ? 0.5 : 1,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: product.isPublished ? 'var(--burgundy)' : 'var(--berry)' }}
                      />
                      {product.isPublished ? 'Live' : 'Draft'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className={CELL}>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-[12px] hover:underline"
                        style={{ color: 'var(--burgundy)' }}
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="text-[12px] opacity-50 hover:opacity-100"
                        style={{ color: 'var(--noir)' }}
                      >
                        ↗
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-[12px] opacity-40 hover:opacity-100"
                        style={{ color: 'var(--rose)' }}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-serif italic text-xl mb-2" style={{ color: 'var(--berry)' }}>No products yet.</p>
            <Link href="/admin/products/new" className="text-[12px]" style={{ color: 'var(--burgundy)' }}>
              Add your first piece →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
