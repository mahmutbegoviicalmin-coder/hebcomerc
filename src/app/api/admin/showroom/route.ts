import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NANO_BASE  = "https://api.nanobananaapi.ai";
const UPLOAD_DIR = path.join(process.cwd(), "public", "products");

// ─── Poll until done ──────────────────────────────────────────────────────────
async function pollTask(taskId: string, apiKey: string, maxMs = 120_000) {
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

// ─── Download and save locally ────────────────────────────────────────────────
async function saveImage(url: string): Promise<string> {
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
      { error: "NANOBANANA_API_KEY nije postavljen u .env.local" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { prompt, imageUrls = [], aspectRatio = "1:1", resolution = "1K" } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt je obavezan." }, { status: 400 });
    }

    // Always NanoBanana 2 — imageUrls empty = text-to-image, with URLs = image-to-image
    const submitRes = await fetch(`${NANO_BASE}/api/v1/nanobanana/generate-2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        imageUrls: Array.isArray(imageUrls) ? imageUrls.slice(0, 14) : [],
        aspectRatio,
        resolution,
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

    const localPath = await saveImage(result.resultImageUrl);

    return NextResponse.json({ success: true, path: localPath, taskId });
  } catch (err) {
    console.error("Showroom error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
