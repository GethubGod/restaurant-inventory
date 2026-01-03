'use client'; // This makes it interactive

import { useState } from 'react';

// The Contract (Same as before)
interface Order {
  id: number;
  product_name: string;
  quantity: number;
  created_at: string;
  status: string;
}

export default function OrderRow({ order }: { order: Order }) {
  // 1. State: We track the status locally so the UI updates INSTANTLY
  // without needing to refresh the whole page.
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // 2. The Logic: Handling the click
  const handleMarkComplete = async () => {
    setIsUpdating(true);

    // Send the PATCH request to Django
    const res = await fetch(`http://127.0.0.1:8000/api/orders/${order.id}/`, {
      method: 'PATCH', // <--- "Update this specific part"
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Completed' // The only field we want to change
      }),
    });

    if (res.ok) {
      setStatus('Completed'); // Update the screen to Green
    } else {
      alert('Failed to update order');
    }
    
    setIsUpdating(false);
  };

  return (
    <tr className="hover:bg-gray-50 border-b transition">
      <td className="p-4 text-gray-500">#{order.id}</td>
      <td className="p-4 font-medium text-gray-900">{order.product_name}</td>
      <td className="p-4 text-gray-900">{order.quantity}</td>
      <td className="p-4 text-gray-500">
        {new Date(order.created_at).toLocaleDateString()}
      </td>
      
      {/* STATUS BADGE */}
      <td className="p-4">
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          status === 'Completed' 
            ? "bg-green-100 text-green-800" // Green if done
            : "bg-yellow-100 text-yellow-800" // Yellow if pending
        }`}>
          {status}
        </span>
      </td>

      {/* ACTION BUTTON */}
      <td className="p-4">
        {status === 'Pending' && (
          <button 
            onClick={handleMarkComplete}
            disabled={isUpdating}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Mark Done"}
          </button>
        )}
      </td>
    </tr>
  );
}