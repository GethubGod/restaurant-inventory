'use client';
import { useState } from 'react';
import ProductCard from './ProductCard';

// Re-defining the interface (or you can export/import it from a shared file later)
interface Product {
  id: number;
  name: string;
  current_stock: number;
  min_stock_threshold: number;
  image?: string;
}

export default function StoreSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');

  // Filter based on what the user types (Case insensitive)
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const lowStockItems = filteredProducts.filter(p => p.current_stock < p.min_stock_threshold);
  const normalItems = filteredProducts.filter(p => p.current_stock >= p.min_stock_threshold);

  return (
    <div>
      {/* Search Input */}
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="🔍 Search items..." 
          className="w-full p-4 rounded-xl border border-gray-300 text-lg text-black shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Reuse the Logic from Phase 17, but now inside the Search Component */}
      {lowStockItems.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Urgent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-red-50 border border-red-200 rounded-xl">
            {lowStockItems.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {normalItems.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}