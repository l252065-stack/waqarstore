import { notFound } from "next/navigation";
import { productsService } from "@/lib/services/products";
import { buildMetadata } from "@/lib/utils/seo";
import PDPClient from "./PDPClient";

interface PDPPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PDPPageProps) {
  const { slug } = await params;
  const product = await productsService.getProductBySlug(slug);
  if (!product) return buildMetadata({ title: "Product Not Found", noIndex: true });

  return buildMetadata({
    title: product.name,
    description: product.description ?? undefined,
    path: `/products/${slug}`,
    image: product.images?.find((i) => i.is_primary)?.url,
  });
}

export default async function ProductDetailPage({ params }: PDPPageProps) {
  const { slug } = await params;

  const product = await productsService.getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await productsService
    .getRelatedProducts(product.id, product.category_id, 4)
    .catch(() => []);

  return <PDPClient product={product} relatedProducts={relatedProducts} />;
}
