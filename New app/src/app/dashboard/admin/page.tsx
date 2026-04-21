"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const fetchInitial = async () => {
       try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (mounted) setOrders(data.orders);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
    fetchInitial();
    return () => { mounted = false; };
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">All Orders System View</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders in the system.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price / Dist.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order: { id: number, pickup: string, dropoff: string, price: number, distance: number, status: string, customer?: { name: string }, courier?: { name: string } }) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.courier?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                        <div><span className="font-medium">From:</span> {order.pickup}</div>
                        <div><span className="font-medium">To:</span> {order.dropoff}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.price.toFixed(2)} / {order.distance}km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
