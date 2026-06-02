import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, products, type Product } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import { readCustomProducts } from "@/lib/custom-products-store";

export function generateStaticParams() {
  if (process.env.NODE_ENV === "development") return [];
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null | undefined = getProductBySlug(slug);

  if (!product) {
    const custom = await readCustomProducts();
    product = custom.find((p) => p.slug === slug) ?? null;
  }

  if (!product) notFound();

  const related = getRelatedProducts(product);

  return <ProductDetailClient product={product} related={related} />;
}
