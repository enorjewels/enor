'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin',          label: 'Dashboard',  icon: '⬚' },
  { href: '/admin/products', label: 'Products',   icon: '◈' },
  { href: '/admin/orders',   label: 'Orders',     icon: '◎' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <aside
      className="w-56 flex flex-col flex-shrink-0 min-h-screen"
      style={{ background: 'var(--noir)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-6 py-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <span className="font-serif italic font-light" style={{ lineHeight: 0.9 }}>
          <span className="block text-2xl" style={{ color: 'var(--cream)' }}>En</span>
          <span className="block text-2xl" style={{ color: 'var(--burgundy)', paddingLeft: '0.45em' }}>or</span>
        </span>
        <p className="text-[10px] uppercase tracking-[0.18em] mt-3" style={{ color: 'rgba(250,247,242,0.3)' }}>
          Admin
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4">
        {NAV.map(({ href, label, icon }) => {
          const active = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-[13px] mb-1 transition-colors"
              style={{
                background: active ? 'rgba(125,32,53,0.4)' : 'transparent',
                color:      active ? 'var(--cream)' : 'rgba(250,247,242,0.5)',
              }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-[11px] mb-3 transition-opacity hover:opacity-100"
          style={{ color: 'rgba(250,247,242,0.35)' }}
        >
          ↗ View storefront
        </a>
        <button
          onClick={handleLogout}
          className="text-[11px] transition-opacity hover:opacity-100"
          style={{ color: 'rgba(250,247,242,0.35)' }}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
