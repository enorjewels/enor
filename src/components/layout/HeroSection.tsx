// HeroSection stub — replace with full animated hero
export function HeroSection() {
  return (
    <section
      className="grid grid-cols-2 min-h-screen"
      style={{ paddingTop: 'var(--nav-h)' }}
    >
      <div className="flex flex-col justify-center px-16 py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] mb-8" style={{ color: 'var(--berry)' }}>
          New collection — Spring 2025
        </p>
        <h1 className="font-serif italic font-light text-display-xl mb-6" style={{ color: 'var(--noir)' }}>
          Wear what<br />
          <em style={{ color: 'var(--burgundy)' }}>moves you.</em>
        </h1>
        <p className="text-[16px] leading-[1.7] max-w-[40ch] mb-10" style={{ color: 'var(--berry)' }}>
          Solid gold. Hand-set stones. Pieces that earn their place on your skin.
        </p>
        <a
          href="/shop"
          className="inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.14em]"
          style={{ color: 'var(--noir)', borderBottom: '1px solid var(--noir)', paddingBottom: '2px', width: 'fit-content' }}
        >
          Explore the collection →
        </a>
      </div>
      <div style={{ background: 'var(--parchment)' }} aria-hidden="true" />
    </section>
  );
}
