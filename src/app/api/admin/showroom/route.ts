import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Extend Vercel function timeout to 5 minutes (Pro plan max)
export const maxDuration = 300;

const NANO_BASE  = "https://api.nanobananaapi.ai";
const UPLOAD_DIR = path.join(process.cwd(), "public", "products");
const IS_VERCEL  = !!process.env.VERCEL;

type B64Image = { data: string; mediaType: string };

// ─── Upload base64 images → get public URLs ───────────────────────────────────
async function uploadBase64Images(images: B64Image[], prefix: string): Promise<string[]> {
  const urls: string[] = [];

  if (IS_VERCEL) {
    // Use Vercel Blob for public URLs
    const { put } = await import("@vercel/blob");
    for (let i = 0; i < images.length; i++) {
      const img  = images[i];
      const ext  = img.mediaType.split("/")[1] ?? "jpg";
      const name = `${prefix}_${Date.now()}_${i}.${ext}`;
      const buf  = Buffer.from(img.data, "base64");
      const blob = await put(name, buf, {
        access: "public",
        contentType: img.mediaType,
      });
      urls.push(blob.url);
    }
  } else {
    // Local: save to public/products/
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    for (let i = 0; i < images.length; i++) {
      const img  = images[i];
      const ext  = img.mediaType.split("/")[1] ?? "jpg";
      const name = `${prefix}_${Date.now()}_${i}.${ext}`;
      const buf  = Buffer.from(img.data, "base64");
      fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
      urls.push(`/products/${name}`);
    }
  }

  return urls;
}

// ─── Poll until NanoBanana finishes ──────────────────────────────────────────
async function pollTask(taskId: string, apiKey: string, maxMs = 240_000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3000));
    const res  = await fetch(`${NANO_BASE}/api/v1/nanobanana/record-info?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = await res.json();
    const data = json.data;
    if (!data) return null;
    if (data.successFlag === 1) return data.response as { resultImageUrl: string };
    if (data.successFlag === 2 || data.successFlag === 3) return null;
  }
  return null;
}

// ─── Download and save result locally (non-Vercel) ───────────────────────────
async function saveResultImage(url: string): Promise<string> {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const res    = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const file   = `showroom_${Date.now()}.jpg`;
  fs.writeFileSync(path.join(UPLOAD_DIR, file), buffer);
  return `/products/${file}`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const apiKey = process.env.NANOBANANA_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json(
      { error: "NANOBANANA_API_KEY nije postavljen." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const {
      prompt,
      aspectRatio = "16:9",
      spaceImages   = [] as B64Image[],
      productImages = [] as B64Image[],
      // Legacy: direct imageUrls still supported
      imageUrls = [] as string[],
    } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt je obavezan." }, { status: 400 });
    }

    // Upload base64 images → public URLs (if provided)
    let allImageUrls: string[] = [...imageUrls];

    if (spaceImages.length > 0 || productImages.length > 0) {
      if (IS_VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
          { error: "BLOB_READ_WRITE_TOKEN nije konfigurisan u Vercel env vars. Postavi Vercel Blob storage u dashboardu." },
          { status: 503 }
        );
      }
      const spaceUrls   = await uploadBase64Images(spaceImages,   "space");
      const productUrls = await uploadBase64Images(productImages, "product");
      allImageUrls = [...spaceUrls, ...productUrls];
    }

    // Call NanoBanana 2
    const submitRes = await fetch(`${NANO_BASE}/api/v1/nanobanana/generate-2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        imageUrls: allImageUrls.slice(0, 14),
        aspectRatio,
        resolution: "2K",
        outputFormat: "jpg",
      }),
    });

    const submitData = await submitRes.json();
    const taskId     = submitData.data?.taskId;

    if (!taskId) {
      return NextResponse.json(
        { error: submitData.message ?? submitData.msg ?? "Nije vraćen taskId." },
        { status: 502 }
      );
    }

    const result = await pollTask(taskId, apiKey);
    if (!result) {
      return NextResponse.json(
        { error: "Generisanje nije uspjelo ili je isteklo." },
        { status: 504 }
      );
    }

    // On Vercel, return the CDN URL directly
    if (IS_VERCEL) {
      return NextResponse.json({ success: true, path: result.resultImageUrl, taskId });
    }

    const localPath = await saveResultImage(result.resultImageUrl);
    return NextResponse.json({ success: true, path: localPath, taskId });
  } catch (err) {
    console.error("Showroom error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
