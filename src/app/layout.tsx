import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "WaqarStore – Kids' Fashion",
  description: "Browse boys' trousers and more at WaqarStore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="text-indigo-700 font-bold text-base">WaqarStore</Link>
          <Link href="/boys-trousers" className="hover:text-indigo-600 transition-colors">Boys&apos; Trousers</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
