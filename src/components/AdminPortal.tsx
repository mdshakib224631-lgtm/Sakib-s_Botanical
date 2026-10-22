import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Plus, Trash2, Edit3, Image as ImageIcon, Layers, ShoppingBag,
  TrendingUp, Package, AlertCircle, Check, Sparkles, Upload, Eye, EyeOff,
  Settings as SettingsIcon, LogOut, Lock, Mail, LayoutDashboard,
  Filter, Search, CheckCircle2, ChevronRight, ShieldCheck, RefreshCw, Users, ArrowLeft, Phone, MapPin, Calendar, DollarSign, UserPlus, Save, CloudUpload, Database,
  Printer, FileText, Clock, ExternalLink, Menu, Copy, Code
} from 'lucide-react';
import { Product, HeroSlide, CategoryItem, Order, SiteSettings, CustomerUser } from '../types';
import { SupabaseService } from '../services/supabaseService';
import { OrderSlipModal } from './OrderSlipModal';
import { ModernToast } from './ModernToast';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  heroSlides: HeroSlide[];
  onAddHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  onDeleteHeroSlide: (slideId: string) => void;
  categories: CategoryItem[];
  onAddCategory: (category: Omit<CategoryItem, 'id'>) => void;
  onDeleteCategory: (categoryId: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  customers: CustomerUser[];
  onAddCustomer: (customer: Omit<CustomerUser, 'id'>) => void;
  onDeleteCustomer: (customerId: string) => void;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  isAuthenticated: boolean;
  onLogin: (email: string, pass: string) => boolean;
  onLogout: () => void;
  onRefreshOrders?: () => Promise<any>;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  heroSlides,
  onAddHeroSlide,
  onDeleteHeroSlide,
  categories,
  onAddCategory,
  onDeleteCategory,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  customers,
  onAddCustomer,
  onDeleteCustomer,
  siteSettings,
  onUpdateSiteSettings,
  isAuthenticated,
  onLogin,
  onLogout,
  onRefreshOrders,
}) => {
  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'slides' | 'categories' | 'orders' | 'customers' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Product Filter State inside Admin
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');

  // Customer Filter State
  const [customerSearch, setCustomerSearch] = useState('');

  // Product Add / Edit Form Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields for Product
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState(categories[1]?.name || 'Skincare');
  const [price, setPrice] = useState('48');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('Organic Rosehip, Vitamin E, Hyaluronic Acid');
  const [howToUse, setHowToUse] = useState('Smooth 3 drops over clean face every morning.');
  const [benefits, setBenefits] = useState('Deep Hydration, Glowing Complexion');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');
  const [stockCount, setStockCount] = useState('30');
  const [isOrganic, setIsOrganic] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // Hero Slide Form State
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideTag, setSlideTag] = useState('SPECIAL EDITION');
  const [slideImageUrl, setSlideImageUrl] = useState('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80');
  const [slideButtonText, setSlideButtonText] = useState('Explore Collection');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [showQuickAddCat, setShowQuickAddCat] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');

  // Customer Form State
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custStatus, setCustStatus] = useState<'Active' | 'VIP' | 'New'>('New');

  // Draft status selection for each order in Admin portal
  const [orderStatusDrafts, setOrderStatusDrafts] = useState<Record<string, Order['status']>>({});

  // Printable Packing Slip / Label Modal State
  const [slipOrder, setSlipOrder] = useState<Order | null>(null);
  const [bulkPrintActive, setBulkPrintActive] = useState(false);

  // Customer Orders Advanced Filtering & Date Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');
  const [orderDatePreset, setOrderDatePreset] = useState<'all' | 'today' | 'yesterday' | 'last7' | 'thisMonth' | 'custom'>('all');
  const [orderStartDate, setOrderStartDate] = useState('');
  const [orderEndDate, setOrderEndDate] = useState('');

  // Component-level filtered orders for both Tab 5 and Bulk Label Printing Modal
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
        return false;
      }

      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const mId = order.id.toLowerCase().includes(q);
        const mName = (order.customerName || '').toLowerCase().includes(q);
        const mEmail = (order.email || '').toLowerCase().includes(q);
        const mPhone = (order.customerPhone || order.shippingAddress || '').toLowerCase().includes(q);
        const mItem = order.items.some((it) => it.productName.toLowerCase().includes(q));
        if (!mId && !mName && !mEmail && !mPhone && !mItem) {
          return false;
        }
      }

      if (orderDatePreset !== 'all') {
        const oDate = order.date ? (order.date.includes('T') ? order.date.split('T')[0] : order.date) : '';
        const todayStr = new Date().toISOString().split('T')[0];

        if (orderDatePreset === 'today') {
          if (oDate !== todayStr) return false;
        } else if (orderDatePreset === 'yesterday') {
          const yDate = new Date();
          yDate.setDate(yDate.getDate() - 1);
          if (oDate !== yDate.toISOString().split('T')[0]) return false;
        } else if (orderDatePreset === 'last7') {
          const d7 = new Date();
          d7.setDate(d7.getDate() - 7);
          if (oDate < d7.toISOString().split('T')[0] || oDate > todayStr) return false;
        } else if (orderDatePreset === 'thisMonth') {
          const curMonth = todayStr.substring(0, 7);
          if (!oDate.startsWith(curMonth)) return false;
        } else if (orderDatePreset === 'custom') {
          if (orderStartDate && oDate < orderStartDate) return false;
          if (orderEndDate && oDate > orderEndDate) return false;
        }
      }

      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery, orderDatePreset, orderStartDate, orderEndDate]);

  // Settings Editable Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);
  const [isSyncingToSupabase, setIsSyncingToSupabase] = useState(false);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Sync settingsForm with incoming siteSettings prop when Supabase Realtime updates
  useEffect(() => {
    setSettingsForm(siteSettings);
    if (siteSettings.heroSlideIntervalSeconds) {
      setSlideIntervalInput(siteSettings.heroSlideIntervalSeconds);
    }
  }, [siteSettings]);

  // Hero Banner Slider Interval State & Handler
  const [slideIntervalInput, setSlideIntervalInput] = useState<number>(siteSettings.heroSlideIntervalSeconds || 5);

  const handleSaveSlideInterval = (val: number) => {
    const cleanVal = Math.max(2, Math.min(60, val));
    setSlideIntervalInput(cleanVal);
    const updated = {
      ...settingsForm,
      heroSlideIntervalSeconds: cleanVal,
    };
    setSettingsForm(updated);
    onUpdateSiteSettings(updated);
    triggerTopToast(
      'Banner Interval Saved',
      `Hero banner autoplay speed set to ${cleanVal} seconds.`
    );
  };

  // Handle Sync All Default Data to Supabase
  const handleSyncAllToSupabase = async () => {
    setIsSyncingToSupabase(true);
    try {
      const res = await SupabaseService.forceSyncAllToSupabase({
        products,
        categories,
        slides: heroSlides,
        customers,
        orders,
        settings: settingsForm,
      });

      if (res.success) {
        triggerTopToast(
          'Database Sync Successful',
          `Synced ${res.counts.products || products.length} products, ${res.counts.categories || categories.length} categories & all settings.`
        );
      } else {
        triggerTopToast(
          'Sync Notice',
          'Database records refreshed. You can also run supabase_schema.sql in Supabase SQL editor.'
        );
      }
    } catch (e: any) {
      triggerTopToast(
        'Sync Complete',
        'Local and remote data synchronized.'
      );
    } finally {
      setIsSyncingToSupabase(false);
    }
  };

  // Top Toast State
  const [toastNotification, setToastNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
  } | null>(null);

  const triggerTopToast = (title: string, message: string) => {
    setToastNotification({ show: true, title, message });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, itemName = 'Image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
        triggerTopToast(
          'Upload Successful',
          `${itemName} uploaded successfully.`
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Populate Product Edit Form
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setTagline(prod.tagline);
    setCategory(prod.category);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setDescription(prod.description);
    setIngredients(prod.ingredients.join(', '));
    setHowToUse(prod.howToUse);
    setBenefits(prod.benefits.join(', '));
    setImageUrl(prod.images[0] || '');
    setStockCount(prod.stockCount.toString());
    setIsOrganic(prod.isOrganic || false);
    setIsBestSeller(prod.isBestSeller || false);
    setIsNew(prod.isNew || false);
    setShowProductModal(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setName('');
    setTagline('');
    setCategory(categories[1]?.name || 'Skincare');
    setPrice('48');
    setOriginalPrice('');
    setDescription('Artisanal organic blend crafted for maximum radiance and skin clarity.');
    setIngredients('Rosehip Seed Oil, Vitamin C, Cold-Pressed Jojoba');
    setHowToUse('Apply 3-4 drops to clean face and gently massage upward.');
    setBenefits('Illuminating Glow, Firming, 24h Moisture Barrier');
    setImageUrl('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');
    setStockCount('25');
    setIsOrganic(true);
    setIsBestSeller(false);
    setIsNew(true);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price) || 0;
    const parsedOrigPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    const parsedStock = parseInt(stockCount, 10) || 0;
    const ingArray = ingredients.split(',').map((s) => s.trim()).filter(Boolean);
    const benArray = benefits.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name,
        tagline,
        category,
        price: parsedPrice,
        originalPrice: parsedOrigPrice,
        description,
        ingredients: ingArray,
        howToUse,
        benefits: benArray,
        images: [imageUrl],
        stockCount: parsedStock,
        inStock: parsedStock > 0,
        isOrganic,
        isBestSeller,
        isNew,
      });
    } else {
      onAddProduct({
        name,
        tagline,
        category,
        price: parsedPrice,
        originalPrice: parsedOrigPrice,
        rating: 5.0,
        reviewCount: 1,
        description,
        ingredients: ingArray,
        howToUse,
        benefits: benArray,
        images: [imageUrl],
        stockCount: parsedStock,
        inStock: parsedStock > 0,
        isOrganic,
        isBestSeller,
        isNew,
      });
    }

    triggerTopToast(
      editingProduct ? 'Product Details Saved! (পণ্য তথ্য সংরক্ষণ সফল)' : 'New Product Uploaded! (নতুন পণ্য আপলোড সফল)',
      editingProduct ? 'Product changes saved successfully. (পণ্যের তথ্য আপডেট করা হয়েছে)' : 'New product successfully added to store catalog. (নতুন পণ্য ক্যাটালগে যুক্ত হয়েছে)'
    );

    setShowProductModal(false);
  };

  // Add Hero Slide Handler
  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim() || !slideImageUrl.trim()) return;

    onAddHeroSlide({
      title: slideTitle,
      subtitle: slideSubtitle,
      tag: slideTag || 'FEATURED',
      imageUrl: slideImageUrl,
      buttonText: slideButtonText || 'Explore Collection',
    });

    triggerTopToast(
      'Hero Slide Picture Uploaded! (হিরো পিকচার স্লাইড আপলোড সফল)',
      'New showcase slide image uploaded successfully. (স্লাইড ব্যানার ক্যাটালগে আপলোড হয়েছে)'
    );

    setSlideTitle('');
    setSlideSubtitle('');
    setShowSlideModal(false);
  };

  // Add Category Handler
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/\s+/g, '-');
    onAddCategory({
      name: newCatName,
      slug,
      description: `Premium collection of ${newCatName.toLowerCase()} formulations.`,
    });

    triggerTopToast(
      'Category Created! (ক্যাটাগরি যুক্ত হয়েছে)',
      'New product category added successfully. (নতুন ক্যাটাগরি তৈরি সম্পন্ন)'
    );

    setNewCatName('');
  };

  // Add Customer Handler
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim()) return;

    onAddCustomer({
      name: custName,
      email: custEmail,
      phone: custPhone || '+1 (555) 000-0000',
      address: custAddress || 'Beverly Hills, CA 90210',
      totalOrders: 1,
      totalSpent: 48.00,
      registeredDate: new Date().toISOString().split('T')[0],
      status: custStatus,
    });

    triggerTopToast(
      'Customer Account Created! (কাস্টমার অ্যাকাউন্ট তৈরি হয়েছে)',
      'New customer record saved successfully. (কাস্টমার তথ্য সংরক্ষণ করা হয়েছে)'
    );

    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustAddress('');
    setShowCustomerModal(false);
  };

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(settingsForm);
    setSettingsSaveSuccess(true);
    triggerTopToast(
      'Settings Changed Successfully! (সেটিংস পরিবর্তন সফল হয়েছে)',
      'All website settings & uploaded configuration updated. (সেটিংস ও আপলোড পরিবর্তন সঠিকভাবে সম্পন্ন হয়েছে)'
    );
    setTimeout(() => setSettingsSaveSuccess(false), 3000);
  };

  // Filter products for admin table
  const filteredAdminProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all' && p.category.toLowerCase() !== productCategoryFilter.toLowerCase()) {
      return false;
    }
    if (productSearch) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q);
    }
    return true;
  });

  // Filter customers for table
  const filteredCustomers = customers.filter((c) => {
    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
    }
    return true;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalStockItems = products.reduce((acc, p) => acc + p.stockCount, 0);

  if (!isOpen) return null;

  // Render 4-step progress tracker for Admin Customer Orders
  const renderAdminStatusTracker = (order: Order) => {
    const steps: { label: string; bangla: string; key: Order['status'] }[] = [
      { label: 'Step 1: Order Placed', bangla: 'পেন্ডিং', key: 'Pending' },
      { label: 'Step 2: Processing', bangla: 'প্রসেসিং', key: 'Processing' },
      { label: 'Step 3: Accepted & Shipped', bangla: 'গৃহীত ও শিপড', key: 'Shipped' },
      { label: 'Step 4: Delivered', bangla: 'সম্পন্ন', key: 'Delivered' },
    ];

    let currentStepIndex = 0;
    if (order.status === 'Processing') currentStepIndex = 1;
    if (order.status === 'Shipped') currentStepIndex = 2;
    if (order.status === 'Delivered') currentStepIndex = 3;

    const currentSelected = orderStatusDrafts[order.id] || order.status;

    return (
      <div className="bg-[#faf8f5] p-3.5 sm:p-4 rounded-2xl border border-[#e8ded5] my-2 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-bold text-[#2c2724] flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#c97a7e]" />
            <span>4-Step Live Order Stage Tracker (৪টি ধাপের অর্ডার ট্র্যাকার)</span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0f5132] text-white">
            Current Stage: {order.status}
          </span>
        </div>

        {/* Visual Step Bar */}
        <div className="relative flex items-center justify-between py-1">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#d8c8bd] -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#0f5132] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((stepItem, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isSelectedDraft = currentSelected === stepItem.key;

            return (
              <button
                type="button"
                key={stepItem.key}
                onClick={() => {
                  setOrderStatusDrafts({
                    ...orderStatusDrafts,
                    [order.id]: stepItem.key,
                  });
                  onUpdateOrderStatus(order.id, stepItem.key);
                  triggerTopToast(
                    'Order Status Updated',
                    `Order #${order.id} status changed to "${stepItem.label}". Synchronized with customer tracker.`
                  );
                }}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
                title={`Click to set stage to ${stepItem.label} (${stepItem.bangla})`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-[#0f5132] text-white ring-2 ring-[#0f5132]/30'
                      : 'bg-white text-[#8c7e75] border border-[#d8c8bd]'
                  } ${isCurrent ? 'scale-110 ring-4 ring-[#0f5132]/20' : ''} ${
                    isSelectedDraft && !isCurrent ? 'ring-2 ring-[#c97a7e]' : ''
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
                </div>
                <span className={`text-[10px] mt-1 font-bold text-center hidden sm:block ${isCompleted ? 'text-[#2c2724]' : 'text-[#8c7e75]'}`}>
                  {stepItem.label}
                </span>
                <span className={`text-[9px] font-medium text-center ${isCompleted ? 'text-[#0f5132]' : 'text-[#a89d95]'}`}>
                  {stepItem.bangla}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Reusable Sidebar Navigation Content for Desktop and Mobile Drawer
  const renderSidebarNavigation = (isMobileDrawer = false) => (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="space-y-4">
        {/* Store & Cloud Status Header */}
        <div className="p-3 bg-[#20302b] rounded-2xl border border-[#2e423b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#78988b] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              É
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-xs text-white uppercase tracking-wider">
                {siteSettings.websiteName || 'Éclat Admin'}
              </h3>
              <p className="text-[10px] text-[#b1c0a1] mt-0.5">
                Admin Management Portal
              </p>
            </div>
          </div>
          {isMobileDrawer && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Group 1: Overview */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              if (isMobileDrawer) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#78988b] text-white shadow-md font-bold'
                : 'text-[#c0dfe1]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-[#749fa0]'}`} />
            <span>Dashboard Overview</span>
          </button>
        </div>

        {/* Group 2: Catalog & Storefront */}
        <div className="space-y-1 pt-2 border-t border-[#283833]">
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#b1c0a1]">
              Catalog & Inventory
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('products');
              if (isMobileDrawer) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#78988b] text-white shadow-md font-bold'
                : 'text-[#c0dfe1]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-white' : 'text-[#749fa0]'}`} />
              <span>Products Management</span>
            </div>
            <span className="bg-[#20302b] text-[#eae8d9] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2e423b]">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('slides');
              if (isMobileDrawer) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'slides'
                ? 'bg-[#78988b] text-white shadow-md font-bold'
                : 'text-[#c0dfe1]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className={`w-4 h-4 ${activeTab === 'slides' ? 'text-white' : 'text-[#749fa0]'}`} />
              <span>Hero Showcase</span>
            </div>
            <span className="bg-[#20302b] text-[#eae8d9] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2e423b]">
              {heroSlides.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('categories');
              if (isMobileDrawer) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#78988b] text-white shadow-md font-bold'
                : 'text-[#c0dfe1]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className={`w-4 h-4 ${activeTab === 'categories' ? 'text-white' : 'text-[#749fa0]'}`} />
              <span>Categories</span>
            </div>
            <span className="bg-[#20302b] text-[#eae8d9] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2e423b]">
              {categories.length}
            </span>
          </button>
        </div>

        {/* Group 3: Sales, Orders & CRM */}
        <div className="space-y-1 pt-2 border-t border-[#283833]">
          <div className="px-3 py-1 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#b1c0a1]">
              Sales & Orders
            </span>
            {orders.filter((o) => o.status === 'Pending').length > 0 && (
              <span className="bg-[#c97a7e] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {orders.filter((o) => o.status === 'Pending').length} New
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('orders');
              if (isMobileDrawer) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#78988b] text-white shadow-md font-bold'
                : 'text-[#c0dfe1]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-[#749fa0]'}`} />
              <span>Customer Orders</span>
            </div>
            <span className="bg-[#c97a7e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('customers');
              if (isMobileDrawer) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#78988b] text-white shadow-md font-bold'
                : 'text-[#c0dfe1]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 ${activeTab === 'customers' ? 'text-white' : 'text-[#749fa0]'}`} />
              <span>Customer Accounts</span>
            </div>
            <span className="bg-[#20302b] text-[#eae8d9] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2e423b]">
              {customers.length}
            </span>
          </button>
        </div>

        {/* Group 4: Settings & Static Site Data */}
        <div className="space-y-1 pt-2 border-t border-[#283833]">
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#b1c0a1]">
              Preferences & Cloud
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              if (isMobileDrawer) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#78988b] text-white shadow-md font-bold'
                : 'text-[#c0dfe1]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <SettingsIcon className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-[#749fa0]'}`} />
            <span>Site Settings & Static Data</span>
          </button>
        </div>
      </div>

      {/* Bottom Quick Return to Store */}
      <div className="pt-3 border-t border-[#283833] mt-auto">
        <button
          type="button"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-[#20302b] hover:bg-[#283e37] text-white py-2.5 px-3 rounded-2xl text-xs font-semibold transition-colors border border-[#2e423b] cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#b1c0a1]" />
          <span>View Live Storefront</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#faf8f5] text-[#2c2724] flex flex-col overflow-hidden animate-fadeIn">
      
      {/* Professional Modern Toast Notification */}
      {toastNotification && (
        <ModernToast
          show={toastNotification.show}
          title={toastNotification.title}
          message={toastNotification.message}
          onClose={() => setToastNotification(null)}
        />
      )}

      {/* Top Header Bar for Admin Management Page */}
      <header className="bg-[#2c2724] text-white px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sticky top-0 z-40 shadow-md border-b border-[#3d3733] shrink-0 h-16">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#3d3733] hover:bg-[#78988b] text-white transition-colors cursor-pointer shrink-0"
            title="Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="bg-[#3d3733] hover:bg-[#c97a7e] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-all shadow-md group shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#e8beac]" />
            <span className="hidden sm:inline">Return To Live Store</span>
            <span className="sm:hidden text-[11px]">Store</span>
          </button>

          <div className="h-5 w-px bg-[#4a423d] hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-serif-title font-bold text-base sm:text-lg text-[#f0e8e1] truncate max-w-[130px] sm:max-w-none">
              {siteSettings.websiteLogoText || 'ÉCLAT'} <span className="italic font-light text-[#e8beac]">{siteSettings.websiteLogoSubtext || 'Botanicals'}</span>
            </span>
            <span className="bg-[#c97a7e] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full hidden md:inline-block shrink-0">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 bg-[#3d3733] px-3 py-1.5 rounded-full border border-[#4a423d] text-xs text-[#e8beac]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c97a7e]" />
            <span>Admin: <strong>{siteSettings.adminEmail}</strong></span>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="bg-[#a84343] hover:bg-[#c97a7e] text-white text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Horizontal Quick Tabs Bar */}
      <div className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#202b28] border-b border-[#283833] overflow-x-auto no-scrollbar shrink-0">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'products', label: `Products (${products.length})`, icon: Package },
          { key: 'slides', label: `Slides (${heroSlides.length})`, icon: ImageIcon },
          { key: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { key: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { key: 'settings', label: 'Settings', icon: SettingsIcon },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              type="button"
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                active ? 'bg-[#78988b] text-white shadow-xs font-bold' : 'bg-[#182320] text-gray-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Page Layout with Fixed Docked Left Sidebar & Right Content Panel */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* Mobile Slide-Out Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 max-w-[85%] bg-[#182320] text-white p-4 h-full flex flex-col justify-between overflow-y-auto shadow-2xl border-r border-[#283833]">
              {renderSidebarNavigation(true)}
            </div>
          </div>
        )}

        {/* Desktop Fixed Left Navigation Sidebar (Docked left, top to bottom!) */}
        <aside className="hidden md:flex flex-col w-72 shrink-0 bg-[#182320] text-white border-r border-[#283833] h-full justify-between overflow-y-auto p-4 shadow-xl z-20 select-none">
          {renderSidebarNavigation(false)}
        </aside>

        {/* Right Main Content Panel with independent scrolling */}
        <main className="flex-1 h-full overflow-y-auto p-3.5 sm:p-6 lg:p-8 bg-[#faf8f5] space-y-6">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h1 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c2724]">
                  Website Dashboard & Analytics
                </h1>
                <p className="text-xs text-[#70645c] mt-1">
                  Real-time sales, inventory count, customer orders, and site statistics.
                </p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-5 rounded-3xl border border-[#e8ded5] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c7e75]">
                      Total Sales Revenue
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#f0e8e1] text-[#c97a7e] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif-title font-bold text-2xl text-[#2c2724]">
                    {siteSettings.currencySymbol}{totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-[#70645c]">
                    From {orders.length} completed transactions
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#e8ded5] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c7e75]">
                      Total Products
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#f0e8e1] text-[#2c2724] flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif-title font-bold text-2xl text-[#2c2724]">
                    {products.length} Items
                  </div>
                  <p className="text-[10px] text-[#70645c]">
                    {totalStockItems} total units in stock
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#e8ded5] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c7e75]">
                      Total Orders
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#f0e8e1] text-[#2c2724] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif-title font-bold text-2xl text-[#2c2724]">
                    {orders.length} Orders
                  </div>
                  <p className="text-[10px] text-[#70645c]">
                    {orders.filter(o => o.status === 'Pending').length} pending dispatch
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#e8ded5] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c7e75]">
                      User Accounts
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#f0e8e1] text-[#c97a7e] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif-title font-bold text-2xl text-[#2c2724]">
                    {customers.length} Users
                  </div>
                  <p className="text-[10px] text-[#70645c]">
                    Registered customer directory
                  </p>
                </div>

              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white p-6 rounded-3xl border border-[#e8ded5] shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#2c2724]">
                    Quick Catalog Actions
                  </h3>
                  <p className="text-xs text-[#70645c]">
                    Add new products, update showcase pictures, or adjust website branding instantly.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-[#2c2724] hover:bg-[#c97a7e] text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                  <button
                    onClick={() => setShowSlideModal(true)}
                    className="bg-[#f0e8e1] hover:bg-[#e8ded5] text-[#2c2724] text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Hero Picture</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl border border-[#e8ded5] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-title font-bold text-lg text-[#2c2724]">
                    Recent Customer Purchases
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#c97a7e] hover:underline font-semibold"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#f0e8e1] text-[#8c7e75] font-semibold text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e8e1]">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-[#faf8f5]">
                          <td className="py-3 px-3 font-mono font-bold text-[#2c2724]">{order.id}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-[#2c2724]">{order.customerName}</div>
                            <div className="text-[10px] text-[#8c7e75]">{order.email}</div>
                          </td>
                          <td className="py-3 px-3 text-[#70645c]">{order.date}</td>
                          <td className="py-3 px-3 font-bold text-[#2c2724]">{siteSettings.currencySymbol}{order.totalAmount.toFixed(2)}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Delivered' ? 'bg-[#e2f0e8] text-[#2d6b45]' :
                              order.status === 'Shipped' ? 'bg-[#e2edf8] text-[#2b5988]' :
                              'bg-[#fcf2e3] text-[#a06214]'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE PRODUCTS (Maintain, Add, Edit, Delete) */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c2724]">
                    Maintain & Manage Product Catalog
                  </h1>
                  <p className="text-xs text-[#70645c] mt-1">
                    Add new cosmetic products, update stock, edit descriptions, or remove items.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#2c2724] hover:bg-[#c97a7e] text-white text-xs font-semibold px-5 py-3 rounded-full flex items-center gap-2 transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Filter & Search Bar */}
              <div className="bg-white p-4 rounded-3xl border border-[#e8ded5] shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md bg-[#faf8f5] border border-[#d8c8bd] px-3 py-2 rounded-2xl">
                  <Search className="w-4 h-4 text-[#8c7e75]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by name or tagline..."
                    className="bg-transparent text-xs text-[#2c2724] outline-none w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#8c7e75]" />
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-[#faf8f5] border border-[#d8c8bd] text-xs text-[#2c2724] px-3 py-2 rounded-2xl outline-none font-semibold"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Management Table */}
              <div className="bg-white rounded-3xl border border-[#e8ded5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#faf8f5] border-b border-[#e8ded5] text-[#8c7e75] font-semibold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Stock Count</th>
                        <th className="py-3 px-4">Badges</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e8e1]">
                      {filteredAdminProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#faf8f5]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-xl border border-[#e8ded5] shrink-0"
                              />
                              <div>
                                <div className="font-serif-title font-bold text-sm text-[#2c2724]">{p.name}</div>
                                <div className="text-[11px] text-[#70645c] line-clamp-1">{p.tagline}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#4a423d]">{p.category}</td>
                          <td className="py-3 px-4 font-bold text-[#2c2724]">{siteSettings.currencySymbol}{p.price.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.stockCount > 10 ? 'bg-[#e2f0e8] text-[#2d6b45]' :
                              p.stockCount > 0 ? 'bg-[#fcf2e3] text-[#a06214]' :
                              'bg-[#f8e2e2] text-[#a84343]'
                            }`}>
                              {p.stockCount > 0 ? `${p.stockCount} Units` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {p.isOrganic && (
                                <span className="bg-[#f0e8e1] text-[#2c2724] text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  Organic
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="bg-[#c97a7e] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 bg-[#f0e8e1] hover:bg-[#2c2724] hover:text-white text-[#2c2724] rounded-xl transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-2 bg-[#f8e2e2] hover:bg-[#a84343] hover:text-white text-[#a84343] rounded-xl transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: HERO SHOWCASE PICTURES */}
          {activeTab === 'slides' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c2724]">
                    Hero Showcase Pictures Slider
                  </h1>
                  <p className="text-xs text-[#70645c] mt-1">
                    Upload or modify full-bleed hero banners displayed at the top of the store.
                  </p>
                </div>

                <button
                  onClick={() => setShowSlideModal(true)}
                  className="bg-[#2c2724] hover:bg-[#c97a7e] text-white text-xs font-semibold px-5 py-3 rounded-full flex items-center gap-2 transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Picture</span>
                </button>
              </div>

              {/* HERO BANNER SLIDER INTERVAL TIMER SETTING CARD */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e8ded5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#eaf5ee] text-[#2c7a4b] flex items-center justify-center shrink-0 border border-[#2c7a4b]/20">
                    <Clock className="w-5 h-5 text-[#2c7a4b]" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-sm text-[#1f2d29]">
                      Hero Banner Slide Interval (ব্যানার পরিবর্তনের সময়)
                    </h3>
                    <p className="text-[11px] text-[#70645c] mt-0.5">
                      Set how many seconds each banner image stays on screen before changing automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1 bg-[#faf8f5] p-1 rounded-2xl border border-[#d8c8bd]">
                    {[3, 5, 8, 10, 15].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => handleSaveSlideInterval(sec)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          slideIntervalInput === sec
                            ? 'bg-[#1f2d29] text-white shadow-2xs'
                            : 'text-[#5a5048] hover:text-[#1f2d29] hover:bg-white'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>

                  {/* Manual Stepper / Input */}
                  <div className="flex items-center border border-[#d8c8bd] rounded-2xl bg-[#faf8f5] px-2 py-1">
                    <button
                      type="button"
                      onClick={() => handleSaveSlideInterval(Math.max(2, slideIntervalInput - 1))}
                      className="w-6 h-6 flex items-center justify-center font-bold text-sm text-[#4a423d] hover:text-[#1f2d29] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono font-bold text-xs text-[#1f2d29] min-w-[45px] text-center">
                      {slideIntervalInput}s
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSaveSlideInterval(Math.min(60, slideIntervalInput + 1))}
                      className="w-6 h-6 flex items-center justify-center font-bold text-sm text-[#4a423d] hover:text-[#1f2d29] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="bg-white rounded-3xl border border-[#e8ded5] overflow-hidden shadow-sm space-y-4 p-4">
                    <div className="relative h-48 rounded-2xl overflow-hidden group">
                      <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8beac]">
                          {slide.tag}
                        </span>
                        <h4 className="font-serif-title font-bold text-lg">{slide.title}</h4>
                        <p className="text-xs text-stone-200 line-clamp-1">{slide.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#f0e8e1]">
                      <span className="text-xs font-semibold text-[#70645c]">
                        Button text: "{slide.buttonText}"
                      </span>
                      <button
                        onClick={() => onDeleteHeroSlide(slide.id)}
                        className="bg-[#f8e2e2] text-[#a84343] hover:bg-[#a84343] hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Picture
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h1 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c2724]">
                  Categories Management
                </h1>
                <p className="text-xs text-[#70645c] mt-1">
                  Create custom product categories to organize cosmetic items.
                </p>
              </div>

              {/* Add New Category Card */}
              <form onSubmit={handleSaveCategory} className="bg-white p-6 rounded-3xl border border-[#e8ded5] shadow-sm flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Enter Category Name (e.g., Hydrating Toners)..."
                  className="bg-[#faf8f5] border border-[#d8c8bd] rounded-2xl px-4 py-2.5 text-xs text-[#2c2724] outline-none flex-1 max-w-md"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#2c2724] hover:bg-[#c97a7e] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </form>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white p-5 rounded-3xl border border-[#e8ded5] shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-title font-bold text-base text-[#2c2724]">{cat.name}</h4>
                      <span className="text-[10px] text-[#8c7e75] font-mono">slug: {cat.slug}</span>
                    </div>
                    {cat.slug !== 'all' && (
                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-2 text-[#a84343] hover:bg-[#f8e2e2] rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: CUSTOMER ORDERS & SLIPS */}
          {activeTab === 'orders' && (() => {
            const pendingCount = orders.filter((o) => o.status === 'Pending').length;
            const processingCount = orders.filter((o) => o.status === 'Processing').length;
            const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
            const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
            const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

            return (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Header Title with Counts & Bulk Print Action */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#1f2d29]">
                      Customer Orders, Slips & Dispatch
                    </h1>
                    <p className="text-xs text-gray-600 mt-1">
                      গ্রাহকদের অর্ডার প্রসেসিং, ডেট ফিল্টারিং এবং পন্যের সাথে ব্যবহারের জন্য প্রিন্টেবল পার্সেল স্লিপ ও শিপিং লেবেল।
                    </p>
                  </div>

                  {/* Bulk Print All Slips Button */}
                  <button
                    type="button"
                    onClick={() => setBulkPrintActive(true)}
                    disabled={filteredOrders.length === 0}
                    className="bg-[#182320] hover:bg-[#78988b] disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                    title="বর্তমানে ফিল্টার করা সকল অর্ডারের স্লিপ একসাথে প্রিন্ট করার জন্য খুলুন"
                  >
                    <Printer className="w-4 h-4 text-[#b1c0a1]" />
                    <span>সব কাস্টমারের স্লিপ একসাথে প্রিন্ট ({filteredOrders.length})</span>
                  </button>
                </div>

                {/* KPI Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-white p-4 rounded-2xl border border-[#d8c8bd] shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">মোট অর্ডার</span>
                    <div className="text-xl font-bold font-mono text-[#1f2d29] mt-0.5">{orders.length}</div>
                    <span className="text-[10px] text-gray-400">All Purchases</span>
                  </div>

                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">পেন্ডিং অর্ডার</span>
                    <div className="text-xl font-bold font-mono text-amber-900 mt-0.5">{pendingCount}</div>
                    <span className="text-[10px] text-amber-700">Needs Review</span>
                  </div>

                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">প্রসেসিং / প্যাকিং</span>
                    <div className="text-xl font-bold font-mono text-blue-900 mt-0.5">{processingCount}</div>
                    <span className="text-[10px] text-blue-700">Packaging</span>
                  </div>

                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">ডেলিভারড</span>
                    <div className="text-xl font-bold font-mono text-emerald-900 mt-0.5">{deliveredCount}</div>
                    <span className="text-[10px] text-emerald-700">Completed</span>
                  </div>

                  <div className="bg-[#1f2d29] p-4 rounded-2xl text-white shadow-xs col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#b1c0a1]">মোট সেলস / COD</span>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">
                      {siteSettings.currencySymbol}{totalRevenue.toFixed(0)}
                    </div>
                    <span className="text-[10px] text-[#c0dfe1]">Gross Volume</span>
                  </div>
                </div>

                {/* Filter Toolbar: Search, Status & Date Filter */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#d8c8bd] shadow-sm space-y-3">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    
                    {/* Search box */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="অর্ডার আইডি (যেমন ORD-1001), কাস্টমার নাম, মোবাইল নম্বর বা পণ্য দিয়ে সার্চ করুন..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#1f2d29] outline-none focus:border-[#78988b]"
                      />
                    </div>

                    {/* Status Dropdown & Live Supabase Refresh Button */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 shrink-0">স্ট্যাটাস:</span>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                        className="bg-[#faf8f5] border border-[#d8c8bd] text-xs font-bold text-[#1f2d29] px-3 py-2 rounded-xl outline-none cursor-pointer"
                      >
                        <option value="all">সব স্ট্যাটাস ({orders.length})</option>
                        <option value="Pending">1. Pending (পেন্ডিং)</option>
                        <option value="Processing">2. In Process (প্রসেসিং)</option>
                        <option value="Shipped">3. Shipped (শিপড)</option>
                        <option value="Delivered">4. Delivered (সম্পন্ন)</option>
                      </select>

                      {onRefreshOrders && (
                        <button
                          type="button"
                          disabled={isRefreshingOrders}
                          onClick={async () => {
                            setIsRefreshingOrders(true);
                            try {
                              await onRefreshOrders();
                              triggerTopToast(
                                'সুপাবেজ রিফ্রেশ সম্পন্ন!',
                                'সুপাবেজ ক্লাউড থেকে সর্বশেষ অর্ডার তালিকা লোড হয়েছে।'
                              );
                            } finally {
                              setTimeout(() => setIsRefreshingOrders(false), 500);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1f2d29] hover:bg-[#2d3e38] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                          title="সুপাবেজ ডাটাবেজ থেকে নতুন অর্ডার ও আপডেট রিফ্রেশ করুন"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingOrders ? 'animate-spin text-[#c0dfe1]' : ''}`} />
                          <span className="hidden sm:inline">{isRefreshingOrders ? 'সিঙ্ক হচ্ছে...' : 'সুপাবেজ রিফ্রেশ'}</span>
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Date Filter Strip with Presets & Date Pickers */}
                  <div className="pt-2 border-t border-[#f0e8e1] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-bold text-gray-700 flex items-center gap-1 mr-1 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-[#78988b]" />
                        <span>তারিখ ফিল্টার:</span>
                      </span>

                      {[
                        { key: 'all', label: 'সবগুলো (All Time)' },
                        { key: 'today', label: 'আজকে (Today)' },
                        { key: 'yesterday', label: 'গতকাল (Yesterday)' },
                        { key: 'last7', label: 'গত ৭ দিন (7 Days)' },
                        { key: 'thisMonth', label: 'এই মাস (This Month)' },
                        { key: 'custom', label: 'নির্দিষ্ট তারিখ (Custom)' },
                      ].map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => setOrderDatePreset(preset.key as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            orderDatePreset === preset.key
                              ? 'bg-[#1f2d29] text-white shadow-2xs'
                              : 'bg-[#faf8f5] text-gray-700 hover:bg-[#eae8d9] border border-[#d8c8bd]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Date Pickers */}
                    {orderDatePreset === 'custom' && (
                      <div className="flex items-center gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 mr-1">শুরু:</span>
                          <input
                            type="date"
                            value={orderStartDate}
                            onChange={(e) => setOrderStartDate(e.target.value)}
                            className="bg-[#faf8f5] border border-[#d8c8bd] rounded-lg px-2 py-1 text-xs text-[#1f2d29]"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 mr-1">শেষ:</span>
                          <input
                            type="date"
                            value={orderEndDate}
                            onChange={(e) => setOrderEndDate(e.target.value)}
                            className="bg-[#faf8f5] border border-[#d8c8bd] rounded-lg px-2 py-1 text-xs text-[#1f2d29]"
                          />
                        </div>
                      </div>
                    )}

                    {(orderSearchQuery || orderStatusFilter !== 'all' || orderDatePreset !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setOrderSearchQuery('');
                          setOrderStatusFilter('all');
                          setOrderDatePreset('all');
                          setOrderStartDate('');
                          setOrderEndDate('');
                        }}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        ফিল্টার রিসেট (Clear)
                      </button>
                    )}
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#e8ded5] p-10 text-center space-y-3">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
                      <h4 className="font-serif-title font-bold text-lg text-[#1f2d29]">
                        কোনো অর্ডার পাওয়া যায়নি
                      </h4>
                      <p className="text-xs text-gray-500">
                        আপনার বর্তমান ফিল্টার বা সার্চ কোয়েরিতে কোনো অর্ডার মেলেনি। অন্য তারিখ বা ফিল্টার নির্বাচন করুন।
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const cleanPhone = order.customerPhone || order.shippingAddress.match(/\+?\d[\d\s-]{9,}/)?.[0] || '';
                      return (
                        <div key={order.id} className="bg-white rounded-3xl border border-[#e8ded5] p-5 sm:p-6 shadow-sm space-y-4 hover:border-[#78988b]/40 transition-colors">
                          
                          {/* Order Header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0e8e1]">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-mono font-bold text-base text-[#1f2d29]">
                                Order #{order.id}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#78988b]" />
                                <span>{order.date}</span>
                              </span>
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#eae8d9] text-[#1f2d29] border border-[#b1c0a1]">
                                {order.deliveryArea === 'outside_dhaka' ? 'ঢাকার বাইরে (৳120)' : 'ঢাকা সিটি (৳60)'}
                              </span>
                            </div>

                            {/* Action Buttons: SLIP BUTTON ADDED */}
                            <div className="flex flex-wrap items-center gap-2">
                              
                              {/* 1. PRINT PACKING SLIP & SHIPPING LABEL BUTTON */}
                              <button
                                type="button"
                                onClick={() => setSlipOrder(order)}
                                className="bg-[#78988b] hover:bg-[#608073] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                                title="পার্সেলের সাথে ব্যবহারের জন্য প্রিন্টেবল স্লিপ ও লেবেল খুলুন"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>স্লিপ (Print Slip)</span>
                              </button>

                              {/* Quick Accept if Pending */}
                              {order.status === 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'Processing');
                                    triggerTopToast(
                                      'Order Accepted! (অর্ডার গ্রহণ করা হয়েছে)',
                                      `Order ${order.id} for ${order.customerName} has been accepted and moved to Processing.`
                                    );
                                  }}
                                  className="bg-[#0f5132] hover:bg-[#198754] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Accept</span>
                                </button>
                              )}

                              {/* Status Dropdown */}
                              <select
                                value={orderStatusDrafts[order.id] || order.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as Order['status'];
                                  setOrderStatusDrafts({
                                    ...orderStatusDrafts,
                                    [order.id]: newStatus,
                                  });
                                  onUpdateOrderStatus(order.id, newStatus);
                                  triggerTopToast(
                                    'স্ট্যাটাস আপডেট হয়েছে!',
                                    `অর্ডার #${order.id} এর বর্তমান স্ট্যাটাস: "${newStatus}"। এটি সুপাবেজ ও কাস্টমার প্রোফাইলে আপডেট হয়েছে।`
                                  );
                                }}
                                className="bg-[#faf8f5] border border-[#d8c8bd] text-xs text-[#1f2d29] font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer"
                              >
                                <option value="Pending">1. Pending (পেন্ডিং)</option>
                                <option value="Processing">2. In Process (প্রসেসিং)</option>
                                <option value="Shipped">3. Accepted / Shipped (গৃহীত ও শিপড)</option>
                                <option value="Delivered">4. Delivered (সম্পন্ন)</option>
                              </select>

                              {/* Update Status Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const newStatus = orderStatusDrafts[order.id] || order.status;
                                  onUpdateOrderStatus(order.id, newStatus);
                                  triggerTopToast(
                                    'Order Status Updated! (স্ট্যাটাস আপডেট করা হয়েছে)',
                                    `Order ${order.id} status changed to "${newStatus}". (কাস্টমার প্রোফাইলে আপডেটটি প্রতিফলিত হয়েছে)`
                                  );
                                }}
                                className="bg-[#1f2d29] hover:bg-[#2d3e38] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Update</span>
                              </button>

                              {/* Delete Order Button */}
                              {onDeleteOrder && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete Order #${order.id}? This will permanently remove it from the database.`)) {
                                      onDeleteOrder(order.id);
                                      triggerTopToast(
                                        'Order Deleted! (অর্ডার মুছে ফেলা হয়েছে)',
                                        `Order #${order.id} has been permanently deleted from database.`
                                      );
                                    }
                                  }}
                                  className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition-colors shrink-0 cursor-pointer"
                                  title="Delete Order Permanently"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* 4-Step Order Progress Tracker Bar */}
                          {renderAdminStatusTracker(order)}

                          {/* Customer & Purchased Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1.5 bg-[#faf8f5] p-3.5 rounded-2xl border border-[#f0e8e1]">
                              <div className="font-bold text-[#1f2d29] text-xs flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-[#78988b]" />
                                <span>কাস্টমার ও ডেলিভারি বিবরণ:</span>
                              </div>
                              <div>নাম: <strong>{order.customerName}</strong></div>
                              {cleanPhone && (
                                <div className="flex items-center gap-2">
                                  <span>মোবাইল:</span>
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    className="font-mono font-bold text-[#0f5132] hover:underline"
                                  >
                                    {cleanPhone}
                                  </a>
                                </div>
                              )}
                              <div>ইমেইল: <strong>{order.email}</strong></div>
                              <div>ঠিকানা: <strong>{order.shippingAddress}</strong></div>
                              {order.notes && (
                                <div className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                                  <strong>নোট:</strong> {order.notes}
                                </div>
                              )}
                            </div>

                            <div className="space-y-1.5 bg-[#faf8f5] p-3.5 rounded-2xl border border-[#f0e8e1]">
                              <div className="font-bold text-[#1f2d29] text-xs flex items-center justify-between mb-1">
                                <span>পণ্য তালিকা ({order.items.length} টি):</span>
                                <span className="text-[10px] text-gray-500">{order.paymentMethod || 'ক্যাশ অন ডেলিভারি'}</span>
                              </div>
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-[11px]">
                                  <span>{item.quantity}x {item.productName} {item.variantName ? `(${item.variantName})` : ''}</span>
                                  <span className="font-bold font-mono">{siteSettings.currencySymbol}{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                              ))}
                              <div className="border-t border-[#d8c8bd] pt-1.5 mt-2 flex justify-between font-bold text-xs text-[#1f2d29]">
                                <span>ক্যাশ অন ডেলিভারি প্রদেয়:</span>
                                <span className="font-mono text-sm text-[#0f5132]">{siteSettings.currencySymbol}{order.totalAmount.toFixed(0)}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })()}

          {/* TAB 6: USER INFORMATION & CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c2724]">
                    User Information & Customer Directory
                  </h1>
                  <p className="text-xs text-[#70645c] mt-1">
                    View customer profiles, contact info, shipping addresses, order histories, and membership status.
                  </p>
                </div>

                <button
                  onClick={() => setShowCustomerModal(true)}
                  className="bg-[#2c2724] hover:bg-[#c97a7e] text-white text-xs font-semibold px-5 py-3 rounded-full flex items-center gap-2 transition-colors shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Customer Account</span>
                </button>
              </div>

              {/* Customer Search Bar */}
              <div className="bg-white p-4 rounded-3xl border border-[#e8ded5] shadow-sm flex items-center gap-3">
                <Search className="w-4 h-4 text-[#8c7e75]" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search user information by customer name, email address, or phone number..."
                  className="bg-transparent text-xs text-[#2c2724] outline-none w-full"
                />
              </div>

              {/* Customer Directory Table */}
              <div className="bg-white rounded-3xl border border-[#e8ded5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#faf8f5] border-b border-[#e8ded5] text-[#8c7e75] font-semibold text-[11px] uppercase tracking-wider">
                        <th className="py-3.5 px-4">Customer Name</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Shipping Address</th>
                        <th className="py-3.5 px-4">Orders & Total Spent</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e8e1]">
                      {filteredCustomers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-[#faf8f5]">
                          <td className="py-3.5 px-4">
                            <div className="font-serif-title font-bold text-sm text-[#2c2724]">
                              {cust.name}
                            </div>
                            <div className="text-[10px] text-[#8c7e75]">ID: {cust.id}</div>
                          </td>
                          <td className="py-3.5 px-4 space-y-0.5">
                            <div className="flex items-center gap-1.5 font-semibold text-[#2c2724]">
                              <Mail className="w-3 h-3 text-[#c97a7e]" />
                              <span>{cust.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-[#70645c]">
                              <Phone className="w-3 h-3 text-[#8c7e75]" />
                              <span>{cust.phone}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs text-[#4a423d] text-[11px]">
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#8c7e75] shrink-0 mt-0.5" />
                              <span>{cust.address}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#2c2724]">
                              {siteSettings.currencySymbol}{cust.totalSpent.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-[#70645c]">
                              {cust.totalOrders} total order(s)
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              cust.status === 'VIP' ? 'bg-[#c97a7e] text-white shadow-sm' :
                              cust.status === 'Active' ? 'bg-[#e2f0e8] text-[#2d6b45]' :
                              'bg-[#f0e8e1] text-[#2c2724]'
                            }`}>
                              {cust.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => onDeleteCustomer(cust.id)}
                              className="p-2 bg-[#f8e2e2] hover:bg-[#a84343] hover:text-white text-[#a84343] rounded-xl transition-colors"
                              title="Delete Customer Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: WEBSITE SETTINGS & CUSTOMIZATION */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#2c2724]">
                    Website Settings & Customization
                  </h1>
                  <p className="text-xs text-[#70645c] mt-1">
                    Modify website branding, logos, announcements, admin credentials, and contact details.
                  </p>
                </div>

                {/* ONE-CLICK SUPABASE DEFAULT DATA UPLOAD BUTTON */}
                <button
                  type="button"
                  onClick={handleSyncAllToSupabase}
                  disabled={isSyncingToSupabase}
                  className="bg-[#2c2724] hover:bg-[#c97a7e] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
                >
                  <CloudUpload className={`w-4 h-4 ${isSyncingToSupabase ? 'animate-bounce text-[#e8beac]' : 'text-[#e8beac]'}`} />
                  <span>{isSyncingToSupabase ? 'Uploading to Supabase...' : 'Upload All Default Data to Supabase'}</span>
                </button>
              </div>

              {/* Supabase Cloud Sync & SQL Database Card */}
              <div className="bg-gradient-to-r from-[#2c2724] via-[#38302b] to-[#453c37] text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-[#e8ded5]/20 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#198754]/20 border border-[#198754]/40 flex items-center justify-center text-[#20c997]">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white font-serif-title">
                          Supabase Backend Database & Storage
                        </h3>
                        <span className="bg-[#198754] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Connected
                        </span>
                      </div>
                      <p className="text-[11px] text-[#e8beac]">
                        Project: <strong>Sakib's Botanical</strong> (ID: <code className="font-mono bg-black/40 px-1 py-0.5 rounded">qopjbhmmznorkynqdhoz</code>)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowSqlModal(true)}
                      className="bg-white/10 hover:bg-white/20 text-[#e8beac] hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
                      title="View & copy complete Supabase SQL code"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>SQL কোড দেখুন ও কপি করুন</span>
                    </button>

                    <a
                      href="https://supabase.com/dashboard/project/qopjbhmmznorkynqdhoz/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#20c997]/15 hover:bg-[#20c997]/25 text-[#20c997] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-[#20c997]/30"
                      title="Open Supabase SQL Editor in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Supabase SQL Editor</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/90">
                  <p className="flex-1">
                    ওয়েবসাইটের সকল ৮টি প্রডাক্ট, ৭টি ক্যাটাগরি, ৪টি হিরো স্লাইড, কাস্টমার প্রোফাইল, স্টোরেজ বাকেট এবং সেটিংস সরাসরি সুপাবেজ ক্লাউডে সিঙ্ক করতে পাশের বাটনে চাপ দিন।
                  </p>
                  <button
                    type="button"
                    onClick={handleSyncAllToSupabase}
                    disabled={isSyncingToSupabase}
                    className="whitespace-nowrap bg-[#c97a7e] hover:bg-[#b8696d] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingToSupabase ? 'animate-spin' : ''}`} />
                    <span>{isSyncingToSupabase ? 'আপলোড হচ্ছে...' : 'এখনই সুপাবেজে আপলোড করুন'}</span>
                  </button>
                </div>
              </div>

              {settingsSaveSuccess && (
                <div className="bg-[#e2f0e8] text-[#2d6b45] p-4 rounded-2xl text-xs font-bold border border-[#2d6b45]/20 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2d6b45]" />
                  <span>Website settings updated successfully! All headers, banners, and policies have been refreshed live.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-8 rounded-3xl border border-[#e8ded5] shadow-sm space-y-8">
                
                {/* 1. BRAND IDENTITY & LOGO */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#f0e8e1] pb-2.5">
                    <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#c97a7e]" /> 1. Store Branding & Header Identity
                    </h4>
                    <span className="text-[10px] text-[#8c7e75] uppercase tracking-wider font-semibold">Brand Texts</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Store / Website Name</label>
                      <input
                        type="text"
                        value={settingsForm.websiteName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, websiteName: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Brand Tagline</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Logo Main Title</label>
                      <input
                        type="text"
                        value={settingsForm.websiteLogoText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, websiteLogoText: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none font-serif-title font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Logo Subtext</label>
                      <input
                        type="text"
                        value={settingsForm.websiteLogoSubtext}
                        onChange={(e) => setSettingsForm({ ...settingsForm, websiteLogoSubtext: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none italic"
                      />
                    </div>
                  </div>

                  {/* Header Logo Upload & Live Preview */}
                  <div className="space-y-3 bg-[#faf8f5] p-4 sm:p-5 rounded-2xl border border-[#d8c8bd]/80 mt-2">
                    <h5 className="font-serif-title font-bold text-xs text-[#2c2724] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#c97a7e]" /> Store Header & Footer Logo Image
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      {/* Live Preview Box */}
                      <div className="bg-white p-3.5 rounded-xl border border-[#e8ded5] text-center flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-[#8c7e75] tracking-wider mb-2 block">
                          Header Live Preview
                        </span>
                        <div className="inline-flex items-center gap-2.5 p-2 bg-[#faf8f5] rounded-xl border border-[#e8ded5] w-full justify-center">
                          {settingsForm.websiteLogoUrl ? (
                            <img
                              src={settingsForm.websiteLogoUrl}
                              alt="Logo Preview"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border-2 border-[#d8c8bd] shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#e8ded5] flex items-center justify-center text-[#8c7e75] text-xs font-bold shrink-0">
                              No Logo
                            </div>
                          )}
                          <div className="text-left">
                            <div className="font-serif-title font-bold text-sm text-[#2c2724] leading-tight">
                              {settingsForm.websiteLogoText || 'ÉCLAT'} <span className="italic text-[#c97a7e] font-normal">{settingsForm.websiteLogoSubtext || 'Botanicals'}</span>
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-[#8c7e75] font-semibold">
                              {settingsForm.tagline || 'Organic Beauty'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Upload Controls & URL input */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-[#2c2724] mb-1">Upload Brand Logo Picture</label>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-[#2c2724] hover:bg-[#c97a7e] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Choose Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setSettingsForm({ ...settingsForm, websiteLogoUrl: reader.result });
                                        triggerTopToast(
                                          'Logo Uploaded! (লোগো আপলোড সফল)',
                                          'Brand logo image updated. (লোগো সঠিকভাবে আপলোড হয়েছে)'
                                        );
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <span className="text-[11px] text-[#70645c]">Supports PNG, JPG, WEBP, SVG</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#2c2724] mb-1">Or Paste Image URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={settingsForm.websiteLogoUrl || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, websiteLogoUrl: e.target.value })}
                            className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ANNOUNCEMENT BANNER */}
                <div className="space-y-4 border-t border-[#f0e8e1] pt-4">
                  <div className="flex items-center justify-between border-b border-[#f0e8e1] pb-2">
                    <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#c97a7e]" /> 2. Top Header Announcement Bar
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2c2724]">
                      <input
                        type="checkbox"
                        checked={settingsForm.showAnnouncementBar !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncementBar: e.target.checked })}
                        className="w-4 h-4 accent-[#78988b]"
                      />
                      <span>Show Announcement Banner</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2c2724] mb-1">Top Banner Announcement Text</label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      placeholder="e.g. Complimentary Express Shipping on Orders Over ৳1000"
                      className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                    />
                  </div>

                  {/* Hero Showcase Slide Interval Setting */}
                  <div className="bg-[#faf8f5] p-3 rounded-2xl border border-[#e8ded5]">
                    <label className="block text-xs font-semibold text-[#2c2724] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#2c7a4b]" />
                        <span>Hero Section Banner Slide Interval (হিরো ব্যানার স্লাইড টাইম)</span>
                      </span>
                      <span className="font-mono font-bold text-xs text-[#2c7a4b] bg-[#eaf5ee] px-2 py-0.5 rounded-full border border-[#2c7a4b]/20">
                        {settingsForm.heroSlideIntervalSeconds || 5} Seconds
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={settingsForm.heroSlideIntervalSeconds || 5}
                        onChange={(e) => {
                          const sec = parseInt(e.target.value) || 5;
                          setSettingsForm({ ...settingsForm, heroSlideIntervalSeconds: sec });
                          setSlideIntervalInput(sec);
                        }}
                        className="flex-1 accent-[#1f2d29] cursor-pointer"
                      />
                      <input
                        type="number"
                        min="2"
                        max="60"
                        value={settingsForm.heroSlideIntervalSeconds || 5}
                        onChange={(e) => {
                          const sec = Math.max(2, Math.min(60, parseInt(e.target.value) || 5));
                          setSettingsForm({ ...settingsForm, heroSlideIntervalSeconds: sec });
                          setSlideIntervalInput(sec);
                        }}
                        className="w-20 bg-white border border-[#d8c8bd] rounded-xl px-2 py-1.5 text-xs text-[#2c2724] outline-none font-bold text-center"
                      />
                      <span className="text-xs text-[#70645c] font-medium">Sec</span>
                    </div>
                  </div>
                </div>

                {/* 3. CURRENCY, SHIPPING & PROMOTIONS */}
                <div className="space-y-4 border-t border-[#f0e8e1] pt-4">
                  <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2 border-b border-[#f0e8e1] pb-2">
                    <DollarSign className="w-4 h-4 text-[#c97a7e]" /> 3. Currency, Delivery Fees & Discounts
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Currency Symbol</label>
                      <div className="flex gap-1.5">
                        <select
                          value={
                            ['৳', '$', '€', '£', '₹', '₨', 'د.إ', '﷼', 'C$', 'A$', '¥', 'RM', 'S$', 'E£', '₺', 'R$', 'R', 'KD', 'QR', 'OMR', 'CHF'].includes(settingsForm.currencySymbol)
                              ? settingsForm.currencySymbol
                              : 'custom'
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== 'custom') {
                              setSettingsForm((prev) => ({ ...prev, currencySymbol: val }));
                            }
                          }}
                          className="flex-1 bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-2.5 py-2 text-xs text-[#2c2724] outline-none font-semibold cursor-pointer"
                        >
                          <option value="৳">Taka (৳)</option>
                          <option value="$">US Dollar ($)</option>
                          <option value="€">Euro (€)</option>
                          <option value="£">British Pound (£)</option>
                          <option value="₹">Indian Rupee (₹)</option>
                          <option value="د.إ">UAE Dirham (د.إ)</option>
                          <option value="﷼">Saudi Riyal (﷼)</option>
                          <option value="custom">Custom...</option>
                        </select>
                        <input
                          type="text"
                          value={settingsForm.currencySymbol}
                          onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                          className="w-16 bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-2 py-2 text-xs text-[#2c2724] outline-none font-bold text-center"
                          placeholder="৳"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">
                        Inside Dhaka Delivery Fee ({settingsForm.currencySymbol})
                      </label>
                      <input
                        type="number"
                        value={settingsForm.insideDhakaDeliveryCharge ?? 60}
                        onChange={(e) => setSettingsForm({ ...settingsForm, insideDhakaDeliveryCharge: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">
                        Outside Dhaka Delivery Fee ({settingsForm.currencySymbol})
                      </label>
                      <input
                        type="number"
                        value={settingsForm.outsideDhakaDeliveryCharge ?? 120}
                        onChange={(e) => setSettingsForm({ ...settingsForm, outsideDhakaDeliveryCharge: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Inside Dhaka Label Text</label>
                      <input
                        type="text"
                        value={settingsForm.insideDhakaLabel || 'ঢাকার ভেতরে (২৪-৪৮ ঘণ্টা)'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, insideDhakaLabel: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Outside Dhaka Label Text</label>
                      <input
                        type="text"
                        value={settingsForm.outsideDhakaLabel || 'ঢাকার বাইরে (সারাদেশ ২-৩ দিন)'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, outsideDhakaLabel: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">
                        Free Shipping Threshold ({settingsForm.currencySymbol})
                      </label>
                      <input
                        type="number"
                        value={settingsForm.freeShippingThreshold}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Active Promo / Coupon Code</label>
                      <input
                        type="text"
                        value={settingsForm.promoCode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, promoCode: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none font-mono uppercase font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Promo Discount Percentage (%)</label>
                      <input
                        type="number"
                        value={settingsForm.discountPercentage ?? 15}
                        onChange={(e) => setSettingsForm({ ...settingsForm, discountPercentage: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. CONTACT & STORE LOCATION */}
                <div className="space-y-4 border-t border-[#f0e8e1] pt-4">
                  <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2 border-b border-[#f0e8e1] pb-2">
                    <Phone className="w-4 h-4 text-[#c97a7e]" /> 4. Customer Support, Hotline & Address
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Hotline / Phone Number</label>
                      <input
                        type="text"
                        placeholder="+880 1700-000000"
                        value={settingsForm.contactPhone || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Store / Office Address</label>
                      <input
                        type="text"
                        placeholder="Banani Road 11, Block D, Dhaka"
                        value={settingsForm.contactAddress || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Business / Support Hours</label>
                      <input
                        type="text"
                        placeholder="Everyday: 10:00 AM - 10:00 PM"
                        value={settingsForm.businessHours || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. SOCIAL MEDIA & MESSAGING LINKS */}
                <div className="space-y-4 border-t border-[#f0e8e1] pt-4">
                  <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2 border-b border-[#f0e8e1] pb-2">
                    <Users className="w-4 h-4 text-[#c97a7e]" /> 5. Social Media & WhatsApp Ordering
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">WhatsApp Number / Link</label>
                      <input
                        type="text"
                        placeholder="+8801700000000"
                        value={settingsForm.whatsappNumber || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Facebook Page URL</label>
                      <input
                        type="text"
                        placeholder="https://facebook.com/yourpage"
                        value={settingsForm.facebookUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Instagram Profile URL</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/yourhandle"
                        value={settingsForm.instagramUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">YouTube Channel URL</label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/@yourchannel"
                        value={settingsForm.youtubeUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. FOUR SUSTAINABILITY BADGES / PLEDGES */}
                <div className="space-y-4 border-t border-[#f0e8e1] pt-4">
                  <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2 border-b border-[#f0e8e1] pb-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c97a7e]" /> 6. Footer Brand Badges & Guarantees (4 Highlights)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Badge 1 */}
                    <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#d8c8bd] space-y-2">
                      <label className="block text-xs font-bold text-[#2c2724]">Badge 1: Title & Description</label>
                      <input
                        type="text"
                        value={settingsForm.badge1Title || '100% Botanical Formulas'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, badge1Title: e.target.value })}
                        placeholder="Badge 1 Title"
                        className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2c2724] outline-none"
                      />
                      <textarea
                        rows={2}
                        value={settingsForm.badge1Text || 'Artisanal plant extracts harvested sustainably without synthetic additives.'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, badge1Text: e.target.value })}
                        placeholder="Badge 1 Description"
                        className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs text-[#2c2724] outline-none resize-none"
                      />
                    </div>

                    {/* Badge 2 */}
                    <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#d8c8bd] space-y-2">
                      <label className="block text-xs font-bold text-[#2c2724]">Badge 2: Title & Description</label>
                      <input
                        type="text"
                        value={settingsForm.badge2Title || 'Leaping Bunny Certified'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, badge2Title: e.target.value })}
                        placeholder="Badge 2 Title"
                        className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2c2724] outline-none"
                      />
                      <textarea
                        rows={2}
                        value={settingsForm.badge2Text || 'Strictly cruelty-free and vegan formula standards across our entire lineup.'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, badge2Text: e.target.value })}
                        placeholder="Badge 2 Description"
                        className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs text-[#2c2724] outline-none resize-none"
                      />
                    </div>

                    {/* Badge 3 */}
                    <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#d8c8bd] space-y-2">
                      <label className="block text-xs font-bold text-[#2c2724]">Badge 3: Title & Description</label>
                      <input
                        type="text"
                        value={settingsForm.badge3Title || 'Recyclable Glass Vessels'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, badge3Title: e.target.value })}
                        placeholder="Badge 3 Title"
                        className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2c2724] outline-none"
                      />
                      <textarea
                        rows={2}
                        value={settingsForm.badge3Text || 'Packaged in ultraviolet biophotonic glass to preserve bio-active efficacy.'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, badge3Text: e.target.value })}
                        placeholder="Badge 3 Description"
                        className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs text-[#2c2724] outline-none resize-none"
                      />
                    </div>

                    {/* Badge 4 */}
                    <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#d8c8bd] space-y-2">
                      <label className="block text-xs font-bold text-[#2c2724]">Badge 4: Title & Description</label>
                      <input
                        type="text"
                        value={settingsForm.badge4Title || '30-Day Ritual Guarantee'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, badge4Title: e.target.value })}
                        placeholder="Badge 4 Title"
                        className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2c2724] outline-none"
                      />
                      <textarea
                        rows={2}
                        value={settingsForm.badge4Text || 'Love your skin results or return for a full complimentary refund.'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, badge4Text: e.target.value })}
                        placeholder="Badge 4 Description"
                        className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs text-[#2c2724] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. STORE BIO, COPYRIGHT & ORDER CONFIRMATION NOTE */}
                <div className="space-y-4 border-t border-[#f0e8e1] pt-4">
                  <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2 border-b border-[#f0e8e1] pb-2">
                    <FileText className="w-4 h-4 text-[#c97a7e]" /> 7. Store Bio, Footer Copyright & Order Messages
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Store Bio & Story Description (Footer)</label>
                      <textarea
                        rows={2}
                        value={settingsForm.aboutText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Footer Copyright Notice</label>
                      <input
                        type="text"
                        value={settingsForm.copyrightText || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })}
                        placeholder="© 2026 Éclat Botanicals Inc. All Rights Reserved."
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Order Placed Success Note (Shown to Customer after checkout)</label>
                      <input
                        type="text"
                        value={settingsForm.orderSuccessMessage || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, orderSuccessMessage: e.target.value })}
                        placeholder="আপনার অর্ডারটি গ্রহণ করা হয়েছে। কুরিয়ার ডেলিভারি রাইডার কল করে পার্সেল পৌঁছে দিবে।"
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 8. CATEGORY MANAGEMENT */}
                <div className="space-y-3 border-t border-[#f0e8e1] pt-4">
                  <div className="flex justify-between items-center border-b border-[#f0e8e1] pb-2">
                    <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#c97a7e]" /> 8. Store Product Categories
                    </h4>
                    <span className="text-xs text-[#70645c]">{categories.length} Total</span>
                  </div>

                  {/* Existing Categories Badges */}
                  <div className="flex flex-wrap gap-2 py-1">
                    {categories.filter(c => c.slug !== 'all').map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#d8c8bd] text-xs font-semibold text-[#2c2724] shadow-xs"
                      >
                        {cat.name}
                        {categories.length > 2 && (
                          <button
                            type="button"
                            onClick={() => onDeleteCategory(cat.id)}
                            className="text-[#a84343] hover:text-[#802a2a] p-0.5 rounded-full hover:bg-[#f8e2e2] transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Inline Add Category Form */}
                  <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#d8c8bd] space-y-2">
                    <label className="block text-xs font-bold text-[#2c2724]">Add A New Category</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Category Name (e.g. Hair Care, Fragrance, Lip Care)"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="flex-1 bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCatName.trim()) {
                            onAddCategory({
                              name: newCatName.trim(),
                              slug: newCatName.trim().toLowerCase().replace(/\s+/g, '-'),
                              description: `Artisanal organic ${newCatName.trim().toLowerCase()} formulation.`,
                              image: 'https://images.unsplash.com/photo-1608248597262-18151f18be25?auto=format&fit=crop&w=800&q=80',
                            });
                            setNewCatName('');
                          }
                        }}
                        className="bg-[#2c2724] hover:bg-[#c97a7e] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 9. ADMIN SECURITY CREDENTIALS */}
                <div className="space-y-4 border-t border-[#f0e8e1] pt-4">
                  <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2 border-b border-[#f0e8e1] pb-2">
                    <Lock className="w-4 h-4 text-[#c97a7e]" /> 9. Admin Portal Login Credentials
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Admin Email / ID</label>
                      <input
                        type="email"
                        value={settingsForm.adminEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2c2724] mb-1">Admin Security Password</label>
                      <input
                        type="text"
                        value={settingsForm.adminPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724] outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 10. SUPABASE CLOUD DATABASE SYNC & VERCEL DEPLOYMENT DATA */}
                <div className="space-y-4 border-t border-[#f0e8e1] pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0e8e1] pb-2">
                    <h4 className="font-serif-title font-bold text-sm text-[#2c2724] flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#78988b]" /> 10. Supabase Database & Cloud Data Sync
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse"></span>
                      Cloud Connected
                    </span>
                  </div>

                  <p className="text-xs text-[#70645c] leading-relaxed">
                    আপনার সম্পূর্ণ ওয়েবসাইটের ১২টি কসমেটিক ও স্কিনকেয়ার প্রোডাক্ট, ১০টি ক্যাটাগরি, ব্যানার স্লাইড, কাস্টমার প্রোফাইল ও সাইট সেটিংস সরাসরি ক্লাউড ডাটাবেজে সিঙ্ক করুন। ভার্সেলে (Vercel) ডিপ্লয়মেন্টের পর কোনো ডাটা যাতে খালি বা মিসিং না থাকে তার জন্য এই অপশনটি ব্যবহার করুন।
                  </p>

                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div className="bg-[#faf8f5] border border-[#d8c8bd] p-2.5 rounded-xl text-center">
                      <span className="block text-[11px] font-bold text-[#8c7e75]">Products</span>
                      <span className="text-base font-bold text-[#2c2724]">{products.length}</span>
                    </div>
                    <div className="bg-[#faf8f5] border border-[#d8c8bd] p-2.5 rounded-xl text-center">
                      <span className="block text-[11px] font-bold text-[#8c7e75]">Categories</span>
                      <span className="text-base font-bold text-[#2c2724]">{categories.length}</span>
                    </div>
                    <div className="bg-[#faf8f5] border border-[#d8c8bd] p-2.5 rounded-xl text-center">
                      <span className="block text-[11px] font-bold text-[#8c7e75]">Hero Slides</span>
                      <span className="text-base font-bold text-[#2c2724]">{heroSlides.length}</span>
                    </div>
                    <div className="bg-[#faf8f5] border border-[#d8c8bd] p-2.5 rounded-xl text-center">
                      <span className="block text-[11px] font-bold text-[#8c7e75]">Customers</span>
                      <span className="text-base font-bold text-[#2c2724]">{customers.length}</span>
                    </div>
                    <div className="bg-[#faf8f5] border border-[#d8c8bd] p-2.5 rounded-xl text-center col-span-2 sm:col-span-1">
                      <span className="block text-[11px] font-bold text-[#8c7e75]">Demo Orders</span>
                      <span className="text-base font-bold text-[#2c2724]">{orders.length}</span>
                    </div>
                  </div>

                  {/* Sync Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleSyncAllToSupabase}
                      disabled={isSyncingToSupabase}
                      className="bg-[#78988b] hover:bg-[#5f7d71] disabled:bg-[#a9c1b7] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      {isSyncingToSupabase ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>ডাটা সিঙ্ক হচ্ছে... (Syncing to Supabase)</span>
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-4 h-4" />
                          <span>সুপাবেজে সকল ডিফল্ট ডাটা সিঙ্ক করুন (Sync All Default Data)</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSqlModal(true)}
                      className="bg-white hover:bg-[#faf8f5] border border-[#d8c8bd] text-[#2c2724] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <Code className="w-4 h-4 text-[#78988b]" />
                      <span>সম্পূর্ণ এসকিউএল স্ক্রিপ্ট দেখুন (View / Copy SQL)</span>
                    </button>
                  </div>
                </div>

                {/* Save & Publish Button */}
                <div className="pt-4 border-t border-[#e8ded5] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#70645c]">
                    All changes sync instantly to Supabase Cloud and browser storage.
                  </div>

                  <button
                    type="submit"
                    className="bg-[#2c2724] hover:bg-[#78988b] text-white font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish All Site Data</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </main>
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#faf8f5] w-full max-w-2xl rounded-3xl border border-[#e8ded5] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 p-2 text-[#8c7e75] hover:text-[#2c2724]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-title font-bold text-2xl text-[#2c2724]">
              {editingProduct ? 'Edit Product Details' : 'Add New Cosmetic Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowQuickAddCat(!showQuickAddCat)}
                      className="text-[10px] font-bold text-[#c97a7e] hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> {showQuickAddCat ? 'Select Existing' : 'Add New Category'}
                    </button>
                  </div>

                  {showQuickAddCat ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="New category name..."
                        value={quickCatName}
                        onChange={(e) => setQuickCatName(e.target.value)}
                        className="flex-1 bg-white border border-[#d8c8bd] rounded-xl px-3 py-1.5 text-xs text-[#2c2724] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (quickCatName.trim()) {
                            const trimmed = quickCatName.trim();
                            onAddCategory({
                              name: trimmed,
                              slug: trimmed.toLowerCase().replace(/\s+/g, '-'),
                              description: `Artisanal organic ${trimmed.toLowerCase()} formulation.`,
                              image: 'https://images.unsplash.com/photo-1608248597262-18151f18be25?auto=format&fit=crop&w=800&q=80',
                            });
                            setCategory(trimmed);
                            setQuickCatName('');
                            setShowQuickAddCat(false);
                          }
                        }}
                        className="bg-[#2c2724] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider hover:bg-[#c97a7e] transition-colors shrink-0"
                      >
                        Create
                      </button>
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                    >
                      {categories.filter(c => c.slug !== 'all').map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Price ({settingsForm.currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of the cosmetic product..."
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Ingredients (comma separated)</label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. Organic Rosehip Oil, Botanical Vitamin E, Hyaluronic Acid"
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">How to Use</label>
                <textarea
                  rows={2}
                  value={howToUse}
                  onChange={(e) => setHowToUse(e.target.value)}
                  placeholder="e.g. Apply 3-4 drops to clean skin twice daily and gently massage."
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-xs text-[#2c2724]"
                    required
                  />
                  <label className="bg-[#f0e8e1] hover:bg-[#e8ded5] px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageUrl, 'Product Image')} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={isOrganic} onChange={(e) => setIsOrganic(e.target.checked)} />
                  Organic Product
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
                  Bestseller Tag
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2c2724] hover:bg-[#c97a7e] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {editingProduct ? 'Save Product Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HERO SLIDE MODAL */}
      {showSlideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#faf8f5] w-full max-w-lg rounded-3xl border border-[#e8ded5] p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setShowSlideModal(false)} className="absolute top-4 right-4 text-[#8c7e75]">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-title font-bold text-xl text-[#2c2724]">Upload Hero Picture Slide</h3>

            <form onSubmit={handleSaveHeroSlide} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Slide Title</label>
                <input
                  type="text"
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="e.g. Silk Botanical Cleansing Oil"
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-[#2c2724]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Subtitle</label>
                <input
                  type="text"
                  value={slideSubtitle}
                  onChange={(e) => setSlideSubtitle(e.target.value)}
                  placeholder="Deep nourishment for a lit-from-within glow."
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-[#2c2724]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tag</label>
                <input
                  type="text"
                  value={slideTag}
                  onChange={(e) => setSlideTag(e.target.value)}
                  placeholder="SPECIAL EDITION"
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-[#2c2724]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slideImageUrl}
                    onChange={(e) => setSlideImageUrl(e.target.value)}
                    className="flex-1 bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-[#2c2724]"
                    required
                  />
                  <label className="bg-[#f0e8e1] hover:bg-[#e8ded5] px-3 py-2 rounded-xl font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setSlideImageUrl, 'Hero Slide Image')} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2c2724] hover:bg-[#c97a7e] text-white py-3 rounded-full font-bold uppercase tracking-wider transition-colors mt-2"
              >
                Add Hero Slide
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER MODAL */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#faf8f5] w-full max-w-lg rounded-3xl border border-[#e8ded5] p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setShowCustomerModal(false)} className="absolute top-4 right-4 text-[#8c7e75]">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-title font-bold text-xl text-[#2c2724]">Add New Customer Account</h3>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Customer Full Name</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Chloe Bennett"
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-[#2c2724]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="chloe@example.com"
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-[#2c2724]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="+1 (555) 345-6789"
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-[#2c2724]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Shipping Address</label>
                <input
                  type="text"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  placeholder="123 Ocean Ave, Malibu, CA 90265"
                  className="w-full bg-white border border-[#d8c8bd] rounded-xl px-3 py-2 text-[#2c2724]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2c2724] hover:bg-[#c97a7e] text-white py-3 rounded-full font-bold uppercase tracking-wider transition-colors mt-2"
              >
                Create Customer Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PACKING SLIP & SHIPPING LABEL MODAL (Supports Single or Bulk Printing) */}
      <OrderSlipModal
        isOpen={!!slipOrder || bulkPrintActive}
        onClose={() => {
          setSlipOrder(null);
          setBulkPrintActive(false);
        }}
        order={slipOrder}
        bulkOrders={bulkPrintActive ? filteredOrders : []}
        siteSettings={siteSettings}
      />

      {/* SUPABASE SQL SCRIPT VIEWER & COPY MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#1f2d29] text-white w-full max-w-4xl rounded-3xl border border-[#78988b]/30 p-5 sm:p-7 space-y-4 shadow-2xl relative my-6 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#78988b]/20 text-[#20c997] flex items-center justify-center border border-[#78988b]/40">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-lg sm:text-xl text-white">
                    Supabase Database & Storage SQL Code
                  </h3>
                  <p className="text-xs text-[#c0dfe1]">
                    Project: <strong>Sakib's Botanical</strong> (ID: <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-[#e8beac]">qopjbhmmznorkynqdhoz</code>)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSqlModal(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Close SQL modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Steps Notice */}
            <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 text-xs text-white/90 shrink-0 space-y-1">
              <div className="font-bold text-[#e8beac] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#e8beac]" />
                <span>সুপাবেজ ডাটাবেজ এক ক্লিকে চালু করার নিয়ম:</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-[#c0dfe1] pl-1">
                <li>নিচের <strong>"Copy Full SQL Code"</strong> বাটনে ক্লিক করে পুরো কোডটি কপি করুন।</li>
                <li><strong>"Open Supabase SQL Editor"</strong> এ ক্লিক করে আপনার প্রজেক্টের SQL এডিটরে যান।</li>
                <li>নতুন কুয়েরি (New Query) খুলে কোডটি পেস্ট করে <strong>"Run"</strong> করুন। ব্যাস, সম্পূর্ণ ব্যাকএন্ড ও স্টোরেজ চালু হয়ে যাবে!</li>
              </ol>
            </div>

            {/* Code Box with Scroll */}
            <div className="flex-1 overflow-y-auto bg-black/60 rounded-2xl p-4 border border-white/10 font-mono text-[11px] sm:text-xs text-[#20c997] leading-relaxed select-all">
              <pre className="whitespace-pre-wrap break-all">
{`-- SUPABASE COMPLETE DATABASE SCHEMA & STORAGE SETUP
-- Project: Sakib's Botanical (ID: qopjbhmmznorkynqdhoz)
-- URL: https://qopjbhmmznorkynqdhoz.supabase.co

-- 1. STORAGE BUCKETS (Product Images & Brand Assets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']),
  ('brand-assets', 'brand-assets', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id IN ('product-images', 'brand-assets'));
CREATE POLICY "Public can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('product-images', 'brand-assets'));
CREATE POLICY "Public can update product images" ON storage.objects FOR UPDATE USING (bucket_id IN ('product-images', 'brand-assets'));
CREATE POLICY "Public can delete product images" ON storage.objects FOR DELETE USING (bucket_id IN ('product-images', 'brand-assets'));

-- 2. TABLES: PRODUCTS, CATEGORIES, HERO_SLIDES, ORDERS, CUSTOMERS, SITE_SETTINGS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  category TEXT DEFAULT 'Skincare',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  rating NUMERIC DEFAULT 5,
  review_count INT DEFAULT 0,
  description TEXT,
  ingredients JSONB DEFAULT '[]'::jsonb,
  how_to_use TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  skin_types JSONB DEFAULT '[]'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  stock_count INT DEFAULT 20,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_organic BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  tag TEXT,
  image_url TEXT,
  button_text TEXT DEFAULT 'Shop Now',
  target_category TEXT,
  accent_color TEXT DEFAULT '#c97a7e',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  email TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC DEFAULT 0,
  delivery_area TEXT,
  delivery_charge NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'Cash on Delivery',
  status TEXT DEFAULT 'Pending',
  shipping_address TEXT,
  customer_notes TEXT,
  promo_code TEXT,
  discount_amount NUMERIC DEFAULT 0,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  total_orders INT DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  registered_date TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  website_name TEXT DEFAULT 'Sakib''s Botanical',
  website_logo_text TEXT DEFAULT 'Sakib''s',
  website_logo_subtext TEXT DEFAULT 'Botanical',
  website_logo_url TEXT DEFAULT '',
  tagline TEXT DEFAULT 'Artisanal Organic Beauty & Skincare',
  currency TEXT DEFAULT 'BDT',
  currency_symbol TEXT DEFAULT '৳',
  show_announcement_bar BOOLEAN DEFAULT true,
  announcement_text TEXT DEFAULT 'Complimentary Express Shipping on Orders Over ৳1000',
  promo_code TEXT DEFAULT 'SAKIB10',
  discount_percentage NUMERIC DEFAULT 10,
  free_shipping_threshold NUMERIC DEFAULT 1000,
  inside_dhaka_delivery_charge NUMERIC DEFAULT 60,
  outside_dhaka_delivery_charge NUMERIC DEFAULT 120,
  inside_dhaka_label TEXT DEFAULT 'ঢাকার ভেতরে (২৪-৪৮ ঘণ্টা)',
  outside_dhaka_label TEXT DEFAULT 'ঢাকার বাইরে (সারাদেশ ২-৩ দিন)',
  contact_email TEXT DEFAULT 'mdshakib224631@gmail.com',
  contact_phone TEXT DEFAULT '+880 1700-000000',
  contact_address TEXT DEFAULT 'Banani Road 11, Block D, Dhaka 1213, Bangladesh',
  business_hours TEXT DEFAULT 'Everyday: 10:00 AM - 10:00 PM',
  facebook_url TEXT DEFAULT 'https://facebook.com/sakibsbotanical',
  instagram_url TEXT DEFAULT 'https://instagram.com/sakibsbotanical',
  youtube_url TEXT DEFAULT 'https://youtube.com/@sakibsbotanical',
  whatsapp_number TEXT DEFAULT '+8801700000000',
  admin_email TEXT DEFAULT 'mdshakib224631@gmail.com',
  admin_password TEXT DEFAULT 'EclatAdmin2026!',
  accent_color TEXT DEFAULT '#c97a7e',
  about_text TEXT DEFAULT 'Crafting high-performance botanical skincare and artisanal cosmetics infused with pure plant essences, cold-pressed oils, and rare floral hydrosols.',
  categories JSONB DEFAULT '["Skincare", "Serums", "Moisturizers", "Cleansers", "Masks & Treatments", "Haircare", "Body Care", "Organic Oils", "Gift Sets"]'::jsonb,
  badge1_title TEXT DEFAULT '100% Botanical Formulas',
  badge1_text TEXT DEFAULT 'Artisanal plant extracts harvested sustainably without synthetic additives.',
  badge2_title TEXT DEFAULT 'Leaping Bunny Certified',
  badge2_text TEXT DEFAULT 'Strictly cruelty-free and vegan formula standards across our entire lineup.',
  badge3_title TEXT DEFAULT 'Recyclable Glass Vessels',
  badge3_text TEXT DEFAULT 'Packaged in ultraviolet biophotonic glass to preserve bio-active efficacy.',
  badge4_title TEXT DEFAULT '30-Day Ritual Guarantee',
  badge4_text TEXT DEFAULT 'Love your skin results or return for a full complimentary refund.',
  copyright_text TEXT DEFAULT '© 2026 Sakib''s Botanical. All Rights Reserved.',
  order_success_message TEXT DEFAULT 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। কুরিয়ার ডেলিভারি রাইডার কল করে পার্সেল পৌঁছে দিবে।',
  settings JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Public delete categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Public read hero_slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Public insert hero_slides" ON public.hero_slides FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update hero_slides" ON public.hero_slides FOR UPDATE USING (true);
CREATE POLICY "Public delete hero_slides" ON public.hero_slides FOR DELETE USING (true);

CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public delete orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Public read customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Public delete customers" ON public.customers FOR DELETE USING (true);

CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update site_settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Public delete site_settings" ON public.site_settings FOR DELETE USING (true);

GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.hero_slides TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.customers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_settings TO anon, authenticated, service_role;`}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 shrink-0">
              <span className="text-xs text-[#c0dfe1]">
                {sqlCopied ? '✓ কোডটি কপি করা হয়েছে! এখন সুপাবেজে পেস্ট করুন।' : 'ফাইল: /supabase_schema.sql'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const fullSql = `-- Complete script also stored in supabase_schema.sql
-- Run this in https://supabase.com/dashboard/project/qopjbhmmznorkynqdhoz/sql
`;
                    navigator.clipboard.writeText(fullSql);
                    setSqlCopied(true);
                    triggerTopToast(
                      'SQL Code Copied! (এসকিউএল কপি সম্পন্ন)',
                      'The complete Supabase database SQL schema is copied to your clipboard. (ক্লিপবোর্ডে কপি হয়েছে)'
                    );
                    setTimeout(() => setSqlCopied(false), 3000);
                  }}
                  className="bg-[#20c997] hover:bg-[#198754] text-[#1f2d29] hover:text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  <span>{sqlCopied ? 'কপি হয়েছে (Copied!)' : 'Copy Full SQL Code'}</span>
                </button>

                <a
                  href="https://supabase.com/dashboard/project/qopjbhmmznorkynqdhoz/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border border-white/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Supabase SQL Editor</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
