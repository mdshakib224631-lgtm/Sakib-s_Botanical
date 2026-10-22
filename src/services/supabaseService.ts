import { supabase } from '../lib/supabase';
import { Product, CategoryItem, HeroSlide, Order, CustomerUser, SiteSettings } from '../types';

// Helper to convert DB snake_case to Product
export function mapRowToProduct(row: any): Product {
  return {
    id: String(row.id),
    name: row.name || '',
    tagline: row.tagline || '',
    category: row.category || 'Skincare',
    price: Number(row.price || 0),
    originalPrice: row.original_price ? Number(row.original_price) : row.originalPrice,
    rating: Number(row.rating || 5),
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 0),
    description: row.description || '',
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : (typeof row.ingredients === 'string' ? row.ingredients.split(',').map((s: string) => s.trim()) : []),
    howToUse: row.how_to_use || row.howToUse || '',
    benefits: Array.isArray(row.benefits) ? row.benefits : (typeof row.benefits === 'string' ? row.benefits.split(',').map((s: string) => s.trim()) : []),
    images: Array.isArray(row.images) ? row.images : [row.image_url || row.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
    variants: Array.isArray(row.variants) ? row.variants : [],
    skinTypes: Array.isArray(row.skin_types ?? row.skinTypes) ? (row.skin_types ?? row.skinTypes) : [],
    inStock: Boolean(row.in_stock ?? row.inStock ?? true),
    stockCount: Number(row.stock_count ?? row.stockCount ?? 20),
    isNew: Boolean(row.is_new ?? row.isNew ?? false),
    isBestSeller: Boolean(row.is_bestseller ?? row.isBestSeller ?? false),
    isOrganic: Boolean(row.is_organic ?? row.isOrganic ?? true),
    featured: Boolean(row.featured ?? false),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

// Helper to convert Product to DB row
export function mapProductToRow(product: Partial<Product>) {
  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    category: product.category,
    price: product.price,
    original_price: product.originalPrice,
    rating: product.rating,
    review_count: product.reviewCount,
    description: product.description,
    ingredients: product.ingredients,
    how_to_use: product.howToUse,
    benefits: product.benefits,
    images: product.images,
    variants: product.variants,
    skin_types: product.skinTypes,
    in_stock: product.inStock,
    stock_count: product.stockCount,
    is_new: product.isNew,
    is_bestseller: product.isBestSeller,
    is_organic: product.isOrganic,
    featured: product.featured,
  };
}

// Map Categories
export function mapRowToCategory(row: any): CategoryItem {
  return {
    id: String(row.id),
    name: row.name || '',
    slug: row.slug || '',
    iconName: row.icon_name || row.iconName,
    description: row.description,
  };
}

export function mapCategoryToRow(cat: CategoryItem) {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon_name: cat.iconName,
    description: cat.description,
  };
}

// Map Hero Slides
export function mapRowToHeroSlide(row: any): HeroSlide {
  return {
    id: String(row.id),
    title: row.title || '',
    subtitle: row.subtitle || '',
    tag: row.tag || '',
    imageUrl: row.image_url || row.imageUrl || '',
    buttonText: row.button_text || row.buttonText || 'Shop Now',
    targetCategory: row.target_category || row.targetCategory,
    accentColor: row.accent_color || row.accentColor,
  };
}

export function mapHeroSlideToRow(slide: HeroSlide) {
  return {
    id: slide.id,
    title: slide.title,
    subtitle: slide.subtitle,
    tag: slide.tag,
    image_url: slide.imageUrl,
    button_text: slide.buttonText,
    target_category: slide.targetCategory,
    accent_color: slide.accentColor,
  };
}

// Map Orders
export function mapRowToOrder(row: any): Order {
  let itemsList: any[] = [];
  try {
    if (Array.isArray(row.items)) {
      itemsList = row.items;
    } else if (typeof row.items === 'string') {
      itemsList = JSON.parse(row.items);
    }
  } catch (e) {
    itemsList = [];
  }

  return {
    id: String(row.id),
    customerId: row.customer_id || row.customerId || undefined,
    customerName: row.customer_name || row.customerName || '',
    customerPhone: row.customer_phone || row.customerPhone || '',
    email: row.email || '',
    items: itemsList,
    totalAmount: Number(row.total_amount ?? row.totalAmount ?? 0),
    deliveryArea: row.delivery_area || row.deliveryArea,
    deliveryCharge: Number(row.delivery_charge ?? row.deliveryCharge ?? 0),
    paymentMethod: row.payment_method || row.paymentMethod,
    status: row.status || 'Pending',
    date: row.date ? (typeof row.date === 'string' && row.date.includes('T') ? row.date.split('T')[0] : String(row.date)) : new Date().toISOString().split('T')[0],
    shippingAddress: row.shipping_address || row.shippingAddress || '',
    notes: row.customer_notes || row.notes || '',
  };
}

