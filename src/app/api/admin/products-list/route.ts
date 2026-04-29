import { NextResponse } from "next/server";
import { products } from "@/data/products";
import fs from "fs";
import path from "path";

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  images: string[];
};

export async function GET() {
  // Static products
  const staticList: ProductListItem[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    images: p.images,
  }));

  // Custom products from JSON
  let customList: ProductListItem[] = [];
  try {
    const filePath = path.join(process.cwd(), "public", "data", "custom-products.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      customList = parsed.map((p: ProductListItem) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        images: p.images ?? [],
      }));
    }
  } catch {
    // ignore
  }

  return NextResponse.json([...staticList, ...customList]);
}
