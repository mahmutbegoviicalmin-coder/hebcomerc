import { NextResponse } from "next/server";
import { readCustomProducts } from "@/lib/custom-products-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await readCustomProducts();
  return NextResponse.json(products, {
    headers: { "Cache-Control": "no-store" },
  });
}
