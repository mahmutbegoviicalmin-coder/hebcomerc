"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Truck,
  Eye,
  RotateCcw,
  MapPin,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import { stats } from "@/data/products";

const values = [
  {
    icon: CheckCircle,
    title: "Kvalitet bez kompromisa",
    description:
      "Biramo isključivo opremu koja prolazi naše standarde kvalitete. Svaki artikl koji nudimo testiramo i stojimo iza njega.",
  },
  {
    icon: Truck,
    title: "Besplatna dostava u BiH",
    description:
      "Sve naše pošiljke dostavljamo besplatno na teritoriji Bosne i Hercegovine. Brinemo o vašoj robi od našeg skladišta do vaših ruku.",
  },
  {
    icon: Eye,
    title: "Dozvoljen pregled paketa",
    description:
      "Za razliku od mnogih, mi vam omogućavamo pregled paketa pri preuzimanju. Vaše zadovoljstvo nam je prioritet.",
  },
  {
    icon: RotateCcw,
    title: "Garantovan povrat",
    description:
      "Niste 100% zadovoljni? Garantujemo povrat sredstava. Povjerenje klijenata je temelj na kome gradimo poslovanje.",
  },
];

export default function ONamaPage() {
  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Header */}
      <div className="bg-[#F8F9FB] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-[#8B1A1A] text-sm font-semibold uppercase tracking-wider mb-2">
              O nama
            </p>
            <h1 className="font-heading font-bold text-[#111111] text-4xl sm:text-5xl mb-4">
              Upoznajte nas
            </h1>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Duboko posvećeni Vašem savršenom iskustvu kupovine.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-[#111111] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: Truck, text: "Besplatna dostava na teritoriji BiH" },
              { icon: Eye, text: "Dozvoljen pregled paketa" },
              { icon: RotateCcw, text: "Garantovan povrat sredstava" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <item.icon size={16} className="text-[#C0392B]" />
                <span className="text-white text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#8B1A1A] text-sm font-semibold uppercase tracking-wider mb-3">
                Naša priča
              </p>
              <h2 className="font-heading font-bold text-[#111111] text-3xl sm:text-4xl mb-6">
                Dobrodošli u Heb Comerc, vašeg dugogodišnjeg partnera u opremanju butika
              </h2>
              <div className="space-y-4 text-[#6B7280] leading-relaxed">
                <p>
                  Sa ponosom smo prisutni na Tržnici Arizona od 2011. godine, pružajući
                  kvalitetna rješenja za opremanje koja odražavaju vaš jedinstveni stil i brend.
                </p>
                <p>
                  Osnovani smo s ciljem da olakšamo kreiranje estetski privlačnih i
                  funkcionalnih prodajnih prostora. Tokom godina, stekli smo povjerenje naših
                  klijenata zahvaljujući posvećenosti kvalitetu, inovacijama i individualizovanom
                  pristupu svakom projektu.
                </p>
                <p>
                  Heb Comerc ima misiju da postane vaš prvi izbor kada je u pitanju opremanje
                  butika. Trudimo se da pružimo personalizovane usluge, raznolik asortiman i
                  trajna rješenja koja će unaprijediti vaše poslovanje i učiniti vaš prostor
                  privlačnijim za kupce.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-gray-100">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading font-bold text-2xl text-[#8B1A1A]">{stat.value}</p>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-[0_16px_64px_rgba(0,0,0,0.10)]"
            >
              <Image
                src="/products/stender1.jpg"
                alt="HEB Comerc tim i showroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wider assortment */}
      <section className="py-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-[0_16px_64px_rgba(0,0,0,0.10)]"
            >
              <Image
                src="/products/arizona55.jpg"
                alt="HEB Comerc asortiman"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading font-bold text-[#111111] text-3xl sm:text-4xl mb-6">
                Naš širok asortiman za potpuno opremanje butika
              </h2>
              <div className="space-y-4 text-[#6B7280] leading-relaxed mb-6">
                <p>
                  Naš asortiman obuhvata sve potrebno za potpuno opremanje butika, uključujući
                  lutke, štendere, kancelarijski namještaj i druge proizvode visokog standarda.
                </p>
                <p>
                  Bez obzira na veličinu vašeg prostora ili vrstu robe koju nudite, imamo
                  rješenja prilagođena vašim potrebama. Nalazimo se na prestižnoj Tržnici
                  Arizona, gdje smo stvorili prostor koji vam omogućava da lično vidite
                  i isprobate sav naš asortiman.
                </p>
                <p className="font-medium text-[#111111]">
                  U Heb Comercu, vaša vizija postaje stvarnost. Očekujemo vas s nestrpljenjem
                  kako bismo zajedno stvorili prostor koji će istaknuti vašu jedinstvenu priču.
                </p>
              </div>
              <Link
                href="/ponuda"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#8B1A1A] text-white font-semibold hover:bg-[#6F1515] transition-all hover:shadow-[0_8px_24px_rgba(139,26,26,0.3)]"
              >
                Pogledaj cijeli asortiman
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#8B1A1A] text-sm font-semibold uppercase tracking-wider mb-2">
              Naše vrijednosti
            </p>
            <h2 className="font-heading font-bold text-[#111111] text-3xl sm:text-4xl">
              Što nas čini posebnim
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8F9FB] rounded-3xl p-8 border border-gray-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#8B1A1A]/8 flex items-center justify-center mb-5">
                  <value.icon size={22} className="text-[#8B1A1A]" />
                </div>
                <h3 className="font-heading font-semibold text-[#111111] text-xl mb-3">
                  {value.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Online shopping experience */}
      <section className="py-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading font-bold text-[#111111] text-3xl sm:text-4xl mb-4">
                Steknite savršeno iskustvo online kupovine
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-8">
                Naš katalog je dostupan online 24/7. Pregledajte naš asortiman, pošaljite upit
                i mi ćemo se pobrinuti za brzu isporuku na vašu adresu u BiH.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Provjeren asortiman – fotografije stvarnih artikala",
                  "Brz odgovor na sve upite",
                  "Personalizirani prijedlog za vaš butik",
                  "Dostava i montaža po dogovoru",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#8B1A1A]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="text-[#8B1A1A]" />
                    </div>
                    <span className="text-[#374151] text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#8B1A1A] text-white font-semibold hover:bg-[#6F1515] transition-all hover:shadow-[0_8px_24px_rgba(139,26,26,0.3)]"
              >
                Kontaktirajte nas
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <h3 className="font-heading font-semibold text-[#111111] text-xl mb-6">
                Gdje nas naći
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-[#F8F9FB] rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-[#8B1A1A]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#8B1A1A]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">Adresa</p>
                    <p className="text-[#111111] font-medium text-sm">
                      Tržnica &quot;Arizona&quot;, zona VI, objekat br. 35<br />
                      76000 Brčko, Bosna i Hercegovina
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#F8F9FB] rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-[#8B1A1A]/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[#8B1A1A]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">Telefon</p>
                    <a href="tel:+38761729781" className="text-[#111111] font-medium text-sm hover:text-[#8B1A1A] transition-colors">
                      (+387) 61 729 781
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#F8F9FB] rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-[#8B1A1A]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[#8B1A1A]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">E-mail</p>
                    <a href="mailto:prodaja@hebcomerc.ba" className="text-[#111111] font-medium text-sm hover:text-[#8B1A1A] transition-colors">
                      prodaja@hebcomerc.ba
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
