import Link from "next/link";
import { MapPin, Phone, Mail, Share2, Globe, AtSign } from "lucide-react";

const SHOP_LINKS = [
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Tops", href: "/categories/tops" },
  { label: "Bottoms", href: "/categories/bottoms" },
  { label: "Formal", href: "/categories/formal" },
  { label: "Accessories", href: "/categories/accessories" },
  { label: "Sale", href: "/products?sort=sale" },
];

const HELP_LINKS = [
  { label: "Order Tracking", href: "/account/orders" },
  { label: "Returns & Exchanges", href: "/help/returns" },
  { label: "Size Guide", href: "/help/size-guide" },
  { label: "Shipping Info", href: "/help/shipping" },
  { label: "FAQ", href: "/help/faq" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-[0.15em] text-white hover:text-[#c9a84c] transition-colors"
            >
              WAQAR STORE
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Premium men&apos;s clothing crafted for the modern gentleman.
              Elevate your style with our curated collection.
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin size={14} className="shrink-0 mt-0.5 text-[#c9a84c]" />
              <span>Chungi Amer Sidhu, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Phone size={14} className="text-[#c9a84c]" />
              <a
                href="tel:+923061536925"
                className="hover:text-[#c9a84c] transition-colors"
              >
                +92 306 1536925
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail size={14} className="text-[#c9a84c]" />
              <a
                href="mailto:hello@waqarstore.com"
                className="hover:text-[#c9a84c] transition-colors"
              >
                hello@waqarstore.com
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-5">
              Help
            </h3>
            <ul className="space-y-3">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Social */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-5">
                Company
              </h3>
              <ul className="space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {[
                  {
                    icon: <AtSign size={18} />,
                    label: "Instagram",
                    href: "https://instagram.com/waqarstore",
                  },
                  {
                    icon: <Globe size={18} />,
                    label: "Facebook",
                    href: "https://facebook.com/waqarstore",
                  },
                  {
                    icon: <Share2 size={18} />,
                    label: "Twitter",
                    href: "https://twitter.com/waqarstore",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Waqar Store. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Crafted with ❤ in Lahore, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
