import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Check, Tag } from 'lucide-react';
import { CartItem, SiteSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, variantId: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variantId?: string) => void;
  onOpenCheckout: () => void;
  siteSettings?: SiteSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  siteSettings,
}) => {
  const currencySymbol = siteSettings?.currencySymbol || '৳';
  const freeShippingThreshold = siteSettings?.freeShippingThreshold || 1000;
  const insideDhakaCharge = siteSettings?.insideDhakaDeliveryCharge ?? 60;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const discountAmount = (subtotal * discountPercent) / 100;
  const isFreeShippingUnlocked = subtotal >= freeShippingThreshold;
  const estimatedShipping = isFreeShippingUnlocked || cartItems.length === 0 ? 0 : insideDhakaCharge;
  const finalTotal = Math.max(0, subtotal - discountAmount + estimatedShipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'ECLAT10' || code === 'GLOW10') {
      setDiscountPercent(10);
      setPromoApplied('10% OFF applied!');
      setPromoError('');
    } else if (code === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoApplied('20% Welcome Gift applied!');
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try ECLAT10 for 10% off.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md flex justify-end animate-fadeIn">
      <div className="bg-[#faf8f5] w-full max-w-md h-[100dvh] max-h-[100dvh] shadow-2xl flex flex-col justify-between relative border-l border-[#e8ded5] overflow-hidden">
        
        {/* Header - Fixed Shrink 0 */}
        <div className="p-4 sm:p-5 border-b border-[#e8ded5] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#c97a7e]/15 flex items-center justify-center text-[#c97a7e]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-title font-bold text-base sm:text-lg text-[#2c2724]">
                Your Shopping Bag
              </h2>
              <p className="text-[11px] text-[#70645c]">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} {cartItems.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'item' : 'items'} in bag
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#4a423d] hover:bg-[#f0e8e1] rounded-full transition-colors"
            title="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator - Fixed Shrink 0 */}
        <div className="bg-[#2c2724] text-[#faf8f5] px-4 sm:px-6 py-2.5 text-xs shrink-0">
          <div className="flex justify-between items-center mb-1 font-medium">
            {amountToFreeShipping > 0 ? (
              <span className="text-[11px] sm:text-xs">
                Add <strong className="text-[#e8beac]">{currencySymbol}{amountToFreeShipping.toFixed(0)}</strong> more for FREE shipping
              </span>
            ) : (
              <span className="text-[#e8beac] font-bold flex items-center gap-1 text-[11px] sm:text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Unlocked Free Express Shipping!
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c97a7e] transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List - Scrollable flex-1 min-h-0 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#f0e8e1] flex items-center justify-center mx-auto text-[#8c7e75]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-[#2c2724]">Your bag is empty</h3>
              <p className="text-xs text-[#8c7e75] max-w-xs mx-auto">
                Explore our botanical elixirs, serums, and organic skincare items.
              </p>
              <button
                onClick={onClose}
                className="bg-[#2c2724] text-white text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-full hover:bg-[#c97a7e] transition-colors shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                className="bg-white p-3 sm:p-4 rounded-2xl border border-[#e8ded5] flex gap-3.5 items-center relative group shadow-2xs"
              >
                {/* Thumbnail */}
                <img
                  src={item.selectedVariant?.image || item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-[#f8f5f2] shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-title font-bold text-xs sm:text-sm text-[#2c2724] truncate">
                    {item.product.name}
                  </h4>
                  {item.selectedVariant && (
                    <span className="text-[11px] text-[#c97a7e] font-medium block">
                      Variant: {item.selectedVariant.name}
                    </span>
                  )}
                  <span className="font-serif-title font-bold text-xs text-[#2c2724] block mt-1">
                    {currencySymbol}{item.product.price}
                  </span>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedVariant?.id)}
                    className="text-[#a89d95] hover:text-[#c97a7e] transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-[#d8c8bd] rounded-full px-2 py-0.5 bg-[#faf8f5]">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant?.id, -1)}
                      className="px-1 text-xs font-bold text-[#4a423d] hover:text-[#2c2724]"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-[#2c2724]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant?.id, 1)}
                      className="px-1 text-xs font-bold text-[#4a423d] hover:text-[#2c2724]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Summary - Fixed Shrink 0 */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#e8ded5] space-y-3 shrink-0 shadow-lg">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#8c7e75] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Promo Code (ECLAT10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl pl-8 pr-2 py-1.5 text-xs text-[#2c2724] outline-none uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="bg-[#2c2724] text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl hover:bg-[#c97a7e] transition-colors shrink-0"
              >
                Apply
              </button>
            </form>
            {promoApplied && <p className="text-[11px] text-[#5c8a68] font-semibold">{promoApplied}</p>}
            {promoError && <p className="text-[11px] text-[#a84343]">{promoError}</p>}

            {/* Price Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5a5048] pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2c2724]">{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#5c8a68]">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>{isFreeShippingUnlocked ? 'FREE' : `${currencySymbol}${estimatedShipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e8ded5] font-serif-title font-bold text-sm sm:text-base text-[#2c2724]">
                <span>Total Charges</span>
                <span className="text-[#c97a7e]">{currencySymbol}{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full bg-[#1f2d29] hover:bg-[#c97a7e] text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <span>অর্ডার ও পেমেন্ট প্রসিড করুন (Proceed to Order)</span>
              <ArrowRight className="w-4 h-4 text-[#e8beac]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
