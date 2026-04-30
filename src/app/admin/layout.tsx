import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types";
import { LayoutDashboard, Package, ShoppingCart, Archive, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: Archive },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== UserRole.ADMIN) redirect("/account");

  return (
    <div className="min-h-screen flex bg-[#f5f4f2]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0a0a0a] text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.15em] text-white hover:text-[#c9a84c] transition-colors"
          >
            WAQAR STORE
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded"
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-white/10 pt-4">
          <div className="px-3 mb-3">
            <p className="text-xs font-medium text-white">{user.email}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors rounded"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
