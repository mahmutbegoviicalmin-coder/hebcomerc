"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, categories, type Product } from "@/data/products";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const BG      = "#0a0b0f";
const SIDEBAR = "#0e0f15";
const SURFACE = "#111318";
const CARD    = "#161820";
const BORDER  = "#1e2030";
const TEXT    = "#f0f1f6";
const MUTED   = "#7c849e";
const MUTED2  = "#3d4258";
const RED     = "#C0392B";
const RED_DIM = "#7f1d1d";
const RED_G   = "linear-gradient(135deg,#e74c3c,#922b21)";
// Keep BLUE alias for legacy usage in subcomponents
const BLUE    = RED;
const BLUE_DIM= RED_DIM;

const CAT_COLORS = ["#e74c3c","#e67e22","#27ae60","#8e44ad","#16a085","#f39c12","#2980b9","#1abc9c","#e91e8c"];

// ─── Slug ─────────────────────────────────────────────────────────────────────
function toSlug(n: string) {
  return n.toLowerCase()
    .replace(/š/g,"s").replace(/č/g,"c").replace(/ć/g,"c")
    .replace(/ž/g,"z").replace(/đ/g,"dj")
    .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
type Tab = "dashboard" | "products" | "categories";

function NavItem({ active, onClick, icon, label }: { active?: boolean; onClick?: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "9px 14px", borderRadius: 8, border: "none", cursor: "pointer",
      background: active ? `${RED}14` : "transparent",
      color: active ? "#fca5a5" : MUTED2,
      fontSize: 13, fontWeight: active ? 600 : 400,
      textAlign: "left", marginBottom: 1, transition: "all 0.15s",
      position: "relative",
    }}>
      {active && <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, background: RED, borderRadius: "0 3px 3px 0" }} />}
      <span style={{ color: active ? RED : MUTED2, opacity: active ? 1 : 0.7 }}>{icon}</span>
      {label}
    </button>
  );
}