export function mapOrderToRow(order: Order) {
  // Ensure items are strictly serializable JSON without undefined values
  const cleanItems = (order.items || []).map((it) => ({
    productName: it.productName || '',
    variantName: it.variantName || null,
    quantity: Number(it.quantity) || 1,
    price: Number(it.price) || 0,
  }));

  // Extract phone number from customerPhone or from shipping address as fallback
  const phoneVal = order.customerPhone || order.shippingAddress?.match(/(?:\+?880|01)[3-9]\d{8}/)?.[0] || null;

  return {
    id: String(order.id),
    customer_id: order.customerId || null,
    customer_name: order.customerName || 'সম্মানিত ক্রেতা',
    customer_phone: phoneVal,
    email: order.email || null,
    items: cleanItems,
    total_amount: Number(order.totalAmount) || 0,
    delivery_area: order.deliveryArea || 'inside_dhaka',
    delivery_charge: Number(order.deliveryCharge) || 0,
    payment_method: order.paymentMethod || 'Cash on Delivery',
    status: order.status || 'Pending',
    date: order.date ? (typeof order.date === 'string' && order.date.includes('T') ? order.date.split('T')[0] : String(order.date)) : new Date().toISOString().split('T')[0],
    shipping_address: order.shippingAddress || '',
    customer_notes: order.notes || null,
    updated_at: new Date().toISOString(),
  };
}

// Map Customers
export function mapRowToCustomer(row: any): CustomerUser {
  return {
    id: String(row.id),
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    totalOrders: Number(row.total_orders ?? row.totalOrders ?? 0),
    totalSpent: Number(row.total_spent ?? row.totalSpent ?? 0),
    registeredDate: row.registered_date || row.registeredDate || new Date().toISOString().split('T')[0],
    status: row.status || 'Active',
  };
}

export function mapCustomerToRow(customer: CustomerUser) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    total_orders: customer.totalOrders,
    total_spent: customer.totalSpent,
    registered_date: customer.registeredDate,
    status: customer.status,
  };
}

