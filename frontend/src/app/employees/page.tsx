"use client";

import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import CartBar from "../components/cart/CartBar";
import { useCart } from "../components/cart/CartProvider";
import Shell from "../components/Shell";
import { Category, OrderRecord, Product } from "../types";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const categoryList: Category[] = [
  { id: "PRODUCE", name: "Produce" },
  { id: "MEAT", name: "Meat" },
  { id: "DRY_GOODS", name: "Dry Goods" },
  { id: "CLEANING", name: "Cleaning" },
  { id: "BAR", name: "Bar Supplies" },
  { id: "OTHER", name: "Other" },
];

const locations = [
  { id: "BABYTUNA_SUSHI", name: "BabyTuna Sushi" },
  { id: "BABYTUNA_POKI_PHO", name: "BabyTuna Poki & Pho" },
  { id: "DOWNTOWN", name: "Downtown" },
  { id: "UPTOWN", name: "Uptown" },
  { id: "MIDTOWN", name: "Midtown" },
  { id: "GENERAL", name: "General" },
];

export default function EmployeesPage() {
  const [location, setLocation] = useState<string>("BABYTUNA_SUSHI");
  const [query, setQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [minDays, setMinDays] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [newItem, setNewItem] = useState({
    name: "",
    supplier: "COSTCO",
    category: "OTHER",
    restock_interval_days: 7,
    min_stock_threshold: 10,
    current_stock: 0,
    location: "BABYTUNA_SUSHI",
  });
  const [quantityById, setQuantityById] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { addItem } = useCart();

  // simple auth gate
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchData = async () => {
    const token = Cookies.get("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const [productRes, orderRes] = await Promise.all([
        fetch(`${API_URL}/api/products/`, { headers, cache: "no-store" }),
        fetch(`${API_URL}/api/orders/`, { headers, cache: "no-store" }),
      ]);
      const [productJson, orderJson] = await Promise.all([productRes.json(), orderRes.json()]);
      setProducts(productJson);
      setOrders(orderJson);
    } catch (err) {
      console.error("Failed to load products/orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingByProduct = useMemo(() => {
    const map = new Map<number, OrderRecord>();
    orders
      .filter((o) => o.status === "Pending")
      .forEach((o) => map.set(o.product, o));
    return map;
  }, [orders]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.location === location)
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => activeCategory === "all" || p.category === activeCategory)
      .filter((p) => {
        const days = p.days_since_last_order ?? 999;
        return days >= minDays;
      })
      .sort((a, b) => {
        const daysA = a.days_since_last_order ?? 999;
        const daysB = b.days_since_last_order ?? 999;
        return daysB - daysA;
      });
  }, [products, location, query, activeCategory, minDays]);

  const handleAddToCart = (product: Product) => {
    const qty = quantityById[product.id] ?? 1;
    addItem({
      productId: product.id,
      item: product.name,
      qty,
      source: product.supplier,
      location: product.location,
      urgency: "Normal",
    });
  };

  const handleCreate = async () => {
    const token = Cookies.get("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/api/products/`, {
      method: "POST",
      headers,
      body: JSON.stringify(newItem),
    });

    if (res.ok) {
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
      setDrawerOpen(false);
      setNewItem({
        name: "",
        supplier: "COSTCO",
        category: "OTHER",
        restock_interval_days: 7,
        min_stock_threshold: 10,
        current_stock: 0,
        location: "BABYTUNA_SUSHI",
      });
    } else {
      alert("Failed to create item");
    }
  };

  return (
    <Shell
      title="Employees"
      subtitle="Quick search, recent picks, and categories to keep ordering fast."
      onSearch={setQuery}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Show items not ordered in the last (days)</p>
            <input
              type="range"
              min={0}
              max={30}
              value={minDays}
              onChange={(e) => setMinDays(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-600 mt-1">{minDays} days</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Fresh picks</p>
              <h3 className="font-semibold text-gray-900">Order by urgency</h3>
            </div>
            <span className="text-xs text-gray-500">Sorted by last ordered</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {orders
              .filter((o) => o.status === "Pending")
              .slice(0, 6)
              .map((order) => (
                <span
                  key={order.id}
                  className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold"
                >
                  {order.product_name ?? "Item"} • {order.quantity} • {order.source}
                </span>
              ))}
            {orders.filter((o) => o.status === "Pending").length === 0 && (
              <span className="text-sm text-gray-500">No pending orders right now.</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${
              activeCategory === "all"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            All categories
          </button>
          {categoryList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProducts.map((item) => {
              const pending = pendingByProduct.get(item.id);
              const qty = quantityById[item.id] ?? 1;
              return (
                <div
                  key={item.id}
                  className="p-3 border border-gray-100 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:border-blue-200 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.supplier} • {item.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last ordered:{" "}
                        {item.last_ordered_at
                          ? `${item.days_since_last_order ?? 0} days ago`
                          : "Never"}
                      </p>
                    </div>
                    {pending && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        Pending
                      </span>
                    )}
                  </div>
                  {pending && (
                    <p className="text-xs text-gray-500 mt-1">
                      {pending.user_name || "Team"} ordered {pending.quantity} pending delivery
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <label className="text-xs text-gray-500">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) =>
                        setQuantityById((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                      }
                      className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-800"
                    />
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Add to cart
                  </button>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="p-6 border border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-500">
                No items match your filters.
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-4 left-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg hover:bg-emerald-700 transition"
      >
        + Add Item
      </button>

      {drawerOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center z-40">
          <div className="bg-white w-full md:w-[480px] rounded-t-3xl md:rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">New item</p>
                <h3 className="text-lg font-semibold text-gray-900">Add to catalog</h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-500">
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  value={newItem.name}
                  onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Supplier</label>
                  <select
                    value={newItem.supplier}
                    onChange={(e) => setNewItem((p) => ({ ...p, supplier: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
                  >
                    <option value="COSTCO">Costco</option>
                    <option value="RESTAURANT_DEPOT">Restaurant Depot</option>
                    <option value="FISH_COMPANY">Fish Company</option>
                    <option value="LOCAL_SUPPLIER">Local Supplier</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
                  >
                    {categoryList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <select
                    value={newItem.location}
                    onChange={(e) => setNewItem((p) => ({ ...p, location: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Restock every (days)</label>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={newItem.restock_interval_days}
                    onChange={(e) =>
                      setNewItem((p) => ({ ...p, restock_interval_days: Number(e.target.value) }))
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600 mt-1">{newItem.restock_interval_days} days</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Current stock</label>
                  <input
                    type="number"
                    value={newItem.current_stock}
                    onChange={(e) =>
                      setNewItem((p) => ({ ...p, current_stock: Number(e.target.value) }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Min threshold</label>
                  <input
                    type="number"
                    value={newItem.min_stock_threshold}
                    onChange={(e) =>
                      setNewItem((p) => ({ ...p, min_stock_threshold: Number(e.target.value) }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Save item
              </button>
            </div>
          </div>
        </div>
      )}

      <CartBar />
    </Shell>
  );
}
