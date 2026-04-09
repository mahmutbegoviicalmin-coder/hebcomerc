"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Lutke i manekeni":                   { bg: "bg-rose-50",    text: "text-rose-600" },
  "Klasik štender":                     { bg: "bg-slate-50",   text: "text-slate-600" },
  "Lux štender":                        { bg: "bg-sky-50",     text: "text-sky-600" },
  Korpe:                                { bg: "bg-amber-50",   text: "text-amber-600" },
  "Kancelarijski namještaj":            { bg: "bg-emerald-50", text: "text-emerald-600" },
  Taburei:                              { bg: "bg-violet-50",  text: "text-violet-600" },
  "Stalaže za knjige":                  { bg: "bg-orange-50",  text: "text-orange-600" },
  "Stalci za kaiševe, torbe i obuću":   { bg: "bg-cyan-50",    text: "text-cyan-600" },
  Laterali:                             { bg: "bg-indigo-50",  text: "text-indigo-600" },
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const color = categoryColors[product.category] ?? { bg: "bg-gray-50", text: "text-gray-600" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_12px_48px_rgba(0,0,0,0.11)] hover:-translate-y-1.5 transition-all duration-300">

        {/* Image */}
        <div className="relative overflow-hidden bg-[#F5F5F5]" style={{ aspectRatio: "4/3" }}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${color.bg} ${color.text}`}
            >
              {product.category}
            </span>
          </div>

          {/* Quick-view arrow on hover */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <ArrowUpRight size={14} className="text-[#080808]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading font-semibold text-[#080808] text-base mb-1.5 leading-snug">
            {product.name}
          </h3>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-4 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Top 2 specs */}
          {product.specs.length > 0 && (
            <div className="space-y-1.5 mb-4 py-3 border-t border-gray-50">
              {product.specs.slice(0, 2).map((spec) => (
                <div key={spec.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">{spec.label}</span>
                  <span className="text-xs font-semibold text-[#374151]">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/ponuda/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#F5F5F5] hover:bg-gray-100 text-sm font-semibold text-[#374151] hover:text-[#080808] transition-colors"
            >
              Detalji
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href={`/kontakt?proizvod=${product.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#E53E3E] text-sm font-semibold text-white transition-all hover:shadow-[0_4px_16px_rgba(192,57,43,0.3)]"
            >
              <Send size={13} />
              Upit
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
