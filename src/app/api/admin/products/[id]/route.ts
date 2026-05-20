import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// PATCH /api/admin/products/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data:  {
        ...(body.name        !== undefined && { name:        body.name }),
        ...(body.slug        !== undefined && { slug:        body.slug }),
        ...(body.subtitle    !== undefined && { subtitle:    body.subtitle }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.story       !== undefined && { story:       body.story }),
        ...(body.careNote    !== undefined && { careNote:    body.careNote }),
        ...(body.category    !== undefined && { category:    body.category }),
        ...(body.tags        !== undefined && { tags:        body.tags }),
        ...(body.isFeatured  !== undefined && { isFeatured:  body.isFeatured }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      },
      include: { images: true, variants: true },
    });

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/product/${product.slug}`);
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.delete({ where: { id: params.id } });
    revalidatePath('/shop');
    return NextResponse.json({ deleted: product.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
