"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Fulfillment", href: "/fulfillment", icon: "📦" },
  { label: "Employees", href: "/employees", icon: "👥" },
  { label: "Orders", href: "/orders", icon: "🧾" },
  { label: "Cart", href: "/cart", icon: "🛒" },
];

const secondaryItems = [{ label: "Settings", href: "/settings", icon: "⚙️" }];

export default function Sidebar() {
  const pathname = usePathname();

  const renderLink = (item: { label: string; href: string; icon: string }) => {
    const active =
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href));

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
        ${active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white/60"}`}
      >
        <span className="text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex w-64 flex-col bg-gray-50 border-r border-gray-200 p-4 gap-6">
      <div className="flex items-center gap-3 px-2">
        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold">
          RI
        </div>
        <div>
          <p className="text-sm text-gray-500">Restaurant Inventory</p>
          <p className="font-semibold text-gray-900">Control Center</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">{navItems.map(renderLink)}</nav>

      <div className="mt-auto flex flex-col gap-1">
        {secondaryItems.map(renderLink)}
        <div className="mt-4 px-3 py-2 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500">Signed in</p>
          <p className="font-semibold text-gray-900">Manager</p>
        </div>
      </div>
    </aside>
  );
}
