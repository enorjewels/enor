'use client';

interface Props {
  total:       number;
  currentSort: string;
}

export function ControlBar({ total, currentSort }: Props) {
  return (
    <div
      className="flex justify-between items-center px-9 py-4"
      style={{
        position:       'sticky',
        top:            '64px',
        zIndex:         40,
        background:     'color-mix(in oklab, var(--cream) 90%, transparent)',
        backdropFilter: 'blur(14px)',
        borderTop:      '1px solid rgba(125,32,53,0.1)',
        borderBottom:   '1px solid rgba(125,32,53,0.1)',
      }}
    >
      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Rings', 'Bangles', 'Pendants', 'Earrings'].map((label, i) => (
          <button
            key={label}
            className="px-3.5 py-2 rounded-full border text-[11px] uppercase tracking-[0.18em] transition-colors"
            style={{
              border:     '1px solid rgba(26,10,13,0.22)',
              background: i === 0 ? 'var(--noir)' : 'none',
              color:      i === 0 ? 'var(--cream)' : 'var(--noir)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right: count + sort */}
      <div className="flex items-center gap-3.5">
        <span className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'rgba(26,10,13,0.6)' }}>
          {total} pieces
        </span>
        <select
          className="rounded-full border px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] bg-transparent appearance-none cursor-pointer"
          style={{ borderColor: 'rgba(26,10,13,0.22)' }}
          defaultValue={currentSort}
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low–High</option>
          <option value="price_desc">Price: High–Low</option>
        </select>
      </div>
    </div>
  );
}
