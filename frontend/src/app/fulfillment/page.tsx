"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import CartBar from "../components/cart/CartBar";
import { useCart } from "../components/cart/CartProvider";
import OrderBucket from "../components/OrderBucket";
import Shell from "../components/Shell";
import StatCard from "../components/StatCard";
import SuggestionCard from "../components/SuggestionCard";
import TabSwitcher from "../components/TabSwitcher";
import { OrderRecord, Product } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const tabs = [
  { id: "all", label: "All Sources" },
  { id: "COSTCO", label: "Costco" },
  { id: "RESTAURANT_DEPOT", label: "Restaurant Depot" },
  { id: "LOCAL_SUPPLIER", label: "Local" },
  { id: "FISH_COMPANY", label: "Fish Company" },
];

function groupBySource(data: OrderRecord[]) {
  const grouped: Record<string, OrderRecord[]> = {};
  data.forEach((order) => {
    const key = order.source;
    grouped[key] = grouped[key] ? [...grouped[key], order] : [order];
  });
  return grouped;
}

export default function FulfillmentPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addItem } = useCart();

  useEffect(() => {
    const token = Cookies.get("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${API_URL}/api/orders/`, { headers, cache: "no-store" }),
          fetch(`${API_URL}/api/products/`, { headers, cache: "no-store" }),
        ]);
        const ordersJson = await ordersRes.json();
        const productsJson = await productsRes.json();
        setOrders(ordersJson);
        setProducts(productsJson);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? orders
        : orders.filter((order) => order.source === activeTab),
    [activeTab, orders]
  );

  const grouped = useMemo(() => groupBySource(filtered), [filtered]);

  const totals = useMemo(() => {
    const pending = orders.filter((o) => o.status === "Pending").length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    const rush = orders.filter((o) => o.urgency === "Rush").length;
    return { pending, completed, rush, total: orders.length };
  }, [orders]);

  const suggestions = useMemo(() => {
    return products
      .filter((p) => p.days_since_last_order === null || (p.days_since_last_order ?? 0) >= p.restock_interval_days)
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        item: p.name,
        source: p.supplier,
        reason: p.days_since_last_order
          ? `${p.days_since_last_order} days since last order`
          : "Not ordered yet",
        productId: p.id,
        location: p.location,
      }));
  }, [products]);

  return (
    <Shell
      title="Fulfillment Overview"
      subtitle="Track every order by source with quick suggestions for this week."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Orders" value={totals.pending} badge="Pending" accent="amber" />
        <StatCard label="Completed" value={totals.completed} badge="This week" accent="green" />
        <StatCard label="Rush" value={totals.rush} badge="Urgent" accent="rose" />
        <StatCard label="Total" value={totals.total} badge="All sources" accent="blue" />
      </div>

      <TabSwitcher tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-gray-500">
          Loading orders...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(grouped).map(([source, items]) => (
            <OrderBucket key={source} source={source} orders={items} />
          ))}
          {Object.keys(grouped).length === 0 && (
            <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500">
              No orders match this filter.
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Suggestions</p>
            <h2 className="text-lg font-semibold text-gray-900">
              Often ordered, not yet this week
            </h2>
          </div>
          <span className="text-sm text-gray-500">Based on restock interval</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAdd={() =>
                addItem({
                  productId: suggestion.productId,
                  item: suggestion.item,
                  qty: 1,
                  source: suggestion.source,
                  location: suggestion.location,
                  urgency: "Normal",
                })
              }
            />
          ))}
          {suggestions.length === 0 && (
            <div className="p-6 border border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-500">
              Everything is up to date for now.
            </div>
          )}
        </div>
      </div>

      <CartBar />
    </Shell>
  );
}
