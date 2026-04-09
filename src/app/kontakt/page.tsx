"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, CheckCircle, Facebook } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";

const contactInfo = [
  {
    icon: MapPin,
    label: "Adresa",
    value: 'Tržnica "Arizona", zona VI, objekat br. 35\n76000 Brčko, Bosna i Hercegovina',
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "(+387) 61 729 781",
    href: "tel:+38761729781",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "prodaja@hebcomerc.ba",
    href: "mailto:prodaja@hebcomerc.ba",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "HEB Comerc",
    href: "https://facebook.com",
  },
];

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Header */}
      <div className="bg-[#F8F9FB] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            <p className="text-[#8B1A1A] text-sm font-semibold uppercase tracking-wider mb-2">
              Kontakt
            </p>
            <h1 className="font-heading font-bold text-[#111111] text-4xl sm:text-5xl mb-4">
              Javite nam se
            </h1>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Popunite formular ukoliko imate pitanja, rado ćemo Vam odgovoriti.
              Ili nas posjetite direktno na Tržnici Arizona u Brčkom.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left – Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Local shop headline */}
              <div className="mb-6">
                <h2 className="font-heading font-semibold text-[#111111] text-2xl mb-2">
                  Tražite našu lokalnu trgovinu?
                </h2>
                <p className="text-[#6B7280] text-sm">
                  Kliknite na lokaciju ispod da postavite cestu na Google Mapu.
                </p>
              </div>

              <div className="space-y-3">
                {contactInfo.map((info, i) => (
                  <div
                    key={info.label}
                    className="flex gap-4 p-4 bg-[#F8F9FB] rounded-2xl border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#8B1A1A]/10 flex items-center justify-center flex-shrink-0">
                      <info.icon size={18} className="text-[#8B1A1A]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.href.startsWith("https") ? "_blank" : undefined}
                          rel={info.href.startsWith("https") ? "noopener noreferrer" : undefined}
                          className="text-[#111111] font-medium text-sm hover:text-[#8B1A1A] transition-colors whitespace-pre-line"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-[#111111] font-medium text-sm whitespace-pre-line">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Maps CTA */}
              <a
                href="https://maps.google.com/?q=Tržnica+Arizona+Brčko"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#222222] transition-all"
              >
                <MapPin size={16} />
                Otvori na Google Mapama
              </a>

              {/* What to expect */}
              <div className="mt-6 bg-[#111111] rounded-3xl p-6 text-white">
                <h3 className="font-heading font-semibold text-lg mb-4">
                  Što možete očekivati?
                </h3>
                <div className="space-y-3">
                  {[
                    "Brz odgovor na sve upite",
                    "Besplatna konzultacija",
                    "Personalizirani prijedlog za vaš prostor",
                    "Besplatna dostava na teritoriji BiH",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle size={15} className="text-[#C0392B] flex-shrink-0" />
                      <span className="text-[#D1D5DB] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right – Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_32px_rgba(0,0,0,0.06)] p-8">
              <h2 className="font-heading font-semibold text-[#111111] text-2xl mb-2">
                Pošalji upit
              </h2>
              <p className="text-[#6B7280] text-sm mb-6">
                Opišite vašu potrebu i mi ćemo vam odgovoriti u najkraćem mogućem roku.
              </p>
              <InquiryForm />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-[#F8F9FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="font-heading font-bold text-[#111111] text-2xl mb-2">
              HEB Comerc d.o.o
            </h2>
            <p className="text-[#6B7280] text-sm">
              Tržnica &quot;Arizona&quot;, zona VI, objekat br. 35, 76000, BRČKO, Bosna i Hercegovina
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden h-72 bg-gray-200 flex items-center justify-center border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#8B1A1A]/10 flex items-center justify-center mx-auto mb-3">
                <MapPin size={24} className="text-[#8B1A1A]" />
              </div>
              <p className="font-heading font-semibold text-[#374151]">
                Tržnica &quot;Arizona&quot;, zona VI, obj. 35
              </p>
              <p className="text-[#9CA3AF] text-sm mt-1">76000 Brčko, BiH</p>
              <a
                href="https://maps.google.com/?q=Tržnica+Arizona+Brčko"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#8B1A1A] text-white text-sm font-semibold hover:bg-[#6F1515] transition-all"
              >
                <MapPin size={14} />
                Otvori Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