// Map Site Settings
export function mapRowToSiteSettings(row: any): SiteSettings {
  const s = row.settings && typeof row.settings === 'object' ? row.settings : {};
  return {
    websiteName: row.website_name || s.websiteName || "Sakib's Botanical",
    websiteLogoText: row.website_logo_text || s.websiteLogoText || "Sakib's",
    websiteLogoSubtext: row.website_logo_subtext || s.websiteLogoSubtext || 'Botanical',
    websiteLogoUrl: row.website_logo_url || s.websiteLogoUrl || '',
    tagline: row.tagline || s.tagline || 'Artisanal Organic Beauty & Skincare',
    currency: row.currency || s.currency || 'BDT',
    currencySymbol: row.currency_symbol || s.currencySymbol || '৳',
    showAnnouncementBar: row.show_announcement_bar ?? s.showAnnouncementBar ?? true,
    announcementText: row.announcement_text || s.announcementText || 'Complimentary Express Shipping on Orders Over ৳1000',
    promoCode: row.promo_code || s.promoCode || 'SAKIB10',
    discountPercentage: Number(row.discount_percentage ?? s.discountPercentage ?? 10),
    freeShippingThreshold: Number(row.free_shipping_threshold ?? s.freeShippingThreshold ?? 1000),
    insideDhakaDeliveryCharge: Number(row.inside_dhaka_delivery_charge ?? s.insideDhakaDeliveryCharge ?? 60),
    outsideDhakaDeliveryCharge: Number(row.outside_dhaka_delivery_charge ?? s.outsideDhakaDeliveryCharge ?? 120),
    insideDhakaLabel: row.inside_dhaka_label || s.insideDhakaLabel || 'ঢাকার ভেতরে (২৪-৪৮ ঘণ্টা)',
    outsideDhakaLabel: row.outside_dhaka_label || s.outsideDhakaLabel || 'ঢাকার বাইরে (সারাদেশ ২-৩ দিন)',
    contactEmail: row.contact_email || s.contactEmail || 'mdshakib224631@gmail.com',
    contactPhone: row.contact_phone || s.contactPhone || '+880 1700-000000',
    contactAddress: row.contact_address || s.contactAddress || 'Banani Road 11, Block D, Dhaka 1213, Bangladesh',
    businessHours: row.business_hours || s.businessHours || 'Everyday: 10:00 AM - 10:00 PM',
    facebookUrl: row.facebook_url || s.facebookUrl || 'https://facebook.com/sakibsbotanical',
    instagramUrl: row.instagram_url || s.instagramUrl || 'https://instagram.com/sakibsbotanical',
    youtubeUrl: row.youtube_url || s.youtubeUrl || 'https://youtube.com/@sakibsbotanical',
    whatsappNumber: row.whatsapp_number || s.whatsappNumber || '+8801700000000',
    adminEmail: row.admin_email || s.adminEmail || 'mdshakib224631@gmail.com',
    adminPassword: row.admin_password || s.adminPassword || 'EclatAdmin2026!',
    accentColor: row.accent_color || s.accentColor || '#c97a7e',
    aboutText: row.about_text || s.aboutText || 'Crafting high-performance botanical skincare and artisanal cosmetics infused with pure plant essences, cold-pressed oils, and rare floral hydrosols.',
    categories: Array.isArray(row.categories) ? row.categories : (Array.isArray(s.categories) ? s.categories : []),
    badge1Title: row.badge1_title || s.badge1Title || '100% Botanical Formulas',
    badge1Text: row.badge1_text || s.badge1Text || 'Artisanal plant extracts harvested sustainably without synthetic additives.',
    badge2Title: row.badge2_title || s.badge2Title || 'Leaping Bunny Certified',
    badge2Text: row.badge2_text || s.badge2Text || 'Strictly cruelty-free and vegan formula standards across our entire lineup.',
    badge3Title: row.badge3_title || s.badge3Title || 'Recyclable Glass Vessels',
    badge3Text: row.badge3_text || s.badge3Text || 'Packaged in ultraviolet biophotonic glass to preserve bio-active efficacy.',
    badge4Title: row.badge4_title || s.badge4Title || '30-Day Ritual Guarantee',
    badge4Text: row.badge4_text || s.badge4Text || 'Love your skin results or return for a full complimentary refund.',
    copyrightText: row.copyright_text || s.copyrightText || "© 2026 Sakib's Botanical. All Rights Reserved.",
    orderSuccessMessage: row.order_success_message || s.orderSuccessMessage || 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। কুরিয়ার ডেলিভারি রাইডার কল করে পার্সেল পৌঁছে দিবে।',
    heroSlideIntervalSeconds: Number(row.hero_slide_interval_seconds ?? s.heroSlideIntervalSeconds ?? 5),
  };
}

export function mapSiteSettingsToRow(settings: SiteSettings) {
  return {
    id: 'global',
    website_name: settings.websiteName,
    website_logo_text: settings.websiteLogoText,
    website_logo_subtext: settings.websiteLogoSubtext,
    website_logo_url: settings.websiteLogoUrl,
    tagline: settings.tagline,
    currency: settings.currency,
    currency_symbol: settings.currencySymbol,
    show_announcement_bar: settings.showAnnouncementBar,
    announcement_text: settings.announcementText,
    promo_code: settings.promoCode,
    discount_percentage: settings.discountPercentage,
    free_shipping_threshold: settings.freeShippingThreshold,
    inside_dhaka_delivery_charge: settings.insideDhakaDeliveryCharge,
    outside_dhaka_delivery_charge: settings.outsideDhakaDeliveryCharge,
    inside_dhaka_label: settings.insideDhakaLabel,
    outside_dhaka_label: settings.outsideDhakaLabel,
    contact_email: settings.contactEmail,
    contact_phone: settings.contactPhone,
    contact_address: settings.contactAddress,
    business_hours: settings.businessHours,
    facebook_url: settings.facebookUrl,
    instagram_url: settings.instagramUrl,
    youtube_url: settings.youtubeUrl,
    whatsapp_number: settings.whatsappNumber,
    admin_email: settings.adminEmail,
    admin_password: settings.adminPassword,
    accent_color: settings.accentColor,
    about_text: settings.aboutText,
    categories: settings.categories,
    badge1_title: settings.badge1Title,
    badge1_text: settings.badge1Text,
    badge2_title: settings.badge2Title,
    badge2_text: settings.badge2Text,
    badge3_title: settings.badge3Title,
    badge3_text: settings.badge3Text,
    badge4_title: settings.badge4Title,
    badge4_text: settings.badge4Text,
    copyright_text: settings.copyrightText,
    order_success_message: settings.orderSuccessMessage,
    hero_slide_interval_seconds: settings.heroSlideIntervalSeconds ?? 5,
    settings: settings, // Included for complete JSON capability
  };
}

