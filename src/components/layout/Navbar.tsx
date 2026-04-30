"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/lib/stores/cart";
import { useWishlistStore } from "@/lib/stores/wishlist";
import { useUIStore } from "@/lib/stores/ui";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Tops", href: "/categories/tops" },
  { label: "Bottoms", href: "/categories/bottoms" },
  { label: "Formal", href: "/categories/formal" },
  { label: "Accessories", href: "/categories/accessories" },
  { label: "Sale", href: "/products?sort=sale", highlight: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { toggleCart, toggleWishlist, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useUIStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 text-xl font-bold tracking-[0.15em] text-[#0a0a0a] hover:text-[#c9a84c] transition-colors"
            >
              WAQAR STORE
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-200",
                    link.highlight
                      ? "text-red-600 hover:text-red-700"
                      : "text-[#0a0a0a] hover:text-[#c9a84c]",
                    pathname === link.href && "text-[#c9a84c]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 text-[#0a0a0a] hover:text-[#c9a84c] transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <button
                onClick={toggleWishlist}
                className="relative p-2 text-[#0a0a0a] hover:text-[#c9a84c] transition-colors"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[10px] font-bold text-white">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-[#0a0a0a] hover:text-[#c9a84c] transition-colors"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0a0a0a] text-[10px] font-bold text-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 text-[#0a0a0a] hover:text-[#c9a84c] transition-colors hidden sm:block"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-[#0a0a0a] hover:text-[#c9a84c] transition-colors lg:hidden"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 bg-white"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="mx-auto max-w-2xl px-4 py-4 flex gap-3"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products…"
                  autoFocus
                  className="flex-1 border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]"
                />
                <button
                  type="submit"
                  className="bg-[#0a0a0a] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#c9a84c] transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeMobileMenu}
            />

            {/* Drawer */}
            <motion.nav
              className="absolute top-16 left-0 right-0 bg-white shadow-xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col divide-y divide-gray-100">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-6 py-4 text-sm font-medium tracking-wide transition-colors",
                        link.highlight
                          ? "text-red-600"
                          : "text-[#0a0a0a] hover:text-[#c9a84c]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/account"
                    className="block px-6 py-4 text-sm font-medium text-[#0a0a0a] hover:text-[#c9a84c]"
                  >
                    My Account
                  </Link>
                </li>
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" aria-hidden />
    </>
  );
}
