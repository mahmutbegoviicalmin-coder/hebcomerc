"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Send,
  Download,
  CheckCircle,
  ChevronRight,
  Tag,
  Building2,
} from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import InquiryForm from "@/components/InquiryForm";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#8B1A1A] transition-colors">Početna</Link>
          <ChevronRight size={12} />
          <Link href="/ponuda" className="hover:text-[#8B1A1A] transition-colors">Ponuda</Link>
          <ChevronRight size={12} />
          <Link
            href={`/ponuda?kategorija=${product.categorySlug}`}
            className="hover:text-[#8B1A1A] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#111111] truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left – Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#F8F9FB] mb-3">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-[#8B1A1A]"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right – Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8B1A1A]/8 text-[#8B1A1A] text-xs font-semibold mb-4">
              <Tag size={11} />
              {product.category}
            </div>

            <h1 className="font-heading font-bold text-[#111111] text-3xl sm:text-4xl mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-[#6B7280] text-base leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            {/* Quick specs */}
            <div className="bg-[#F8F9FB] rounded-2xl p-5 mb-6">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
                Ključne specifikacije
              </p>
              <div className="grid grid-cols-2 gap-3">
                {product.specs.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-[#9CA3AF] mb-0.5">{spec.label}</p>
                    <p className="text-sm font-semibold text-[#111111]">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal for */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 size={13} />
                Idealno za
              </p>
              <div className="flex flex-wrap gap-2">
                {product.idealFor.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-[#374151]"
                  >
                    <CheckCircle size={11} className="text-[#8B1A1A]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <Link
                href={`/kontakt?proizvod=${product.slug}`}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#8B1A1A] text-white font-semibold hover:bg-[#6F1515] transition-all hover:shadow-[0_8px_24px_rgba(139,26,26,0.3)] active:scale-[0.98]"
              >
                <Send size={16} />
                Zatraži ponudu
              </Link>
              <Link
                href="/preuzmi-upute"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-gray-200 text-[#374151] font-semibold hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-all"
              >
                <Download size={16} />
                Brošura
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full specifications */}
      <div className="bg-[#F8F9FB] py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-[#111111] text-2xl mb-8">
              Kompletne specifikacije
            </h2>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              {product.specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i < product.specs.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <span className="text-[#6B7280] text-sm">{spec.label}</span>
                  <span className="font-semibold text-[#111111] text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Description */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="font-heading font-bold text-[#111111] text-2xl mb-6">
              O proizvodu
            </h2>
            <p className="text-[#6B7280] leading-loose text-base">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Inquiry form */}
      <div className="py-16 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#8B1A1A] text-sm font-semibold uppercase tracking-wider mb-2">
                Upit
              </p>
              <h2 className="font-heading font-bold text-[#111111] text-3xl mb-4">
                Zanima vas ovaj proizvod?
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-6">
                Ispunite obrazac i naš tim će vam se javiti s detaljnom ponudom i svim
                informacijama koje trebate.
              </p>
              <div className="space-y-4">
                {[
                  "Besplatna konzultacija",
                  "Brz odgovor u roku 24h",
                  "Profesionalni savjet",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#8B1A1A]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="text-[#8B1A1A]" />
                    </div>
                    <span className="text-[#374151] font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <InquiryForm productName={product.name} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-[#111111] text-2xl">
                Slični proizvodi
              </h2>
              <Link
                href={`/ponuda?kategorija=${product.categorySlug}`}
                className="flex items-center gap-1 text-sm font-semibold text-[#8B1A1A] hover:gap-2 transition-all"
              >
                Svi iz kategorije <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
