import StoreSearch from './components/StoreSearch';

// Fix 1: Changed 'https' to 'http' for the fallback (Localhost is usually not HTTPS)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface Product {
  id: number;
  name: string;
  current_stock: number;
  min_stock_threshold: number;
  image?: string;
}

async function getProducts() {
  // Debug Log: This will show up in Vercel Logs so we know what URL is being used
  console.log(`Attempting to fetch products from: ${API_URL}/api/products/`);

  try {
    const res = await fetch(`${API_URL}/api/products/`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Backend returned error: ${res.status}`);
      return []; // Return empty list on 404 or 500 error
    }

    return res.json();

  } catch (error) {
    // If Railway is down or URL is wrong, catch the error here
    console.error("NETWORK ERROR:", error);
    return []; // Return empty list so the app doesn't crash
  }
}

export default async function Home() {
  // 1. Fetch the data (Now safe from crashing)
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
        {/* If products is empty, we can show a message, or just show the empty search bar */}
        <StoreSearch products={products} />
        
        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No products found. (Check Vercel Logs if this is unexpected)
          </p>
        )}
      </div>

    </main>
  );
}