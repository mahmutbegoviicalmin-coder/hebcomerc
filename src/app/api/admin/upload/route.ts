import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "products");
const IS_VERCEL  = !!process.env.VERCEL;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Nema fajlova." }, { status: 400 });
    }

    // ── On Vercel: use Vercel Blob ────────────────────────────────────────────
    if (IS_VERCEL) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
          { error: "BLOB_READ_WRITE_TOKEN nije konfigurisan u Vercel env vars." },
          { status: 503 }
        );
      }
      const { put } = await import("@vercel/blob");
      const urls: string[] = [];
      for (const file of files) {
        const safeName = file.name
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9.\-_]/g, "")
          .toLowerCase();
        const filename = `products/custom_${Date.now()}_${safeName}`;
        const blob = await put(filename, file, { access: "public" });
        urls.push(blob.url);
      }
      return NextResponse.json({ success: true, paths: urls });
    }

    // ── Local: save to public/products ───────────────────────────────────────
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const savedPaths: string[] = [];
    for (const file of files) {
      const safeName = file.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.\-_]/g, "")
        .toLowerCase();
      const filename = `custom_${Date.now()}_${safeName}`;
      const filePath = path.join(UPLOAD_DIR, filename);
      const buffer   = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      savedPaths.push(`/products/${filename}`);
    }

    return NextResponse.json({ success: true, paths: savedPaths });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Greška pri uploadu." }, { status: 500 });
  }
}
