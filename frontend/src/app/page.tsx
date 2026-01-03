import StoreSearch from './components/StoreSearch';

interface Product {
  id: number;
  name: string;
  current_stock: number;
  min_stock_threshold: number;
  image?: string;
}

async function getProducts() {
  const res = await fetch('http://127.0.0.1:8000/api/products/', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function Home() {
  // 1. Fetch the data on the Server
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100 p-10">
       
       {/* Header Section */}
       <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📦 Kitchen Inventory</h1>
        
        <div className="flex gap-4">
          <a 
            href="/dashboard" 
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Manager View
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* 2. Hand the data to the Search Component */}
        {/* This component will now handle drawing the Search Bar AND the Grid of items */}
        <StoreSearch products={products} />
      </div>

    </main>
  );
}