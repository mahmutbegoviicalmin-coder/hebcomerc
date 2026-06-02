import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { readCustomProducts } from "@/lib/custom-products-store";

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  images: string[];
};

export const dynamic = "force-dynamic";

export async function GET() {
  const staticList: ProductListItem[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    images: p.images,
  }));

  const custom = await readCustomProducts();
  const customList: ProductListItem[] = custom.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    images: p.images ?? [],
  }));

  return NextResponse.json([...staticList, ...customList]);
}
