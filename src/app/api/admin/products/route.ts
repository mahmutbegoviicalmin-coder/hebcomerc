import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const DATA_FILE = path.join(process.cwd(), "public", "data", "custom-products.json");

function readProducts() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

const IS_VERCEL = !!process.env.VERCEL;

function writeProducts(products: unknown[]) {
  if (IS_VERCEL) throw new Error("VERCEL_READONLY");
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.slug || !body.category) {
      return NextResponse.json({ error: "Naziv, slug i kategorija su obavezni." }, { status: 400 });
    }

    const products = readProducts();

    const exists = products.some(
      (p: { slug: string }) => p.slug === body.slug
    );
    if (exists) {
      return NextResponse.json({ error: "Proizvod s tim slug-om već postoji." }, { status: 409 });
    }

    const newProduct = {
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
    writeProducts(products);

    revalidatePath("/ponuda");
    revalidatePath(`/ponuda/${newProduct.slug}`);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "VERCEL_READONLY") {
      return NextResponse.json({ error: "Admin write operacije rade samo lokalno. Dodaj proizvod lokalno pa pushaj na GitHub." }, { status: 503 });
    }
    return NextResponse.json({ error: "Greška pri dodavanju proizvoda." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID je obavezan." }, { status: 400 });
    }

    const products = readProducts();
    const filtered = products.filter((p: { id: string }) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Proizvod nije pronađen." }, { status: 404 });
    }

    writeProducts(filtered);
    revalidatePath("/ponuda");

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "VERCEL_READONLY") {
      return NextResponse.json({ error: "Admin write operacije rade samo lokalno." }, { status: 503 });
    }
    return NextResponse.json({ error: "Greška pri brisanju." }, { status: 500 });
  }
}
