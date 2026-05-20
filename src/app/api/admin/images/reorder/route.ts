import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/images/reorder
// Body: { images: [{ id, sortOrder, isPrimary }] }
export async function PATCH(req: NextRequest) {
  try {
    const { images } = await req.json();

    await prisma.$transaction(
      images.map((img: { id: string; sortOrder: number; isPrimary: boolean }) =>
        prisma.productImage.update({
          where: { id: img.id },
          data:  { sortOrder: img.sortOrder, isPrimary: img.isPrimary },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
