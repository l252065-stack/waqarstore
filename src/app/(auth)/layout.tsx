import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f2]">
      {/* Minimal header */}
      <header className="py-6 px-4">
        <div className="mx-auto max-w-sm text-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.15em] text-[#0a0a0a] hover:text-[#c9a84c] transition-colors"
          >
            WAQAR STORE
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Waqar Store
      </footer>
    </div>
  );
}
