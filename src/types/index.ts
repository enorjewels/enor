// ─── En or — shared types ────────────────────────────────

export type Metal = 'YELLOW_GOLD' | 'ROSE_GOLD' | 'WHITE_GOLD' | 'GREEN_GOLD' | 'SILVER';
export type Karat = 'K9' | 'K14' | 'K18' | 'K22' | 'K24' | 'SILVER_925';
export type Category = 'FINE' | 'TRADITIONAL' | 'GIFTS' | 'MADE_TO_ORDER';
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export const METAL_LABELS: Record<Metal, string> = {
  YELLOW_GOLD: '18K Yellow Gold',
  ROSE_GOLD:   '18K Rose Gold',
  WHITE_GOLD:  '18K White Gold',
  GREEN_GOLD:  '18K Green Gold',
  SILVER:      '925 Silver',
};

export const KARAT_LABELS: Record<Karat, string> = {
  K9:        '9K',
  K14:       '14K',
  K18:       '18K',
  K22:       '22K',
  K24:       '24K',
  SILVER_925: '925',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  FINE:         'Fine Jewellery',
  TRADITIONAL:  'Traditional',
  GIFTS:        'Gifts',
  MADE_TO_ORDER:'Made to Order',
};

// ─── UI product types (from API / Prisma) ─────────────────

export interface ProductImage {
  id:          string;
  cloudinaryId:string;
  url:         string;
  altText:     string | null;
  width:       number;
  height:      number;
  sortOrder:   number;
  isPrimary:   boolean;
}

export interface ProductVariant {
  id:             string;
  metal:          Metal;
  karat:          Karat;
  size:           string | null;
  weightGrams:    number | null;
  priceCad:       number;        // cents
  comparePriceCad:number | null; // cents
  sku:            string;
  stock:          number;
  isDefault:      boolean;
}

export interface Product {
  id:          string;
  slug:        string;
  name:        string;
  subtitle:    string | null;
  description: string;
  story:       string | null;
  careNote:    string | null;
  category:    Category;
  tags:        string[];
  isFeatured:  boolean;
  images:      ProductImage[];
  variants:    ProductVariant[];
}

// ─── Cart ────────────────────────────────────────────────

export interface CartItem {
  variantId:  string;
  productId:  string;
  productSlug:string;
  name:       string;
  metal:      Metal;
  karat:      Karat;
  size:       string | null;
  priceCad:   number; // cents
  quantity:   number;
  image:      string;
  imageAlt:   string;
}

export interface Cart {
  items:     CartItem[];
  totalCad:  number; // cents
  itemCount: number;
}

// ─── Stripe / Checkout ───────────────────────────────────

export interface CheckoutPayload {
  cartItems: CartItem[];
  successUrl: string;
  cancelUrl:  string;
}

// ─── Utilities ───────────────────────────────────────────

/** Format cents to CA$ display string */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style:    'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
