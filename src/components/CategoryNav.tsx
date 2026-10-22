import React from 'react';
import { FilterState, CategoryItem } from '../types';
import { SlidersHorizontal, Sparkles, Search, Heart, X, RotateCcw } from 'lucide-react';

interface CategoryNavProps {
  categories: CategoryItem[];
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
  wishlistCount?: number;
  showWishlistOnly?: boolean;
  onToggleWishlistOnly?: () => void;
}

const SKIN_TYPES = ['All Skin Types', 'Sensitive', 'Dry', 'Normal', 'Combination', 'Dull'];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  filterState,
  onUpdateFilter,
  onResetFilters,
  totalProductsCount,
  wishlistCount = 0,
  showWishlistOnly = false,
  onToggleWishlistOnly,
}) => {
  const isFiltered =
    filterState.category !== 'all' ||
    filterState.searchQuery !== '' ||
    filterState.organicOnly ||
    filterState.skinType !== 'All Skin Types' ||
    filterState.maxPrice < 150 ||
    showWishlistOnly;

  return (
    <div className="bg-[#faf8f5] border-b border-[#e8ded5] py-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      
      {/* Search & Category Header Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills Slider (Item List Below Hero) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth flex-1 min-w-0">
          {categories.map((cat) => {
            const isActive = filterState.category === cat.slug && !showWishlistOnly;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onUpdateFilter({ category: cat.slug });
                  if (showWishlistOnly && onToggleWishlistOnly) {
                    onToggleWishlistOnly();
                  }
                }}
                className={`flex-shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#2c2724] text-[#faf8f5] shadow-md ring-2 ring-[#2c2724]/20'
                    : 'bg-[#f0e8e1] text-[#5a5048] hover:bg-[#e8dad0] hover:text-[#2c2724]'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Integrated Product Search */}
        <div className="relative shrink-0 w-full md:w-64">
          <div className="flex items-center bg-white border border-[#d8c8bd] focus-within:border-[#c97a7e] rounded-full px-3.5 py-1.5 shadow-2xs transition-all">
            <Search className="w-4 h-4 text-[#8c7e75] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search products, serums..."
              value={filterState.searchQuery}
              onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
              className="bg-transparent text-xs text-[#2c2724] placeholder-[#8c7e75] outline-none w-full"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => onUpdateFilter({ searchQuery: '' })}
                className="text-[#8c7e75] hover:text-[#2c2724] p-0.5 ml-1"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="pt-3 border-t border-[#e8ded5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5a5048]">
        
        {/* Left Side: Refine by, Skin Type, Organic, Wishlist */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-[#2c2724]">
            <SlidersHorizontal className="w-4 h-4 text-[#c97a7e]" />
            <span>Refine:</span>
          </div>

          {/* Skin Type Selector */}
          <select
            value={filterState.skinType}
            onChange={(e) => onUpdateFilter({ skinType: e.target.value })}
            className="bg-white border border-[#d8c8bd] rounded-lg px-2.5 py-1 text-xs text-[#2c2724] outline-none focus:border-[#c97a7e]"
          >
            {SKIN_TYPES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Organic Only Filter */}
          <button
            onClick={() => onUpdateFilter({ organicOnly: !filterState.organicOnly })}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              filterState.organicOnly
                ? 'bg-[#e8beac]/30 border-[#c97a7e] text-[#2c2724] font-semibold'
                : 'bg-white border-[#d8c8bd] text-[#5a5048] hover:border-[#2c2724]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c97a7e]" />
            <span>Organic</span>
          </button>

          {/* Saved Wishlist Toggle */}
          {onToggleWishlistOnly && (
            <button
              onClick={onToggleWishlistOnly}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                showWishlistOnly
                  ? 'bg-[#c97a7e] text-white border-[#c97a7e] font-semibold'
                  : 'bg-white border-[#d8c8bd] text-[#5a5048] hover:border-[#2c2724]'
              }`}
              title="Filter by Saved Items"
            >
              <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-current' : ''}`} />
              <span>Saved ({wishlistCount})</span>
            </button>
          )}

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[#c97a7e] hover:text-[#9e5458] font-semibold underline underline-offset-2 ml-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {/* Right Side: Sorting & Product Counter */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-[#8c7e75] hidden sm:inline text-xs">
            Showing <strong className="text-[#2c2724] font-bold">{totalProductsCount}</strong> items
          </span>

          <div className="flex items-center gap-1.5">
            <label htmlFor="sort-select" className="text-[#8c7e75] font-medium hidden md:inline">Sort:</label>
            <select
              id="sort-select"
              value={filterState.sortBy}
              onChange={(e) => onUpdateFilter({ sortBy: e.target.value as any })}
              className="bg-white border border-[#d8c8bd] rounded-lg px-2.5 py-1 text-xs text-[#2c2724] outline-none focus:border-[#c97a7e] font-medium"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
