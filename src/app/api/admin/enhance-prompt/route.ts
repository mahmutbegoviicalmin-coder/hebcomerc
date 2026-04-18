import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Claude with multiple images can take 15-30s — extend timeout
export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type B64Image = { data: string; mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" };

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY nije konfigurisan." }, { status: 500 });
  }

  try {
    const {
      prompt,
      spaceImages = [],
      productImages = [],
    }: { prompt: string; spaceImages: B64Image[]; productImages: B64Image[] } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt je prazan." }, { status: 400 });
    }
    if (spaceImages.length === 0) {
      return NextResponse.json({ error: "Potrebna je najmanje jedna slika prostora." }, { status: 400 });
    }
    if (productImages.length === 0) {
      return NextResponse.json({ error: "Potrebna je najmanje jedna slika proizvoda." }, { status: 400 });
    }

    const systemPrompt = `You are an expert prompt engineer specializing in interior design and product placement for AI image generation.

The user is using NanoBanana 2 — an image-to-image diffusion model. They have uploaded:
1. Space/room photos — the physical environment where products will be placed
2. Product photos — the items to be placed inside that space

You will be shown ALL uploaded images. Study each one carefully:
- Analyze every space image: room type, architectural style, colors, materials, lighting direction, existing furniture, flooring, wall color
- Analyze every product image: product type, exact color, material, finish, size proportion, style

Then write a precise English prompt that instructs NanoBanana 2 to place those exact products into that exact space.

Critical rules:
- Write ONLY in English
- Preserve the room's structure, architecture, walls, floor, ceiling, and lighting EXACTLY — do not alter anything in the space
- Describe realistic placement: natural shadows, correct perspective, material interaction with light
- Reference specific visual details visible in the images (exact colors, materials, styles)
- Be concise but precise — under 180 words
- Return ONLY the prompt text itself, no preamble, no labels, no quotes, no explanations`;

    // Build content: all space images, then all product images, then the task
    const contentBlocks: Anthropic.Messages.ContentBlockParam[] = [];

    contentBlocks.push({ type: "text", text: `SPACE / ROOM IMAGES (${spaceImages.length} total):` });
    spaceImages.forEach((img) => {
      contentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: img.mediaType, data: img.data },
      });
    });

    contentBlocks.push({ type: "text", text: `PRODUCT IMAGES (${productImages.length} total):` });
    productImages.forEach((img) => {
      contentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: img.mediaType, data: img.data },
      });
    });

    contentBlocks.push({
      type: "text",
      text: `User's rough prompt idea: "${prompt.trim()}"\n\nBased on all the images above, write the optimized image-to-image prompt for NanoBanana 2.`,
    });

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: "user", content: contentBlocks }],
    });

    const enhanced =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    if (!enhanced) {
      return NextResponse.json({ error: "Claude nije vratio odgovor." }, { status: 500 });
    }

    return NextResponse.json({ enhanced });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
