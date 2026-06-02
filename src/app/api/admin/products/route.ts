import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Product } from "@/data/products";
import {
  readCustomProducts,
  writeCustomProducts,
  customProductsStorageReady,
} from "@/lib/custom-products-store";

export async function GET() {
  const products = await readCustomProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    if (!customProductsStorageReady()) {
      return NextResponse.json(
        {
          error:
            "BLOB_READ_WRITE_TOKEN nije postavljen na Vercelu. Storage → Blob → Connect Store.",
        },
        { status: 503 }
      );
    }

    const body = await req.json();

    if (!body.name || !body.slug || !body.category) {
      return NextResponse.json(
        { error: "Naziv, slug i kategorija su obavezni." },
        { status: 400 }
      );
    }

    const products = await readCustomProducts();

    const exists = products.some((p) => p.slug === body.slug);
    if (exists) {
      return NextResponse.json(
        { error: "Proizvod s tim slug-om već postoji." },
        { status: 409 }
      );
    }

    const newProduct: Product = {
      id: `custom_${Date.now()}`,
      slug: body.slug,
      name: body.name,
      category: body.category,
      categorySlug: body.categorySlug ?? "",
      shortDescription: body.shortDescription ?? "",
      description: body.description ?? "",
      specs: body.specs ?? [],
      idealFor: body.idealFor ?? [],
      images: body.images ?? [],
      featured: body.featured ?? false,
      tags: body.tags ?? [],
    };

    products.push(newProduct);
    await writeCustomProducts(products);

    revalidatePath("/ponuda");
    revalidatePath(`/ponuda/${newProduct.slug}`);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products:", err);
    return NextResponse.json({ error: "Greška pri dodavanju proizvoda." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!customProductsStorageReady()) {
      return NextResponse.json(
        {
          error:
            "BLOB_READ_WRITE_TOKEN nije postavljen na Vercelu. Storage → Blob → Connect Store.",
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID je obavezan." }, { status: 400 });
    }

    const products = await readCustomProducts();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Proizvod nije pronađen." }, { status: 404 });
    }

    await writeCustomProducts(filtered);
    revalidatePath("/ponuda");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/products:", err);
    return NextResponse.json({ error: "Greška pri brisanju." }, { status: 500 });
  }
}
