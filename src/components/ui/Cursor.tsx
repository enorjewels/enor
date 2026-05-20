'use client';

import { useEffect, useRef } from 'react';

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    let cx = innerWidth / 2, cy = innerHeight / 2;
    let tx = cx, ty = cy;
    let raf: number;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };

    const tick = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    // Cursor states based on data-cursor attribute
    const onEnter = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      if (!target) return;
      const kind  = target.getAttribute('data-cursor');
      const label = target.getAttribute('data-label') ?? '';
      if (kind === 'add')   el.classList.add('is-add');
      if (kind === 'hover') el.classList.add('is-hover');
      if (label) el.setAttribute('data-label', label);
    };
    const onLeave = () => {
      el.classList.remove('is-hover', 'is-add');
      el.removeAttribute('data-label');
    };

    document.addEventListener('mouseover',  onEnter);
    document.addEventListener('mouseout',   onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover',  onEnter);
      document.removeEventListener('mouseout',   onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
