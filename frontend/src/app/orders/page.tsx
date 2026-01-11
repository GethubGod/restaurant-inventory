"use client";

import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import Shell from "../components/Shell";
import StatusBadge from "../components/StatusBadge";
import TabSwitcher from "../components/TabSwitcher";
import { OrderRecord } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const tabs = [
  { id: "all", label: "All" },
  { id: "Pending", label: "Pending" },
  { id: "Completed", label: "Completed" },
  { id: "Cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [orderList, setOrderList] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    const token = Cookies.get("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_URL}/api/orders/`, { headers, cache: "no-store" });
      const data = await res.json();
      setOrderList(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? orderList
        : orderList.filter((order) => order.status === activeTab),
    [activeTab, orderList]
  );

  const cancelOrder = async (id: number) => {
    const token = Cookies.get("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      await fetch(`${API_URL}/api/orders/${id}/`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: "Cancelled" }),
      });
      setOrderList((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "Cancelled" as const } : order
        )
      );
    } catch (err) {
      console.error("Failed to cancel order", err);
      alert("Failed to cancel order");
    }
  };

  return (
    <Shell title="Orders" subtitle="Track placed orders and cancel duplicates.">
      <div className="flex flex-col gap-4">
        <TabSwitcher tabs={tabs} active={activeTab} onChange={setActiveTab} />

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Item</th>
                <th className="text-left px-4 py-3">Qty</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Urgency</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {order.product_name ?? "Item"}
                  </td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3 text-gray-700">{order.source}</td>
                  <td className="px-4 py-3 text-gray-700">{order.location}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.urgency === "Rush"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {order.urgency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {order.status === "Pending" ? (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No orders in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
