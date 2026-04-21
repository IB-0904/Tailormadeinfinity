"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CourierDashboard() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState<{ id: number, name: string } | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchUserAndOrders = async () => {
      try {
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
            const userData = await userRes.json();
            if (mounted) setUser(userData.user);
        } else {
            router.push('/login');
        }

        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (mounted) setOrders(data.orders);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchUserAndOrders();
    return () => { mounted = false; };
  }, [router]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update order');
      }
    } catch {
      alert('An unexpected error occurred');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold">Courier Dashboard</h1>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Available & Assigned Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders available at the moment.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order: { id: number, pickup: string, dropoff: string, price: number, distance: number, status: string, customer?: { name: string }, courierId: number | null }) => (
                <div key={order.id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-medium">Customer: <span className="font-normal">{order.customer?.name}</span></p>
                    <p className="text-sm mt-1">From: <span className="font-medium">{order.pickup}</span></p>
                    <p className="text-sm">To: <span className="font-medium">{order.dropoff}</span></p>
                    <p className="text-sm text-gray-500 mt-1">Earnings: ${(order.price * 0.8).toFixed(2)} • Distance: {order.distance} km</p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'}`}>
                      {order.status.replace('_', ' ')}
                    </span>

                    {order.status === 'PENDING' && (
                        <button
                            onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm whitespace-nowrap"
                        >
                            Accept Order
                        </button>
                    )}

                    {order.status === 'ACCEPTED' && order.courierId === user?.id && (
                        <button
                            onClick={() => updateOrderStatus(order.id, 'IN_TRANSIT')}
                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm whitespace-nowrap"
                        >
                            Mark In Transit
                        </button>
                    )}

                    {order.status === 'IN_TRANSIT' && order.courierId === user?.id && (
                        <button
                            onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm whitespace-nowrap"
                        >
                            Mark Delivered
                        </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
