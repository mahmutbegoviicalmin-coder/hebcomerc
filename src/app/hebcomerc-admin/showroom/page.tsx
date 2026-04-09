"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const BG     = "#08090f";
const PANEL  = "#0e1018";
const CARD   = "#161825";
const CARD2  = "#1c1f2e";
const BORDER = "#252840";
const TEXT   = "#eceef8";
const MUTED  = "#8890b0";
const MUTED2 = "#454868";
const BLUE   = "#c0392b";
const BLUE_G = "linear-gradient(135deg,#e74c3c,#922b21)";
const RED    = "#c0392b";
const RED_G  = "linear-gradient(135deg,#e74c3c,#922b21)";

const PROMPT_TEMPLATE = "Place the shown products naturally inside this space. Do NOT change the room structure, walls, floor, or lighting. Keep the original spatial layout completely intact — only add and arrange the products within the existing scene.";

type AR = "16:9" | "1:1" | "9:16" | "4:3";

const AR_SHAPES: Record<AR, { w: number; h: number }> = {
  "16:9": { w: 28, h: 16 },
  "1:1":  { w: 20, h: 20 },
  "9:16": { w: 14, h: 24 },
  "4:3":  { w: 24, h: 18 },
};

const AR_LABELS: Record<AR, string> = {
  "16:9": "Krajolik",
  "1:1":  "Kvadrat",
  "9:16": "Portret",
  "4:3":  "Klasik",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type RefImage = { url: string; isLocal: boolean; file?: File };
type HistItem = { path: string; prompt: string; ar: AR; at: string; spaceCount: number; productCount: number };

// ─── Format Button ────────────────────────────────────────────────────────────
function FormatBtn({ ratio, active, onClick }: { ratio: AR; active: boolean; onClick: () => void }) {
  const s = AR_SHAPES[ratio];
  return (
    <button onClick={onClick} style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 7, height: 64, borderRadius: 10, cursor: "pointer",
      background: active ? "linear-gradient(145deg,#1e2a5e,#131a3e)" : CARD,
      border: `1.5px solid ${active ? BLUE : BORDER}`,
      boxShadow: active ? `0 0 0 1px ${BLUE}33, inset 0 1px 0 rgba(255,255,255,0.06)` : "none",
      transition: "all 0.18s", padding: 0,
    }}>
      <div style={{
        width: s.w, height: s.h, borderRadius: 3,
        background: active ? `linear-gradient(135deg,${BLUE},#922b21)` : MUTED2,
        boxShadow: active ? `0 2px 8px ${BLUE}66` : "none",
      }} />
      <span style={{ color: active ? "#fca5a5" : MUTED2, fontSize: 9, fontWeight: 600, letterSpacing: 0.3 }}>
        {ratio}
      </span>
    </button>
  );
}

// ─── Mini drop zone ───────────────────────────────────────────────────────────
function MiniZone({
  images, onChange, maxImages, accent, emptyLabel, emptyHint, icon,
}: {
  images: RefImage[]; onChange: (v: RefImage[]) => void;
  maxImages: number; accent: string;
  emptyLabel: string; emptyHint: string; icon: React.ReactNode;
}) {
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, maxImages - images.length);
    onChange([...images, ...arr.map(f => ({ url: URL.createObjectURL(f), isLocal: true, file: f }))]);
  }, [images, onChange, maxImages]);

  const full = images.length >= maxImages;

  return (
    <div>
      {images.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          onDragEnter={() => setDrag(true)}
          onDragLeave={() => setDrag(false)}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          style={{
            border: `2px dashed ${drag ? accent : BORDER}`,
            borderRadius: 10, padding: "18px 14px", textAlign: "center",
            cursor: "pointer", background: drag ? accent + "08" : CARD,
            transition: "all 0.18s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ color: drag ? accent : MUTED2 }}>{icon}</div>
            <p style={{ margin: 0, color: drag ? accent : TEXT, fontSize: 12, fontWeight: 600 }}>{emptyLabel}</p>
          </div>
          <p style={{ margin: 0, color: MUTED2, fontSize: 10 }}>{emptyHint} · do {maxImages}</p>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); if (!full) addFiles(e.dataTransfer.files); }}
          style={{ background: CARD, borderRadius: 10, padding: 8, border: `1.5px dashed ${drag ? accent : BORDER}`, transition: "border-color 0.18s" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: "relative", width: 52, height: 52, borderRadius: 7, overflow: "hidden", border: `1px solid ${BORDER}`, flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={e => { e.stopPropagation(); onChange(images.filter((_, j) => j !== i)); }}
                  style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.88)", border: "none", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>×</button>
              </div>
            ))}
            {!full && (
              <button onClick={() => fileRef.current?.click()}
                style={{ width: 52, height: 52, borderRadius: 7, border: `2px dashed ${BORDER}`, background: "transparent", color: MUTED2, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</button>
            )}
          </div>
        </div>
      )}
      {images.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ color: MUTED2, fontSize: 10 }}><span style={{ color: accent, fontWeight: 700 }}>{images.length}</span> / {maxImages}</span>
          <button onClick={() => onChange([])} style={{ background: "none", border: "none", color: MUTED2, fontSize: 10, cursor: "pointer", padding: 0 }}>Ukloni ×</button>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => addFiles(e.target.files!)} />
    </div>
  );
}

