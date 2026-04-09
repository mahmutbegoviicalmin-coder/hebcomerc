"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { products, categories, getProductsByCategory, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initCat = searchParams.get("kategorija") || "";

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(initCat);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/data/custom-products.json")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCustomProducts(data))
      .catch(() => {});
  }, []);

  const allProducts = useMemo(() => [...products, ...customProducts], [customProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = !selectedCat || p.categorySlug === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat, allProducts]);

  const activeCategory = categories.find((c) => c.slug === selectedCat);

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Page header */}
      <div className="bg-[#F8F9FB] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <nav className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-4">
              <Link href="/" className="hover:text-[#8B1A1A] transition-colors">Početna</Link>
              <span>/</span>
              <span className="text-[#111111]">Proizvodi</span>
              {activeCategory && (
                <>
                  <span>/</span>
                  <span className="text-[#111111]">{activeCategory.name}</span>
                </>
              )}
            </nav>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-heading font-bold text-[#111111] text-3xl sm:text-4xl mb-2">
                  {activeCategory ? activeCategory.name : "Svi proizvodi"}
                </h1>
                <p className="text-[#6B7280]">
                  {activeCategory
                    ? activeCategory.description
                    : "Pregledajte naš kompletan katalog opreme za butike i maloprodajne prostore."}
                </p>
              </div>
              <span className="hidden sm:block text-[#9CA3AF] text-sm font-medium">
                {filtered.length} {filtered.length === 1 ? "artikal" : "artikala"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži proizvode..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-[#F8F9FB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X size={14} className="text-[#9CA3AF]" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden sm:block">
            <div className="sticky top-28">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
                Kategorije
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCat("")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !selectedCat
                      ? "bg-[#8B1A1A]/8 text-[#8B1A1A]"
                      : "text-[#374151] hover:bg-gray-100"
                  }`}
                >
                  <span>Sve kategorije</span>
                  <span className="text-xs text-[#9CA3AF]">{allProducts.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCat(cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedCat === cat.slug
                        ? "bg-[#8B1A1A]/8 text-[#8B1A1A]"
                        : "text-[#374151] hover:bg-gray-100"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-[#9CA3AF]">
                      {allProducts.filter((p) => p.categorySlug === cat.slug).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F8F9FB] flex items-center justify-center mb-4">
                  <Search size={24} className="text-[#9CA3AF]" />
                </div>
                <h3 className="font-heading font-semibold text-[#111111] text-xl mb-2">
                  Nema rezultata
                </h3>
                <p className="text-[#6B7280] text-sm">
                  Pokušajte promijeniti pretragu ili odabranu kategoriju.
                </p>
                <button
                  onClick={() => { setSearch(""); setSelectedCat(""); }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#8B1A1A] text-white text-sm font-semibold hover:bg-[#6F1515] transition-all"
                >
                  Resetiraj filtere
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PonudaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8B1A1A]/30 border-t-[#8B1A1A] rounded-full animate-spin" />
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
