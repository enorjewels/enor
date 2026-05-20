'use client';

import { useState, useRef, useCallback } from 'react';
import type { ProductImage } from '@/types';

interface Props {
  productId: string;
  initial:   ProductImage[];
  onChange?: (images: ProductImage[]) => void;
}

export function ImageUploader({ productId, initial, onChange }: Props) {
  const [images,   setImages]   = useState<ProductImage[]>(initial);
  const [dragging, setDragging] = useState(false);
  const [uploading,setUploading]= useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    const arr = Array.from(files);

    for (const file of arr) {
      const fd = new FormData();
      fd.append('file',      file);
      fd.append('productId', productId);
      fd.append('isPrimary', images.length === 0 ? 'true' : 'false');

      const res  = await fetch('/api/admin/images/upload', { method: 'POST', body: fd });
      const img  = await res.json();
      setImages(prev => {
        const next = [...prev, img];
        onChange?.(next);
        return next;
      });
    }
    setUploading(false);
  }

  async function deleteImage(id: string) {
    await fetch(`/api/admin/images/upload?imageId=${id}`, { method: 'DELETE' });
    setImages(prev => {
      const next = prev.filter(i => i.id !== id);
      onChange?.(next);
      return next;
    });
  }

  async function setPrimary(id: string) {
    const next = images.map((img, idx) => ({ ...img, isPrimary: img.id === id, sortOrder: idx }));
    setImages(next);
    onChange?.(next);
    await fetch('/api/admin/images/reorder', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ images: next }),
    });
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, [images]);

  const BORDER = '1px solid rgba(125,32,53,0.15)';

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 py-10 rounded cursor-pointer transition-colors"
        style={{
          border:     `2px dashed ${dragging ? 'var(--burgundy)' : 'rgba(125,32,53,0.2)'}`,
          background: dragging ? 'rgba(125,32,53,0.04)' : 'transparent',
        }}
      >
        <span className="text-3xl" style={{ color: 'rgba(125,32,53,0.3)' }}>↑</span>
        <p className="text-[13px]" style={{ color: 'var(--berry)' }}>
          {uploading ? 'Uploading…' : 'Drop images here or click to browse'}
        </p>
        <p className="text-[11px]" style={{ color: 'rgba(158,122,130,0.6)' }}>
          JPG, PNG, WEBP — up to 20MB each. First image becomes primary.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-3 mt-5">
          {images.map(img => (
            <div
              key={img.id}
              className="relative group rounded overflow-hidden"
              style={{
                aspectRatio: '1',
                border:      img.isPrimary ? '2px solid var(--burgundy)' : BORDER,
                background:  'var(--parchment)',
              }}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />

              {/* Primary badge */}
              {img.isPrimary && (
                <span
                  className="absolute top-1.5 left-1.5 text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5"
                  style={{ background: 'var(--burgundy)', color: 'var(--cream)' }}
                >
                  Primary
                </span>
              )}

              {/* Hover actions */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(26,10,13,0.55)' }}
              >
                {!img.isPrimary && (
                  <button
                    onClick={() => setPrimary(img.id)}
                    className="text-[10px] uppercase tracking-[0.1em] px-2 py-1"
                    style={{ background: 'var(--cream)', color: 'var(--noir)' }}
                  >
                    Set primary
                  </button>
                )}
                <button
                  onClick={() => deleteImage(img.id)}
                  className="text-[10px] uppercase tracking-[0.1em] px-2 py-1"
                  style={{ background: 'var(--rose)', color: 'var(--cream)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
