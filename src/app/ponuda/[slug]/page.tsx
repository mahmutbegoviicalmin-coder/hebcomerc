import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, products, type Product } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import fs from "fs";
import path from "path";

export function generateStaticParams() {
  if (process.env.NODE_ENV === "development") return [];
  return products.map((p) => ({ slug: p.slug }));
}

function getCustomProducts(): Product[] {
  try {
    const file = path.join(process.cwd(), "public", "data", "custom-products.json");
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null | undefined = getProductBySlug(slug);

  if (!product) {
    const custom = getCustomProducts();
    product = custom.find((p) => p.slug === slug) ?? null;
  }

  if (!product) notFound();

  const related = getRelatedProducts(product);

  return <ProductDetailClient product={product} related={related} />;
}