function Sidebar({ tab, setTab, onAdd }: {
  tab: Tab; setTab: (t: Tab) => void; onAdd: () => void;
}) {
  return (
    <aside style={{
      width: 210, background: SIDEBAR, borderRight: `1px solid ${BORDER}`,
      display: "flex", flexDirection: "column", flexShrink: 0,
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: RED_G,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900, color: "#fff",
            boxShadow: `0 4px 12px ${RED}44`,
          }}>H</div>
          <span style={{ color: TEXT, fontSize: 15, fontWeight: 800, letterSpacing: -0.4, fontFamily: "'Sora',sans-serif" }}>
            heb<span style={{ color: RED }}>comerc</span>
          </span>
        </div>
      </div>

      <div style={{ height: 1, background: BORDER, margin: "0 18px" }} />

      {/* Main nav */}
      <nav style={{ padding: "14px 8px", flex: 1 }}>
        <p style={{ margin: "0 14px 8px", color: MUTED2, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, fontWeight: 600 }}>Katalog</p>
        <NavItem active={tab === "dashboard"} onClick={() => setTab("dashboard")} label="Pregled"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>} />
        <NavItem active={tab === "products"} onClick={() => setTab("products")} label="Proizvodi"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>} />
        <NavItem active={tab === "categories"} onClick={() => setTab("categories")} label="Kategorije"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>} />

        <div style={{ height: 1, background: BORDER, margin: "12px 6px" }} />

        <p style={{ margin: "0 14px 8px", color: MUTED2, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, fontWeight: 600 }}>Alati</p>
        <Link href="/hebcomerc-admin/showroom" style={{ textDecoration: "none" }}>
          <NavItem label="Make Showroom"
            icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>} />
        </Link>

        <div style={{ height: 1, background: BORDER, margin: "12px 6px" }} />

        <p style={{ margin: "0 14px 8px", color: MUTED2, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, fontWeight: 600 }}>Sajt</p>
        <Link href="/ponuda" target="_blank" style={{ textDecoration: "none" }}>
          <NavItem label="Ponuda"
            icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>} />
        </Link>
        <Link href="/kontakt" target="_blank" style={{ textDecoration: "none" }}>
          <NavItem label="Kontakt"
            icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} />
        </Link>
      </nav>

      {/* Add button */}
      <div style={{ padding: "14px 12px 20px" }}>
        <button onClick={onAdd} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "10px", borderRadius: 9,
          background: RED_G, border: "none", color: "#fff",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 4px 16px ${RED}40`,
          transition: "all 0.15s",
        }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Dodaj proizvod
        </button>
      </div>
    </aside>
  );
}

// ─── Stat strip ───────────────────────────────────────────────────────────────
function StatStrip({ items }: { items: { label: string; value: number | string }[] }) {
  return (
    <div style={{ display: "flex", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          flex: 1, padding: "18px 24px",
          borderRight: i < items.length - 1 ? `1px solid ${BORDER}` : "none",
        }}>
          <p style={{ margin: "0 0 6px", color: MUTED, fontSize: 11, fontWeight: 500 }}>{item.label}</p>
          <p style={{ margin: 0, color: TEXT, fontSize: 24, fontWeight: 800, fontFamily: "'Sora',sans-serif", letterSpacing: -0.5 }}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Category row ─────────────────────────────────────────────────────────────
function CatRow({ name, count, max, rank }: { name: string; count: number; max: number; rank: number }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ color: MUTED2, fontSize: 11, width: 16, textAlign: "right", flexShrink: 0 }}>{rank}</span>
      <span style={{ color: MUTED, fontSize: 13, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{name}</span>
      <div style={{ width: 100, background: BORDER, borderRadius: 99, height: 3, flexShrink: 0 }}>
        <div style={{ background: RED, borderRadius: 99, height: 3, width: `${pct}%`, opacity: 0.7 }} />
      </div>
      <span style={{ color: TEXT, fontSize: 13, fontWeight: 700, width: 24, textAlign: "right", flexShrink: 0 }}>{count}</span>
    </div>
  );
}

// ─── Product row ──────────────────────────────────────────────────────────────
function ProductRow({ p, idx, isCustom, onDelete }: {
  p: Product; idx: number; isCustom: boolean; onDelete?: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  return (
    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
      <td style={{ padding: "11px 16px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 9, overflow: "hidden", background: CARD, position: "relative", flexShrink: 0, border: `1px solid ${BORDER}` }}>
          {p.images[0] ? <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: "cover" }} /> : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" fill="none" stroke={MUTED2} strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          )}
        </div>
      </td>
      <td style={{ padding: "11px 16px" }}>
        <p style={{ margin: 0, color: TEXT, fontSize: 13, fontWeight: 600 }}>{p.name}</p>
        <p style={{ margin: "2px 0 0", color: MUTED2, fontSize: 11 }}>/{p.slug}</p>
      </td>
      <td style={{ padding: "11px 16px" }}>
        <span style={{ background: CARD, color: MUTED, fontSize: 11, padding: "3px 10px", borderRadius: 6, border: `1px solid ${BORDER}`, whiteSpace: "nowrap" as const }}>
          {p.category}
        </span>
      </td>
      <td style={{ padding: "11px 16px", color: MUTED, fontSize: 13 }}>{p.images.length}</td>
      <td style={{ padding: "11px 16px" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {p.featured && <span style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontSize: 10, padding: "2px 9px", borderRadius: 20, fontWeight: 600, border: "1px solid rgba(245,158,11,0.2)" }}>★ Istaknuto</span>}
          {isCustom && <span style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", fontSize: 10, padding: "2px 9px", borderRadius: 20, fontWeight: 600, border: "1px solid rgba(74,222,128,0.2)" }}>Novo</span>}
        </div>
      </td>
      <td style={{ padding: "11px 16px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <Link href={`/ponuda/${p.slug}`} target="_blank" style={{
            color: MUTED, fontSize: 12, textDecoration: "none",
            border: `1px solid ${BORDER}`, padding: "4px 12px", borderRadius: 7, fontWeight: 500,
            transition: "all 0.15s",
          }}>↗</Link>
          {isCustom && onDelete && (
            <button disabled={deleting} onClick={async () => {
              if (!confirm(`Obrisati "${p.name}"?`)) return;
              setDeleting(true);
              const res = await fetch(`/api/admin/products?id=${p.id}`, { method: "DELETE" });
              if (res.ok) onDelete(p.id); else setDeleting(false);
            }} style={{
              background: "transparent", border: `1px solid ${BORDER}`, color: MUTED2,
              fontSize: 12, padding: "4px 10px", borderRadius: 7, cursor: deleting ? "not-allowed" : "pointer",
              opacity: deleting ? 0.4 : 1, transition: "all 0.15s",
            }}>×</button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Tag Input ────────────────────────────────────────────────────────────────
function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => { const v = input.trim(); if (v && !values.includes(v)) onChange([...values, v]); setInput(""); };
  return (
    <div>
      <label style={{ display: "block", color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</label>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); }}}
          placeholder="Unesi i pritisni Enter..."
          style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "7px 10px", fontSize: 12, outline: "none" }} />
        <button onClick={add} style={{ background: BLUE+"22", border: `1px solid ${BLUE}44`, color: BLUE, borderRadius: 8, padding: "7px 12px", fontSize: 12, cursor: "pointer" }}>+</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {values.map(v => (
          <span key={v} style={{ background: CARD, border: `1px solid ${BORDER}`, color: MUTED, fontSize: 11, padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 5 }}>
            {v}
            <button onClick={() => onChange(values.filter(x => x !== v))} style={{ background: "none", border: "none", color: MUTED2, cursor: "pointer", fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Specs editor ─────────────────────────────────────────────────────────────
function SpecsEditor({ specs, onChange }: { specs: { label: string; value: string }[]; onChange: (v: { label: string; value: string }[]) => void }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={{ color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Specifikacije</label>
        <button onClick={() => onChange([...specs, { label: "", value: "" }])}
          style={{ background: BLUE+"22", border: `1px solid ${BLUE}44`, color: BLUE, borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer" }}>+ Dodaj</button>
      </div>
      {specs.length === 0 && <p style={{ color: MUTED2, fontSize: 12, margin: "6px 0" }}>Nema specifikacija.</p>}
      {specs.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <input value={s.label} onChange={e => { const n = [...specs]; n[i] = { ...n[i], label: e.target.value }; onChange(n); }}
            placeholder="Naziv" style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "7px 10px", fontSize: 12, outline: "none" }} />
          <input value={s.value} onChange={e => { const n = [...specs]; n[i] = { ...n[i], value: e.target.value }; onChange(n); }}
            placeholder="Vrijednost" style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "7px 10px", fontSize: 12, outline: "none" }} />
          <button onClick={() => onChange(specs.filter((_, j) => j !== i))}
            style={{ background: "#2d0a0a", border: "1px solid #7f1d1d", color: "#f87171", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 13 }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ─── Image uploader ───────────────────────────────────────────────────────────
function ImageUploader({ images, onChange }: { images: string[]; onChange: (v: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setPreviews(prev => [...prev, ...Array.from(files).map(f => ({ file: f, url: URL.createObjectURL(f) }))]);
  };

  const uploadAll = useCallback(async (): Promise<string[]> => {
    if (!previews.length) return [];
    setUploading(true);
    const fd = new FormData();
    previews.forEach(p => fd.append("files", p.file));
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.paths) { setPreviews([]); return data.paths; }
    return [];
  }, [previews]);

  useEffect(() => {
    (window as Window & { __imgUpload?: () => Promise<string[]> }).__imgUpload = uploadAll;
  }, [uploadAll]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true); setAiError(""); setAiPreview(null);
    try {
      const res = await fetch("/api/admin/generate-image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, aspectRatio: "1:1", resolution: "1K" }),
      });
      const data = await res.json();
      if (data.path) setAiPreview(data.path); else setAiError(data.error ?? "Greška.");
    } catch { setAiError("Greška mreže."); }
    setAiGenerating(false);
  };

  const inp = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "7px 10px", fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box" as const };

  return (
    <div>
      <label style={{ display: "block", color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>DESIGN FILE</label>

      {/* Upload area */}
      <div onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        style={{ border: `1px dashed ${BORDER}`, borderRadius: 10, padding: "16px", textAlign: "center",
          cursor: "pointer", background: CARD, marginBottom: 10 }}>
        <p style={{ margin: 0, color: MUTED2, fontSize: 12 }}>⬆ Upload image</p>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* AI section */}
      <div style={{ background: "#1a0505", border: `1px solid ${RED_DIM}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
        <p style={{ margin: "0 0 8px", color: "#fca5a5", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>✨ AI Generate</p>
        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={2}
          placeholder="Product on a marble desk, natural window light, minimal..."
          style={{ ...inp, resize: "vertical", fontFamily: "inherit", marginBottom: 8 }} />
        <button onClick={handleAiGenerate} disabled={aiGenerating || !aiPrompt.trim()} style={{
          width: "100%", padding: "7px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          background: aiGenerating ? RED_DIM : `linear-gradient(135deg,${RED},#922b21)`,
          border: "none", color: aiGenerating ? "#f87171" : "#fff", cursor: aiGenerating ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {aiGenerating ? <><span style={{ display:"inline-block", width:10, height:10, border:`2px solid ${RED}44`, borderTop:`2px solid #f87171`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />Generisanje...</> : "✨ Generiši"}
        </button>
        {aiError && <p style={{ margin: "6px 0 0", color: "#f87171", fontSize: 11 }}>{aiError}</p>}
        {aiPreview && (
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative", width: 60, height: 60, borderRadius: 6, overflow: "hidden", border: `1px solid ${BORDER}` }}>
              <Image src={aiPreview} alt="" fill style={{ objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ margin: "0 0 6px", color: "#4ade80", fontSize: 11 }}>✓ Generisano</p>
              <button onClick={() => { onChange([...images, aiPreview!]); setAiPreview(null); setAiPrompt(""); }}
                style={{ background: "#064e3b", border: "1px solid #065f46", color: "#6ee7b7", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>+ Dodaj</button>
            </div>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {previews.map((p, i) => (
            <div key={i} style={{ position: "relative", width: 52, height: 52, borderRadius: 6, overflow: "hidden", border: `1px solid ${BORDER}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => setPreviews(prev => prev.filter((_, j) => j !== i))}
                style={{ position: "absolute", top: 1, right: 1, background: "rgba(0,0,0,0.8)", border: "none", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {images.map((src, i) => (
            <div key={i} style={{ position: "relative", width: 52, height: 52, borderRadius: 6, overflow: "hidden", border: `1px solid ${BORDER}` }}>
              <Image src={src} alt="" fill style={{ objectFit: "cover" }} />
              <button onClick={() => onChange(images.filter((_, j) => j !== i))}
                style={{ position: "absolute", top: 1, right: 1, background: "rgba(0,0,0,0.8)", border: "none", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
        </div>
      )}

      {uploading && <p style={{ color: MUTED, fontSize: 11, marginTop: 6 }}>Upload u toku...</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Add product panel ────────────────────────────────────────────────────────
type FormState = {
  name: string; slug: string; slugManual: boolean;
  category: string; categorySlug: string;
  shortDescription: string; description: string;
  specs: { label: string; value: string }[];
  idealFor: string[]; tags: string[];
  images: string[]; featured: boolean;
};
const EMPTY: FormState = { name:"", slug:"", slugManual:false, category:"", categorySlug:"", shortDescription:"", description:"", specs:[], idealFor:[], tags:[], images:[], featured:false };

function AddPanel({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormState, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const handleName = (name: string) => setForm(f => ({ ...f, name, slug: f.slugManual ? f.slug : toSlug(name) }));
  const handleCat = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    setForm(f => ({ ...f, categorySlug: slug, category: cat?.name ?? "" }));
  };

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) { setError("Naziv je obavezan."); return; }
    if (!form.categorySlug) { setError("Kategorija je obavezna."); return; }
    setSaving(true);
    const uploadFn = (window as Window & { __imgUpload?: () => Promise<string[]> }).__imgUpload;
    const uploaded = uploadFn ? await uploadFn() : [];
    const res = await fetch("/api/admin/products", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: [...form.images, ...uploaded] }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Greška."); return; }
    onSaved();
  };

  const inp = { width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" as const };
  const sectionLabel = (t: string) => <p style={{ margin: "0 0 8px", color: MUTED, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 1 }}>{t}</p>;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "min(560px,100%)", background: SIDEBAR, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Head */}
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, color: TEXT, fontSize: 16, fontWeight: 700, fontFamily: "'Sora',sans-serif" }}>Dodaj proizvod</h2>
            <p style={{ margin: "2px 0 0", color: MUTED2, fontSize: 12 }}>Odmah se pojavljuje na sajtu</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          {sectionLabel("Naziv *")}
          <input value={form.name} onChange={e => handleName(e.target.value)} placeholder="npr. Maneken Premium" style={{ ...inp, marginBottom: 4 }} />
          <p style={{ margin: "0 0 16px", color: MUTED2, fontSize: 11 }}>/ponuda/<strong style={{ color: MUTED }}>{form.slug || "..."}</strong></p>

          {sectionLabel("Kategorija *")}
          <select value={form.categorySlug} onChange={e => handleCat(e.target.value)}
            style={{ ...inp, cursor: "pointer", marginBottom: 16, fontFamily: "inherit" }}>
            <option value="">-- Odaberi --</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input type="checkbox" id="feat" checked={form.featured} onChange={e => set("featured", e.target.checked)}
              style={{ width: 15, height: 15, accentColor: BLUE, cursor: "pointer" }} />
            <label htmlFor="feat" style={{ color: MUTED, fontSize: 13, cursor: "pointer" }}>Istakni na naslovnoj</label>
          </div>

          {sectionLabel("Kratki opis")}
          <input value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)}
            placeholder="Kratki opis za karticu..." style={{ ...inp, marginBottom: 16 }} />

          {sectionLabel("Puni opis")}
          <textarea value={form.description} onChange={e => set("description", e.target.value)}
            rows={3} placeholder="Detaljan opis..."
            style={{ ...inp, resize: "vertical", fontFamily: "inherit", marginBottom: 16 }} />

          <div style={{ marginBottom: 16 }}><SpecsEditor specs={form.specs} onChange={v => set("specs", v)} /></div>
          <div style={{ marginBottom: 16 }}><TagInput label="Idealno za" values={form.idealFor} onChange={v => set("idealFor", v)} /></div>
          <div style={{ marginBottom: 16 }}><TagInput label="Tagovi" values={form.tags} onChange={v => set("tags", v)} /></div>
          <div style={{ marginBottom: 16 }}><ImageUploader images={form.images} onChange={v => set("images", v)} /></div>

          {error && <div style={{ background: "#2d0a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 12px", color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</div>}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, fontSize: 13, cursor: "pointer" }}>Odustani</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: "10px", borderRadius: 8,
            background: saving ? BLUE_DIM : `linear-gradient(135deg,${BLUE},${BLUE_DIM})`,
            border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer", boxShadow: saving ? "none" : `0 4px 14px ${BLUE}44`,
          }}>{saving ? "Snimanje..." : "Snimi proizvod"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, background: "#064e3b", border: "1px solid #065f46", color: "#6ee7b7", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      ✓ {msg}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [showPanel, setShowPanel] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("sve");
  const [customProducts, setCustomProducts] = useState<Product[]>([]);

  const fetchCustom = useCallback(() => {
    fetch("/api/admin/products").then(r => r.json())
      .then(d => Array.isArray(d) && setCustomProducts(d)).catch(() => {});
  }, []);
  useEffect(() => { fetchCustom(); }, [fetchCustom]);

  const allProducts = useMemo(() => [...products, ...customProducts], [customProducts]);
  const customIds   = useMemo(() => new Set(customProducts.map(p => p.id)), [customProducts]);
  const maxCat      = Math.max(...categories.map(c => allProducts.filter(p => p.categorySlug === c.slug).length));

  const filtered = useMemo(() => allProducts.filter(p => {
    const mc = activeCat === "sve" || p.categorySlug === activeCat;
    const q  = search.toLowerCase();
    const ms = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    return mc && ms;
  }), [search, activeCat, allProducts]);

  const handleDelete = (id: string) => { setCustomProducts(prev => prev.filter(p => p.id !== id)); setToast("Proizvod obrisan."); };
  const handleSaved  = () => { setShowPanel(false); fetchCustom(); setToast("Proizvod dodan!"); setTab("products"); };

  const SL = (t: string) => (
    <p style={{ margin: "0 0 16px", color: MUTED2, fontSize: 10, textTransform: "uppercase" as const, letterSpacing: 1.6, fontWeight: 700 }}>{t}</p>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Inter',sans-serif", display: "flex" }}>
      <Sidebar tab={tab} setTab={setTab} onAdd={() => setShowPanel(true)} />

      {/* Content */}
      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          padding: "0 32px", height: 58, borderBottom: `1px solid ${BORDER}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: BG, position: "sticky", top: 0, zIndex: 5,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 style={{ margin: 0, color: TEXT, fontSize: 16, fontWeight: 700, fontFamily: "'Sora',sans-serif" }}>
              {tab === "dashboard" && "Pregled"}
              {tab === "products"  && "Proizvodi"}
              {tab === "categories" && "Kategorije"}
            </h1>
            <span style={{ color: MUTED2, fontSize: 13 }}>·</span>
            <span style={{ color: MUTED2, fontSize: 13 }}>
              {tab === "dashboard"  && `${allProducts.length} proizvoda`}
              {tab === "products"   && `${filtered.length} / ${allProducts.length}`}
              {tab === "categories" && `${categories.length} kategorija`}
            </span>
          </div>
          <button onClick={() => setShowPanel(true)} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "7px 16px", borderRadius: 8,
            background: RED_G, border: "none", color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: "pointer", boxShadow: `0 3px 10px ${RED}40`,
          }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Dodaj
          </button>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* ─── DASHBOARD ─── */}
          {tab === "dashboard" && (
            <>
              {/* Stats strip */}
              <StatStrip items={[
                { label: "Proizvodi", value: allProducts.length },
                { label: "Kategorije", value: categories.length },
                { label: "Istaknuti", value: allProducts.filter(p => p.featured).length },
                { label: "Fotografije", value: allProducts.reduce((a,p) => a + p.images.length, 0) },
              ]} />

              {/* Two column layout */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>

                {/* Left — categories */}
                <div style={{ background: SURFACE, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>Kategorije</span>
                    <span style={{ color: MUTED2, fontSize: 12 }}>{categories.length} ukupno</span>
                  </div>
                  <div style={{ padding: "4px 20px 8px" }}>
                    {[...categories].sort((a,b) =>
                      allProducts.filter(p=>p.categorySlug===b.slug).length -
                      allProducts.filter(p=>p.categorySlug===a.slug).length
                    ).map((cat, i) => (
                      <CatRow key={cat.slug} name={cat.name} rank={i+1}
                        count={allProducts.filter(p => p.categorySlug === cat.slug).length}
                        max={maxCat} />
                    ))}
                  </div>
                </div>

                {/* Right panel */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                  {/* Status */}
                  <div style={{ background: SURFACE, borderRadius: 12, border: `1px solid ${BORDER}`, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade8066", flexShrink: 0 }} />
                      <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>Katalog je aktivan</span>
                    </div>
                    <p style={{ margin: 0, color: MUTED2, fontSize: 12, lineHeight: 1.6 }}>Promjene se odmah prikazuju na sajtu.</p>
                  </div>

                  {/* Quick actions */}
                  <div style={{ background: SURFACE, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
                      <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>Brze akcije</span>
                    </div>
                    {[
                      { label: "Dodaj novi proizvod", action: () => setShowPanel(true), primary: true },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        width: "100%", padding: "12px 18px",
                        background: item.primary ? `${RED}12` : "transparent",
                        border: "none", borderBottom: `1px solid ${BORDER}`,
                        color: item.primary ? "#fca5a5" : MUTED,
                        fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" as const,
                      }}>
                        {item.label}
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    ))}
                    <Link href="/hebcomerc-admin/showroom" style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 18px", textDecoration: "none",
                      color: MUTED, fontSize: 13, fontWeight: 500,
                      borderBottom: `1px solid ${BORDER}`,
                    }}>
                      Make Showroom
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                    <Link href="/ponuda" target="_blank" style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 18px", textDecoration: "none",
                      color: MUTED, fontSize: 13, fontWeight: 500,
                    }}>
                      Pogledaj sajt ↗
                    </Link>
                  </div>

                  {/* Recent products */}
                  <div style={{ background: SURFACE, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}` }}>
                      <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>Nedavno dodani</span>
                    </div>
                    {allProducts.slice(-5).reverse().map((p, i) => (
                      <Link key={p.slug} href={`/ponuda/${p.slug}`} target="_blank" style={{ textDecoration: "none" }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 18px",
                          borderBottom: i < 4 ? `1px solid ${BORDER}` : "none",
                          transition: "background 0.1s",
                        }}>
                          <div style={{ width: 32, height: 32, borderRadius: 7, overflow: "hidden", background: CARD, border: `1px solid ${BORDER}`, flexShrink: 0, position: "relative" }}>
                            {p.images[0] && <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: "cover" }} />}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, color: MUTED, fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.name}</p>
                            <p style={{ margin: "1px 0 0", color: MUTED2, fontSize: 10 }}>{p.category}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ─── PRODUCTS ─── */}
          {tab === "products" && (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
                  <svg width="13" height="13" fill="none" stroke={MUTED2} strokeWidth="2" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Pretraži proizvode..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9, color: TEXT, padding: "9px 12px 9px 34px", fontSize: 13, outline: "none", boxSizing: "border-box" as const }} />
                </div>
                <select value={activeCat} onChange={e => setActiveCat(e.target.value)}
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, padding: "9px 14px", fontSize: 13, outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  <option value="sve">Sve kategorije</option>
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ background: SURFACE, borderRadius: 14, overflow: "hidden", border: `1px solid ${BORDER}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      {["", "Naziv", "Kategorija", "Slike", "Status", ""].map((h, i) => (
                        <th key={i} style={{ padding: "11px 16px", color: MUTED2, fontSize: 10, fontWeight: 700, textAlign: "left", textTransform: "uppercase" as const, letterSpacing: 1.3 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => <ProductRow key={p.slug} p={p} idx={i} isCustom={customIds.has(p.id)} onDelete={handleDelete} />)}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: 56, color: MUTED2 }}>
                    <svg width="32" height="32" fill="none" stroke={MUTED2} strokeWidth="1.2" viewBox="0 0 24 24" style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <p style={{ margin: 0, fontSize: 13 }}>Nema rezultata{search ? ` za "${search}"` : ""}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── CATEGORIES ─── */}
          {tab === "categories" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {categories.map((cat, i) => {
                const cp = allProducts.filter(p => p.categorySlug === cat.slug);
                const color = CAT_COLORS[i % CAT_COLORS.length];
                return (
                  <div key={cat.slug} style={{ background: SURFACE, borderRadius: 14, padding: "20px 22px", border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
                    {/* Colored top accent */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "14px 14px 0 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ margin: 0, color: TEXT, fontSize: 14, fontWeight: 700 }}>{cat.name}</h3>
                        <p style={{ margin: "3px 0 0", color: MUTED2, fontSize: 11 }}>/{cat.slug}</p>
                      </div>
                      <div style={{ background: color+"18", color, fontWeight: 800, fontSize: 18, borderRadius: 9, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${color}28`, flexShrink: 0 }}>{cp.length}</div>
                    </div>
                    <p style={{ margin: "0 0 16px", color: MUTED2, fontSize: 12, lineHeight: 1.6 }}>{cat.description}</p>
                    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                      {[{ l: "Ukupno", v: cp.length }, { l: "Istaknuto", v: cp.filter(p=>p.featured).length }, { l: "Slike", v: cp.reduce((a,p)=>a+p.images.length,0) }].map(s => (
                        <div key={s.l} style={{ flex: 1, background: CARD, borderRadius: 9, padding: "9px 6px", textAlign: "center", border: `1px solid ${BORDER}` }}>
                          <p style={{ margin: 0, color: MUTED2, fontSize: 9, textTransform: "uppercase" as const, letterSpacing: 0.8 }}>{s.l}</p>
                          <p style={{ margin: "3px 0 0", color: TEXT, fontSize: 18, fontWeight: 800 }}>{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <Link href={`/ponuda?kategorija=${cat.slug}`} target="_blank" style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      padding: "8px", borderRadius: 8, border: `1px solid ${BORDER}`,
                      color: MUTED, fontSize: 12, textDecoration: "none", fontWeight: 500,
                      transition: "all 0.15s",
                    }}>Otvori na sajtu <span style={{ color }}>↗</span></Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showPanel && <AddPanel onClose={() => setShowPanel(false)} onSaved={handleSaved} />}
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
    </div>
  );
}
