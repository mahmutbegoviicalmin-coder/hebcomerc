"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { categories } from "@/data/products";

interface InquiryFormProps {
  productName?: string;
  compact?: boolean;
}

export default function InquiryForm({ productName, compact }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="font-heading font-semibold text-[#111111] text-xl mb-2">
          Upit poslan!
        </h3>
        <p className="text-[#6B7280] text-sm max-w-xs">
          Hvala vam na upitu. Naš tim će vam se javiti u roku od 24 sata.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Ime i prezime *
          </label>
          <input
            type="text"
            required
            placeholder="Vaše ime"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F9FB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Tvrtka
          </label>
          <input
            type="text"
            placeholder="Naziv tvrtke"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F9FB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all"
          />
        </div>
      </div>

      <div className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Telefon *
          </label>
          <input
            type="tel"
            required
            placeholder="+385 1 234 5678"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F9FB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            E-mail *
          </label>
          <input
            type="email"
            required
            placeholder="email@tvrtka.hr"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F9FB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#374151] mb-1.5">
          Kategorija proizvoda
        </label>
        <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F9FB] text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all appearance-none">
          <option value="">Odaberite kategoriju</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#374151] mb-1.5">
          Poruka
        </label>
        <textarea
          rows={compact ? 3 : 4}
          placeholder={
            productName
              ? `Zanima me više informacija o: ${productName}`
              : "Opišite vašu potrebu, vrstu butika i šta trebate..."
          }
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F9FB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#8B1A1A] text-white font-semibold text-sm hover:bg-[#6F1515] transition-all hover:shadow-[0_4px_20px_rgba(139,26,26,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Slanje...
          </>
        ) : (
          <>
            <Send size={15} />
            Pošalji upit
          </>
        )}
      </button>
    </form>
  );
}
