import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    href: "/products?sort=newest",
    image: "/placeholder-category-arrivals.jpg",
    span: "col-span-2",
  },
  {
    name: "Tops",
    slug: "tops",
    href: "/categories/tops",
    image: "/placeholder-category-tops.jpg",
    span: "col-span-1",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    href: "/categories/bottoms",
    image: "/placeholder-category-bottoms.jpg",
    span: "col-span-1",
  },
  {
    name: "Formal",
    slug: "formal",
    href: "/categories/formal",
    image: "/placeholder-category-formal.jpg",
    span: "col-span-1",
  },
  {
    name: "Accessories",
    slug: "accessories",
    href: "/categories/accessories",
    image: "/placeholder-category-accessories.jpg",
    span: "col-span-1",
  },
];

export default function CategoryBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#c9a84c] mb-2">
          Browse
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0a0a] tracking-tight">
          SHOP BY CATEGORY
        </h2>
      </div>

      {/* Desktop: bento grid */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            href={cat.href}
            className={`group relative overflow-hidden bg-[#f5f4f2] ${
              i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
            }`}
          >
            {/* Replace with actual category image */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/30 transition-colors duration-300" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="bg-white/90 backdrop-blur-sm inline-block px-4 py-2">
                <span className="text-sm font-bold tracking-widest uppercase text-[#0a0a0a]">
                  {cat.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.href}
            className="group relative flex-shrink-0 w-48 aspect-[3/4] overflow-hidden bg-[#f5f4f2] snap-start"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/20 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#0a0a0a] bg-white/90 px-3 py-1.5 inline-block">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