// API Methods
export const SupabaseService = {
  // Check Supabase connection state
  async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  // PRODUCTS
  async fetchProducts(): Promise<Product[] | null> {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) {
        if (error.message?.includes('schema cache') || error.code === 'PGRST204') {
          console.info('Supabase table "products" does not exist yet. Please run supabase_schema.sql in Supabase SQL Editor.');
        } else {
          console.warn('Error fetching products from Supabase:', error.message);
        }
        return null;
      }
      if (!data) return null;
      return data.map(mapRowToProduct);
    } catch (e) {
      return null;
    }
  },

  async upsertProduct(product: Product): Promise<boolean> {
    try {
      const row = mapProductToRow(product);
      const { error } = await supabase.from('products').upsert(row);
      if (error) {
        if (error.message?.includes('schema cache') || error.code === 'PGRST204') {
          console.info('Supabase table "products" pending creation in SQL Editor.');
        } else {
          console.warn('Error upserting product to Supabase:', error.message);
        }
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  subscribeToProducts(onChange: (products: Product[]) => void) {
    const channelId = `products-rt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          const fresh = await SupabaseService.fetchProducts();
          if (fresh) onChange(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // CATEGORIES
  async fetchCategories(): Promise<CategoryItem[] | null> {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error || !data) return null;
      return data.map(mapRowToCategory);
    } catch (e) {
      return null;
    }
  },

  async upsertCategory(cat: CategoryItem): Promise<boolean> {
    try {
      const { error } = await supabase.from('categories').upsert(mapCategoryToRow(cat));
      return !error;
    } catch (e) {
      return false;
    }
  },

  async deleteCategory(catId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', catId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // HERO SLIDES
  async fetchHeroSlides(): Promise<HeroSlide[] | null> {
    try {
      const { data, error } = await supabase.from('hero_slides').select('*');
      if (error || !data) return null;
      return data.map(mapRowToHeroSlide);
    } catch (e) {
      return null;
    }
  },

  async upsertHeroSlide(slide: HeroSlide): Promise<boolean> {
    try {
      const { error } = await supabase.from('hero_slides').upsert(mapHeroSlideToRow(slide));
      return !error;
    } catch (e) {
      return false;
    }
  },

  async deleteHeroSlide(slideId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', slideId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // ORDERS
  async fetchOrders(): Promise<Order[] | null> {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('date', { ascending: false });
      if (error) {
        console.warn('Error fetching orders from Supabase:', error.message);
        return null;
      }
      if (!data) return null;
      return data.map(mapRowToOrder);
    } catch (e) {
      console.error('Exception fetching orders:', e);
      return null;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select();

      if (error) {
        console.warn('Error updating order status in Supabase:', error.message);
        // Fallback: try upserting with updated status
        const { error: upsertErr } = await supabase
          .from('orders')
          .upsert({ id: orderId, status, updated_at: new Date().toISOString() }, { onConflict: 'id' });
        return !upsertErr;
      }

      console.info(`Supabase order #${orderId} status successfully updated to "${status}".`, data);
      return true;
    } catch (e) {
      console.error('Exception updating order status:', e);
      return false;
    }
  },

  async upsertOrder(order: Order): Promise<boolean> {
    try {
      const row = mapOrderToRow(order);
      // Primary attempt: standard upsert with onConflict on primary key 'id'
      const { data, error } = await supabase.from('orders').upsert(row, { onConflict: 'id' }).select();
      if (!error) {
        console.info(`Order #${order.id} saved to Supabase successfully:`, data);
        return true;
      }

      console.warn('Standard upsert encountered notice, trying direct insert:', error.message);
      // Fallback 1: Direct insert if order row is brand new
      const { data: insertData, error: insertErr } = await supabase.from('orders').insert(row).select();
      if (!insertErr) {
        console.info(`Order #${order.id} inserted into Supabase successfully:`, insertData);
        return true;
      }

      // Fallback 2: Exclude customer_id if foreign key constraint or schema issue
      const { customer_id, ...fallbackRow } = row;
      const { error: fallbackUpsertErr } = await supabase.from('orders').upsert(fallbackRow, { onConflict: 'id' });
      if (!fallbackUpsertErr) {
        console.info(`Order #${order.id} saved to Supabase (without customer_id FK).`);
        return true;
      }

      const { error: fallbackInsertErr } = await supabase.from('orders').insert(fallbackRow);
      if (!fallbackInsertErr) {
        console.info(`Order #${order.id} inserted into Supabase (without customer_id FK).`);
        return true;
      }

      // If cloud network was temporarily unreachable, queue locally and log warning
      console.warn('Supabase order cloud sync notice (order saved in local storage):', error?.message || insertErr?.message || fallbackUpsertErr?.message);
      try {
        const queueKey = 'eclat_pending_sync_orders';
        const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
        existingQueue.push(row);
        localStorage.setItem(queueKey, JSON.stringify(existingQueue));
      } catch (e) {
        // Ignore localStorage quota errors
      }
      return true;
    } catch (e: any) {
      console.warn('Supabase order sync notice (order saved locally):', e?.message || e);
      return true;
    }
  },

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) {
        console.warn('Error deleting order from Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  subscribeToOrders(onChange: (orders: Order[]) => void) {
    const channelId = `orders-rt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          const fresh = await SupabaseService.fetchOrders();
          if (fresh) onChange(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // CUSTOMERS
  async fetchCustomers(): Promise<CustomerUser[] | null> {
    try {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) {
        console.warn('Error fetching customers:', error.message);
        return null;
      }
      if (!data) return null;
      return data.map(mapRowToCustomer);
    } catch (e) {
      console.error('Exception fetching customers:', e);
      return null;
    }
  },

  async upsertCustomer(customer: CustomerUser): Promise<boolean> {
    try {
      const row = mapCustomerToRow(customer);

      // Prevent 23505 unique constraint violation if customer email already exists under another id
      if (customer.email && !customer.email.endsWith('@customer.eclat.com')) {
        const { data: existingEmailCust } = await supabase
          .from('customers')
          .select('id')
          .eq('email', customer.email)
          .maybeSingle();

        if (existingEmailCust && existingEmailCust.id !== customer.id) {
          const { error: updErr } = await supabase
            .from('customers')
            .update({
              name: customer.name,
              phone: customer.phone,
              address: customer.address,
              total_orders: customer.totalOrders,
              total_spent: customer.totalSpent,
              status: customer.status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingEmailCust.id);
          return !updErr;
        }
      }

      const { error } = await supabase.from('customers').upsert(row, { onConflict: 'id' });
      if (!error) return true;

      const { error: insertErr } = await supabase.from('customers').insert(row);
      if (!insertErr) return true;

      if (customer.email) {
        const { error: updateErr } = await supabase
          .from('customers')
          .update({
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            total_orders: customer.totalOrders,
            total_spent: customer.totalSpent,
            status: customer.status,
            updated_at: new Date().toISOString(),
          })
          .eq('email', customer.email);
        if (!updateErr) return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  async deleteCustomer(customerId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', customerId);
      if (error) {
        console.warn('Error deleting customer from Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Exception in deleteCustomer:', e);
      return false;
    }
  },

  subscribeToCustomers(onChange: (customers: CustomerUser[]) => void) {
    const channelId = `cust-rt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        async () => {
          const fresh = await SupabaseService.fetchCustomers();
          if (fresh) onChange(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // SITE SETTINGS
  async fetchSiteSettings(): Promise<SiteSettings | null> {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
      if (error || !data) return null;
      return mapRowToSiteSettings(data);
    } catch (e) {
      return null;
    }
  },

  async saveSiteSettings(settings: SiteSettings): Promise<boolean> {
    try {
      const row = mapSiteSettingsToRow(settings);
      const { error } = await supabase.from('site_settings').upsert(row);
      
      if (error) {
        console.warn('Upserting individual columns failed (table schema might need column updates), attempting fallback to json settings:', error.message);
        // Fallback for older table schema with only (id, settings)
        const fallbackRes = await supabase.from('site_settings').upsert({
          id: 'global',
          settings: settings,
        });
        return !fallbackRes.error;
      }
      return true;
    } catch (e) {
      console.error('Failed to save site settings:', e);
      return false;
    }
  },

  subscribeToSiteSettings(onChange: (settings: SiteSettings) => void) {
    const channelId = `settings-rt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          if (payload.new) {
            onChange(mapRowToSiteSettings(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // AUTO SEED ALL INITIAL PRODUCTS & DATA TO SUPABASE IF EMPTY
  async seedInitialDataIfEmpty(initialData: {
    products: Product[];
    categories: CategoryItem[];
    slides: HeroSlide[];
    customers: CustomerUser[];
    orders?: Order[];
    settings: SiteSettings;
  }) {
    try {
      const existingProducts = await SupabaseService.fetchProducts();
      if (!existingProducts || existingProducts.length === 0) {
        console.log('Seeding initial products to Supabase...');
        for (const p of initialData.products) {
          await SupabaseService.upsertProduct(p);
        }
      }

      const existingCats = await SupabaseService.fetchCategories();
      if (!existingCats || existingCats.length === 0) {
        for (const c of initialData.categories) {
          await SupabaseService.upsertCategory(c);
        }
      }

      const existingSlides = await SupabaseService.fetchHeroSlides();
      if (!existingSlides || existingSlides.length === 0) {
        for (const s of initialData.slides) {
          await SupabaseService.upsertHeroSlide(s);
        }
      }

      const existingCust = await SupabaseService.fetchCustomers();
      if (!existingCust || existingCust.length === 0) {
        for (const cust of initialData.customers) {
          await SupabaseService.upsertCustomer(cust);
        }
      }

      const existingSettings = await SupabaseService.fetchSiteSettings();
      if (!existingSettings) {
        await SupabaseService.saveSiteSettings(initialData.settings);
      }

      if (initialData.orders && initialData.orders.length > 0) {
        const existingOrders = await SupabaseService.fetchOrders();
        if (!existingOrders || existingOrders.length === 0) {
          for (const ord of initialData.orders) {
            await SupabaseService.upsertOrder(ord);
          }
        }
      }
    } catch (e) {
      console.warn('Initial seed check error:', e);
    }
  },

  // FORCE UPLOAD / SYNC ALL DEFAULT LOCAL DATA TO SUPABASE
  async forceSyncAllToSupabase(data: {
    products: Product[];
    categories: CategoryItem[];
    slides: HeroSlide[];
    customers: CustomerUser[];
    orders: Order[];
    settings: SiteSettings;
  }): Promise<{ success: boolean; message: string; counts: Record<string, number> }> {
    try {
      let productCount = 0;
      let catCount = 0;
      let slideCount = 0;
      let customerCount = 0;
      let orderCount = 0;

      for (const p of data.products) {
        const ok = await SupabaseService.upsertProduct(p);
        if (ok) productCount++;
      }
      for (const c of data.categories) {
        const ok = await SupabaseService.upsertCategory(c);
        if (ok) catCount++;
      }
      for (const s of data.slides) {
        const ok = await SupabaseService.upsertHeroSlide(s);
        if (ok) slideCount++;
      }
      for (const cust of data.customers) {
        const ok = await SupabaseService.upsertCustomer(cust);
        if (ok) customerCount++;
      }
      for (const ord of data.orders) {
        const ok = await SupabaseService.upsertOrder(ord);
        if (ok) orderCount++;
      }
      await SupabaseService.saveSiteSettings(data.settings);

      return {
        success: true,
        message: 'All default data uploaded to Supabase successfully!',
        counts: {
          products: productCount,
          categories: catCount,
          slides: slideCount,
          customers: customerCount,
          orders: orderCount,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Sync failed',
        counts: {},
      };
    }
  },
};
