import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/admin/products — list all
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { images: true, variants: true },
  });
  return NextResponse.json(products);
}

// POST /api/admin/products — create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        slug:        body.slug,
        name:        body.name,
        subtitle:    body.subtitle   || null,
        description: body.description,
        story:       body.story      || null,
        careNote:    body.careNote   || null,
        category:    body.category,
        tags:        body.tags       || [],
        isFeatured:  body.isFeatured || false,
        isPublished: body.isPublished || false,
      },
    });

    revalidatePath('/');
    revalidatePath('/shop');
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/admin/products]', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
