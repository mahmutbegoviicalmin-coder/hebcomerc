import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, ArrowRight } from "lucide-react";
import { categories } from "@/data/products";

export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14 pb-14 border-b border-white/[0.07]">

          {/* Brand col */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#C0392B] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-heading font-bold text-white text-lg tracking-tight">
                heb<span className="text-[#C0392B]">comerc</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-[280px]">
              Vaš partner u savremenoj opremi za butike i maloprodajne prostore.
              Na Tržnici Arizona od 2011. godine.
            </p>

            {/* Social */}
            <a
              href="https://www.facebook.com/hebcomerc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1] hover:border-white/15 transition-all text-sm font-medium"
              aria-label="Facebook"
            >
              <Facebook size={15} />
              HEB Comerc
            </a>
          </div>

          {/* Nav links */}
          <div className="md:col-span-2">
            <h4 className="font-heading font-semibold text-white/80 text-xs uppercase tracking-[0.15em] mb-5">
              Navigacija
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Početna", href: "/" },
                { label: "Proizvodi", href: "/ponuda" },
                { label: "O nama", href: "/o-nama" },
                { label: "Kontakt", href: "/kontakt" },
                { label: "Preuzmi upute", href: "/preuzmi-upute" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="font-heading font-semibold text-white/80 text-xs uppercase tracking-[0.15em] mb-5">
              Kategorije
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/ponuda?kategorija=${cat.slug}`}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="font-heading font-semibold text-white/80 text-xs uppercase tracking-[0.15em] mb-5">
              Kontakt
            </h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#C0392B] mt-0.5 flex-shrink-0" />
                <span className="text-white/40 text-sm leading-relaxed">
                  Tržnica &quot;Arizona&quot;, zona VI,<br />
                  objekat br. 35<br />
                  76000 Brčko, BiH
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[#C0392B] flex-shrink-0" />
                <a
                  href="tel:+38761729781"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  (+387) 61 729 781
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-[#C0392B] flex-shrink-0" />
                <a
                  href="mailto:prodaja@hebcomerc.ba"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  prodaja@hebcomerc.ba
                </a>
              </li>
            </ul>

            {/* Quick CTA */}
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C0392B]/15 border border-[#C0392B]/25 text-[#FF7676] hover:bg-[#C0392B]/25 transition-all text-xs font-semibold group"
            >
              Pošalji upit
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} HEB Comerc. Sva prava zadržana.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/o-nama" className="text-white/25 hover:text-white/60 text-xs transition-colors">
              O nama
            </Link>
            <Link href="/kontakt" className="text-white/25 hover:text-white/60 text-xs transition-colors">
              Kontakt
            </Link>
            <Link href="/preuzmi-upute" className="text-white/25 hover:text-white/60 text-xs transition-colors">
              Upute
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
