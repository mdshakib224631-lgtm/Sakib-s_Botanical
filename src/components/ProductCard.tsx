import React, { useState } from 'react';
import { Star, Eye, ShoppingCart, Heart, Sparkles, Check } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  currencySymbol?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  currencySymbol = '৳',
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const activeImage = hoveredImage || (selectedVariant?.image || product.images[0]);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedVariant);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-2xl border border-[#e8ded5] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square bg-[#f8f5f2] overflow-hidden">
        
        {/* Main Product Image */}
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          onMouseEnter={() => {
            if (product.images[1]) setHoveredImage(product.images[1]);
          }}
          onMouseLeave={() => setHoveredImage(null)}
        />

        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex flex-col items-end gap-1 z-10">
          {product.isBestSeller && (
            <span className="bg-[#2c2724] text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#c97a7e] text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
              New Arrival
            </span>
          )}
          {product.isOrganic && (
            <span className="bg-[#e8beac] text-[#2c2724] text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#c97a7e]" /> Organic
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-[#9e3a3e] text-white text-[8px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full">
              Save {currencySymbol}{product.originalPrice - product.price}
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 left-2.5 sm:top-3 sm:left-3 p-2 sm:p-2.5 rounded-full transition-all z-10 shadow-xs ${
            isWishlisted
              ? 'bg-[#c97a7e] text-white'
              : 'bg-white/80 backdrop-blur-md text-[#4a423d] hover:bg-white hover:text-[#c97a7e]'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Floating Button */}
        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-white/90 backdrop-blur-md text-[#2c2724] hover:bg-[#2c2724] hover:text-white py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[9px] sm:text-xs text-[#8c7e75] mb-1">
            <span className="uppercase font-semibold tracking-wider text-[9px] sm:text-[11px] text-[#c97a7e] truncate max-w-[70px] sm:max-w-none">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#2c2724] font-medium shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#d4a373] text-[#d4a373]" />
              <span className="text-[10px] sm:text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[#a89d95] text-[9px] sm:text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title & Tagline */}
          <h3 className="font-serif-title font-bold text-xs sm:text-sm text-[#2c2724] group-hover:text-[#c97a7e] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[9px] sm:text-[11px] text-[#70645c] line-clamp-1 mt-0.5 font-light">
            {product.tagline}
          </p>

          {/* Color Shade Swatches (if lipstick/makeup variant exists) */}
          <div className="mt-2 min-h-[20px] flex items-center">
            {product.variants && product.variants.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] sm:text-[10px] text-[#8c7e75] font-medium">Shades:</span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? 'ring-2 ring-[#2c2724] ring-offset-1 scale-110'
                          : 'border-white/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: v.hexColor || '#ccc' }}
                      title={v.name}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-[9px] sm:text-[10px] text-[#a89d95] font-light">100% Pure Botanical</span>
            )}
          </div>
        </div>

        {/* Footer Price & Full-Width Add Button */}
        <div className="mt-2.5 pt-2 border-t border-[#f0e8e1]">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-serif-title font-bold text-sm sm:text-base text-[#2c2724]">
                {currencySymbol}{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-[#a89d95] line-through">
                  {currencySymbol}{product.originalPrice}
                </span>
              )}
            </div>
            {selectedVariant ? (
              <span className="text-[9px] sm:text-[10px] text-[#c97a7e] font-medium truncate max-w-[70px]">
                {selectedVariant.name}
              </span>
            ) : product.inStock ? (
              <span className="text-[9px] sm:text-[10px] text-[#5c8a68] font-medium hidden xs:inline">In Stock</span>
            ) : (
              <span className="text-[9px] sm:text-[10px] text-[#a84343] font-medium">Sold Out</span>
            )}
          </div>

          {/* Full-width Responsive Add to Cart Button (Never clips on mobile) */}
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full mt-2 py-2 px-2 rounded-xl font-bold text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer ${
              addedAnimation
                ? 'bg-[#5c8a68] text-white'
                : product.inStock
                ? 'bg-[#1f2d29] text-[#faf8f5] hover:bg-[#c97a7e]'
                : 'bg-[#e8ded5] text-[#8c7e75] cursor-not-allowed'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">Added</span>
              </>
            ) : product.inStock ? (
              <>
                <ShoppingCart className="w-3.5 h-3.5 text-[#e8beac] shrink-0" />
                <span className="truncate">Add to Cart</span>
              </>
            ) : (
              <span className="truncate">Sold Out</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
