import React, { useState, useEffect } from 'react';
import {
  X, ShieldCheck, MapPin, Banknote,
  User, Phone, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Building2, Compass, Navigation, Lock
} from 'lucide-react';
import { CartItem, Order, SiteSettings, CustomerUser } from '../types';
import { BANGLADESH_GEO_DATA } from '../data/bangladeshGeo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
  onNewOrderCreated: (order: Order) => void;
  siteSettings?: SiteSettings;
  currentUser?: CustomerUser;
  onOpenProfile?: () => void;
  onOpenTracking?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  onNewOrderCreated,
  siteSettings,
  currentUser,
  onOpenProfile,
  onOpenTracking,
}) => {
  const currencySymbol = siteSettings?.currencySymbol || '৳';
  const insideDhakaCharge = siteSettings?.insideDhakaDeliveryCharge ?? 60;
  const outsideDhakaCharge = siteSettings?.outsideDhakaDeliveryCharge ?? 120;

  // 2-Step Flow: Step 1 (Delivery Information) & Step 2 (Payment & Order Summary)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form Fields: Customer & Delivery Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Geographic Location Dropdowns: Division, District, Upazila
  const [selectedDivision, setSelectedDivision] = useState<string>('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Dhaka');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('Dhanmondi');

  // Detailed Street Address
  const [addressDetails, setAddressDetails] = useState('');

  // Delivery Area is strictly & immutably derived from selectedDivision:
  // Division === 'Dhaka' => 'inside_dhaka'
  // Any other division => 'outside_dhaka'
  const deliveryArea: 'inside_dhaka' | 'outside_dhaka' =
    selectedDivision.trim().toLowerCase() === 'dhaka' ? 'inside_dhaka' : 'outside_dhaka';

  // Promo Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Available districts for current division
  const availableDistricts = selectedDivision && BANGLADESH_GEO_DATA[selectedDivision]
    ? Object.keys(BANGLADESH_GEO_DATA[selectedDivision].districts)
    : [];

  // Available upazilas for current district
  const availableUpazilas = selectedDivision && selectedDistrict && BANGLADESH_GEO_DATA[selectedDivision]?.districts[selectedDistrict]
    ? BANGLADESH_GEO_DATA[selectedDivision].districts[selectedDistrict]
    : [];

  // Handle Division Change: Auto-sets District, Upazila and locks Delivery Area automatically
  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);

    const divData = BANGLADESH_GEO_DATA[division];
    if (divData) {
      const firstDistrict = Object.keys(divData.districts)[0] || '';
      setSelectedDistrict(firstDistrict);
      const firstUpazila = divData.districts[firstDistrict]?.[0] || '';
      setSelectedUpazila(firstUpazila);
    } else {
      setSelectedDistrict('');
      setSelectedUpazila('');
    }
  };

  // Handle District Change
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const divData = BANGLADESH_GEO_DATA[selectedDivision];
    if (divData && divData.districts[district]) {
      setSelectedUpazila(divData.districts[district][0] || '');
    } else {
      setSelectedUpazila('');
    }
  };

  // Auto-fill and reset on modal open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setValidationError(null);
      if (currentUser && currentUser.name && !currentUser.name.includes('Guest') && !currentUser.name.includes('অ্যাকাউন্ট')) {
        setFullName(currentUser.name);
        setPhone(currentUser.phone || '');
        if (currentUser.address) {
          setAddressDetails(currentUser.address);
        }
      }
    }
  }, [isOpen, currentUser]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCharge = deliveryArea === 'inside_dhaka' ? insideDhakaCharge : outsideDhakaCharge;
  const total = Math.max(0, subtotal + deliveryCharge - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (siteSettings?.promoCode && code === siteSettings.promoCode.toUpperCase()) {
      const discountPct = siteSettings.discountPercentage || 15;
      const discount = Math.round(subtotal * (discountPct / 100));
      setAppliedDiscount(discount);
      setCouponMessage(`Coupon applied! ${currencySymbol}${discount} discount added.`);
    } else if (code === 'ECLAT10' || code === 'ECLAT15' || code === 'ORGANIC' || code === 'SAKIB10') {
      const discount = Math.round(subtotal * 0.15);
      setAppliedDiscount(discount);
      setCouponMessage(`Special 15% discount applied!`);
    } else {
      setCouponMessage('Invalid coupon code.');
    }
  };

  // Construct full formatted address
  const getFullFormattedAddress = () => {
    const parts = [
      addressDetails.trim(),
      selectedUpazila,
      selectedDistrict,
      selectedDivision ? `${selectedDivision} Division` : ''
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Move from Step 1 to Step 2
  const handleProceedToStep2 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const trimmedName = fullName.trim();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const trimmedAddress = addressDetails.trim();

    if (!trimmedName) {
      setValidationError('Please enter your full name.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setValidationError('Please enter a valid 11-digit mobile number.');
      return;
    }

    if (!selectedDivision) {
      setValidationError('Please select your division.');
      return;
    }

    if (!selectedDistrict) {
      setValidationError('Please select your district.');
      return;
    }

    if (!trimmedAddress || trimmedAddress.length < 3) {
      setValidationError('Please enter your street address (House/Road/Area).');
      return;
    }

    // Switch to step 2 seamlessly
    setCurrentStep(2);
  };

  // Final Order Confirmation
  const handleConfirmOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const trimmedName = fullName.trim();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const fullShippingAddress = getFullFormattedAddress();

    if (!trimmedName || !cleanPhone || !addressDetails.trim()) {
      setCurrentStep(1);
      setValidationError('Please complete all delivery information fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentMethodLabel = 'Cash on Delivery';

      const order: Order = {
        id: orderId,
        customerId: currentUser?.id,
        customerName: trimmedName,
        email: `${cleanPhone.replace(/\D/g, '')}@customer.eclat.com`,
        customerPhone: cleanPhone,
        items: cartItems.map((ci) => ({
          productName: ci.product.name,
          variantName: ci.selectedVariant?.name || undefined,
          quantity: ci.quantity,
          price: ci.product.price,
        })),
        totalAmount: total,
        deliveryArea: deliveryArea,
        deliveryCharge: deliveryCharge,
        paymentMethod: paymentMethodLabel,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        shippingAddress: fullShippingAddress,
        notes: `Division: ${selectedDivision}, District: ${selectedDistrict}, Upazila: ${selectedUpazila}`,
      };

      // 1. Instant state & storage update (< 1ms)
      onNewOrderCreated(order);
      onClearCart();
      setIsSubmitting(false);

      // 2. Immediate transition to live Order Tracking modal
      onClose();
      if (onOpenTracking) {
        onOpenTracking();
      } else if (onOpenProfile) {
        onOpenProfile();
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setIsSubmitting(false);
      onClose();
      if (onOpenTracking) {
        onOpenTracking();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Centered Single Modal Dialog with Elegant Borders - Compact & Zero-Scroll */}
      <div className="bg-[#faf8f5] w-full max-w-lg sm:max-w-xl rounded-3xl border-2 border-[#d8c8bd] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col text-[#1f2d29] my-auto">
        
        {/* Top Header Bar */}
        <div className="bg-[#1f2d29] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-[#2d3e38]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2c7a4b]/30 text-[#a3d9b4] flex items-center justify-center font-bold text-xs tracking-wider">
              COD
            </div>
            <div>
              <h2 className="font-serif-title font-bold text-sm sm:text-base text-white">
                Checkout & Confirmation
              </h2>
              <p className="text-[10px] text-[#a3d9b4] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#a3d9b4]" />
                <span>100% Cash on Delivery (Pay upon receiving parcel)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Step Option Tabs Bar at the Top of Dialog */}
        <div className="bg-white px-3 sm:px-5 py-2.5 border-b border-[#e8ded5] flex items-center justify-between gap-2 shrink-0">
          {/* Step 1 Tab Button */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === 1
                ? 'bg-[#1f2d29] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#5a5048] border border-[#e8ded5] hover:border-[#1f2d29]'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
              currentStep === 1 ? 'bg-white text-[#1f2d29]' : 'bg-[#e8ded5] text-[#5a5048]'
            }`}>
              1
            </span>
            <span className="truncate">1. Delivery Info</span>
          </button>

          {/* Step 2 Tab Button */}
          <button
            type="button"
            onClick={() => {
              if (fullName.trim() && phone.trim().length >= 10 && addressDetails.trim().length >= 3) {
                setCurrentStep(2);
              } else {
                handleProceedToStep2();
              }
            }}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === 2
                ? 'bg-[#1f2d29] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#5a5048] border border-[#e8ded5] hover:border-[#1f2d29]'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
              currentStep === 2 ? 'bg-white text-[#1f2d29]' : 'bg-[#e8ded5] text-[#5a5048]'
            }`}>
              2
            </span>
            <span className="truncate">2. Payment & Summary</span>
          </button>
        </div>

        {/* Modal Center Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-3">
          
          {/* Validation Alert */}
          {validationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ================= STEP 1: DELIVERY INFO ================= */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-fadeIn">
              
              {/* Row 1: Full Name beside Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f2d29] mb-1">
                    Full Name <span className="text-[#c97a7e]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#8c7e75] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sakib Ahmed"
                      className="w-full bg-white border border-[#d8c8bd] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#1f2d29] transition-all placeholder:text-[#a89d95]"
                    />
                  </div>
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f2d29] mb-1">
                    Mobile Number <span className="text-[#c97a7e]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#8c7e75] absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-white border border-[#d8c8bd] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-[#1f2d29] outline-none focus:border-[#1f2d29] transition-all placeholder:text-[#a89d95]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Division beside District beside Upazila / Thana (Dropdown selection) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Division Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f2d29] mb-1 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#2c7a4b]" />
                    <span>Division <span className="text-[#c97a7e]">*</span></span>
                  </label>
                  <select
                    value={selectedDivision}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full bg-white border border-[#d8c8bd] rounded-xl px-2.5 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#1f2d29] transition-all cursor-pointer font-medium"
                  >
                    {Object.keys(BANGLADESH_GEO_DATA).map((divName) => (
                      <option key={divName} value={divName}>
                        {divName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f2d29] mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#2c7a4b]" />
                    <span>District <span className="text-[#c97a7e]">*</span></span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-white border border-[#d8c8bd] rounded-xl px-2.5 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#1f2d29] transition-all cursor-pointer font-medium"
                  >
                    {availableDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upazila / Thana Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-[#1f2d29] mb-1 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#2c7a4b]" />
                    <span>Upazila / Area <span className="text-[#c97a7e]">*</span></span>
                  </label>
                  <select
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    className="w-full bg-white border border-[#d8c8bd] rounded-xl px-2.5 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#1f2d29] transition-all cursor-pointer font-medium"
                  >
                    {availableUpazilas.map((upz) => (
                      <option key={upz} value={upz}>
                        {upz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Detailed Street Address (House / Road / Area) */}
              <div>
                <label className="block text-xs font-semibold text-[#1f2d29] mb-1">
                  Detailed Address (House / Road / Area / Landmark) <span className="text-[#c97a7e]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#8c7e75] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    placeholder="e.g. House #12, Road #4, Block D, Banani"
                    className="w-full bg-white border border-[#d8c8bd] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#1f2d29] transition-all placeholder:text-[#a89d95]"
                  />
                </div>
              </div>

              {/* Immutable Delivery Zone Badge (Auto-Selected based on Dropdown & Non-Editable) */}
              <div className="bg-white p-2.5 rounded-2xl border border-[#d8c8bd] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#1f2d29] text-white flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5 text-[#e8beac]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8c7e75] block uppercase font-bold tracking-wider">
                      Delivery Zone (Auto-Locked)
                    </span>
                    <span className="font-bold text-xs text-[#1f2d29]">
                      {deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#2c7a4b] bg-[#eaf5ee] px-2.5 py-1 rounded-xl border border-[#2c7a4b]/20 inline-block">
                    {currencySymbol}{deliveryCharge} Delivery Charge
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 2: PAYMENT & SUMMARY (COMPACT & REFINED) ================= */}
          {currentStep === 2 && (
            <div className="space-y-3 animate-fadeIn">
              
              {/* Cash On Delivery Method Card */}
              <div className="p-3 rounded-2xl border border-[#1f2d29] bg-white shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#eaf5ee] text-[#2c7a4b] flex items-center justify-center shrink-0">
                      <Banknote className="w-4 h-4 text-[#2c7a4b]" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#1f2d29] block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] text-[#2c7a4b] font-medium">
                        Pay cash directly upon parcel delivery
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-[#2c7a4b] text-white px-2.5 py-0.5 rounded-full font-bold shrink-0">
                    ৳0 Advance
                  </span>
                </div>
              </div>

              {/* Delivery Zone Row (Immutable display) */}
              <div className="bg-white px-3 py-2 rounded-xl border border-[#e8ded5] text-xs flex items-center justify-between shadow-2xs">
                <span className="text-[#5a5048] flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#2c7a4b]" />
                  <span>Delivery Zone: <strong>{deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</strong> ({selectedDivision})</span>
                </span>
                <span className="font-mono font-bold text-[#1f2d29]">{currencySymbol}{deliveryCharge}</span>
              </div>

              {/* Promo Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo Code (e.g. SAKIB10)"
                  className="flex-1 bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs uppercase font-mono outline-none focus:border-[#1f2d29]"
                />
                <button
                  type="submit"
                  className="bg-[#1f2d29] hover:bg-[#c97a7e] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
                >
                  Apply
                </button>
              </form>
              {couponMessage && (
                <p className={`text-[10px] ${appliedDiscount > 0 ? 'text-[#2c7a4b] font-semibold' : 'text-red-600'}`}>
                  {couponMessage}
                </p>
              )}

              {/* Cost Breakdown Summary Card */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#e8ded5] space-y-1.5 text-xs shadow-2xs">
                <div className="flex justify-between text-[#70645c]">
                  <span>Subtotal ({cartItems.reduce((acc, ci) => acc + ci.quantity, 0)} items)</span>
                  <span className="font-mono">{currencySymbol}{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#70645c]">
                  <span>Delivery Charge ({deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span className="font-mono">{currencySymbol}{deliveryCharge}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#2c7a4b] font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-{currencySymbol}{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#1f2d29] pt-2 border-t border-[#e8ded5]">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#c97a7e] font-bold text-base">{currencySymbol}{total}</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Pinned Bottom CTA Action Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#e8ded5] shrink-0">
          {currentStep === 1 ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#8c7e75] block">Total Amount:</span>
                <span className="font-mono font-bold text-sm text-[#1f2d29]">{currencySymbol}{total}</span>
              </div>
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="flex-1 max-w-[240px] bg-[#1f2d29] hover:bg-[#2c7a4b] text-white py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer ml-auto"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="p-2.5 rounded-xl border border-[#d8c8bd] bg-[#faf8f5] hover:bg-[#e8ded5] text-[#1f2d29] transition-all cursor-pointer shrink-0"
                title="Back to delivery details"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmOrder}
                className="flex-1 bg-[#1f2d29] hover:bg-[#2c7a4b] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#a3d9b4]" />
                    <span>Confirm Order • {currencySymbol}{total}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
