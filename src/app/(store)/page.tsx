import HeroSection from "@/components/home/HeroSection";
import CategoryBanner from "@/components/home/CategoryBanner";
import PromoVideo from "@/components/home/PromoVideo";
import NewArrivals from "@/components/home/NewArrivals";
import { productsService } from "@/lib/services/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waqar Store — Premium Men's Clothing",
  description:
    "Shop the latest men's fashion. New arrivals in tops, bottoms, formal wear and accessories.",
};

export default async function HomePage() {
  const newArrivals = await productsService.getNewArrivals(8).catch(() => []);

  return (
    <>
      <HeroSection />
      <CategoryBanner />
      <NewArrivals products={newArrivals} />
      <PromoVideo />
    </>
  );
}
