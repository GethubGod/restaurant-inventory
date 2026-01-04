import OrderRow from '../components/OrderRow'; // <--- Import the new piece

interface Order {
  id: number;
  product_name: string;
  quantity: number;
  created_at: string;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
async function getOrders() {
  const res = await fetch(`${API_URL}/api/orders/`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export default async function Dashboard() {
  const orders: Order[] = await getOrders();

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Manager Dashboard</h1>
          <a href="/" className="text-blue-600 hover:underline">
            ← Back to Store
          </a>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">ID</th>
                <th className="text-left p-4 font-semibold text-gray-600">Product</th>
                <th className="text-left p-4 font-semibold text-gray-600">Qty</th>
                <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                <th className="text-left p-4 font-semibold text-gray-600">Action</th> {/* New Header */}
              </tr>
            </thead>

            {/* Use the new Component inside the body */}
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No active orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}