"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartBar() {
  const { totalCount } = useCart();
  const hasItems = totalCount > 0;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-8 md:left-auto md:w-80 z-30">
      <Link
        href="/cart"
        className={`w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl shadow-lg border border-gray-200 bg-white text-gray-900 font-semibold transition ${
          hasItems ? "ring-2 ring-blue-100 animate-pulse" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🛒</span>
          <div>
            <p className="text-sm text-gray-500">Cart</p>
            <p className="text-base font-semibold">
              {hasItems ? `${totalCount} items` : "Empty"}
            </p>
          </div>
        </div>
        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          Review
        </span>
      </Link>
    </div>
  );
}
