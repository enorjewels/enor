import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/admin/images/upload
// Body: FormData with `file` (binary) + `productId`
export async function POST(req: NextRequest) {
  try {
    const form      = await req.formData();
    const file      = form.get('file') as File;
    const productId = form.get('productId') as string;
    const isPrimary = form.get('isPrimary') === 'true';

    if (!file || !productId) {
      return NextResponse.json({ error: 'Missing file or productId' }, { status: 400 });
    }

    // Convert File to buffer
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder:          `enor/products/${productId}`,
            use_filename:    false,
            unique_filename: true,
            overwrite:       false,
            transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (err, res) => (err ? reject(err) : resolve(res))
        )
        .end(buffer);
    });

    // If this is primary, unset existing primary
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data:  { isPrimary: false },
      });
    }

    // Get current max sortOrder
    const maxOrder = await prisma.productImage.aggregate({
      where: { productId },
      _max:  { sortOrder: true },
    });

    // Save to DB
    const image = await prisma.productImage.create({
      data: {
        productId,
        cloudinaryId: result.public_id,
        url:          result.secure_url,
        width:        result.width,
        height:       result.height,
        altText:      null,
        sortOrder:    (maxOrder._max.sortOrder ?? -1) + 1,
        isPrimary,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (err: any) {
    console.error('[image upload]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/images/upload?imageId=xxx
export async function DELETE(req: NextRequest) {
  try {
    const imageId = req.nextUrl.searchParams.get('imageId');
    if (!imageId) return NextResponse.json({ error: 'Missing imageId' }, { status: 400 });

    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    // Delete from DB
    await prisma.productImage.delete({ where: { id: imageId } });

    return NextResponse.json({ deleted: imageId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
