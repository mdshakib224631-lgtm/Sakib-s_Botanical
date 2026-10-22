import React from 'react';
import { ShoppingBag, Truck } from 'lucide-react';
import { CategoryItem, SiteSettings } from '../types';

interface HeaderProps {
  categories?: CategoryItem[];
  selectedCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onOpenTracking: () => void;
  userName?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  siteSettings: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectCategory,
  cartCount,
  onOpenCart,
  onOpenTracking,
  siteSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8ded5] transition-all shadow-2xs">
      {/* Top Announcement Bar */}
      {siteSettings.showAnnouncementBar !== false && siteSettings.announcementText && (
        <div className="bg-[#2c2724] text-[#faf8f5] text-[10px] sm:text-xs py-1.5 px-3 sm:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-[#3d3733]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c97a7e] animate-pulse shrink-0" />
          <span className="truncate max-w-xl">{siteSettings.announcementText}</span>
        </div>
      )}

      {/* Main Brand Bar with Adjusted Logo and Right-Side Bag & Profile Options */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Name - Strictly constrained and truncated on mobile to never overlap buttons */}
          <button
            onClick={() => onSelectCategory?.('all')}
            className="inline-flex items-center gap-2 sm:gap-3.5 group text-left min-w-0 transition-transform active:scale-[0.99] cursor-pointer flex-1 max-w-[calc(100%-110px)] sm:max-w-none pr-1"
            title="Return to Home & All Collections"
          >
            {siteSettings.websiteLogoUrl ? (
              <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#d8c8bd] shadow-2xs group-hover:border-[#c97a7e] group-hover:scale-105 transition-all bg-[#faf8f5] shrink-0">
                <img
                  src={siteSettings.websiteLogoUrl}
                  alt={siteSettings.websiteName || 'Website Logo'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#2c2724] to-[#4a423d] text-[#e8beac] flex items-center justify-center font-serif-title font-bold text-sm sm:text-lg border-2 border-[#d8c8bd] group-hover:border-[#c97a7e] group-hover:scale-105 transition-all shadow-2xs shrink-0">
                {siteSettings.websiteLogoText ? siteSettings.websiteLogoText.charAt(0).toUpperCase() : 'S'}
              </div>
            )}

            <div className="flex flex-col items-start min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap min-w-0 max-w-full overflow-hidden">
                <span className="font-serif-title text-sm xs:text-base sm:text-2xl font-bold tracking-tight text-[#2c2724] group-hover:text-[#c97a7e] transition-colors truncate">
                  {siteSettings.websiteLogoText || "Sakib's"}
                </span>
                {siteSettings.websiteLogoSubtext && (
                  <span className="font-serif-title text-sm xs:text-base sm:text-2xl italic text-[#c97a7e] font-normal truncate shrink">
                    {siteSettings.websiteLogoSubtext}
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#8c7e75] font-semibold -mt-0.5 truncate hidden sm:block">
                {siteSettings.tagline || 'Artisanal Botanical Beauty'}
              </span>
            </div>
          </button>

          {/* Right Action Options: Bag & Profile (Isolated with shrink-0 and zero mobile overlap) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto z-10">
            
            {/* Bag Option */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1 sm:gap-2 bg-[#2c2724] text-[#faf8f5] px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-full text-xs font-semibold hover:bg-[#423b37] hover:shadow-md transition-all active:scale-95 shrink-0 cursor-pointer border border-[#2c2724]"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e8beac] shrink-0" />
              <span className="text-xs font-bold tracking-wide hidden md:inline">Bag</span>
              <span className="bg-[#c97a7e] text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] sm:min-w-[20px] text-center leading-none">
                {cartCount}
              </span>
            </button>

            {/* Courier Delivery Truck Order Tracking Option */}
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-full text-xs font-semibold bg-white text-[#1f2d29] border border-[#d8c8bd] hover:border-[#2c7a4b] hover:text-[#2c7a4b] hover:shadow-xs transition-all shrink-0 cursor-pointer active:scale-95 group"
              title="Order Tracking & Delivery Status"
              aria-label="Track Order Status"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#2c7a4b]/15 text-[#2c7a4b] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Truck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#2c7a4b]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#1f2d29] group-hover:text-[#2c7a4b] hidden xs:inline whitespace-nowrap">
                Track Order
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
