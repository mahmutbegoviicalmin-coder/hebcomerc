import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NANO_BASE = "https://api.nanobananaapi.ai";
const UPLOAD_DIR = path.join(process.cwd(), "public", "products");

async function pollTask(taskId: string, apiKey: string, maxMs = 120_000): Promise<{
  resultImageUrl: string;
  originImageUrl: string;
} | null> {
  const deadline = Date.now() + maxMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3000));

    const res = await fetch(
      `${NANO_BASE}/api/v1/nanobanana/record-info?taskId=${taskId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const json = await res.json();
    const data = json.data;

    if (!data) return null;

    if (data.successFlag === 1) {
      return {
        resultImageUrl: data.response?.resultImageUrl ?? "",
        originImageUrl: data.response?.originImageUrl ?? "",
      };
    }

    if (data.successFlag === 2 || data.successFlag === 3) {
      return null;
    }
  }

  return null;
}

async function downloadImage(url: string): Promise<string> {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = `ai_${Date.now()}.jpg`;
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filePath, buffer);

  return `/products/${filename}`;
}

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
    const { prompt, aspectRatio = "1:1", resolution = "1K" } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt je obavezan." }, { status: 400 });
    }

    // 1. Submit generation task
    const submitRes = await fetch(`${NANO_BASE}/api/v1/nanobanana/generate-2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        imageUrls: [],
        aspectRatio,
        resolution,
        outputFormat: "jpg",
      }),
    });

    const submitData = await submitRes.json();

    if (!submitRes.ok || !submitData.data?.taskId) {
      return NextResponse.json(
        { error: submitData.message ?? "Greška pri slanju zahtjeva." },
        { status: 502 }
      );
    }

    const taskId: string = submitData.data.taskId;

    // 2. Poll until done
    const result = await pollTask(taskId, apiKey);

    if (!result) {
      return NextResponse.json(
        { error: "Generisanje nije uspjelo ili je isteklo vrijeme." },
        { status: 504 }
      );
    }

    // 3. Download and save locally
    const localPath = await downloadImage(result.resultImageUrl);

    return NextResponse.json({ success: true, path: localPath, taskId });
  } catch (err) {
    console.error("NanoBanana error:", err);
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}
