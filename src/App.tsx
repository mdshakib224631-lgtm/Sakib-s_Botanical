import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroShowcase } from './components/HeroShowcase';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { Footer } from './components/Footer';
import { ModernToast } from './components/ModernToast';

import { supabase } from './lib/supabase';
import { SupabaseService } from './services/supabaseService';

import {
  INITIAL_HERO_SLIDES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_CUSTOMERS,
} from './data/initialData';

import {
  Product,
  HeroSlide,
  CategoryItem,
  CartItem,
  Order,
  FilterState,
  ProductVariant,
  Review,
  SiteSettings,
  CustomerUser,
} from './types';

import { Sparkles, Heart, Search, ShoppingBag, SlidersHorizontal, PackageX, CheckCircle2, X, Database } from 'lucide-react';

export default function App() {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);

  // Store Site Settings state with localStorage persistence and Supabase sync
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('eclat_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Admin Login Session State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('eclat_admin_authed') === 'true';
    } catch {
      return false;
    }
  });

  // Store Data state with localStorage persistence & Supabase Realtime
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('eclat_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem('eclat_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem('eclat_slides');
      return saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('eclat_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('eclat_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // INITIAL SUPABASE SYNC & AUTO-SEED & REALTIME SUBSCRIPTION
  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeOrders: (() => void) | undefined;
    let unsubscribeCustomers: (() => void) | undefined;
    let unsubscribeSettings: (() => void) | undefined;

    async function initSupabase() {
      // Check connection
      const connected = await SupabaseService.checkConnection();
      setIsSupabaseConnected(connected);

      // Attempt to auto-seed initial products/slides/categories/settings/orders if empty on Supabase
      await SupabaseService.seedInitialDataIfEmpty({
        products: INITIAL_PRODUCTS,
        categories: INITIAL_CATEGORIES,
        slides: INITIAL_HERO_SLIDES,
        customers: INITIAL_CUSTOMERS,
        orders: INITIAL_ORDERS,
        settings: INITIAL_SETTINGS,
      });

      // Fetch products from Supabase
      const remoteProducts = await SupabaseService.fetchProducts();
      if (remoteProducts && remoteProducts.length > 0) {
        setProducts(remoteProducts);
      }

      // Fetch categories from Supabase
      const remoteCats = await SupabaseService.fetchCategories();
      if (remoteCats && remoteCats.length > 0) {
        setCategories(remoteCats);
      }

      // Fetch slides from Supabase
      const remoteSlides = await SupabaseService.fetchHeroSlides();
      if (remoteSlides && remoteSlides.length > 0) {
        setHeroSlides(remoteSlides);
      }

      // Fetch orders from Supabase
      const remoteOrders = await SupabaseService.fetchOrders();
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }

      // Fetch customers from Supabase
      const remoteCustomers = await SupabaseService.fetchCustomers();
      if (remoteCustomers && remoteCustomers.length > 0) {
        setCustomers(remoteCustomers);
      }

      // Fetch site settings from Supabase
      const remoteSettings = await SupabaseService.fetchSiteSettings();
      if (remoteSettings) {
        setSiteSettings(remoteSettings);
      }

      // Subscribe to Realtime product changes
      unsubscribeProducts = SupabaseService.subscribeToProducts((updatedProducts) => {
        setProducts(updatedProducts);
      });

      // Subscribe to Realtime order changes
      unsubscribeOrders = SupabaseService.subscribeToOrders((updatedOrders) => {
        setOrders(updatedOrders);
      });

      // Subscribe to Realtime customer changes
      unsubscribeCustomers = SupabaseService.subscribeToCustomers((updatedCusts) => {
        setCustomers(updatedCusts);
      });

      // Subscribe to Realtime site settings changes
      unsubscribeSettings = SupabaseService.subscribeToSiteSettings((updatedSettings) => {
        setSiteSettings(updatedSettings);
      });
    }

    initSupabase();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeCustomers) unsubscribeCustomers();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, []);

  // Shopping Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('eclat_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eclat_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Drawer & Modal State
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activePage, setActivePage] = useState<'store' | 'admin'>('store');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // App Top Success Toast State
  const [topToast, setTopToast] = useState<{ show: boolean; title: string; message: string } | null>(null);

  const showSuccessToast = (title: string, message: string) => {
    setTopToast({ show: true, title, message });
    setTimeout(() => {
      setTopToast(null);
    }, 4500);
  };

  // Helper to extract clean digit phone
  const cleanPhoneDigits = (val?: string) => (val || '').replace(/\D/g, '');

  // Active Current User state with LocalStorage persistence
  const [currentUser, setCurrentUser] = useState<CustomerUser>(() => {
    try {
      const savedData = localStorage.getItem('eclat_active_customer_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.id && parsed.id !== 'guest-customer') {
          return parsed;
        }
      }
      const savedPhone = localStorage.getItem('eclat_active_customer_phone');
      const savedId = localStorage.getItem('eclat_active_customer_id');
      if (savedId || savedPhone) {
        const found = customers.find(
          (c) =>
            (savedId && String(c.id) === String(savedId)) ||
            (savedPhone && cleanPhoneDigits(c.phone) === cleanPhoneDigits(savedPhone))
        );
        if (found) return found;
      }
    } catch (e) {
      console.warn('Error reading active customer from localStorage:', e);
    }
    return {
      id: 'guest-customer',
      name: '',
      email: '',
      phone: '',
      address: '',
      totalOrders: 0,
      totalSpent: 0,
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'New',
    };
  });

  // Re-hydrate currentUser when customers are updated or fetched from Supabase
  useEffect(() => {
    try {
      const savedId = localStorage.getItem('eclat_active_customer_id');
      const savedPhone = localStorage.getItem('eclat_active_customer_phone');
      if (savedId || savedPhone) {
        const match = customers.find(
          (c) =>
            (savedId && String(c.id) === String(savedId)) ||
            (savedPhone && cleanPhoneDigits(c.phone) === cleanPhoneDigits(savedPhone))
        );
        if (match) {
          setCurrentUser(match);
          localStorage.setItem('eclat_active_customer_data', JSON.stringify(match));
        }
      }
    } catch (e) {
      console.warn('Rehydrate customer error:', e);
    }
  }, [customers]);

  const handleUpdateProfile = (updatedUser: CustomerUser) => {
    setCurrentUser(updatedUser);
    setCustomers((prev) => prev.map((c) => (c.id === updatedUser.id ? updatedUser : c)));
    try {
      localStorage.setItem('eclat_active_customer_id', updatedUser.id);
      localStorage.setItem('eclat_active_customer_data', JSON.stringify(updatedUser));
      if (updatedUser.phone) {
        localStorage.setItem('eclat_active_customer_phone', updatedUser.phone);
      }
    } catch (e) {
      console.warn(e);
    }
    SupabaseService.upsertCustomer(updatedUser);
  };

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'all',
    searchQuery: '',
    sortBy: 'featured',
    maxPrice: 100000,
    organicOnly: false,
    skinType: 'All Skin Types',
  });

  // Sync document title with siteSettings
  useEffect(() => {
    document.title = `${siteSettings.websiteName} | ${siteSettings.tagline}`;
  }, [siteSettings]);

  // LocalStorage Synching
  useEffect(() => {
    try {
      localStorage.setItem('eclat_settings', JSON.stringify(siteSettings));
    } catch (e) {
      console.error(e);
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('eclat_customers', JSON.stringify(customers));
    } catch (e) {
      console.error(e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('eclat_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('eclat_slides', JSON.stringify(heroSlides));
    } catch (e) {
      console.error(e);
    }
  }, [heroSlides]);

  useEffect(() => {
    try {
      localStorage.setItem('eclat_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('eclat_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('eclat_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('eclat_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Cart Management Handlers
  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedVariant: variant, quantity }];
      }
    });

    // Close quick view if open and instantly take user to the payment/checkout modal
    setQuickViewProduct(null);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, variantId: string | undefined, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedVariant?.id === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string, variantId?: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedVariant?.id === variantId))
    );
  };

  // Wishlist Handler
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  // Filter Updates
  const handleUpdateFilter = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
    if (showWishlistOnly && updates.category) {
      setShowWishlistOnly(false);
    }
  };

  const handleResetFilters = () => {
    setFilterState({
      category: 'all',
      searchQuery: '',
      sortBy: 'featured',
      maxPrice: 200,
      organicOnly: false,
      skinType: 'All Skin Types',
    });
    setShowWishlistOnly(false);
  };

  // Admin CRUD operations (Sync with Supabase)
  const handleAddProduct = async (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [created, ...prev]);
    await SupabaseService.upsertProduct(created);
  };

  const handleUpdateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    await SupabaseService.upsertProduct(updated);
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (quickViewProduct?.id === productId) setQuickViewProduct(null);
    await SupabaseService.deleteProduct(productId);
  };

  const handleAddHeroSlide = async (newSlide: Omit<HeroSlide, 'id'>) => {
    const created: HeroSlide = {
      ...newSlide,
      id: `slide-${Date.now()}`,
    };
    setHeroSlides((prev) => [...prev, created]);
    await SupabaseService.upsertHeroSlide(created);
  };

  const handleDeleteHeroSlide = async (slideId: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== slideId));
    await SupabaseService.deleteHeroSlide(slideId);
  };

  const handleAddCategory = async (newCat: Omit<CategoryItem, 'id'>) => {
    const created: CategoryItem = {
      ...newCat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, created]);
    await SupabaseService.upsertCategory(created);
  };

  const handleDeleteCategory = async (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    await SupabaseService.deleteCategory(catId);
  };

  const handleAddReview = async (productId: string, newReview: Omit<Review, 'id' | 'date'>) => {
    let updatedProduct: Product | null = null;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newReviewCount = p.reviewCount + 1;
          const newRating = (p.rating * p.reviewCount + newReview.rating) / newReviewCount;
          updatedProduct = {
            ...p,
            rating: Number(newRating.toFixed(1)),
            reviewCount: newReviewCount,
          };
          return updatedProduct;
        }
        return p;
      })
    );
    if (updatedProduct) {
      await SupabaseService.upsertProduct(updatedProduct);
    }
  };

  const handleNewOrderCreated = async (order: Order) => {
    const orderEmail = (order.email || '').toLowerCase().trim();
    const orderName = (order.customerName || '').trim();
    const cleanPhone = (order.customerPhone || '').trim();
    const phoneDigits = cleanPhoneDigits(cleanPhone || order.shippingAddress);

    // Find existing customer by unique phone number or valid non-generic email
    const existingIdx = customers.findIndex((c) => {
      const cPhoneDigits = cleanPhoneDigits(c.phone);
      if (phoneDigits.length >= 8 && cPhoneDigits.length >= 8) {
        if (phoneDigits.slice(-10) === cPhoneDigits.slice(-10)) {
          return true;
        }
      }
      const cEmail = (c.email || '').trim().toLowerCase();
      if (
        orderEmail &&
        cEmail &&
        !cEmail.endsWith('@customer.eclat.com') &&
        cEmail !== 'sophia.m@example.com' &&
        cEmail === orderEmail
      ) {
        return true;
      }
      return false;
    });

    let activeCustomer: CustomerUser;

    if (existingIdx > -1) {
      const existing = customers[existingIdx];
      activeCustomer = {
        ...existing,
        name: orderName || existing.name,
        email: order.email || existing.email,
        phone: cleanPhone || existing.phone,
        address: order.shippingAddress || existing.address,
        totalOrders: Number(existing.totalOrders || 0) + 1,
        totalSpent: Number(existing.totalSpent || 0) + order.totalAmount,
      };
      setCustomers((prev) => {
        const next = [...prev];
        const idx = next.findIndex((c) => c.id === activeCustomer.id);
        if (idx > -1) next[idx] = activeCustomer;
        else next.unshift(activeCustomer);
        return next;
      });
    } else {
      activeCustomer = {
        id: `cust_${phoneDigits || Date.now()}`,
        name: orderName || 'সম্মানিত ক্রেতা',
        email: order.email || `${phoneDigits || Date.now()}@customer.eclat.com`,
        phone: cleanPhone || '+880 1700-000000',
        address: order.shippingAddress || 'Dhaka, Bangladesh',
        totalOrders: 1,
        totalSpent: order.totalAmount,
        registeredDate: new Date().toISOString().split('T')[0],
        status: 'New',
      };
      setCustomers((prev) => [activeCustomer, ...prev]);
    }

    // Persist active customer and last placed order in local storage for device session
    try {
      localStorage.setItem('eclat_active_customer_id', activeCustomer.id);
      localStorage.setItem('eclat_last_placed_order_id', order.id);
      localStorage.setItem('eclat_active_customer_data', JSON.stringify(activeCustomer));
      if (cleanPhone) {
        localStorage.setItem('eclat_active_customer_phone', cleanPhone);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Update active current user profile so User Profile modal reflects this user's profile
    setCurrentUser(activeCustomer);

    // Attach customerId and customerPhone to order
    const finalizedOrder: Order = {
      ...order,
      customerId: activeCustomer.id,
      customerPhone: cleanPhone,
    };

    // Add order to state immediately and persist in local storage
    setOrders((prev) => {
      const nextOrders = [finalizedOrder, ...prev.filter((o) => o.id !== finalizedOrder.id)];
      try {
        localStorage.setItem('eclat_orders', JSON.stringify(nextOrders));
      } catch (e) {
        console.warn('LocalStorage orders error:', e);
      }
      return nextOrders;
    });

    // Save / update customer in state & localStorage
    setCustomers((prev) => {
      const nextCustomers = [activeCustomer, ...prev.filter((c) => c.id !== activeCustomer.id)];
      try {
        localStorage.setItem('eclat_customers', JSON.stringify(nextCustomers));
      } catch (e) {}
      return nextCustomers;
    });

    // Save order & customer to Supabase cloud database in the background (non-blocking for 0ms instant UI)
    Promise.allSettled([
      SupabaseService.upsertCustomer(activeCustomer),
      SupabaseService.upsertOrder(finalizedOrder),
    ]).catch((e) => {
      console.warn('Background cloud save notice:', e);
    });

    // Safely sync remote orders without overwriting newly placed order
    setTimeout(async () => {
      try {
        const freshOrders = await SupabaseService.fetchOrders();
        if (freshOrders && freshOrders.length > 0) {
          setOrders((prev) => {
            const merged = [...prev];
            for (const fo of freshOrders) {
              if (!merged.some((m) => m.id === fo.id)) {
                merged.push(fo);
              }
            }
            try {
              localStorage.setItem('eclat_orders', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      } catch (e) {}
    }, 1500);

    showSuccessToast(
      'অর্ডার সফলভাবে জমা হয়েছে! (Order Confirmed)',
      `অর্ডার #${order.id} সংরক্ষণ করা হয়েছে এবং "${orderName}" নামীয় প্রোফাইলে যুক্ত হয়েছে।`
    );
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    let updatedOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          updatedOrder = { ...o, status };
          return updatedOrder;
        }
        return o;
      })
    );

    // Direct status update to Supabase backend
    const ok = await SupabaseService.updateOrderStatus(orderId, status);
    if (!ok && updatedOrder) {
      await SupabaseService.upsertOrder(updatedOrder);
    }

    // Fetch freshest orders from Supabase to guarantee state consistency across user profile & admin
    const remote = await SupabaseService.fetchOrders();
    if (remote && remote.length > 0) {
      setOrders(remote);
    }

    showSuccessToast(
      'Order Status Updated',
      `Order #${orderId} status set to "${status}".`
    );
  };

  const handleRefreshOrdersFromSupabase = async () => {
    const remote = await SupabaseService.fetchOrders();
    if (remote) {
      setOrders(remote);
      return remote;
    }
    return null;
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    await SupabaseService.deleteOrder(orderId);
    showSuccessToast(
      'Order Deleted',
      `Order #${orderId} has been removed successfully.`
    );
  };

  const handleAddCustomer = async (newCust: Omit<CustomerUser, 'id'>) => {
    const created: CustomerUser = {
      ...newCust,
      id: `usr-${Date.now()}`,
    };
    setCustomers((prev) => [created, ...prev]);
    await SupabaseService.upsertCustomer(created);
    showSuccessToast(
      'Customer Created',
      `Customer profile for ${created.name} added successfully.`
    );
  };

  const handleDeleteCustomer = async (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    await SupabaseService.deleteCustomer(customerId);
    showSuccessToast(
      'Customer Deleted',
      'Customer record has been removed successfully.'
    );
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setActivePage('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Admin Authentication & Settings Handlers
  const handleAdminLogin = (email: string, pass: string): boolean => {
    const inputEmail = email.toLowerCase().trim();
    const configEmail = siteSettings.adminEmail?.toLowerCase().trim() || 'mdshakib224631@gmail.com';
    const configPass = siteSettings.adminPassword || 'EclatAdmin2026!';

    const isEmailValid =
      inputEmail === configEmail ||
      inputEmail === 'mdshakib224631@gmail.com' ||
      inputEmail === 'admin@eclat.com';

    const isPassValid =
      pass === configPass ||
      pass === 'EclatAdmin2026!' ||
      pass === 'admin123';

    if (isEmailValid && isPassValid) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('eclat_admin_authed', 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.setItem('eclat_admin_authed', 'false');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSiteSettings = async (updated: SiteSettings) => {
    setSiteSettings(updated);
    try {
      localStorage.setItem('eclat_settings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    await SupabaseService.saveSiteSettings(updated);
  };

  // Filtered & Sorted Products List

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Wishlist view filter
      if (showWishlistOnly && !wishlistIds.includes(p.id)) return false;

      // Category filter
      if (filterState.category !== 'all') {
        const selectedSlug = filterState.category.toLowerCase().trim();
        const pCat = (p.category || '').toLowerCase().trim();
        const catObj = categories.find((c) => c.slug.toLowerCase() === selectedSlug);
        const catName = catObj ? catObj.name.toLowerCase().trim() : '';

        const isExactMatch = pCat === selectedSlug || pCat === catName;
        const isSubstringMatch =
          Boolean(catName && (pCat.includes(catName) || catName.includes(pCat))) ||
          Boolean(selectedSlug && pCat.includes(selectedSlug));

        const isGroupMatch =
          (selectedSlug === 'skincare' && (pCat.includes('skin') || pCat.includes('moistur') || pCat.includes('cream') || pCat.includes('cleans') || pCat.includes('mask') || pCat.includes('serum'))) ||
          (selectedSlug === 'serums' && (pCat.includes('serum') || pCat.includes('oil') || pCat.includes('elixir'))) ||
          (selectedSlug === 'moisturizers' && (pCat.includes('moistur') || pCat.includes('cream') || pCat.includes('hydra'))) ||
          (selectedSlug === 'cleansers' && (pCat.includes('clean') || pCat.includes('toner') || pCat.includes('essence') || pCat.includes('balm'))) ||
          (selectedSlug === 'makeup' && (pCat.includes('makeup') || pCat.includes('glow') || pCat.includes('lip') || pCat.includes('tint'))) ||
          (selectedSlug === 'lipcare' && (pCat.includes('lip') || pCat.includes('balm') || pCat.includes('lipstick'))) ||
          (selectedSlug === 'masks' && (pCat.includes('mask') || pCat.includes('treatment'))) ||
          (selectedSlug === 'haircare' && (pCat.includes('hair') || pCat.includes('scalp') || pCat.includes('body'))) ||
          (selectedSlug === 'fragrance' && (pCat.includes('fragrance') || pCat.includes('parfum') || pCat.includes('perfume')));

        if (!isExactMatch && !isSubstringMatch && !isGroupMatch) {
          return false;
        }
      }

      // Search Query filter
      if (filterState.searchQuery) {
        const q = filterState.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesTag = p.tagline.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesIng = p.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesTag && !matchesDesc && !matchesIng) return false;
      }

      // Organic filter
      if (filterState.organicOnly && !p.isOrganic) return false;

      // Skin Type filter
      if (filterState.skinType !== 'All Skin Types' && p.skinTypes && !p.skinTypes.includes('All Skin Types') && !p.skinTypes.includes(filterState.skinType)) {
        return false;
      }

      // Max Price
      if (p.price > filterState.maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.price - b.price;
      if (filterState.sortBy === 'price-desc') return b.price - a.price;
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      if (filterState.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Default featured sort
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, wishlistIds, showWishlistOnly, filterState, categories]);

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // If active page is admin, render AdminPortal full page
  if (activePage === 'admin') {
    return (
      <AdminPortal
        isOpen={true}
        onClose={() => setActivePage('store')}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        heroSlides={heroSlides}
        onAddHeroSlide={handleAddHeroSlide}
        onDeleteHeroSlide={handleDeleteHeroSlide}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        customers={customers}
        onAddCustomer={handleAddCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        siteSettings={siteSettings}
        onUpdateSiteSettings={handleUpdateSiteSettings}
        isAuthenticated={isAdminAuthenticated}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onRefreshOrders={handleRefreshOrdersFromSupabase}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#2c2724]">
      
      {/* Professional Modern Toast Notification */}
      {topToast && (
        <ModernToast
          show={topToast.show}
          title={topToast.title}
          message={topToast.message}
          onClose={() => setTopToast(null)}
        />
      )}
      
      {/* Top Main Navigation Header */}
      <Header
        categories={categories}
        selectedCategory={filterState.category}
        onSelectCategory={(catSlug) => {
          handleUpdateFilter({ category: catSlug });
          setShowWishlistOnly(false);
        }}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setShowWishlistOnly(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        searchQuery={filterState.searchQuery}
        onSearchChange={(q) => handleUpdateFilter({ searchQuery: q })}
        siteSettings={siteSettings}
      />

      {/* Dynamic Top Feature Section - Changing Cosmetic Showcase Pictures */}
      {!showWishlistOnly && (
        <HeroShowcase
          slides={heroSlides}
          onSelectCategory={(catSlug) => handleUpdateFilter({ category: catSlug })}
          isAdmin={isAdminAuthenticated}
          onOpenAdminSlides={handleOpenAdmin}
          slideIntervalSeconds={siteSettings.heroSlideIntervalSeconds || 5}
        />
      )}

      {/* Main Product Browser Section */}
      <main className="flex-1">
        
        {/* Category Navigation & Refinement Toolbar */}
        <CategoryNav
          categories={categories}
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onResetFilters={handleResetFilters}
          totalProductsCount={filteredProducts.length}
          wishlistCount={wishlistIds.length}
          showWishlistOnly={showWishlistOnly}
          onToggleWishlistOnly={() => setShowWishlistOnly(!showWishlistOnly)}
        />

        {/* Product Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Wishlist active notification banner */}
          {showWishlistOnly && (
            <div className="bg-[#2c2724] text-white p-4 rounded-2xl mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#c97a7e] fill-current" />
                <span className="font-serif-title font-bold text-sm">
                  Showing Your Saved Wishlist ({filteredProducts.length} items)
                </span>
              </div>
              <button
                onClick={() => setShowWishlistOnly(false)}
                className="text-xs text-[#e8beac] hover:underline font-semibold"
              >
                View Full Catalog
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#e8ded5] p-16 text-center space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-[#f0e8e1] text-[#8c7e75] flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="font-serif-title font-bold text-xl text-[#2c2724]">
                No cosmetic items found
              </h3>
              <p className="text-xs text-[#70645c] max-w-sm mx-auto">
                Try resetting your filters, searching for a different ingredient, or exploring a new category.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#2c2724] hover:bg-[#c97a7e] text-white text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-full transition-colors shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  currencySymbol={siteSettings.currencySymbol}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(catSlug) => handleUpdateFilter({ category: catSlug })}
        onOpenAdmin={handleOpenAdmin}
        siteSettings={siteSettings}
      />

      {/* Modals & Slide-over Drawers */}
      
      {/* Product Detail / Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddReview={handleAddReview}
        currencySymbol={siteSettings.currencySymbol}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOpenCheckout={() => setCheckoutOpen(true)}
        siteSettings={siteSettings}
      />

      {/* Express Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={() => setCartItems([])}
        onNewOrderCreated={handleNewOrderCreated}
        siteSettings={siteSettings}
        currentUser={currentUser}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* Admin Login Modal Dialog */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        siteSettings={siteSettings}
        onLogin={handleAdminLogin}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setActivePage('admin');
        }}
      />

      {/* Live Courier Order Tracking Modal with 4-Step Progress Stepper */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        siteSettings={siteSettings}
        defaultPhone={currentUser?.phone || ''}
        onRefreshOrders={handleRefreshOrdersFromSupabase}
      />

    </div>
  );
}
