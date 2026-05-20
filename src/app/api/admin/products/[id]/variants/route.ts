import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/products/[id]/variants — add variant
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const variant = await prisma.productVariant.create({
      data: {
        productId:       params.id,
        metal:           body.metal,
        karat:           body.karat,
        size:            body.size        || null,
        weightGrams:     body.weightGrams || null,
        priceCad:        body.priceCad,      // cents
        comparePriceCad: body.comparePriceCad || null,
        sku:             body.sku,
        stock:           body.stock ?? 0,
        isDefault:       body.isDefault ?? false,
      },
    });
    return NextResponse.json(variant, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// PUT /api/admin/products/[id]/variants — replace all variants (bulk save)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { variants } = await req.json();

    await prisma.$transaction([
      prisma.productVariant.deleteMany({ where: { productId: params.id } }),
      prisma.productVariant.createMany({
        data: variants.map((v: any) => ({
          productId:       params.id,
          metal:           v.metal,
          karat:           v.karat,
          size:            v.size            || null,
          weightGrams:     v.weightGrams      || null,
          priceCad:        v.priceCad,
          comparePriceCad: v.comparePriceCad  || null,
          sku:             v.sku,
          stock:           v.stock ?? 0,
          isDefault:       v.isDefault ?? false,
        })),
      }),
    ]);

    const updated = await prisma.productVariant.findMany({ where: { productId: params.id } });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
