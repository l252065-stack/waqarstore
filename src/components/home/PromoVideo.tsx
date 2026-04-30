// Replace the video src with your actual promotional video URL.
// Recommended: Host on a CDN (e.g., Cloudflare Stream, AWS CloudFront) for best performance.

export default function PromoVideo() {
  return (
    <section
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#0a0a0a]"
      aria-label="Promotional video"
    >
      {/* Video background — replace src with actual promo video */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        // src="/videos/promo.mp4"   ← Replace with actual video URL
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#c9a84c] mb-4">
          Exclusive
        </p>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight">
          THE NEW
          <br />
          <span className="text-[#c9a84c]">COLLECTION</span>
        </h2>
        <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-md mx-auto">
          Crafted for those who demand more from their wardrobe.
        </p>
        <a
          href="/products"
          className="mt-8 inline-flex items-center gap-2 border border-white text-white px-8 py-3 text-sm font-semibold tracking-wide hover:bg-white hover:text-[#0a0a0a] transition-colors duration-200"
        >
          Shop the Collection
        </a>
      </div>
    </section>
  );
}
