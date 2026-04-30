"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart, ShoppingBag, Minus, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ZoomImage from "@/components/ui/ZoomImage";
import DiscountBadge from "@/components/ui/DiscountBadge";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import { useCartStore } from "@/lib/stores/cart";
import { useWishlistStore } from "@/lib/stores/wishlist";
import { useUIStore } from "@/lib/stores/ui";
import type { Product, ProductVariant } from "@/types";

interface PDPClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function PDPClient({ product, relatedProducts }: PDPClientProps) {
  const primaryImage =
    product.images?.find((img) => img.is_primary) ?? product.images?.[0];
  const allImages = product.images ?? [];

  const [selectedImage, setSelectedImage] = useState(primaryImage ?? allImages[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const openCart = useUIStore((s) => s.openCart);

  const inWishlist = isInWishlist(product.id);
  const isDiscounted =
    product.compare_at_price && product.compare_at_price > product.price;

  // Group variants by size
  const sizeVariants = product.variants?.reduce(
    (acc, v) => {
      if (!acc[v.size]) acc[v.size] = [];
      acc[v.size].push(v);
      return acc;
    },
    {} as Record<string, ProductVariant[]>
  );

  const availableSizes = Object.keys(sizeVariants ?? {});

  function handleAddToCart() {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleSizeSelect(size: string) {
    const variants = sizeVariants?.[size] ?? [];
    setSelectedVariant(variants[0] ?? null);
  }

  const effectivePrice = selectedVariant
    ? product.price + selectedVariant.price_modifier
    : product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-8" aria-label="Breadcrumb">
        <a href="/" className="hover:text-[#0a0a0a]">Home</a>
        <ChevronRight size={12} />
        <a href="/products" className="hover:text-[#0a0a0a]">Products</a>
        {product.category && (
          <>
            <ChevronRight size={12} />
            <a href={`/categories/${product.category.slug}`} className="hover:text-[#0a0a0a]">
              {product.category.name}
            </a>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-[#0a0a0a] font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
              {allImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "relative shrink-0 h-20 w-16 overflow-hidden border-2 transition-colors",
                    selectedImage?.id === img.id
                      ? "border-[#0a0a0a]"
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text ?? product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1 relative">
            {selectedImage ? (
              <ZoomImage
                src={selectedImage.url}
                alt={selectedImage.alt_text ?? product.name}
                width={800}
                height={1000}
                className="aspect-[4/5] w-full"
                zoomScale={2.5}
              />
            ) : (
              <div className="aspect-[4/5] bg-[#f5f4f2] w-full" />
            )}

            {isDiscounted && product.compare_at_price && (
              <div className="absolute top-4 left-4">
                <DiscountBadge
                  originalPrice={product.compare_at_price}
                  salePrice={product.price}
                />
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.category && (
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {product.category.name}
            </p>
          )}

          <h1 className="text-3xl font-bold text-[#0a0a0a] leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#0a0a0a]">
              {formatCurrency(effectivePrice)}
            </span>
            {isDiscounted && product.compare_at_price && (
              <span className="text-lg text-gray-400 line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Size selector */}
          {availableSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0a0a0a]">
                  Size:{" "}
                  <span className="font-normal">
                    {selectedVariant?.size ?? "Select size"}
                  </span>
                </span>
                <a
                  href="/help/size-guide"
                  className="text-xs text-gray-400 underline underline-offset-2 hover:text-[#0a0a0a]"
                >
                  Size Guide
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const variants = sizeVariants?.[size] ?? [];
                  const inStock = variants.some((v) => v.stock_quantity > 0);
                  const isSelected = selectedVariant?.size === size;

                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      disabled={!inStock}
                      className={cn(
                        "flex h-11 min-w-[44px] px-3 items-center justify-center border text-sm font-medium transition-colors",
                        isSelected
                          ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                          : inStock
                          ? "border-gray-200 text-[#0a0a0a] hover:border-[#0a0a0a]"
                          : "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <span className="text-sm font-semibold text-[#0a0a0a]">Quantity</span>
            <div className="flex items-center border border-gray-200 w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-gray-500 hover:bg-[#f5f4f2] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(q + 1, selectedVariant?.stock_quantity ?? 10)
                  )
                }
                className="flex h-11 w-11 items-center justify-center text-gray-500 hover:bg-[#f5f4f2] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant || selectedVariant.stock_quantity === 0
              }
              fullWidth
              size="lg"
              className="justify-center"
            >
              <ShoppingBag size={18} />
              {addedToCart
                ? "Added!"
                : selectedVariant?.stock_quantity === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </Button>

            <button
              onClick={() => toggleWishlist(product)}
              className={cn(
                "flex h-[52px] w-[52px] shrink-0 items-center justify-center border-2 transition-colors",
                inWishlist
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 hover:border-[#0a0a0a]"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={20}
                className={cn(
                  "transition-colors",
                  inWishlist ? "fill-red-500 text-red-500" : "text-[#0a0a0a]"
                )}
              />
            </button>
          </div>

          {/* Stock indicator */}
          {selectedVariant && selectedVariant.stock_quantity <= 5 && selectedVariant.stock_quantity > 0 && (
            <p className="text-sm text-orange-600 font-medium">
              Only {selectedVariant.stock_quantity} left in stock!
            </p>
          )}

          {/* Description */}
          {product.description && (
            <div className="border-t border-gray-100 pt-6 space-y-2">
              <h2 className="text-sm font-semibold text-[#0a0a0a] uppercase tracking-wide">
                Description
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Trust badges */}
          <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: "🚚", label: "Free shipping on orders over PKR 5,000" },
              { icon: "↩️", label: "Easy 7-day returns" },
              { icon: "✅", label: "100% authentic" },
            ].map((badge) => (
              <div key={badge.label} className="space-y-1">
                <span className="text-xl">{badge.icon}</span>
                <p className="text-xs text-gray-500 leading-tight">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-gray-100 pt-16">
          <h2 className="text-2xl font-bold text-[#0a0a0a] tracking-tight mb-8">
            YOU MAY ALSO LIKE
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
