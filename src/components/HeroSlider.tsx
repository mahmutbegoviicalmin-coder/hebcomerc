"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    video: "/video/1.mp4",
    tag: "Oprema za butike · od 2011.",
    headline1: "Vaš partner u",
    headline2: "savremenoj opremi",
    sub: "Opremamo butike i maloprodajne prostore od A do Ž — lutke, štenderi, korpe, taburei i mnogo više.",
    cta: "Pogledaj ponudu",
    ctaHref: "/ponuda",
    ctaSecondary: "Pošalji upit",
    ctaSecondaryHref: "/kontakt",
  },
  {
    id: 2,
    video: "/video/2.mp4",
    tag: "Tržnica Arizona, Brčko",
    headline1: "Premium oprema",
    headline2: "za svaki prostor",
    sub: "ROTA lux štenderi, fiberglass lutke, Balance namještaj — sve što vašem butiku treba na jednom mjestu.",
    cta: "Istraži asortiman",
    ctaHref: "/ponuda",
    ctaSecondary: "O nama",
    ctaSecondaryHref: "/o-nama",
  },
];

const DURATION = 8000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState([false, false]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
    setProgress(0);
    startRef.current = Date.now();
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length, 1), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length, -1), [current, goTo]);

  // Auto-advance timer
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [next]);

  // Progress RAF
  useEffect(() => {
    startRef.current = Date.now();
    setProgress(0);
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const p = Math.min(((Date.now() - startRef.current) / DURATION) * 100, 100);
      setProgress(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current]);

  // Play / pause videos
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [current]);

  const slide = slides[current];

  const textVariants = {
    enter: { opacity: 0, y: 56, filter: "blur(10px)" },
    center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.25 } },
    exit: { opacity: 0, y: -32, filter: "blur(4px)", transition: { duration: 0.35, ease: "easeIn" } },
  };

  const subVariants = {
    enter: { opacity: 0, y: 32 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.45 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const ctaVariants = {
    enter: { opacity: 0, y: 24 },
    center: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#050505] flex items-center pt-20">

      {/* ── Video backgrounds (both mounted, only current plays) ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <video
            ref={(el) => { videoRefs.current[i] = el; }}
            src={s.video}
            autoPlay={i === 0}
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setLoaded((prev) => { const n = [...prev]; n[i] = true; return n; })}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/55 to-[#050505]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-[#050505]/35" />
        </div>
      ))}

      {/* Subtle grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          zIndex: 2,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Main content ── */}
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 pb-28 sm:pb-20" style={{ zIndex: 10 }}>
        <div className="max-w-[680px]">

          {/* Tag */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`tag-${current}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.45, delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="mb-7"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.14] bg-white/[0.05] backdrop-blur-sm text-white/55 text-xs font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B] animate-pulse flex-shrink-0" />
                {slide.tag}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h1-${current}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="font-heading font-bold text-white tracking-tighter leading-[0.9] mb-6"
              style={{ fontSize: "clamp(48px, 7.5vw, 92px)" }}
            >
              {slide.headline1}
              <br />
              <span
                style={{
                  background: "linear-gradient(130deg, #FF5252 0%, #C0392B 50%, #FF7676 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {slide.headline2}
              </span>
            </motion.h1>
          </AnimatePresence>

          {/* Sub */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${current}`}
              variants={subVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-white/45 text-base sm:text-[17px] leading-relaxed mb-10 max-w-[500px]"
            >
              {slide.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${current}`}
              variants={ctaVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href={slide.ctaHref}
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-[#C0392B] text-white font-semibold text-sm hover:bg-[#E53E3E] transition-all hover:shadow-[0_8px_48px_rgba(192,57,43,0.55)] active:scale-95"
              >
                {slide.cta}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={slide.ctaSecondaryHref}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/[0.13] text-white/60 font-medium text-sm hover:bg-white/[0.07] hover:text-white hover:border-white/22 transition-all backdrop-blur-sm"
              >
                {slide.ctaSecondary}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 sm:px-10 pb-7 sm:pb-9" style={{ zIndex: 10 }}>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-8">
          {[
            { value: "300+", label: "Zadovoljnih klijenata" },
            { value: "15+", label: "Godina iskustva" },
            { value: "85+", label: "Vrsta proizvoda" },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-heading font-bold text-white text-lg leading-none tracking-tight">{s.value}</p>
              <p className="text-white/30 text-xs mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/[0.15] bg-white/[0.06] backdrop-blur-sm flex items-center justify-center text-white/50 hover:bg-white/[0.13] hover:text-white hover:border-white/25 transition-all"
              aria-label="Prethodni"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/[0.15] bg-white/[0.06] backdrop-blur-sm flex items-center justify-center text-white/50 hover:bg-white/[0.13] hover:text-white hover:border-white/25 transition-all"
              aria-label="Sljedeći"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Slide ${i + 1}`}
                className="relative h-[3px] rounded-full overflow-hidden transition-all duration-400"
                style={{
                  width: i === current ? 44 : 16,
                  background: i === current ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.2)",
                }}
              >
                {i === current && (
                  <span
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Slide counter */}
          <div className="select-none ml-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={current}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                className="font-heading font-bold text-white/70 text-sm tabular-nums"
              >
                0{current + 1}
              </motion.span>
            </AnimatePresence>
            <span className="text-white/20 text-sm font-medium"> / 0{slides.length}</span>
          </div>
        </div>
      </div>

      {/* ── Left accent line ── */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3" style={{ zIndex: 10 }}>
        <div className="w-px h-14 bg-white/[0.1]" />
        <div className="w-1 h-1 rounded-full bg-[#C0392B]" />
        <div className="w-px h-14 bg-white/[0.1]" />
      </div>
    </section>
  );
}
