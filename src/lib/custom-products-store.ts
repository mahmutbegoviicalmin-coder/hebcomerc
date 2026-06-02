import fs from "fs";
import path from "path";
import type { Product } from "@/data/products";

const DATA_FILE = path.join(process.cwd(), "public", "data", "custom-products.json");
const BLOB_PATHNAME = "hebcomerc/data/custom-products.json";

const useBlob = () =>
  !!process.env.VERCEL && !!process.env.BLOB_READ_WRITE_TOKEN;

function readFromDisk(): Product[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

export async function readCustomProducts(): Promise<Product[]> {
  if (useBlob()) {
    try {
      const { head } = await import("@vercel/blob");
      const meta = await head(BLOB_PATHNAME);
      const res = await fetch(meta.url, { cache: "no-store" });
      if (!res.ok) return readFromDisk();
      const parsed = await res.json();
      return Array.isArray(parsed) ? (parsed as Product[]) : [];
    } catch {
      return readFromDisk();
    }
  }
  return readFromDisk();
}

export async function writeCustomProducts(products: Product[]): Promise<void> {
  const json = JSON.stringify(products, null, 2);

  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, json, "utf-8");
}

export function customProductsStorageReady(): boolean {
  if (!process.env.VERCEL) return true;
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}
