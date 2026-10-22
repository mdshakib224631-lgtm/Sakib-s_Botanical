import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { Product, ProductVariant, Review } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddReview?: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  currencySymbol?: string;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  currencySymbol = '৳',
}) => {
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'howToUse'>('details');
  const [added, setAdded] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || '');
      setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
      setQuantity(1);
      setActiveTab('details');
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  const currentPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Centered Modal Dialog with Elegant Borders */}
      <div className="bg-[#faf8f5] w-full max-w-xl sm:max-w-2xl rounded-3xl border-2 border-[#d8c8bd] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col text-[#1f2d29] my-auto">
        
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-5 bg-white border-b border-[#e8ded5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="uppercase font-bold tracking-wider text-[#c97a7e] text-[10px] sm:text-xs bg-[#f8ede8] px-2.5 py-0.5 rounded-full shrink-0">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#2c2724] font-semibold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#d4a373] text-[#d4a373]" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#a89d95] text-[11px]">({product.reviewCount})</span>
            </div>
            {product.isOrganic && (
              <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-bold text-[#5c8a68] bg-[#eaf4ed] px-2 py-0.5 rounded-full shrink-0">
                <Sparkles className="w-2.5 h-2.5" /> ১০০% অর্গানিক
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-[#faf8f5] hover:bg-[#e8ded5] text-[#2c2724] rounded-full transition-colors cursor-pointer shrink-0"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Center Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Main Product Card: Centered and well-balanced */}
          <div className="flex flex-row items-center gap-3.5 sm:gap-5 bg-white p-3.5 sm:p-5 rounded-2xl border border-[#e8ded5] shadow-2xs">
            {/* Image Preview */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#f8f5f2] shrink-0 border border-[#e8ded5]">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.isNew && (
                <span className="absolute top-1 left-1 bg-[#c97a7e] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  NEW
                </span>
              )}
            </div>

            {/* Title, Pricing & Highlights */}
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-title text-sm sm:text-lg font-bold text-[#2c2724] leading-snug line-clamp-2">
                {product.name}
              </h2>
              <p className="text-[10px] sm:text-xs text-[#70645c] mt-0.5 font-light line-clamp-1">
                {product.tagline}
              </p>

              {/* Price & Stock */}
              <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                <span className="font-serif-title font-bold text-base sm:text-xl text-[#2c2724]">
                  {currencySymbol}{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[11px] sm:text-xs text-[#a89d95] line-through">
                    {currencySymbol}{product.originalPrice}
                  </span>
                )}
                {product.inStock ? (
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#2c7a4b] bg-[#eaf5ee] px-2 py-0.5 rounded-full">
                    স্টকে আছে ({product.stockCount} টি)
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    স্টক শেষ
                  </span>
                )}
              </div>

              {/* Guarantees */}
              <div className="mt-2 flex items-center gap-2 text-[10px] text-[#8c7e75]">
                <span className="flex items-center gap-1 text-[#2c7a4b] font-medium">
                  <ShieldCheck className="w-3 h-3" /> ক্যাশ অন ডেলিভারি
                </span>
                <span>•</span>
                <span>হোম ডেলিভারি</span>
              </div>
            </div>
          </div>

          {/* Variants / Color Shades (if applicable) */}
          {product.variants && product.variants.length > 0 && (
            <div className="bg-white p-3 rounded-2xl border border-[#e8ded5]">
              <div className="text-[11px] font-semibold text-[#2c2724] mb-1.5 flex items-center justify-between">
                <span>শেড বা ভেরিয়েন্ট নির্বাচন করুন:</span>
                <span className="text-[#c97a7e] font-bold">{selectedVariant?.name}</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shrink-0 cursor-pointer ${
                      selectedVariant?.id === v.id
                        ? 'border-[#1f2d29] bg-[#1f2d29] text-white shadow-xs'
                        : 'border-[#d8c8bd] bg-white text-[#4a423d] hover:border-[#1f2d29]'
                    }`}
                  >
                    {v.hexColor && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: v.hexColor }}
                      />
                    )}
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Details / Description Tabs */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#e8ded5] text-xs">
            <div className="flex border-b border-[#e8ded5] gap-3 font-semibold pb-2 mb-2 text-[#70645c]">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeTab === 'details' ? 'border-[#1f2d29] text-[#1f2d29] font-bold' : 'border-transparent'
                }`}
              >
                বিবরণ (Details)
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeTab === 'ingredients' ? 'border-[#1f2d29] text-[#1f2d29] font-bold' : 'border-transparent'
                }`}
              >
                উপাদান (Ingredients)
              </button>
              <button
                onClick={() => setActiveTab('howToUse')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeTab === 'howToUse' ? 'border-[#1f2d29] text-[#1f2d29] font-bold' : 'border-transparent'
                }`}
              >
                ব্যবহার বিধি
              </button>
            </div>

            <div className="text-[11px] sm:text-xs text-[#5a5048] leading-relaxed">
              {activeTab === 'details' && (
                <p>{product.description}</p>
              )}
              {activeTab === 'ingredients' && (
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="bg-[#faf8f5] border border-[#e8ded5] px-2 py-0.5 rounded-lg text-[10px] text-[#2c2724]">
                      🌿 {ing}
                    </span>
                  ))}
                </div>
              )}
              {activeTab === 'howToUse' && (
                <p>{product.howToUse}</p>
              )}
            </div>
          </div>

        </div>

        {/* Pinned Bottom Action Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#e8ded5] shadow-lg flex items-center gap-2.5 shrink-0 z-20">
          
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#d8c8bd] rounded-2xl bg-[#faf8f5] px-2 py-1.5 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-6 h-6 flex items-center justify-center font-bold text-sm text-[#4a423d] hover:text-[#2c2724] active:scale-95 cursor-pointer"
            >
              -
            </button>
            <span className="px-2 text-xs font-bold text-[#2c2724] min-w-[20px] text-center font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-6 h-6 flex items-center justify-center font-bold text-sm text-[#4a423d] hover:text-[#2c2724] active:scale-95 cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Primary CTA: Instantly adds to cart and redirects straight to checkout/payment */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer ${
              added
                ? 'bg-[#2c7a4b] text-white'
                : product.inStock
                ? 'bg-[#1f2d29] hover:bg-[#c97a7e] text-white'
                : 'bg-[#e8ded5] text-[#8c7e75] cursor-not-allowed'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Redirecting to Checkout...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-[#e8beac] shrink-0" />
                <span>Order Now • {currencySymbol}{currentPrice}</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onToggleWishlist(product)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer shrink-0 ${
              isWishlisted
                ? 'bg-[#c97a7e] text-white border-[#c97a7e]'
                : 'bg-[#faf8f5] text-[#4a423d] border-[#d8c8bd] hover:border-[#1f2d29]'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
