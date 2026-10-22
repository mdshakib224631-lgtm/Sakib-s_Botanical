import React, { useState, useEffect } from 'react';
import {
  X, Truck, Search, CheckCircle2, Clock, PackageCheck,
  MapPin, Phone, RefreshCw, ShoppingBag
} from 'lucide-react';
import { Order, SiteSettings } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  siteSettings: SiteSettings;
  defaultPhone?: string;
  onRefreshOrders?: () => Promise<any>;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders = [],
  siteSettings,
  onRefreshOrders,
}) => {
  const currencySymbol = siteSettings?.currencySymbol || '৳';
  
  // Clean digits helper
  const cleanPhoneDigits = (val?: string) => (val || '').replace(/\D/g, '');

  // Strictly empty by default - No default orders shown until user searches
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Reset search state on modal open so NO default orders are shown
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setSearchedQuery('');
      setHasSearched(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.trim();
    if (!clean) return;
    setSearchedQuery(clean);
    setHasSearched(true);
  };

  const handleManualRefresh = async () => {
    if (onRefreshOrders) {
      setIsRefreshing(true);
      try {
        await onRefreshOrders();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // Filter orders STRICTLY and ONLY for the searched phone number or exact Order ID
  const searchClean = cleanPhoneDigits(searchedQuery);
  const trimmedInput = searchedQuery.trim().toUpperCase();

  const isFullOrderId = trimmedInput.startsWith('ORD-') && trimmedInput.length >= 7;
  const isPhoneNumber = searchClean.length >= 10;

  const matchedOrders = hasSearched
    ? orders.filter((order) => {
        // 1. Exact Match by Order ID (e.g. ORD-8921)
        if (isFullOrderId && order.id.toUpperCase() === trimmedInput) {
          return true;
        }

        // 2. Strict Exact 10-digit Customer Phone Match
        if (isPhoneNumber && order.customerPhone) {
          const orderPhoneClean = cleanPhoneDigits(order.customerPhone);
          if (orderPhoneClean.length >= 10) {
            if (orderPhoneClean.slice(-10) === searchClean.slice(-10)) {
              return true;
            }
          }
        }

        return false;
      })
    : [];

  // 4-Step Tracker Definition in clean English
  const steps: { key: Order['status']; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'Pending', label: 'Order Placed', description: 'Order confirmed & logged', icon: PackageCheck },
    { key: 'Processing', label: 'Processing', description: 'Package being prepared', icon: Clock },
    { key: 'Shipped', label: 'On The Way', description: 'With courier rider', icon: Truck },
    { key: 'Delivered', label: 'Delivered', description: 'Arrived at doorstep', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const renderStatusTracker = (status: Order['status']) => {
    const currentStepIndex = getStepIndex(status);

    return (
      <div className="bg-[#faf8f5] p-3.5 sm:p-5 rounded-2xl border border-[#e8ded5] my-2">
        <div className="relative flex items-center justify-between py-1">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-[#e8ded5] -translate-y-1/2 z-0 rounded-full" />
          
          {/* Active Progress Line */}
          <div
            className="absolute top-1/2 left-4 h-1.5 bg-[#2c7a4b] -translate-y-1/2 z-0 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (Math.max(0, currentStepIndex) / (steps.length - 1)) * 92)}%` }}
          />

          {steps.map((stepItem, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = stepItem.icon;

            return (
              <div key={stepItem.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-[#2c7a4b] text-white ring-2 ring-[#2c7a4b]/30'
                      : 'bg-white text-[#a89d95] border-2 border-[#d8c8bd]'
                  } ${isCurrent ? 'scale-110 ring-4 ring-[#2c7a4b]/20 bg-[#1f2d29] text-white animate-pulse' : ''}`}
                >
                  <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                
                {/* Step Name */}
                <span className={`text-[11px] sm:text-xs mt-2 font-bold text-center ${isCompleted ? 'text-[#1f2d29]' : 'text-[#8c7e75]'}`}>
                  {stepItem.label}
                </span>

                {/* Sub-label */}
                <span className={`text-[9px] sm:text-[10px] text-center hidden xs:block font-medium ${isCurrent ? 'text-[#2c7a4b] font-bold' : 'text-[#8c7e75]'}`}>
                  {stepItem.description}
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
      {/* Centered Modal Dialog with Elegant Borders */}
      <div className="bg-[#faf8f5] w-full max-w-xl sm:max-w-2xl rounded-3xl border-2 border-[#d8c8bd] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col text-[#1f2d29] my-auto">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-[#1f2d29] text-white flex items-center justify-between shrink-0 border-b border-[#2d3e38]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2c7a4b]/25 border border-[#2c7a4b]/40 text-[#a3d9b4] flex items-center justify-center shadow-xs shrink-0">
              <Truck className="w-5 h-5 text-[#a3d9b4]" />
            </div>
            <div>
              <h2 className="font-serif-title font-bold text-base sm:text-lg text-white">
                Order Tracking & Delivery Status
              </h2>
              <p className="text-[11px] text-[#a3d9b4] mt-0.5">
                Track real-time shipment updates using your mobile number or Order ID
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Phone Search Box */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#d8c8bd] shadow-xs space-y-2.5">
            <label className="block text-xs sm:text-sm font-bold text-[#1f2d29]">
              Enter Mobile Number or Order ID:
            </label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-[#8c7e75] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 01XXXXXXXXX or ORD-1234"
                  className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm font-mono text-[#1f2d29] outline-none focus:border-[#2c7a4b] focus:bg-white transition-all placeholder:text-[#a89d95]"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="px-4 sm:px-6 py-2.5 bg-[#1f2d29] hover:bg-[#2c7a4b] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </button>

              {onRefreshOrders && hasSearched && (
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="p-2.5 rounded-xl border border-[#d8c8bd] bg-[#faf8f5] hover:bg-[#e8ded5] text-[#1f2d29] transition-all cursor-pointer shrink-0"
                  title="Refresh order data"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#2c7a4b]' : ''}`} />
                </button>
              )}
            </form>
          </div>

          {/* Search Results Display */}
          {hasSearched ? (
            matchedOrders.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#5a5048] px-1 font-semibold">
                  <span>Found Orders: <strong>{matchedOrders.length}</strong></span>
                  <span className="text-[#2c7a4b] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Live Courier Tracking Active
                  </span>
                </div>

                {matchedOrders.map((order) => {
                  const stepIndex = getStepIndex(order.status);
                  const activeStep = steps[stepIndex] || steps[0];

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-[#d8c8bd] p-4 sm:p-5 shadow-xs space-y-3.5"
                    >
                      {/* Order Header: ID, Date & Current Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0e8e1] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm sm:text-base text-[#1f2d29]">
                              #{order.id}
                            </span>
                            <span className="text-xs text-[#8c7e75]">({order.date})</span>
                          </div>
                          <p className="text-xs text-[#5a5048] mt-0.5">
                            Customer: <strong className="text-[#1f2d29]">{order.customerName}</strong>
                            {order.customerPhone && (
                              <span className="ml-2 font-mono text-[#8c7e75]">({order.customerPhone})</span>
                            )}
                          </p>
                        </div>

                        {/* Current Status Pill */}
                        <div className="flex items-center gap-1.5 bg-[#eaf5ee] text-[#2c7a4b] border border-[#2c7a4b]/30 px-3 py-1 rounded-full text-xs font-bold">
                          <span className="w-2 h-2 rounded-full bg-[#2c7a4b] animate-ping" />
                          <span>Status: {activeStep.label}</span>
                        </div>
                      </div>

                      {/* 4-Step Visual Progress Stepper */}
                      <div>
                        <div className="text-xs font-bold text-[#1f2d29] mb-1">
                          Delivery Timeline:
                        </div>
                        {renderStatusTracker(order.status)}
                      </div>

                      {/* Products in this order */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-[#8c7e75] uppercase tracking-wider block">
                          Ordered Items:
                        </span>
                        <div className="bg-[#faf8f5] rounded-xl p-3 border border-[#e8ded5] divide-y divide-[#e8ded5]">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-semibold text-[#1f2d29]">{item.productName}</span>
                                {item.variantName && (
                                  <span className="text-[#c97a7e] ml-1.5">({item.variantName})</span>
                                )}
                                <div className="text-[11px] text-[#8c7e75] font-mono">
                                  Qty: {item.quantity} × {currencySymbol}{item.price}
                                </div>
                              </div>
                              <span className="font-mono font-bold text-xs text-[#1f2d29]">
                                {currencySymbol}{item.quantity * item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Details: Address & Payment Total */}
                      <div className="pt-2 border-t border-[#f0e8e1] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="text-[#5a5048] space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#8c7e75] shrink-0" />
                            <span>Address: <strong>{order.shippingAddress}</strong></span>
                          </div>
                          <div>
                            Payment: <span className="font-semibold text-[#2c7a4b]">{order.paymentMethod || 'Cash on Delivery'}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[#8c7e75] mr-1.5">Total Payable:</span>
                          <span className="font-mono font-bold text-base text-[#1f2d29]">
                            {currencySymbol}{order.totalAmount}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 sm:p-8 text-center space-y-2.5 border border-[#d8c8bd]">
                <div className="w-12 h-12 rounded-full bg-[#faf0eb] text-[#c97a7e] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-serif-title font-bold text-sm sm:text-base text-[#1f2d29]">
                  No Orders Found
                </h4>
                <p className="text-xs text-[#70645c] max-w-sm mx-auto leading-relaxed">
                  {searchClean.length > 0 && searchClean.length < 10 && !isFullOrderId
                    ? 'Please enter a valid 11-digit mobile number (e.g. 01XXXXXXXXX).'
                    : `No orders found matching "${searchedQuery}". Please ensure you entered the exact mobile number used during checkout.`}
                </p>
              </div>
            )
          ) : (
            /* Clean Empty State Before Search */
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-center space-y-2.5 border border-[#d8c8bd]">
              <div className="w-12 h-12 rounded-full bg-[#eaf5ee] text-[#2c7a4b] flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-serif-title font-bold text-sm sm:text-base text-[#1f2d29]">
                Live Order Tracker
              </h4>
              <p className="text-xs text-[#70645c] max-w-sm mx-auto leading-relaxed">
                Enter your mobile number or Order ID in the search box above to view real-time delivery status and courier updates.
              </p>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#e8ded5] flex items-center justify-between text-xs text-[#8c7e75] shrink-0">
          <div className="flex items-center gap-1.5 text-[#2c7a4b] font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Real-time Parcel Tracking</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#faf8f5] hover:bg-[#e8ded5] text-[#1f2d29] rounded-xl font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
