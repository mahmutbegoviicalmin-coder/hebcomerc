"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  PersonStanding,
  Shirt,
  LayoutGrid,
  ShoppingBasket,
  Armchair,
  Tag,
  Truck,
  Eye,
  RotateCcw,
  Star,
  MapPin,
  Phone,
  CheckCircle,
} from "lucide-react";
import { getFeaturedProducts, testimonials, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";

const categoryIcons: Record<string, React.ElementType> = {
  PersonStanding,
  Shirt,
  LayoutGrid,
  ShoppingBasket,
  Armchair,
  Tag,
};

const categoryColors: Record<string, string> = {
  "lutke-i-manekeni":         "bg-rose-100 text-rose-600",
  "klasik-stender":           "bg-slate-100 text-slate-600",
  "lux-stender":              "bg-sky-100 text-sky-600",
  korpe:                      "bg-amber-100 text-amber-600",
  "kancelarijski-namjestaj":  "bg-emerald-100 text-emerald-600",
  taburei:                    "bg-violet-100 text-violet-600",
  "stalaze-za-knjige":        "bg-orange-100 text-orange-600",
  "stalci-za-kajseve-i-torbe":"bg-cyan-100 text-cyan-600",
  laterali:                   "bg-indigo-100 text-indigo-600",
};

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO SLIDER ══ */}
      <HeroSlider />

      {/* ══ TRUST STRIP ══ */}
      <section className="bg-[#111111] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
            {[
              { icon: Truck, text: "Besplatna dostava na teritoriji BiH" },
              { icon: Eye, text: "Dozvoljen pregled paketa pri dostavi" },
              { icon: RotateCcw, text: "Garantovan povrat sredstava" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3.5 py-5 px-8">
                <div className="w-8 h-8 rounded-lg bg-[#C0392B]/15 flex items-center justify-center flex-shrink-0">
                  <item.icon size={15} className="text-[#FF7676]" />
                </div>
                <span className="text-white/55 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LUTKE HIGHLIGHT ══ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[28px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src="/products/lutka1.jpg"
                alt="Lutke i manekeni za butike"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block text-[#C0392B] text-xs font-bold uppercase tracking-[0.16em] mb-5">
                Lutke i manekeni
              </span>
              <h2 className="font-heading font-bold text-[#080808] text-4xl sm:text-5xl leading-[1.0] tracking-tight mb-5">
                Elegantne lutke koje
                <br />
                <span className="text-[#C0392B]">upotpunjuju</span> Vaš izlog
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-8 text-base max-w-md">
                Naše lutke i manekeni su izrađeni od visokokvalitetnog fiberglass materijala
                u raznim pozama i završnicama. Od klasičnih mat bijelih do modernih krom modela.
              </p>
              <div className="space-y-3.5 mb-9">
                {[
                  "Muški, ženski i dječiji modeli",
                  "Mat bijela, krom, bež i custom boje",
                  "Stojeće, sjedeće i poluglave varijante",
                  "Laka i robusna izrada – dugotrajnost",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#C0392B]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={11} className="text-[#C0392B]" />
                    </div>
                    <span className="text-[#374151] text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/ponuda?kategorija=lutke-i-manekeni"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#080808] text-white font-semibold text-sm hover:bg-[#C0392B] transition-all group"
              >
                Pogledaj lutke
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className="py-28 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-14"
          >
            <div>
              <span className="text-[#C0392B] text-xs font-bold uppercase tracking-[0.16em] mb-3 block">
                Kategorije
              </span>
              <h2 className="font-heading font-bold text-[#080808] text-4xl sm:text-5xl leading-tight tracking-tight">
                Sve što butik treba
              </h2>
            </div>
            <Link
              href="/ponuda"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#080808] hover:text-[#C0392B] transition-colors group"
            >
              Sve kategorije
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.icon] || Tag;
              const colorClass = categoryColors[cat.slug] || "bg-gray-100 text-gray-500";
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={`/ponuda?kategorija=${cat.slug}`}
                    className="group flex flex-col items-center gap-3.5 p-5 bg-white rounded-2xl border border-transparent hover:border-[#C0392B]/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all text-center"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorClass}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-[#080808] text-xs leading-tight">
                        {cat.name}
                      </p>
                      <p className="text-[#9CA3AF] text-xs mt-0.5">{cat.productCount} artikala</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-[#C0392B] text-xs font-bold uppercase tracking-[0.16em] mb-3 block">
                Istaknuti artikli
              </span>
              <h2 className="font-heading font-bold text-[#080808] text-4xl sm:text-5xl leading-[1.05] tracking-tight">
                Najpopularniji proizvodi
              </h2>
            </div>
            <Link
              href="/ponuda"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E5E5] text-[#080808] text-sm font-semibold hover:border-[#C0392B] hover:text-[#C0392B] transition-all group"
            >
              Svi artikli
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <Link href={`/ponuda/${product.slug}`} className="block">

                  {/* Image */}
                  <div
                    className="relative overflow-hidden rounded-2xl bg-[#F4F4F4] mb-4"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350" />

                    {/* Hover CTA */}
                    <div className="absolute inset-x-4 bottom-4 flex gap-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="flex-1 py-2.5 text-center rounded-xl bg-white text-[#080808] text-xs font-bold">
                        Detalji
                      </span>
                      <Link
                        href={`/kontakt?proizvod=${product.slug}`}
                        onClick={e => e.stopPropagation()}
                        className="flex-1 py-2.5 text-center rounded-xl bg-[#C0392B] text-white text-xs font-bold hover:bg-[#E53E3E] transition-colors"
                      >
                        Upit
                      </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <p className="text-[11px] text-[#C0392B] font-semibold uppercase tracking-wider mb-1.5">
                    {product.category}
                  </p>
                  <p className="text-[#111111] text-sm font-semibold leading-snug group-hover:text-[#C0392B] transition-colors line-clamp-2">
                    {product.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-6 sm:hidden">
            <Link
              href="/ponuda"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[#E5E5E5] text-[#080808] text-sm font-semibold"
            >
              Svi artikli <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* ══ WHY CHOOSE US ══ */}
      <section className="py-28 bg-[#080808] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8B1A1A]/12 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#C0392B] text-xs font-bold uppercase tracking-[0.16em] mb-4 block">
              Zašto mi
            </span>
            <h2 className="font-heading font-bold text-white text-4xl sm:text-5xl tracking-tight mb-4">
              Zašto odabrati HEB Comerc
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-base leading-relaxed">
              Sa više od 15 godina iskustva na Tržnici Arizona, pružamo potpunu podršku
              pri opremanju butika i maloprodajnih prostora u cijeloj BiH.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05] rounded-3xl overflow-hidden">
            {[
              {
                icon: Truck,
                title: "Besplatna dostava u BiH",
                description:
                  "Svi naši artikli se dostavljaju besplatno na teritoriji Bosne i Hercegovine. Brinemo o vašoj robi od skladišta do vašeg praga.",
              },
              {
                icon: Eye,
                title: "Dozvoljen pregled paketa",
                description:
                  "Možete pregledati paket pri preuzimanju od kurira. Vaše zadovoljstvo nam je na prvom mjestu i nikada ne kompromitujemo to.",
              },
              {
                icon: RotateCcw,
                title: "Garantovan povrat",
                description:
                  "Niste zadovoljni? Garantujemo povrat sredstava. Vaše povjerenje je temelj našeg poslovanja od 2011. godine.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0D0D0D] p-10 hover:bg-[#111111] transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#C0392B]/15 flex items-center justify-center mb-7">
                  <item.icon size={22} className="text-[#FF7676]" />
                </div>
                <h3 className="font-heading font-semibold text-white text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-white/40 leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-28 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-[#C0392B] text-xs font-bold uppercase tracking-[0.16em] mb-3 block">
              Recenzije
            </span>
            <h2 className="font-heading font-bold text-[#080808] text-4xl sm:text-5xl tracking-tight">
              Što kažu naši klijenti
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-gray-100/80 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all"
              >
                <div
                  className="font-heading font-bold text-7xl leading-none mb-2 select-none"
                  style={{ color: "rgba(192,57,43,0.15)" }}
                >
                  &ldquo;
                </div>
                <div className="flex gap-0.5 mb-4 -mt-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[#374151] leading-relaxed mb-7 text-sm">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-[#080808] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111] text-sm leading-none">{t.name}</p>
                    <p className="text-[#9CA3AF] text-xs mt-1">{t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SHOWROOM / ARIZONA ══ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[28px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src="/products/arizona55.jpg"
                alt="HEB Comerc – Tržnica Arizona"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block text-[#C0392B] text-xs font-bold uppercase tracking-[0.16em] mb-5">
                Lokacija
              </span>
              <h2 className="font-heading font-bold text-[#080808] text-4xl sm:text-5xl tracking-tight leading-[1.0] mb-5">
                Posjetite nas na
                <br />
                <span className="text-[#C0392B]">Tržnici Arizona</span>
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-9 text-base max-w-md">
                Nalazimo se na Tržnici Arizona od 2011. godine. Lično pogledajte cijeli
                asortiman i neka vam naš tim pomogne odabrati opremu za vaš butik.
              </p>

              <div className="space-y-4 mb-9">
                {[
                  { icon: MapPin, text: 'Tržnica "Arizona", zona VI, objekat br. 35, 76000 Brčko, BiH' },
                  { icon: Phone, text: "(+387) 61 729 781" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <item.icon size={17} className="text-[#C0392B]" />
                    </div>
                    <span className="text-[#374151] font-medium text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#080808] text-white font-semibold text-sm hover:bg-[#C0392B] transition-all group"
              >
                Preuzmi upute do nas
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="py-24 bg-[#080808] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[350px] bg-[#C0392B]/18 rounded-full blur-[130px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-[60px] tracking-tight leading-[0.95] mb-5">
              Pripremite se za{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #FF5252 0%, #C0392B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                savršen izlog
              </span>
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Pošaljite nam upit ili nas posjetite direktno na Tržnici Arizona u Brčkom.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C0392B] text-white font-semibold text-sm hover:bg-[#E53E3E] transition-all hover:shadow-[0_8px_40px_rgba(192,57,43,0.45)]"
              >
                Pošalji upit
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/ponuda"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/[0.14] text-white/75 font-semibold text-sm hover:bg-white/[0.06] hover:border-white/25 hover:text-white transition-all"
              >
                Pregledaj katalog
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
