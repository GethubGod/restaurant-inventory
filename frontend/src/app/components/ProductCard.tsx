"use client"; // <--- MAGIC WORD: Tells Next.js "This part runs in the browser"

import { useState } from "react";

// The Interface (The Contract)
interface Product {
  id: number;
  name: string;
  current_stock: number;
  min_stock_threshold: number;
  image?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  // State: To remember if we are currently loading (spinning)
  const [loading, setLoading] = useState(false);

  // The Function: What happens when they click
  const handleOrder = async () => {
    setLoading(true); // 1. Turn on spinner

    // 2. Send the message to Django (POST request)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${API_URL}/api/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: product.id, // The ID of the item
        quantity: 5, // Hardcoded to 5 for now (we can change later)
      }),
    });

    if (res.ok) {
      alert(`Ordered 5 more ${product.name}!`);
    } else {
      alert("Failed to order.");
    }

    setLoading(false); // 3. Turn off spinner
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-2"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {/* Existing Title */}
      <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {product.name}
      </h2>

      <div className="flex justify-between items-center">
        <span className="text-gray-500">In Stock:</span>
        <span
          className={`text-2xl font-bold ${
            product.current_stock < product.min_stock_threshold
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {product.current_stock}
        </span>
      </div>

      <button
        onClick={handleOrder} // <--- Connects the click
        disabled={loading} // <--- Disable button while loading
        className={`w-full mt-4 py-2 rounded transition text-white ${
          loading ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-700"
        }`}
      >
        {loading ? "Ordering..." : "Order More"}
      </button>
    </div>
  );
}
