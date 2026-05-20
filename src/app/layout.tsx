import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Nav } from '@/components/layout/Nav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Cursor } from '@/components/ui/Cursor';

export const metadata: Metadata = {
  title:       { default: 'En or — Wear what moves you', template: '%s | En or' },
  description: 'Luxury jewellery. Certified gold. Crafted by hand. Ships across Canada.',
  metadataBase: new URL('https://enor.ca'),
  openGraph: {
    type:      'website',
    siteName:  'En or',
    locale:    'en_CA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body>
        <Cursor />
        <Nav />
        <CartDrawer />
        <main>{children}</main>
      </body>
    </html>
  );
}
