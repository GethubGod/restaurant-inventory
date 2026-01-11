"use client";

import { OrderRecord } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  source: string;
  orders: OrderRecord[];
}

export default function OrderBucket({ source, orders }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Source</p>
          <p className="font-semibold text-gray-900 text-lg">{source}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
          {orders.length} orders
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {order.product_name ?? "Item"}
                </p>
                <p className="text-xs text-gray-500">
                  {order.location} • {order.user_name || "Team"}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                Qty {order.quantity}
              </span>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  order.urgency === "Rush"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {order.urgency}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
