'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tracking number inputs mapped by order ID
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Custom Alert Modal State
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const showAlert = (title: string, message: string) => {
    setAlertDialog({ isOpen: true, title, message });
  };

  const router = useRouter();
  const supabase = createClient();

  // Confirm Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders');
      if (response.status === 401 || response.status === 403) {
        alert("Access Denied: You do not have administrator privileges.");
        router.push('/');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackingChange = (orderId: string, value: string) => {
    setTrackingInputs(prev => ({ ...prev, [orderId]: value }));
  };

  const handleShipOrder = async (orderId: string) => {
    const trackingNumber = trackingInputs[orderId];
    if (!trackingNumber || trackingNumber.trim() === '') {
      showAlert("Missing Information", "Please enter a tracking number first.");
      return;
    }

    setSubmittingId(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_number: trackingNumber.trim() })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update order');
      }

      showAlert("Success", "Order marked as shipped! The customer has been notified via email.");
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'shipped', tracking_number: trackingNumber.trim() } 
            : order
        )
      );
    } catch (err: any) {
      showAlert("Error", err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-neon font-bold animate-pulse">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage orders, fulfillment, and tracking.</p>
          </div>
          <button onClick={fetchOrders} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-gray-400">No orders found in the database.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Order ID</p>
                    <p className="font-mono text-sm text-white font-bold">{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                    <p className="text-sm text-white">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Customer</p>
                    <p className="text-sm text-white">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</p>
                    <p className="text-xs text-gray-400">{order.user_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
                    <p className="text-sm font-bold text-neon">₱{(order.total_amount_cents / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'paid' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      order.status === 'shipped' ? 'bg-neon/20 text-neon border border-neon/30' :
                      order.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-white/10 text-gray-300 border border-white/20'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                  {/* Left: Items */}
                  <div className="p-6 lg:w-1/2">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Items Purchased</h3>
                    <ul className="space-y-4">
                      {order.order_items?.map((item: any) => (
                        <li key={item.id} className="flex items-center gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 border border-white/10">
                            <Image
                              src={item.product_skus?.image_url || '/placeholder.png'}
                              alt={item.products?.title || 'Product'}
                              fill
                              className="object-cover object-center"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white line-clamp-1">{item.products?.title}</p>
                            <p className="text-xs text-gray-400">SKU: {item.product_skus?.sku_code}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} &times; ₱{(item.unit_price_cents / 100).toFixed(2)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Shipping & Fulfillment */}
                  <div className="p-6 lg:w-1/2 bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Fulfillment</h3>
                    
                    <div className="mb-6 text-sm text-gray-300">
                      <p className="font-bold text-white mb-1">Ship to:</p>
                      <p>{order.shipping_address?.address} {order.shipping_address?.apartment}</p>
                      <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}</p>
                      <p>{order.shipping_address?.country}</p>
                      <p className="mt-1 text-gray-400">Phone: {order.shipping_address?.phone}</p>
                    </div>

                    {order.status === 'paid' ? (
                      <div className="bg-[#111] p-4 rounded-xl border border-white/10">
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Enter Tracking Number</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="e.g. YT1234567890"
                            value={trackingInputs[order.id] || ''}
                            onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon transition-colors"
                          />
                          <button 
                            onClick={() => handleShipOrder(order.id)}
                            disabled={submittingId === order.id}
                            className="px-4 py-2 bg-neon text-black text-sm font-bold rounded-lg hover:bg-neon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {submittingId === order.id ? 'Saving...' : 'Mark Shipped'}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">
                          * Clicking this will email the tracking number to the customer.
                        </p>
                      </div>
                    ) : order.status === 'shipped' ? (
                      <div className="bg-neon/10 p-4 rounded-xl border border-neon/30">
                        <p className="text-xs font-bold text-neon mb-1 uppercase">Shipped via 17Track</p>
                        <p className="text-sm text-white font-mono">{order.tracking_number}</p>
                        <a 
                          href={`https://t.17track.net/en#nums=${order.tracking_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-white underline mt-2 inline-block"
                        >
                          Verify Tracking
                        </a>
                      </div>
                    ) : order.status === 'cancelled' ? (
                      <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-sm text-red-400 flex flex-col gap-3">
                        <p className="font-bold">Order Cancelled</p>
                        <button 
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Order',
                              message: 'Permanently delete this order?',
                              onConfirm: async () => {
                                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                                await supabase.from('orders').delete().eq('id', order.id);
                                fetchOrders();
                              }
                            });
                          }}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors border border-red-500/30"
                        >
                          Delete Order Permanently
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-gray-400 flex flex-col gap-3">
                        <p>Order is pending payment.</p>
                        <button 
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Cancel Order',
                              message: 'Are you sure you want to cancel this unpaid order?',
                              onConfirm: async () => {
                                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                                await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
                                fetchOrders();
                              }
                            });
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors border border-white/20"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />

      {/* Custom Alert Modal */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${alertDialog.title === 'Success' ? 'bg-neon' : 'bg-red-500'}`}></div>
            <h3 className="text-xl font-bold text-white mb-2">{alertDialog.title}</h3>
            <p className="text-gray-400 mb-8">{alertDialog.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-neon"></div>
            <h3 className="text-xl font-bold text-white mb-2">{confirmDialog.title}</h3>
            <p className="text-gray-400 mb-8">{confirmDialog.message}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
