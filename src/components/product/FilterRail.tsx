'use client';

// ─── FilterRail ──────────────────────────────────────────
export function FilterRail() {
  return (
    <aside
      className="self-start"
      style={{
        position:    'sticky',
        top:         '140px',
        borderRight: '1px solid rgba(125,32,53,0.1)',
        paddingRight: '30px',
      }}
    >
      {/* Category */}
      <div style={{ padding: '18px 0', borderBottom: '1px solid rgba(125,32,53,0.1)' }}>
        <h4 className="text-[11px] uppercase tracking-[0.22em] font-normal mb-4" style={{ color: 'rgba(26,10,13,0.7)' }}>
          Category
        </h4>
        {[
          ['Fine Jewellery', 'FINE',         '42'],
          ['Traditional',    'TRADITIONAL',  '18'],
          ['Gifts',          'GIFTS',        '24'],
          ['Made to Order',  'MADE_TO_ORDER','12'],
        ].map(([label, value, qty]) => (
          <label key={value} className="flex justify-between items-center py-1.5 text-[14px] cursor-pointer hover:text-burgundy transition-colors">
            <span>{label}</span>
            <span className="text-[11px]" style={{ color: 'rgba(26,10,13,0.5)' }}>{qty}</span>
          </label>
        ))}
      </div>

      {/* Metal tone */}
      <div style={{ padding: '18px 0', borderBottom: '1px solid rgba(125,32,53,0.1)' }}>
        <h4 className="text-[11px] uppercase tracking-[0.22em] font-normal mb-4" style={{ color: 'rgba(26,10,13,0.7)' }}>
          Metal Tone
        </h4>
        <div className="flex gap-2.5 flex-wrap">
          {[
            { cls: 'gold-y', label: 'Yellow Gold', bg: 'linear-gradient(135deg,#e8c87a,#b48a3a)' },
            { cls: 'gold-r', label: 'Rose Gold',   bg: 'linear-gradient(135deg,#e8a888,#b46a4a)' },
            { cls: 'gold-w', label: 'White Gold',  bg: 'linear-gradient(135deg,#ece7dd,#b9b3a8)' },
            { cls: 'gold-g', label: 'Green Gold',  bg: 'linear-gradient(135deg,#cfd6c0,#8a9874)' },
          ].map(({ label, bg }) => (
            <button
              key={label}
              title={label}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110"
              style={{ background: bg, outline: '1px solid rgba(125,32,53,0.14)', outlineOffset: '2px' }}
              aria-label={label}
            />
          ))}
        </div>
      </div>

      {/* Price range */}
      <div style={{ padding: '18px 0', borderBottom: '1px solid rgba(125,32,53,0.1)' }}>
        <h4 className="text-[11px] uppercase tracking-[0.22em] font-normal mb-4" style={{ color: 'rgba(26,10,13,0.7)' }}>
          Price
        </h4>
        <div className="flex justify-between text-[12px]">
          <span>CA$420</span>
          <span>CA$4,800</span>
        </div>
        <div className="relative h-px my-4" style={{ background: 'rgba(125,32,53,0.14)' }}>
          <div
            className="absolute top-[-1px] h-[3px]"
            style={{ left: '14%', right: '18%', background: 'var(--burgundy)' }}
          />
        </div>
      </div>
    </aside>
  );
}
