import type { Metadata } from "next";
import BoysTrousersCatalog from "@/components/products/BoysTrousersCatalog";
import { SEED_PRODUCTS } from "@/lib/seedData";

export const metadata: Metadata = {
  title: "Boys' Trousers | WaqarStore",
  description:
    "Shop our full range of boys' trousers – chinos, denim, linen and more. Sizes for ages 2–13.",
};

/**
 * Boys' Trousers catalog page (Server Component).
 *
 * In production, replace SEED_PRODUCTS with a Prisma query such as:
 *
 *   import { prisma } from "@/lib/prisma";
 *   const products = await prisma.product.findMany({
 *     where: { category: "boys-trousers" },
 *     include: { variants: true },
 *   });
 */
export default function BoysTrousersPage() {
  // Isolate only boys-trousers category products
  const products = SEED_PRODUCTS.filter(
    (p) => p.category === "boys-trousers",
  );

  return <BoysTrousersCatalog initialProducts={products} />;
}
