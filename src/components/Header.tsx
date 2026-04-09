"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  PersonStanding,
  Shirt,
  LayoutGrid,
  ShoppingBasket,
  Armchair,
  Tag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";

const categoryIconMap: Record<string, React.ElementType> = {
  "lutke-i-manekeni": PersonStanding,
  stenderi: Shirt,
  "zidni-sistemi": LayoutGrid,
  korpe: ShoppingBasket,
  "kancelarijski-namjestaj": Armchair,
  "stalci-i-akcija": Tag,
};

const categoryColors: Record<string, string> = {
  "lutke-i-manekeni": "bg-rose-50 text-rose-600",
  stenderi: "bg-slate-50 text-slate-600",
  "zidni-sistemi": "bg-sky-50 text-sky-600",
  korpe: "bg-amber-50 text-amber-600",
  "kancelarijski-namjestaj": "bg-emerald-50 text-emerald-600",
  "stalci-i-akcija": "bg-violet-50 text-violet-600",
};

const navItems = [
  { label: "Početna", href: "/" },
  { label: "Proizvodi", href: "/ponuda", dropdown: true },
  { label: "O nama", href: "/o-nama" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Preuzmi upute", href: "/preuzmi-upute" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = pathname === "/";
  const isDark = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "pt-2 pb-2" : "pt-4 pb-0"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300",
            isDark
              ? "bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] shadow-none"
              : "bg-white/96 backdrop-blur-md shadow-[0_4px_32px_rgba(0,0,0,0.10)] border border-gray-100"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C0392B] flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-white font-bold text-sm font-heading">H</span>
            </div>
            <span
              className={cn(
                "font-heading font-bold text-[17px] tracking-tight leading-none transition-colors",
                isDark ? "text-white" : "text-[#111111]"
              )}
            >
              heb<span className="text-[#C0392B]">comerc</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                  ref={dropdownRef}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all select-none",
                      pathname.startsWith("/ponuda")
                        ? isDark
                          ? "text-white bg-white/10"
                          : "text-[#C0392B] bg-[#C0392B]/8"
                        : isDark
                        ? "text-white/65 hover:text-white hover:bg-white/8"
                        : "text-[#374151] hover:text-[#111111] hover:bg-gray-100/80"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={cn(
                        "transition-transform duration-200",
                        dropdownOpen && "rotate-180",
                        isDark ? "text-white/40" : "text-[#9CA3AF]"
                      )}
                    />
                  </Link>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        onMouseEnter={openDropdown}
                        onMouseLeave={closeDropdown}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[540px]"
                      >
                        <div className="bg-white rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.16)] border border-gray-100/80 overflow-hidden">
                          {/* Header row */}
                          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <Sparkles size={13} className="text-[#C0392B]" />
                              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">
                                Kategorije proizvoda
                              </span>
                            </div>
                            <Link
                              href="/ponuda"
                              className="flex items-center gap-1 text-xs font-semibold text-[#C0392B] hover:gap-1.5 transition-all"
                            >
                              Sve kategorije <ArrowRight size={12} />
                            </Link>
                          </div>

                          {/* Grid of categories */}
                          <div className="grid grid-cols-2 gap-1 p-3">
                            {categories.map((cat) => {
                              const Icon = categoryIconMap[cat.slug] || Tag;
                              const colorClass =
                                categoryColors[cat.slug] ?? "bg-gray-50 text-gray-500";
                              return (
                                <Link
                                  key={cat.slug}
                                  href={`/ponuda?kategorija=${cat.slug}`}
                                  className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F5F5F5] transition-all"
                                >
                                  <div
                                    className={cn(
                                      "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                                      colorClass
                                    )}
                                  >
                                    <Icon size={17} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#111111] group-hover:text-[#C0392B] transition-colors leading-tight truncate">
                                      {cat.name}
                                    </p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                                      {cat.productCount} artikala
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Footer CTA */}
                          <div className="mx-3 mb-3 rounded-xl bg-[#080808] p-4 flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-semibold">
                                Tražite nešto specifično?
                              </p>
                              <p className="text-white/45 text-xs mt-0.5">
                                Pošaljite upit i odgovaramo u roku od 24h
                              </p>
                            </div>
                            <Link
                              href="/kontakt"
                              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C0392B] text-white text-xs font-bold hover:bg-[#E53E3E] transition-colors"
                            >
                              Pošalji upit <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    pathname === item.href
                      ? isDark
                        ? "text-white bg-white/10"
                        : "text-[#C0392B] bg-[#C0392B]/8"
                      : isDark
                      ? "text-white/65 hover:text-white hover:bg-white/8"
                      : "text-[#374151] hover:text-[#111111] hover:bg-gray-100/80"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/kontakt"
              className={cn(
                "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95",
                isDark
                  ? "bg-[#C0392B] text-white hover:bg-[#E53E3E] hover:shadow-[0_4px_20px_rgba(192,57,43,0.4)]"
                  : "bg-[#C0392B] text-white hover:bg-[#E53E3E] hover:shadow-[0_4px_16px_rgba(192,57,43,0.3)]"
              )}
            >
              Pošalji upit
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={cn(
              "md:hidden p-2 rounded-xl transition-colors",
              isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-[#111111]"
            )}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 p-3 overflow-hidden"
            >
              <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      pathname === item.href ||
                        (item.dropdown && pathname.startsWith("/ponuda"))
                        ? "text-[#C0392B] bg-[#C0392B]/8"
                        : "text-[#374151] hover:text-[#111111] hover:bg-gray-50"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-100 mt-1">
                  <Link
                    href="/kontakt"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#C0392B] text-white text-sm font-semibold hover:bg-[#E53E3E] transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    Pošalji upit <ArrowRight size={15} />
                  </Link>
                </div>
              </nav>

              {/* Mobile category quick links */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-2 mb-2">
                  Kategorije
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((cat) => {
                    const Icon = categoryIconMap[cat.slug] || Tag;
                    const colorClass =
                      categoryColors[cat.slug] ?? "bg-gray-50 text-gray-500";
                    return (
                      <Link
                        key={cat.slug}
                        href={`/ponuda?kategorija=${cat.slug}`}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                            colorClass
                          )}
                        >
                          <Icon size={14} />
                        </div>
                        <span className="text-xs font-medium text-[#374151] truncate">
                          {cat.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
