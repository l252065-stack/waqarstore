"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import { useWishlistStore } from "@/lib/stores/wishlist";
import { useUIStore } from "@/lib/stores/ui";
import { useCartStore } from "@/lib/stores/cart";

export default function WishlistDrawer() {
  const { isWishlistOpen, closeWishlist, openCart } = useUIStore();
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  function handleMoveToCart(item: (typeof items)[number]) {
    const defaultVariant = item.product.variants?.[0];
    if (!defaultVariant) return;
    addToCart(item.product, defaultVariant, 1);
    removeItem(item.product.id);
    closeWishlist();
    openCart();
  }

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
          />

          <motion.aside
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            aria-label="Wishlist"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <Heart size={20} />
                <h2 className="font-semibold text-[#0a0a0a]">
                  Wishlist
                  {items.length > 0 && (
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      ({items.length})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeWishlist}
                className="p-1 text-gray-400 hover:text-[#0a0a0a] transition-colors"
                aria-label="Close wishlist"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-16 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f4f2]">
                    <Heart size={32} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a0a0a]">
                      Your wishlist is empty
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Save items you love to buy later.
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={closeWishlist}
                    className="bg-[#0a0a0a] text-white px-8 py-3 text-sm font-medium hover:bg-[#c9a84c] transition-colors"
                  >
                    Explore Products
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 px-6">
                  {items.map((item) => {
                    const imageUrl =
                      item.product.images?.find((img) => img.is_primary)?.url ??
                      item.product.images?.[0]?.url ??
                      "/placeholder-product.jpg";

                    return (
                      <li key={item.id} className="flex gap-4 py-5">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#f5f4f2]">
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        <div className="flex flex-1 flex-col gap-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={closeWishlist}
                              className="text-sm font-medium text-[#0a0a0a] hover:text-[#c9a84c] transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <p className="text-sm font-semibold text-[#0a0a0a]">
                            {formatCurrency(item.product.price)}
                          </p>

                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="mt-auto flex items-center gap-1.5 text-xs text-[#0a0a0a] hover:text-[#c9a84c] transition-colors font-medium"
                          >
                            <ShoppingBag size={13} />
                            Move to Cart
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
