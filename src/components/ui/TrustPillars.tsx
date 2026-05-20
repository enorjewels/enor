const PILLARS = [
  { icon: '★', title: 'Solid gold, always',   body: '14k minimum, no plating, no shortcuts. Hallmarked & weighed.' },
  { icon: '↺', title: 'Lifetime repolish',    body: 'Bring it back to us. We polish, retip and resize forever.' },
  { icon: '✿', title: 'Made by 3 hands',      body: 'One wax carver, one karigar, one final setter. Always.' },
  { icon: '→', title: 'Free shipping in CA',  body: 'Insured & signature-required, in a single linen pouch.' },
];

export function TrustPillars() {
  return (
    <section
      className="grid grid-cols-4 border-t"
      style={{ borderColor: 'rgba(125,32,53,0.1)' }}
    >
      {PILLARS.map(({ icon, title, body }, i) => (
        <div
          key={title}
          className="flex flex-col gap-3 px-10 py-12"
          style={{
            borderRight: i < 3 ? '1px solid rgba(125,32,53,0.1)' : 'none',
          }}
        >
          <span className="text-xl" style={{ color: 'var(--burgundy)' }} aria-hidden="true">
            {icon}
          </span>
          <strong className="font-sans font-normal text-[13px] tracking-[0.06em]">{title}</strong>
          <p className="text-[13px] leading-[1.6]" style={{ color: 'var(--berry)' }}>{body}</p>
        </div>
      ))}
    </section>
  );
}
