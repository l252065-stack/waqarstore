"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import ZoomImage from "./ZoomImage";
import DiscountBadge from "./DiscountBadge";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import { useCartStore } from "@/lib/stores/cart";
import { useWishlistStore } from "@/lib/stores/wishlist";
import { useUIStore } from "@/lib/stores/ui";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const openCart = useUIStore((s) => s.openCart);

  const primaryImage =
    product.images?.find((img) => img.is_primary) ?? product.images?.[0];
  const secondaryImage = product.images?.[1];
  const defaultVariant = product.variants?.[0];

  const inWishlist = isInWishlist(product.id);
  const isDiscounted =
    product.compare_at_price && product.compare_at_price > product.price;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!defaultVariant) return;
    addToCart(product, defaultVariant, 1);
    openCart();
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleWishlist(product);
  }

  const imageUrl = primaryImage?.url ?? "/placeholder-product.jpg";
  const hoverImageUrl = secondaryImage?.url ?? imageUrl;

  return (
    <motion.div
      className="group relative flex flex-col"
      onHoverStart={() => setIsHoveringCard(true)}
      onHoverEnd={() => setIsHoveringCard(false)}
      initial={false}
      animate={{ y: isHoveringCard ? -4 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link href={`/products/${product.slug}`} className="block relative">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f4f2]">
          <ZoomImage
            src={isHoveringCard ? hoverImageUrl : imageUrl}
            alt={primaryImage?.alt_text ?? product.name}
            width={600}
            height={800}
            className="w-full h-full"
            zoomScale={1.08}
          />

          {/* Discount badge */}
          {isDiscounted && product.compare_at_price && (
            <div className="absolute top-3 left-3 z-10">
              <DiscountBadge
                originalPrice={product.compare_at_price}
                salePrice={product.price}
              />
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "hover:bg-white shadow-sm"
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors",
                inWishlist ? "fill-red-500 text-red-500" : "text-[#0a0a0a]"
              )}
            />
          </button>

          {/* Quick add button */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300",
              "translate-y-full group-hover:translate-y-0"
            )}
          >
            <button
              onClick={handleAddToCart}
              disabled={!defaultVariant || defaultVariant.stock_quantity === 0}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "bg-[#0a0a0a] text-white text-sm font-medium py-3",
                "hover:bg-[#c9a84c] transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ShoppingBag size={15} />
              {defaultVariant?.stock_quantity === 0
                ? "Out of Stock"
                : "Quick Add"}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category?.name}
          </p>
          <h3 className="font-medium text-[#0a0a0a] leading-snug line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0a0a0a]">
              {formatCurrency(product.price)}
            </span>
            {isDiscounted && product.compare_at_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
