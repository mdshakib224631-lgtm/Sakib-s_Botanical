export interface ProductVariant {
  id: string;
  name: string;
  hexColor?: string;
  image?: string;
  inStock: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  ingredients: string[];
  howToUse: string;
  benefits: string[];
  images: string[];
  variants?: ProductVariant[];
  skinTypes?: string[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOrganic?: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  buttonText: string;
  targetCategory?: string;
  accentColor?: string;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description?: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  email: string;
  items: {
    productName: string;
    variantName?: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  deliveryArea?: 'inside_dhaka' | 'outside_dhaka';
  deliveryCharge?: number;
  paymentMethod?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  date: string;
  shippingAddress: string;
  customerPhone?: string;
  notes?: string;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  maxPrice: number;
  organicOnly: boolean;
  skinType: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  registeredDate: string;
  status: 'Active' | 'VIP' | 'New';
}

export interface SiteSettings {
  websiteName: string;
  websiteLogoUrl?: string;
  websiteLogoText: string;
  websiteLogoSubtext: string;
  tagline: string;
  currency?: string;
  currencySymbol: string;
  showAnnouncementBar?: boolean;
  announcementText: string;
  freeShippingThreshold: number;
  insideDhakaDeliveryCharge: number;
  outsideDhakaDeliveryCharge: number;
  insideDhakaLabel?: string;
  outsideDhakaLabel?: string;
  contactEmail: string;
  contactPhone?: string;
  contactAddress?: string;
  businessHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  whatsappNumber?: string;
  adminEmail: string;
  adminPassword: string;
  accentColor: string;
  promoCode: string;
  discountPercentage?: number;
  aboutText: string;
  categories?: string[];
  // Static Trust Badges & Guarantee Highlights
  badge1Title?: string;
  badge1Text?: string;
  badge2Title?: string;
  badge2Text?: string;
  badge3Title?: string;
  badge3Text?: string;
  badge4Title?: string;
  badge4Text?: string;
  // Footer & Order Confirmation Texts
  copyrightText?: string;
  orderSuccessMessage?: string;
  // Hero Slider Duration (Seconds)
  heroSlideIntervalSeconds?: number;
}

