/**
 * Prisma seed script – populates the boys' trousers catalog.
 * Run with: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding boys' trousers catalog…");

  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Classic Chino Trousers",
        slug: "classic-chino-trousers",
        description: "Smart, versatile chinos perfect for school or casual wear.",
        brand: "KidsFit",
        category: "boys-trousers",
      },
      {
        name: "Slim Denim Jeans",
        slug: "slim-denim-jeans",
        description: "Durable stretch denim jeans with adjustable waistband.",
        brand: "DenimCo",
        category: "boys-trousers",
      },
      {
        name: "Relaxed Linen Trousers",
        slug: "relaxed-linen-trousers",
        description: "Lightweight linen trousers, ideal for summer.",
        brand: "SummerKids",
        category: "boys-trousers",
      },
      {
        name: "Smart Wool Blend Trousers",
        slug: "smart-wool-blend-trousers",
        description: "Warm wool-blend trousers for school and formal occasions.",
        brand: "KidsFit",
        category: "boys-trousers",
      },
      {
        name: "Jogger Track Trousers",
        slug: "jogger-track-trousers",
        description: "Comfortable polyester joggers with elastic waistband.",
        brand: "ActiveKids",
        category: "boys-trousers",
      },
    ],
  });

  const products = await prisma.product.findMany();
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p.id]));

  const variants = [
    // Classic Chino
    { productId: bySlug["classic-chino-trousers"], ageRange: "4-5Y", waistSize: "45cm", length: "Regular", material: "Cotton",     color: "Beige", fit: "Regular", price: 14.99, stock: 20, sku: "CHN-4-5-45-REG-COT-BEI" },
    { productId: bySlug["classic-chino-trousers"], ageRange: "6-7Y", waistSize: "50cm", length: "Regular", material: "Cotton",     color: "Navy",  fit: "Regular", price: 15.99, stock: 15, sku: "CHN-6-7-50-REG-COT-NAV" },
    // Slim Denim
    { productId: bySlug["slim-denim-jeans"],       ageRange: "8-9Y",   waistSize: "55cm", length: "Regular", material: "Denim",      color: "Blue",  fit: "Slim",    price: 19.99, stock: 10, sku: "DNM-8-9-55-REG-DEN-BLU" },
    { productId: bySlug["slim-denim-jeans"],       ageRange: "10-11Y", waistSize: "60cm", length: "Long",    material: "Denim",      color: "Black", fit: "Slim",    price: 22.99, stock: 8,  sku: "DNM-10-11-60-LNG-DEN-BLK" },
    // Linen
    { productId: bySlug["relaxed-linen-trousers"], ageRange: "2-3Y",  waistSize: "40cm", length: "Short",   material: "Linen",      color: "White", fit: "Relaxed", price: 12.99, stock: 25, sku: "LIN-2-3-40-SHT-LIN-WHT" },
    { productId: bySlug["relaxed-linen-trousers"], ageRange: "4-5Y",  waistSize: "45cm", length: "Short",   material: "Linen",      color: "Khaki", fit: "Relaxed", price: 13.99, stock: 18, sku: "LIN-4-5-45-SHT-LIN-KHK" },
    // Wool Blend
    { productId: bySlug["smart-wool-blend-trousers"], ageRange: "12-13Y", waistSize: "65cm", length: "Long", material: "Wool Blend", color: "Grey",  fit: "Regular", price: 29.99, stock: 5,  sku: "WOL-12-13-65-LNG-WOL-GRY" },
    // Joggers
    { productId: bySlug["jogger-track-trousers"],  ageRange: "6-7Y",  waistSize: "50cm", length: "Regular", material: "Polyester",  color: "Grey",  fit: "Relaxed", price: 11.99, stock: 30, sku: "JOG-6-7-50-REG-POL-GRY" },
    { productId: bySlug["jogger-track-trousers"],  ageRange: "8-9Y",  waistSize: "55cm", length: "Regular", material: "Polyester",  color: "Black", fit: "Relaxed", price: 12.99, stock: 22, sku: "JOG-8-9-55-REG-POL-BLK" },
  ];

  await prisma.productVariant.createMany({ data: variants });

  console.log(`✅ Seeded ${products.length} products with ${variants.length} variants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
