"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import { useCartStore } from "@/lib/stores/cart";
import { useUIStore } from "@/lib/stores/ui";

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, total, itemCount } = useCartStore();

  const cartTotal = total();
  const cartItemCount = itemCount();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="font-semibold text-[#0a0a0a]">
                  Your Cart
                  {cartItemCount > 0 && (
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      ({cartItemCount} {cartItemCount === 1 ? "item" : "items"})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1 text-gray-400 hover:text-[#0a0a0a] transition-colors"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <EmptyCart onClose={closeCart} />
              ) : (
                <ul className="divide-y divide-gray-100 px-6">
                  {items.map((item) => {
                    const imageUrl =
                      item.product.images?.find((img) => img.is_primary)?.url ??
                      item.product.images?.[0]?.url ??
                      "/placeholder-product.jpg";
                    const itemPrice =
                      item.product.price + item.variant.price_modifier;

                    return (
                      <li key={item.id} className="flex gap-4 py-5">
                        {/* Image */}
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#f5f4f2]">
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col gap-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={closeCart}
                              className="text-sm font-medium text-[#0a0a0a] hover:text-[#c9a84c] transition-colors leading-snug line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.variant.id)}
                              className="shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <p className="text-xs text-gray-400">
                            Size: {item.variant.size}
                            {item.variant.color && ` · ${item.variant.color}`}
                          </p>

                          <div className="mt-auto flex items-center justify-between">
                            {/* Quantity */}
                            <div className="flex items-center border border-gray-200">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.variant.id,
                                    item.quantity - 1
                                  )
                                }
                                className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-[#f5f4f2] transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.variant.id,
                                    item.quantity + 1
                                  )
                                }
                                className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-[#f5f4f2] transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <span className="text-sm font-semibold text-[#0a0a0a]">
                              {formatCurrency(itemPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-[#0a0a0a]">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center bg-[#0a0a0a] text-white px-6 py-4 text-sm font-semibold tracking-wide hover:bg-[#c9a84c] transition-colors"
                >
                  Checkout · {formatCurrency(cartTotal)}
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-gray-500 hover:text-[#0a0a0a] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f4f2]">
        <ShoppingBag size={32} className="text-gray-300" />
      </div>
      <div>
        <p className="font-semibold text-[#0a0a0a]">Your cart is empty</p>
        <p className="mt-1 text-sm text-gray-400">
          Start shopping to add items to your cart.
        </p>
      </div>
      <Link
        href="/products"
        onClick={onClose}
        className="bg-[#0a0a0a] text-white px-8 py-3 text-sm font-medium hover:bg-[#c9a84c] transition-colors"
      >
        Shop Now
      </Link>
    </div>
  );
}
