"use client";

import Cookies from "js-cookie";
import { useState } from "react";
import Shell from "../components/Shell";
import { useCart } from "../components/cart/CartProvider";
import { Urgency } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const panels = [
  { id: "BABYTUNA_SUSHI", title: "BabyTuna Sushi" },
  { id: "BABYTUNA_POKI_PHO", title: "BabyTuna Poki & Pho" },
];

export default function CartPage() {
  const { items, updateQuantity, updateUrgency, updateLocation, removeItem, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, panelId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      updateLocation(id, panelId);
    }
  };

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    const token = Cookies.get("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      for (const item of items) {
        await fetch(`${API_URL}/api/orders/`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            product: item.productId,
            quantity: item.qty,
            source: item.source,
            location: item.location,
            urgency: item.urgency,
          }),
        });
      }
      clearCart();
      alert("Orders submitted.");
    } catch (err) {
      console.error("Failed to submit orders", err);
      alert("Failed to submit some orders");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell title="Cart" subtitle="Drag items to locations, set urgency, and submit.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {panels.map((panel) => (
            <div
              key={panel.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, panel.id)}
              className="min-h-[260px] bg-white border-2 border-dashed border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <h3 className="text-lg font-semibold text-gray-900">{panel.title}</h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  Drag items here
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {items.filter((i) => i.location === panel.id).map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.id)}
                    className="p-3 border border-gray-100 rounded-xl bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{item.item}</p>
                        <p className="text-xs text-gray-500">{item.source}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs text-gray-500">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-800"
                      />
                      <label className="text-xs text-gray-500 ml-3">Urgency</label>
                      <select
                        value={item.urgency}
                        onChange={(e) => updateUrgency(item.id, e.target.value as Urgency)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-800"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Rush">Rush</option>
                      </select>
                    </div>
                  </div>
                ))}
                {items.filter((i) => i.location === panel.id).length === 0 && (
                  <div className="p-4 border border-dashed border-gray-200 rounded-xl text-sm text-gray-500">
                    Drop items for {panel.title} here.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-500">Cart summary</p>
            <h3 className="text-lg font-semibold text-gray-900">
              {items.length} item{items.length === 1 ? "" : "s"}
            </h3>
          </div>
          <button
            onClick={handleSubmit}
            disabled={items.length === 0 || submitting}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
          <p className="text-xs text-gray-500">
            Drag to assign locations, set urgency per item, then submit. Orders are created immediately in the backend.
          </p>
        </div>
      </div>
    </Shell>
  );
}
