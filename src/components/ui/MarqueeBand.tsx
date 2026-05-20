const ITEMS = [
  'Certified solid gold',
  'Hand-set in Jaipur',
  'Ships across Canada',
  'Lifetime repolish',
  'Conflict-free stones',
  '30-day returns',
];

export function MarqueeBand() {
  const repeated = [...ITEMS, ...ITEMS]; // doubled for seamless loop

  return (
    <div
      className="overflow-hidden py-3"
      style={{ background: 'var(--burgundy)' }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 px-8 text-[11px] uppercase tracking-[0.22em] font-light"
            style={{ color: 'var(--cream)' }}
          >
            {item}
            <span className="mx-4 opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
