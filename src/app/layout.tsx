import type { Metadata } from "next";
import "./globals.css";
import CartDrawer from "@/components/layout/CartDrawer";
import WishlistDrawer from "@/components/layout/WishlistDrawer";

export const metadata: Metadata = {
  title: {
    default: "Waqar Store — Premium Men's Clothing",
    template: "%s | Waqar Store",
  },
  description:
    "Premium men's clothing — shop the latest arrivals in tops, bottoms, formal wear and accessories.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://waqarstore.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-[#0a0a0a]">
        {children}
        {/* Global drawers rendered at root so they overlay everything */}
        <CartDrawer />
        <WishlistDrawer />
      </body>
    </html>
  );
}