// ─── History panel ─────────────────────────────────────────────────────────────
function HistoryPanel({ items, onClose, onSelect }: {
  items: HistItem[]; onClose: () => void; onSelect: (path: string) => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: 320, background: PANEL, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, color: TEXT, fontSize: 14, fontWeight: 700 }}>Historija generisanja</p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
          {items.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 60, color: MUTED2 }}>
              <p style={{ fontSize: 28, margin: "0 0 8px" }}>🎨</p>
              <p style={{ margin: 0, fontSize: 13 }}>Još nema historije</p>
            </div>
          )}
          {items.map((item, i) => (
            <div key={i} onClick={() => { onSelect(item.path); onClose(); }}
              style={{ borderRadius: 10, overflow: "hidden", background: CARD, border: `1px solid ${BORDER}`, marginBottom: 10, cursor: "pointer", transition: "border-color 0.15s" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <Image src={item.path} alt="" fill style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: "8px 10px" }}>
                <p style={{ margin: "0 0 6px", color: MUTED, fontSize: 11, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.prompt}</p>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <span style={{ background: BLUE+"22", color: BLUE, fontSize: 9, padding: "1px 7px", borderRadius: 5, fontWeight: 700 }}>NanoBanana 2</span>
                  <span style={{ background: CARD2, color: MUTED2, fontSize: 9, padding: "1px 7px", borderRadius: 5, border: `1px solid ${BORDER}` }}>{item.ar}</span>
                  <span style={{ background: "rgba(6,182,212,0.1)", color: "#67e8f9", fontSize: 9, padding: "1px 7px", borderRadius: 5 }}>{item.spaceCount} prostora</span>
                  <span style={{ background: "rgba(139,92,246,0.1)", color: "#c4b5fd", fontSize: 9, padding: "1px 7px", borderRadius: 5 }}>{item.productCount} prod</span>
                  <span style={{ marginLeft: "auto", color: MUTED2, fontSize: 9 }}>{item.at}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ShowroomPage() {
  const ar: AR = "16:9";
  const [prompt, setPrompt]       = useState("");
  // Space images (photos of the room/showroom to place products in)
  const [spaceImages, setSpaceImages] = useState<RefImage[]>([]);
  // Product images (products to be placed inside the space)
  const [productImages, setProductImages] = useState<RefImage[]>([]);
  const [generating, setGen]      = useState(false);
  const [error, setError]         = useState("");
  const [result, setResult]       = useState<string | null>(null);
  const [history, setHistory]     = useState<HistItem[]>([]);
  const [showHist, setHist]       = useState(false);
  const [copied, setCopied]       = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const allImages = [...spaceImages, ...productImages];

  const handleEnhance = async () => {
    if (!prompt.trim()) { setError("Unesi opis prije poboljšanja."); return; }
    if (spaceImages.length === 0) { setError("Dodaj slike prostora da bi Claude mogao vidjeti scenu."); return; }
    if (productImages.length === 0) { setError("Dodaj slike proizvoda da bi Claude mogao vidjeti šta postavljaš."); return; }
    setError("");
    setEnhancing(true);
    try {
      // Convert ALL images to base64 — Claude sees everything the user uploaded
      const spaceB64   = (await Promise.all(spaceImages.map(toBase64))).filter(Boolean);
      const productB64 = (await Promise.all(productImages.map(toBase64))).filter(Boolean);

      const res = await fetch("/api/admin/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          spaceImages: spaceB64,
          productImages: productB64,
        }),
      });
      const data = await res.json();
      if (data.enhanced) {
        setPrompt(data.enhanced);
      } else {
        setError(data.error ?? "Greška pri poboljšanju prompta.");
      }
    } catch { setError("Greška mreže."); }
    setEnhancing(false);
  };

  // Convert a RefImage to {data, mediaType} base64 for Claude vision
  const toBase64 = (img: RefImage): Promise<{ data: string; mediaType: string } | null> =>
    new Promise((resolve) => {
      const readBlob = (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const [header, data] = result.split(",");
          const mediaType = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
          resolve({ data, mediaType });
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      };
      if (img.isLocal && img.file) {
        readBlob(img.file);
      } else {
        fetch(img.url).then(r => r.blob()).then(readBlob).catch(() => resolve(null));
      }
    });

  const uploadImages = async (images: RefImage[]): Promise<string[]> => {
    const localFiles = images.filter(r => r.isLocal && r.file);
    const remoteUrls = images.filter(r => !r.isLocal).map(r => r.url);
    if (localFiles.length === 0) return remoteUrls;
    const fd = new FormData();
    localFiles.forEach(r => fd.append("files", r.file!));
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upData = await upRes.json();
    if (upData.paths) {
      return [...upData.paths.map((p: string) => `${window.location.origin}${p}`), ...remoteUrls];
    }
    return remoteUrls;
  };

  const handleGenerate = async () => {
    setError("");
    if (!prompt.trim()) { setError("Opis je obavezan."); return; }
    if (spaceImages.length === 0) { setError("Dodaj najmanje 1 sliku prostora."); return; }
    if (productImages.length === 0) { setError("Dodaj najmanje 1 sliku proizvoda."); return; }

    setGen(true);
    try {
      // Upload space images first (they appear first in the array → NanoBanana treats them as primary reference)
      const spaceUrls   = await uploadImages(spaceImages);
      const productUrls = await uploadImages(productImages);
      const imageUrls   = [...spaceUrls, ...productUrls];

      const res = await fetch("/api/admin/showroom", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageUrls, aspectRatio: ar }),
      });
      const data = await res.json();
      if (!res.ok || !data.path) {
        setError(data.error ?? "Greška pri generisanju.");
      } else {
        setResult(data.path);
        setHistory(prev => [{
          path: data.path, prompt, ar,
          spaceCount: spaceImages.length,
          productCount: productImages.length,
          at: new Date().toLocaleTimeString("hr"),
        }, ...prev]);
      }
    } catch { setError("Greška mreže."); }
    setGen(false);
  };

  return (
    <div style={{ height: "100vh", background: BG, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ─── Top bar ─────────────────────────────────────────────────── */}
      <div style={{
        height: 50, borderBottom: `1px solid ${BORDER}`, background: PANEL,
        display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0,
        backdropFilter: "blur(12px)",
      }}>
        <Link href="/hebcomerc-admin" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 30, height: 30, borderRadius: 8, background: CARD,
          border: `1px solid ${BORDER}`, color: MUTED, textDecoration: "none", fontSize: 14,
          transition: "all 0.15s",
        }}>←</Link>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 15, fontFamily: "'Sora',sans-serif" }}>
            Make Showroom
          </span>
          <span style={{ color: MUTED2, fontSize: 12 }}>·</span>
          <span style={{ color: MUTED2, fontSize: 12 }}>Postavi proizvode u tvoj prostor</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Format badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 7, padding: "5px 12px",
            background: "linear-gradient(135deg,#1a0a0a,#2a0e0e)",
            border: `1px solid ${RED}44`, borderRadius: 8,
          }}>
            <svg width="11" height="11" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <span style={{ color: "#fca5a5", fontSize: 12, fontWeight: 600 }}>Format</span>
            <span style={{ background: RED, color: "#fff", fontSize: 10, padding: "1px 8px", borderRadius: 5, fontWeight: 800 }}>16:9</span>
          </div>

          {/* History */}
          <button onClick={() => setHist(true)} style={{
            display: "flex", alignItems: "center", gap: 6, background: CARD,
            border: `1px solid ${BORDER}`, borderRadius: 8, padding: "5px 12px",
            color: MUTED, fontSize: 12, cursor: "pointer", position: "relative",
          }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.96"/>
            </svg>
            Historija
            {history.length > 0 && (
              <span style={{ background: BLUE, color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 99, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{history.length}</span>
            )}
          </button>

          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, cursor: "pointer" }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Body ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Canvas */}
        <div style={{ flex: 1, background: BG, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {result ? (
            <>
              <div style={{ position: "relative", maxWidth: "min(88%,860px)", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)" }}>
                <Image src={result} alt="Generirano" width={860} height={480} style={{ display: "block", maxWidth: "100%", maxHeight: "calc(100vh - 110px)", width: "auto", height: "auto" }} />
              </div>
              {/* Canvas actions */}
              <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
                {[
                  {
                    label: copied ? "✓ Kopirano!" : "Kopiraj putanju",
                    action: () => { navigator.clipboard.writeText(result!).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); },
                    active: copied,
                  },
                  { label: "Novo generisanje ↺", action: () => setResult(null), active: false },
                ].map(b => (
                  <button key={b.label} onClick={b.action} style={{
                    padding: "8px 16px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: b.active ? "rgba(6,78,59,0.9)" : "rgba(14,16,24,0.88)",
                    border: `1px solid ${b.active ? "#065f46" : BORDER}`,
                    color: b.active ? "#6ee7b7" : MUTED,
                    backdropFilter: "blur(10px)",
                  }}>{b.label}</button>
                ))}
                <a href={result} download style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12, fontWeight: 600, background: "rgba(14,16,24,0.88)", border: `1px solid ${BORDER}`, color: MUTED, textDecoration: "none", backdropFilter: "blur(10px)" }}>
                  ⬇ Preuzmi
                </a>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", pointerEvents: "none" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, margin: "0 auto 16px",
                background: "linear-gradient(145deg,#14162a,#1e2038)",
                border: `1px solid ${BORDER}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                <svg width="26" height="26" fill="none" stroke={MUTED2} strokeWidth="1.4" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <p style={{ margin: "0 0 6px", fontSize: 15, color: TEXT, fontWeight: 600, fontFamily: "'Sora',sans-serif" }}>
                Dodaj slike prostora i proizvoda
              </p>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: MUTED2 }}>AI će postaviti tvoje proizvode u prostor</p>
              <p style={{ margin: 0, fontSize: 11, color: MUTED2, opacity: 0.6 }}>bez mijenjanja oblika prostora</p>
            </div>
          )}

          {/* Generating overlay */}
          {generating && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,15,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
              <div style={{ position: "relative", width: 60, height: 60, marginBottom: 20 }}>
                <div style={{ position: "absolute", inset: 0, border: `2px solid ${BLUE}22`, borderRadius: "50%" }} />
                <div style={{ position: "absolute", inset: 0, border: `2px solid transparent`, borderTopColor: BLUE, borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
                <div style={{ position: "absolute", inset: 8, border: `2px solid transparent`, borderTopColor: BLUE+"88", borderRadius: "50%", animation: "spin 1.4s linear infinite reverse" }} />
              </div>
              <p style={{ margin: "0 0 6px", color: TEXT, fontSize: 16, fontWeight: 700, fontFamily: "'Sora',sans-serif" }}>Generisanje slike...</p>
              <p style={{ margin: 0, color: MUTED2, fontSize: 12 }}>NanoBanana 2 · 2K · može trajati do 2 minute</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <span style={{ fontSize: 11, color: "#a5f3fc", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                  {spaceImages.length} prostora
                </span>
                <span style={{ fontSize: 11, color: "#d8b4fe", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                  {productImages.length} proizvoda
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─── Right panel ─────────────────────────────────────────── */}
        <div style={{
          width: 300, flexShrink: 0, display: "flex", flexDirection: "column",
          background: PANEL, borderLeft: `1px solid ${BORDER}`,
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>

            {/* ─ Zone 1: Prostor ─ */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" fill="none" stroke="#67e8f9" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <span style={{ color: "#a5f3fc", fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>Slike prostora</span>
                <span style={{ background: "rgba(6,182,212,0.1)", color: "#67e8f9", fontSize: 9, padding: "1px 7px", borderRadius: 5, border: "1px solid rgba(6,182,212,0.2)", fontWeight: 600 }}>
                  {spaceImages.length} / 5
                </span>
              </div>
              <p style={{ margin: "0 0 10px", color: MUTED2, fontSize: 10, lineHeight: 1.5 }}>
                Fotografije prostorije u kojoj ćeš izložiti proizvode. AI čuva izgled prostora nepromijenjenim.
              </p>
              <MiniZone
                images={spaceImages} onChange={setSpaceImages} maxImages={5} accent="#06b6d4"
                emptyLabel="Prevuci slike prostora" emptyHint="JPG, PNG, WEBP"
                icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>}
              />
            </div>

            {/* ─ Zone 2: Proizvodi ─ */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" fill="none" stroke="#c4b5fd" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                  </svg>
                </div>
                <span style={{ color: "#d8b4fe", fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>Slike proizvoda</span>
                <span style={{ background: "rgba(139,92,246,0.1)", color: "#c4b5fd", fontSize: 9, padding: "1px 7px", borderRadius: 5, border: "1px solid rgba(139,92,246,0.2)", fontWeight: 600 }}>
                  {productImages.length} / 9
                </span>
              </div>
              <p style={{ margin: "0 0 10px", color: MUTED2, fontSize: 10, lineHeight: 1.5 }}>
                Fotografije proizvoda koje želiš smjestiti u prostor. AI ih prirodno rasporedi unutar scene.
              </p>
              <MiniZone
                images={productImages} onChange={setProductImages} maxImages={9} accent="#8b5cf6"
                emptyLabel="Prevuci slike proizvoda" emptyHint="JPG, PNG, WEBP"
                icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>}
              />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: BORDER, marginBottom: 20 }} />


            {/* Opis / Prompt */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: TEXT, fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>Uputa za AI</span>
                  <span style={{ color: "#ef4444", fontSize: 12 }}>*</span>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {/* Enhance button */}
                  <button
                    onClick={handleEnhance}
                    disabled={enhancing}
                    style={{
                      background: enhancing ? "rgba(120,20,15,0.3)" : RED_G,
                      border: `1px solid ${enhancing ? "#7f1d1d" : RED}`,
                      color: enhancing ? "#f87171" : "#fff",
                      fontSize: 10, cursor: enhancing ? "not-allowed" : "pointer",
                      fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                      display: "flex", alignItems: "center", gap: 4,
                      transition: "all 0.15s",
                      boxShadow: enhancing ? "none" : `0 2px 10px ${RED}55`,
                    }}
                    title="Claude analizira slike i poboljšava prompt"
                  >
                    {enhancing ? (
                      <><span style={{ display: "inline-block", width: 8, height: 8, border: "1.5px solid #f8717144", borderTop: "1.5px solid #f87171", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Poboljšavam...</>
                    ) : (
                      <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>Poboljšaj</>
                    )}
                  </button>
                </div>
              </div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4}
                placeholder="Postavi prikazane proizvode u ovaj prostor, bez mijenjanja oblika i strukture prostorije..."
                style={{
                  width: "100%", background: CARD, border: `1.5px solid ${BORDER}`,
                  borderRadius: 10, color: TEXT, padding: "10px 12px", fontSize: 12,
                  outline: "none", resize: "vertical", fontFamily: "inherit",
                  boxSizing: "border-box", lineHeight: 1.6, transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = BLUE+"66"; }}
                onBlur={e => { e.target.style.borderColor = BORDER; }}
              />
              <p style={{ margin: "5px 0 0", color: MUTED2, fontSize: 10, display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ color: "#f87171", fontWeight: 600 }}>Poboljšaj</span> — AI analizira slike i repiše uputu na engleski
              </p>
            </div>

            {error && (
              <div style={{ background: "rgba(45,10,10,0.8)", border: "1px solid #7f1d1d", borderRadius: 8, padding: "9px 12px", color: "#f87171", fontSize: 12, marginBottom: 8 }}>
                {error}
              </div>
            )}
          </div>

          {/* Generate */}
          <div style={{ padding: "14px 16px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <button onClick={handleGenerate} disabled={generating} style={{
              width: "100%", padding: "13px", borderRadius: 11, fontSize: 14, fontWeight: 700,
              background: generating ? "#161825" : BLUE_G,
              border: "none", color: generating ? MUTED2 : "#fff",
              cursor: generating ? "not-allowed" : "pointer",
              boxShadow: generating ? "none" : `0 6px 20px ${BLUE}55, inset 0 1px 0 rgba(255,255,255,0.12)`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s", fontFamily: "'Sora',sans-serif",
            }}>
              {generating ? (
                <><span style={{ display:"inline-block",width:14,height:14,border:`2px solid ${BLUE}33`,borderTop:`2px solid ${BLUE}`,borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>Generisanje...</>
              ) : (
                <>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Generiši showroom
                  {allImages.length > 0 && (
                    <span style={{ background:"rgba(255,255,255,0.18)", borderRadius:6, padding:"2px 9px", fontSize:11, fontWeight:700 }}>{allImages.length} slika</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showHist && <HistoryPanel items={history} onClose={() => setHist(false)} onSelect={p => { setResult(p); setHist(false); }} />}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} textarea:focus{border-color:${BLUE}66!important;}`}</style>
    </div>
  );
}
