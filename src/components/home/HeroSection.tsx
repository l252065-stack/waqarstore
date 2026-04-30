"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

// Replace the gradient background with an actual high-quality men's fashion photo.
// Recommended: Use next/image with a CDN-hosted image for best performance.

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: "easeOut" },
        };

  return (
    <section
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#0a0a0a]"
      aria-label="Hero banner"
    >
      {/* Background — replace this gradient with next/image pointing to an actual photo */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] opacity-95"
        aria-hidden
      />

      {/* Accent lines */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full border border-[#c9a84c]/10" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full border border-[#c9a84c]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full border border-white/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-[#c9a84c]"
          {...fadeUp(0.1)}
        >
          New Collection 2025
        </motion.p>

        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none"
          {...fadeUp(0.25)}
        >
          ELEVATE
          <br />
          <span className="text-[#c9a84c]">YOUR STYLE</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed"
          {...fadeUp(0.4)}
        >
          Discover premium men's clothing crafted for the modern gentleman.
          From everyday essentials to formal elegance.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          {...fadeUp(0.55)}
        >
          <Link
            href="/products?sort=newest"
            className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-white font-semibold tracking-wide px-8 py-4 text-sm hover:bg-[#b8973d] transition-colors duration-200 w-full sm:w-auto"
          >
            Shop New Arrivals
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold tracking-wide px-8 py-4 text-sm hover:bg-white/10 hover:border-white transition-colors duration-200 w-full sm:w-auto"
          >
            Explore Collections
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex justify-center"
          {...fadeUp(0.7)}
        >
          <div className="flex flex-col items-center gap-1 text-white/30">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
