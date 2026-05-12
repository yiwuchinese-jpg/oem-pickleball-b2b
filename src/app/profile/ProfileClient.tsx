'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfileClient() {
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  
  // Custom Confirm Modal State
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
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    isDefault: false
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchOrders();
    } else if (user && activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [user, activeTab]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_email', user?.email)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
      
    if (data) setAddresses(data);
    setLoadingAddresses(false);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      if (formData.isDefault) {
        // Unset other defaults first
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_email', user.email);
      }

      const addressData = {
        user_email: user.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        is_default: formData.isDefault || addresses.length === 0 // Force default if first address
      };

      if (editingAddress) {
        await supabase.from('user_addresses').update(addressData).eq('id', editingAddress.id);
      } else {
        await supabase.from('user_addresses').insert(addressData);
      }
      
      setShowAddressForm(false);
      setEditingAddress(null);
      resetFormData();
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Address',
      message: 'Are you sure you want to delete this address? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        await supabase.from('user_addresses').delete().eq('id', id);
        fetchAddresses();
      }
    });
  };

  const handleSetDefault = async (id: string) => {
    await supabase.from('user_addresses').update({ is_default: false }).eq('user_email', user?.email);
    await supabase.from('user_addresses').update({ is_default: true }).eq('id', id);
    fetchAddresses();
  };

  const resetFormData = () => {
    setFormData({
      firstName: '', lastName: '', address: '', apartment: '',
      city: '', state: '', zipCode: '', country: 'US', phone: '', isDefault: false
    });
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/user/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoadingOrders(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-24 pb-12">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Account</h1>
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-neon text-neon'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-neon text-neon'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`${
                activeTab === 'addresses'
                  ? 'border-neon text-neon'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Addresses
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'orders' ? (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Order History</h2>
            {loadingOrders ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-white/5 rounded-xl"></div>
                <div className="h-32 bg-white/5 rounded-xl"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
                <button
                  onClick={() => router.push('/products')}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-black bg-neon hover:bg-neon/90 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                    <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Order placed</p>
                        <p className="font-medium text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="font-medium text-white">₱{(order.total_amount_cents / 100).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Order #</p>
                        <p className="font-mono text-sm text-white">{order.id.split('-')[0].toUpperCase()}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'paid' ? 'bg-neon/20 text-neon border border-neon/30' :
                          order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-white/10 text-gray-300 border border-white/20'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <ul className="divide-y divide-white/5">
                        {order.order_items?.map((item: any) => (
                          <li key={item.id} className="py-4 flex items-center gap-6">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 border border-white/10">
                              <Image
                                src={item.product_skus?.image_url || '/placeholder.png'}
                                alt={item.products?.title || 'Product'}
                                fill
                                className="object-cover object-center"
                              />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-bold text-white">
                                  <h3>{item.products?.title}</h3>
                                  <p className="ml-4">₱{(item.unit_price_cents / 100).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-400">
                                  Variant: {item.product_skus?.sku_code || ''}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <p className="text-gray-400">Qty {item.quantity}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {order.tracking_number && (
                      <div className="bg-white/5 px-6 py-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                          <span className="text-sm text-gray-300">Tracking Number: <span className="font-mono text-white">{order.tracking_number}</span></span>
                        </div>
                        <a 
                          href={`https://t.17track.net/en#nums=${order.tracking_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-neon hover:text-neon/80 transition-colors"
                        >
                          Track Package &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'addresses' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Saved Addresses</h2>
              {!showAddressForm && (
                <button
                  onClick={() => {
                    resetFormData();
                    setEditingAddress(null);
                    setShowAddressForm(true);
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {showAddressForm ? (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-8">
                <h3 className="text-lg font-bold text-white mb-6">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <form onSubmit={handleSaveAddress} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">First name</label>
                      <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Last name</label>
                      <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                    <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Apartment, suite, etc. (optional)</label>
                    <input type="text" value={formData.apartment} onChange={e => setFormData({...formData, apartment: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                      <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">State / Province</label>
                      <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">ZIP / Postal Code</label>
                      <input required type="text" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-neon focus:ring-neon bg-white/5" />
                    <label htmlFor="isDefault" className="ml-2 text-sm text-gray-400">Set as default shipping address</label>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-2 rounded-xl border border-white/20 text-white hover:bg-white/5 font-medium transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-xl bg-neon text-black font-bold hover:bg-neon/90 transition-colors">Save Address</button>
                  </div>
                </form>
              </div>
            ) : loadingAddresses ? (
               <div className="animate-pulse space-y-4">
                 <div className="h-40 bg-white/5 rounded-xl"></div>
               </div>
            ) : addresses.length === 0 ? (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-gray-400 mb-6">You haven't saved any addresses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-[#111] border border-white/10 rounded-2xl p-6 relative">
                    {addr.is_default && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-neon/20 text-neon text-xs font-bold rounded-full border border-neon/30">
                        Default
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white mb-2">{addr.first_name} {addr.last_name}</h3>
                    <div className="text-gray-400 text-sm space-y-1 mb-6">
                      <p>{addr.address} {addr.apartment && `, ${addr.apartment}`}</p>
                      <p>{addr.city}, {addr.state} {addr.zip_code}</p>
                      <p>{addr.country}</p>
                      <p className="pt-2 text-gray-300">Phone: {addr.phone}</p>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <button onClick={() => {
                        setEditingAddress(addr);
                        setFormData({
                          firstName: addr.first_name, lastName: addr.last_name, address: addr.address,
                          apartment: addr.apartment || '', city: addr.city, state: addr.state,
                          zipCode: addr.zip_code, country: addr.country, phone: addr.phone, isDefault: addr.is_default
                        });
                        setShowAddressForm(true);
                      }} className="text-sm font-medium text-neon hover:text-neon/80">Edit</button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm font-medium text-red-400 hover:text-red-300">Delete</button>
                      {!addr.is_default && (
                        <button onClick={() => handleSetDefault(addr.id)} className="text-sm font-medium text-gray-400 hover:text-white ml-auto">Set as Default</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-2xl">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Profile Information</h3>
                <p className="text-sm text-gray-400 mb-4">Manage your account details and preferences.</p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Name</label>
                    <div className="mt-2 text-white font-mono bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                      {user.user_metadata?.full_name || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email address</label>
                    <div className="mt-2 text-white font-mono bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Custom Confirm Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
