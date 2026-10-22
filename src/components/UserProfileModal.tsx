import React, { useState, useEffect } from 'react';
import {
  X, User, ShoppingBag, Clock, CheckCircle2, Truck, AlertCircle,
  MapPin, Mail, Phone, Edit3, Save, PackageCheck, ShieldCheck, Search,
  ArrowRight, KeyRound, Sparkles, RefreshCw, Check
} from 'lucide-react';
import { Order, CustomerUser, SiteSettings } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CustomerUser;
  orders: Order[];
  onUpdateProfile: (updatedUser: CustomerUser) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status']) => void;
  siteSettings: SiteSettings;
  onShowSuccessToast: (title: string, msg: string) => void;
  allCustomers?: CustomerUser[];
  onSelectCustomer?: (customer: CustomerUser) => void;
  onRefreshOrders?: () => Promise<any>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  orders = [],
  onUpdateProfile,
  siteSettings,
  onShowSuccessToast,
  allCustomers = [],
  onSelectCustomer,
  onRefreshOrders,
}) => {
  const currencySymbol = siteSettings?.currencySymbol || '৳';
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'switch'>('orders');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Editable Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  // Phone lookup for switching accounts
  const [phoneLookup, setPhoneLookup] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Keep state in sync with user prop when modal opens/user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email && !user.email.endsWith('@customer.eclat.com') ? user.email : '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  // Helper to extract clean digit phone
  const cleanDigits = (val?: string) => (val || '').replace(/\D/g, '');
  const userPhoneClean = cleanDigits(user?.phone);

  // Stored browser session hints to prevent losing newly placed orders
  const lastPlacedOrderId = typeof window !== 'undefined' ? localStorage.getItem('eclat_last_placed_order_id') : null;
  const activeCustomerPhone = typeof window !== 'undefined' ? cleanDigits(localStorage.getItem('eclat_active_customer_phone') || '') : '';
  const activeCustomerId = typeof window !== 'undefined' ? localStorage.getItem('eclat_active_customer_id') : null;

  // Auto-refresh orders from Supabase when modal opens and poll every 8 seconds for live status changes
  useEffect(() => {
    if (isOpen) {
      if (onRefreshOrders) {
        setIsRefreshing(true);
        onRefreshOrders().finally(() => {
          setTimeout(() => setIsRefreshing(false), 500);
        });
      }
      const pollTimer = setInterval(() => {
        if (onRefreshOrders) onRefreshOrders();
      }, 8000);
      return () => clearInterval(pollTimer);
    }
  }, [isOpen, onRefreshOrders]);

  const handleManualRefresh = async () => {
    if (onRefreshOrders) {
      setIsRefreshing(true);
      try {
        await onRefreshOrders();
        onShowSuccessToast('Supabase Live Sync', 'সুপাবেজ থেকে সর্বশেষ অর্ডার ও স্ট্যাটাস লোড হয়েছে।');
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  if (!isOpen || !user) return null;

  // STRICT ORDER ISOLATION + BROWSER SESSION RECOVERY:
  const userOrders = orders.filter((o) => {
    // 1. Strict customerId match (only if valid registered user ID)
    if (o.customerId && user.id && user.id !== 'guest-customer' && String(o.customerId) === String(user.id)) {
      return true;
    }
    // 2. Stored active customerId match
    if (activeCustomerId && activeCustomerId !== 'guest-customer' && o.customerId && String(o.customerId) === String(activeCustomerId)) {
      return true;
    }
    // 3. Strict phone number match (clean digits, last 10 digits)
    if (userPhoneClean.length >= 8) {
      const orderPhoneClean = cleanDigits(o.customerPhone || o.shippingAddress);
      if (orderPhoneClean.includes(userPhoneClean.slice(-10))) {
        return true;
      }
    }
    // 4. Stored active customer phone match
    if (activeCustomerPhone.length >= 8) {
      const orderPhoneClean = cleanDigits(o.customerPhone || o.shippingAddress);
      if (orderPhoneClean.includes(activeCustomerPhone.slice(-10))) {
        return true;
      }
    }
    // 5. Last placed order on this device
    if (lastPlacedOrderId && o.id === lastPlacedOrderId) {
      return true;
    }
    // 6. Strict non-default email match
    const orderEmail = (o.email || '').trim().toLowerCase();
    const curEmail = (user.email || '').trim().toLowerCase();
    if (orderEmail && curEmail && !curEmail.endsWith('@customer.eclat.com') && curEmail !== 'sophia.m@example.com' && orderEmail === curEmail) {
      return true;
    }
    return false;
  });

  // Global search fallback: if searching specifically by Order ID (ORD-...) or phone number
  const trimmedQuery = orderSearchQuery.trim();
  const displayOrders = trimmedQuery
    ? (
        userOrders.some((o) => o.id.toLowerCase().includes(trimmedQuery.toLowerCase()))
          ? userOrders.filter((o) => {
              const q = trimmedQuery.toLowerCase();
              return (
                o.id.toLowerCase().includes(q) ||
                (o.customerName || '').toLowerCase().includes(q) ||
                (o.shippingAddress || '').toLowerCase().includes(q) ||
                o.items.some((it) => it.productName.toLowerCase().includes(q))
              );
            })
          : orders.filter((o) => {
              const q = trimmedQuery.toLowerCase();
              const qDigits = cleanDigits(q);
              const orderIdMatch = o.id.toLowerCase().includes(q);
              const phoneMatch = qDigits.length >= 6 && cleanDigits(o.customerPhone || o.shippingAddress).includes(qDigits);
              return orderIdMatch || phoneMatch;
            })
      )
    : userOrders;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CustomerUser = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      phone: phone.trim() || user.phone,
      address: address.trim() || user.address,
    };
    onUpdateProfile(updated);
    setIsEditing(false);
    onShowSuccessToast('প্রোফাইল আপডেট সফল!', 'আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে।');
  };

  const handlePhoneLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const cleanLookup = cleanDigits(phoneLookup);
    if (!cleanLookup || cleanLookup.length < 8) {
      setLookupError('সঠিক মোবাইল নম্বর লিখুন (কমপক্ষে ৮ ডিজিট)।');
      return;
    }

    const matchedCustomer = allCustomers.find((c) => {
      const cPhone = cleanDigits(c.phone);
      return cPhone.includes(cleanLookup.slice(-8)) || cleanLookup.includes(cPhone.slice(-8));
    });

    if (matchedCustomer) {
      if (onSelectCustomer) {
        onSelectCustomer(matchedCustomer);
      } else {
        onUpdateProfile(matchedCustomer);
      }
      setPhoneLookup('');
      setActiveTab('orders');
      onShowSuccessToast('অ্যাকাউন্ট সফলভাবে পাওয়া গেছে!', `${matchedCustomer.name} হিসেবে লগইন সফল হয়েছে।`);
    } else {
      const matchingOrder = orders.find((o) => {
        const oPhone = cleanDigits(o.customerPhone || o.shippingAddress);
        return oPhone.includes(cleanLookup.slice(-8));
      });

      if (matchingOrder) {
        const guestCust: CustomerUser = {
          id: matchingOrder.customerId || `cust-${matchingOrder.id}`,
          name: matchingOrder.customerName,
          phone: matchingOrder.customerPhone || phoneLookup,
          email: matchingOrder.email || `${cleanLookup}@customer.eclat.com`,
          address: matchingOrder.shippingAddress,
          totalOrders: 1,
          totalSpent: matchingOrder.totalAmount,
          registeredDate: matchingOrder.date,
          status: 'Active',
        };
        if (onSelectCustomer) {
          onSelectCustomer(guestCust);
        } else {
          onUpdateProfile(guestCust);
        }
        setPhoneLookup('');
        setActiveTab('orders');
        onShowSuccessToast('অর্ডার ডাটা পাওয়া গেছে!', `অর্ডার #${matchingOrder.id} এর তথ্যানুযায়ী প্রোফাইল লোড হয়েছে।`);
      } else {
        setLookupError('এই মোবাইল নম্বরে পূর্বে কোনো অ্যাকাউন্ট বা অর্ডার পাওয়া যায়নি।');
      }
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>পেন্ডিং (অর্ডার গৃহীত হচ্ছে)</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>প্রসেসিং (পণ্য প্রস্তুত হচ্ছে)</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            <span>শিপড (ডেলিভারিতে বের হয়েছে)</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>সম্পন্ন (ডেলিভারি সম্পন্ন)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  // Elegant Status Stepper Tracker
  const renderStatusTracker = (status: Order['status']) => {
    const steps: { key: Order['status']; label: string; bangla: string }[] = [
      { key: 'Pending', label: 'Order Placed', bangla: 'অর্ডার প্লেস' },
      { key: 'Processing', label: 'Processing', bangla: 'প্রসেসিং' },
      { key: 'Shipped', label: 'On The Way', bangla: 'শিপড' },
      { key: 'Delivered', label: 'Delivered', bangla: 'ডেলিভার্ড' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === status);

    return (
      <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#e8ded5] my-2">
        <div className="relative flex items-center justify-between py-1">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#e8ded5] -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#2c7a4b] -translate-y-1/2 z-0 transition-all duration-700"
            style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((stepItem, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={stepItem.key} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                    isCompleted
                      ? 'bg-[#2c7a4b] text-white ring-2 ring-[#2c7a4b]/20'
                      : 'bg-white text-[#a89d95] border border-[#e8ded5]'
                  } ${isCurrent ? 'scale-110 ring-4 ring-[#2c7a4b]/20' : ''}`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 text-white" /> : idx + 1}
                </div>
                <span className={`text-[10px] sm:text-[11px] mt-1.5 font-bold text-center ${isCompleted ? 'text-[#1f2d29]' : 'text-[#8c7e75]'}`}>
                  {stepItem.bangla}
                </span>
                <span className={`text-[9px] font-medium text-center hidden sm:block ${isCompleted ? 'text-[#2c7a4b]' : 'text-[#a89d95]'}`}>
                  {stepItem.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#faf8f5] w-full max-w-3xl rounded-3xl border border-[#e8ded5] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col text-[#1f2d29]">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-[#1f2d29] text-white flex items-center justify-between shrink-0 border-b border-[#2d3e38]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#c97a7e]/25 text-[#e8beac] border border-[#c97a7e]/30 flex items-center justify-center font-bold shadow-xs">
              <User className="w-5 h-5 text-[#e8beac]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-title font-bold text-lg sm:text-xl text-white">
                  {name || 'কাস্টমার প্রোফাইল'}
                </h2>
                <span className="text-[10px] bg-[#c97a7e]/20 text-[#e8beac] border border-[#c97a7e]/40 px-2 py-0.5 rounded-full font-semibold">
                  Personal Account
                </span>
              </div>
              <p className="text-xs text-[#a89d95] flex items-center gap-2 mt-0.5">
                <span>{phone ? `মোবাইল: ${phone}` : 'অর্ডার সংক্রান্ত একাউন্ট'}</span>
                {email && <span>• {email}</span>}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#f2eee9] px-4 sm:px-6 py-2.5 border-b border-[#e8ded5] flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#1f2d29] text-white shadow-xs'
                : 'text-[#5a5048] hover:text-[#1f2d29] hover:bg-white/80'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#e8beac]" />
            <span>আমার অর্ডারসমূহ ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#1f2d29] text-white shadow-xs'
                : 'text-[#5a5048] hover:text-[#1f2d29] hover:bg-white/80'
            }`}
          >
            <User className="w-4 h-4 text-[#e8beac]" />
            <span>প্রোফাইল তথ্য (Profile Details)</span>
          </button>

          <button
            onClick={() => setActiveTab('switch')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'switch'
                ? 'bg-[#1f2d29] text-white shadow-xs'
                : 'text-[#5a5048] hover:text-[#1f2d29] hover:bg-white/80'
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#e8beac]" />
            <span>অ্যাকাউন্ট বদলান (Switch Account)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Order Search & Refresh Box */}
              <div className="bg-white p-3 rounded-2xl border border-[#d8c8bd] shadow-2xs flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#78988b] shrink-0" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="অর্ডার ট্র্যাক করুন: অর্ডার আইডি (যেমন: ORD-1234) বা মোবাইল নম্বর লিখুন..."
                  className="bg-transparent text-xs text-[#1f2d29] outline-none w-full placeholder:text-gray-400"
                />
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery('')}
                    className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f2d29] hover:bg-[#2d3e38] text-white transition-all text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0"
                  title="অর্ডার স্ট্যাটাস রিফ্রেশ করুন"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#c0dfe1]' : ''}`} />
                  <span className="hidden sm:inline">{isRefreshing ? 'সিঙ্ক...' : 'রিফ্রেশ'}</span>
                </button>
              </div>

              {/* Zero Orders State */}
              {displayOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 sm:p-10 text-center space-y-3 border border-[#d8c8bd]">
                  <div className="w-14 h-14 rounded-full bg-[#eae8d9] text-[#78988b] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif-title font-bold text-lg text-[#1f2d29]">
                    কোনো অর্ডার পাওয়া যায়নি
                  </h4>
                  <p className="text-xs text-[#70645c] max-w-md mx-auto leading-relaxed">
                    {orderSearchQuery
                      ? `"${orderSearchQuery}" দিয়ে কোনো অর্ডার মেলেনি। সঠিক অর্ডার আইডি বা মোবাইল নম্বর দিয়ে সার্চ করুন।`
                      : 'আপনি এখনো কোনো অর্ডার করেননি। যেকোনো পণ্য অর্ডার করার সময় আপনার দেওয়া তথ্যের ভিত্তিতে স্বয়ংক্রিয়ভাবে আপনার প্রোফাইল তৈরি হয়ে যাবে এবং এই ডিভাইসে সংরক্ষিত থাকবে।'}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-[#1f2d29] hover:bg-[#c97a7e] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      পণ্য ব্রাউজ করুন (Start Shopping)
                    </button>
                  </div>
                </div>
              ) : (
                displayOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-[#d8c8bd] p-5 shadow-xs space-y-4">
                    {/* Top Row: Order ID, Date & Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e8e1] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#1f2d29]">#{order.id}</span>
                          <span className="text-xs text-gray-500">({order.date})</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          প্রাপক: <strong className="text-[#1f2d29]">{order.customerName}</strong>
                          {order.customerPhone && <span className="ml-2 font-mono">({order.customerPhone})</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Order Visual Tracker Bar */}
                    {renderStatusTracker(order.status)}

                    {/* Items List */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        অর্ডারকৃত পণ্যসমূহ
                      </div>
                      <div className="bg-[#faf8f5] rounded-xl p-3 border border-[#d8c8bd] divide-y divide-[#e8ded5]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-[#1f2d29]">{item.productName}</span>
                              {item.variantName && (
                                <span className="text-gray-500 ml-1.5 font-normal">({item.variantName})</span>
                              )}
                              <div className="text-[11px] text-gray-600 font-mono">
                                {item.quantity} × {currencySymbol}{item.price}
                              </div>
                            </div>
                            <div className="font-bold text-[#1f2d29] font-mono">
                              {currencySymbol}{(item.quantity * item.price).toFixed(0)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Bottom Summary */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[#f0e8e1]">
                      <div className="text-gray-600">
                        পেমেন্ট পদ্ধতি: <span className="font-bold text-[#1f2d29]">{order.paymentMethod || 'ক্যাশ অন ডেলিভারি (COD)'}</span>
                        {order.shippingAddress && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            ঠিকানা: {order.shippingAddress}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 mr-2">সর্বমোট:</span>
                        <span className="font-bold text-base text-[#0f5132] font-mono">
                          {currencySymbol}{order.totalAmount.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-[#d8c8bd] shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#f0e8e1] pb-3">
                <h3 className="font-serif-title font-bold text-sm text-[#1f2d29]">
                  ব্যক্তিগত তথ্য ও ঠিকানা (Customer Information)
                </h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#78988b] hover:text-[#1f2d29] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>সম্পাদনা করুন (Edit)</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">নাম</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3.5 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#78988b]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3.5 py-2 text-xs font-mono text-[#1f2d29] outline-none focus:border-[#78988b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেইল</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3.5 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#78988b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">ডিফল্ট ডেলিভারি ঠিকানা</label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3.5 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#78988b] resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1f2d29] hover:bg-[#0f5132] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      সংরক্ষণ করুন (Save)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                </form>
              ) : (!user.name || user.id === 'guest-customer') ? (
                <div className="text-center py-6 px-4 bg-[#faf8f5] rounded-2xl border border-dashed border-[#d8c8bd] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#eae8d9] text-[#78988b] flex items-center justify-center mx-auto">
                    <User className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif-title font-bold text-sm text-[#1f2d29]">
                    কোনো তথ্য এখনো সংরক্ষিত নেই (খালি প্রোফাইল)
                  </h4>
                  <p className="text-xs text-[#70645c] max-w-sm mx-auto leading-relaxed">
                    আপনি যখন কোনো পণ্য অর্ডার করবেন, চেকআউটের সময় আপনার দেওয়া নাম, ফোন নম্বর ও ঠিকানার উপর ভিত্তি করে স্বয়ংক্রিয়ভাবে এই ডিভাইসে আপনার অ্যাকাউন্ট তৈরি হয়ে যাবে।
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1f2d29] hover:bg-[#c97a7e] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>এখনই তথ্য লিখুন</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8ded5]">
                    <span className="text-gray-500 block text-[11px]">গ্রাহকের নাম:</span>
                    <strong className="text-[#1f2d29] text-sm">{user.name || 'N/A'}</strong>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8ded5]">
                    <span className="text-gray-500 block text-[11px]">মোবাইল নম্বর:</span>
                    <strong className="text-[#1f2d29] text-sm font-mono">{user.phone || 'N/A'}</strong>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8ded5]">
                    <span className="text-gray-500 block text-[11px]">ইমেইল:</span>
                    <span className="text-[#1f2d29]">{email || 'N/A'}</span>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8ded5]">
                    <span className="text-gray-500 block text-[11px]">ডেলিভারি ঠিকানা:</span>
                    <span className="text-[#1f2d29]">{user.address || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SWITCH ACCOUNT */}
          {activeTab === 'switch' && (
            <div className="bg-white p-6 rounded-2xl border border-[#d8c8bd] shadow-2xs space-y-4">
              <div>
                <h3 className="font-serif-title font-bold text-sm text-[#1f2d29]">
                  পূর্বে অর্ডারকৃত ফোন নম্বর দিয়ে অ্যাকাউন্ট লোড করুন
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  আপনি যদি পূর্বে অন্য ফোন নম্বর দিয়ে অর্ডার করে থাকেন, নম্বরটি লিখলে আপনার পুরনো অর্ডার হিস্ট্রি চলে আসবে।
                </p>
              </div>

              <form onSubmit={handlePhoneLookup} className="flex gap-2">
                <input
                  type="tel"
                  placeholder="১১ ডিজিটের মোবাইল নম্বর লিখুন..."
                  value={phoneLookup}
                  onChange={(e) => setPhoneLookup(e.target.value)}
                  className="flex-1 bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3.5 py-2.5 text-xs text-[#1f2d29] outline-none font-mono focus:border-[#78988b]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1f2d29] hover:bg-[#0f5132] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
                >
                  খুঁজুন
                </button>
              </form>

              {lookupError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{lookupError}</span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
