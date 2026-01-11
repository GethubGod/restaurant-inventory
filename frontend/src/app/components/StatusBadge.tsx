"use client";

import { OrderStatus } from "../types";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const map = {
    Completed: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Cancelled: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
