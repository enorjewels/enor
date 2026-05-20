export function StorySection() {
  return (
    <section
      className="grid grid-cols-2 min-h-[480px]"
      style={{ background: 'var(--bordeaux)' }}
    >
      <div style={{ background: 'rgba(0,0,0,0.15)' }} aria-hidden="true" />
      <div className="flex flex-col justify-center px-16 py-20">
        <p className="text-[10px] uppercase tracking-[0.18em] mb-6" style={{ color: 'var(--blush)' }}>
          The Craft
        </p>
        <h2 className="font-serif italic font-light text-display-lg mb-5" style={{ color: 'var(--cream)' }}>
          Light that stays<br />with you.
        </h2>
        <p className="text-[14px] leading-[1.8] max-w-[40ch] mb-8" style={{ color: 'rgba(250,247,242,0.65)' }}>
          Every piece begins as a sketch. It passes through three pairs of hands before it reaches yours.
          That is the only way we know how to make jewellery.
        </p>
        <a
          href="/story"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--blush)' }}
        >
          Our ateliers →
        </a>
      </div>
    </section>
  );
}
