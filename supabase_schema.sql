-- ==============================================================================
-- SUPABASE COMPLETE DATABASE SCHEMA & STORAGE SETUP
-- Project: Sakib's Botanical (ID: qopjbhmmznorkynqdhoz)
-- URL: https://qopjbhmmznorkynqdhoz.supabase.co
--
-- INSTRUCTIONS TO RUN:
-- 1. Go to your Supabase Dashboard:
--    https://supabase.com/dashboard/project/qopjbhmmznorkynqdhoz/sql
-- 2. Open "SQL Editor" -> Click "New query"
-- 3. Paste this entire SQL file and click "Run" (or Ctrl + Enter)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. STORAGE BUCKETS (Product Images, Brand Assets & Uploads)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']),
  ('brand-assets', 'brand-assets', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'])
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 52428800;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete product images" ON storage.objects;

CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id IN ('product-images', 'brand-assets'));

CREATE POLICY "Public can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('product-images', 'brand-assets'));

CREATE POLICY "Public can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id IN ('product-images', 'brand-assets'));

CREATE POLICY "Public can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id IN ('product-images', 'brand-assets'));

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. HERO SLIDES TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE (Customer & Admin Order Tracking)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. CUSTOMERS TABLE (Syncs with Supabase Auth)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 7. SITE SETTINGS TABLE (Branding, Delivery, Guarantees & Announcements)
-- ------------------------------------------------------------------------------
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
  hero_slide_interval_seconds INT DEFAULT 5,
  settings JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. PRODUCT REVIEWS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating NUMERIC DEFAULT 5,
  title TEXT,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. PROMO CODES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percentage NUMERIC NOT NULL DEFAULT 10,
  min_order_amount NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- SAFE COLUMN EXTENSIONS (Supports re-running without dropping existing tables)
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS show_announcement_bar BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC DEFAULT 10;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS inside_dhaka_label TEXT DEFAULT 'ঢাকার ভেতরে (২৪-৪৮ ঘণ্টা)';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS outside_dhaka_label TEXT DEFAULT 'ঢাকার বাইরে (সারাদেশ ২-৩ দিন)';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS business_hours TEXT DEFAULT 'Everyday: 10:00 AM - 10:00 PM';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT 'https://youtube.com/@sakibsbotanical';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge1_title TEXT DEFAULT '100% Botanical Formulas';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge1_text TEXT DEFAULT 'Artisanal plant extracts harvested sustainably without synthetic additives.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge2_title TEXT DEFAULT 'Leaping Bunny Certified';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge2_text TEXT DEFAULT 'Strictly cruelty-free and vegan formula standards across our entire lineup.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge3_title TEXT DEFAULT 'Recyclable Glass Vessels';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge3_text TEXT DEFAULT 'Packaged in ultraviolet biophotonic glass to preserve bio-active efficacy.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge4_title TEXT DEFAULT '30-Day Ritual Guarantee';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS badge4_text TEXT DEFAULT 'Love your skin results or return for a full complimentary refund.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT '© 2026 Sakib''s Botanical. All Rights Reserved.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS order_success_message TEXT DEFAULT 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। কুরিয়ার ডেলিভারি রাইডার কল করে পার্সেল পৌঁছে দিবে।';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_slide_interval_seconds INT DEFAULT 5;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS promo_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) & ALL-ACCESS POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Safely Drop Existing Policies Before Re-creating
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public insert products" ON public.products;
DROP POLICY IF EXISTS "Public update products" ON public.products;
DROP POLICY IF EXISTS "Public delete products" ON public.products;

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Public insert categories" ON public.categories;
DROP POLICY IF EXISTS "Public update categories" ON public.categories;
DROP POLICY IF EXISTS "Public delete categories" ON public.categories;

DROP POLICY IF EXISTS "Public read hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public insert hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public update hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public delete hero_slides" ON public.hero_slides;

DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
DROP POLICY IF EXISTS "Public delete orders" ON public.orders;

DROP POLICY IF EXISTS "Public read customers" ON public.customers;
DROP POLICY IF EXISTS "Public insert customers" ON public.customers;
DROP POLICY IF EXISTS "Public update customers" ON public.customers;
DROP POLICY IF EXISTS "Public delete customers" ON public.customers;

DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public delete site_settings" ON public.site_settings;

DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public delete reviews" ON public.reviews;

DROP POLICY IF EXISTS "Public read promo_codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Public insert promo_codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Public update promo_codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Public delete promo_codes" ON public.promo_codes;

-- Products Policies
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

-- Categories Policies
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Public delete categories" ON public.categories FOR DELETE USING (true);

-- Hero Slides Policies
CREATE POLICY "Public read hero_slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Public insert hero_slides" ON public.hero_slides FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update hero_slides" ON public.hero_slides FOR UPDATE USING (true);
CREATE POLICY "Public delete hero_slides" ON public.hero_slides FOR DELETE USING (true);

-- Orders Policies
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public delete orders" ON public.orders FOR DELETE USING (true);

-- Customers Policies
CREATE POLICY "Public read customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Public delete customers" ON public.customers FOR DELETE USING (true);

-- Site Settings Policies
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update site_settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Public delete site_settings" ON public.site_settings FOR DELETE USING (true);

-- Reviews Policies
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update reviews" ON public.reviews FOR UPDATE USING (true);
CREATE POLICY "Public delete reviews" ON public.reviews FOR DELETE USING (true);

-- Promo Codes Policies
CREATE POLICY "Public read promo_codes" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Public insert promo_codes" ON public.promo_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update promo_codes" ON public.promo_codes FOR UPDATE USING (true);
CREATE POLICY "Public delete promo_codes" ON public.promo_codes FOR DELETE USING (true);

-- Grant Table Permissions to API Roles
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.hero_slides TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.customers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.reviews TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.promo_codes TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 11. AUTOMATIC AUTH USER TO CUSTOMER SYNC TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (id, name, email, phone, address, total_orders, total_spent, registered_date, status)
  VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.phone, ''),
    '',
    0,
    0,
    TO_CHAR(NOW(), 'YYYY-MM-DD'),
    'Active'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.customers.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 12. REALTIME REPLICATION (Instant Updates across browsers & devices)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_slides;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- ------------------------------------------------------------------------------
-- 13. SEED INITIAL DATA (Sakib's Botanical Complete E-Commerce Store)
-- ------------------------------------------------------------------------------

-- Seed Site Settings
INSERT INTO public.site_settings (
  id,
  website_name,
  website_logo_text,
  website_logo_subtext,
  website_logo_url,
  tagline,
  currency,
  currency_symbol,
  show_announcement_bar,
  announcement_text,
  promo_code,
  discount_percentage,
  free_shipping_threshold,
  inside_dhaka_delivery_charge,
  outside_dhaka_delivery_charge,
  inside_dhaka_label,
  outside_dhaka_label,
  contact_email,
  contact_phone,
  contact_address,
  business_hours,
  facebook_url,
  instagram_url,
  youtube_url,
  whatsapp_number,
  admin_email,
  admin_password,
  accent_color,
  about_text,
  categories,
  badge1_title,
  badge1_text,
  badge2_title,
  badge2_text,
  badge3_title,
  badge3_text,
  badge4_title,
  badge4_text,
  copyright_text,
  order_success_message,
  hero_slide_interval_seconds
) VALUES (
  'global',
  'Sakib''s Botanical',
  'Sakib''s',
  'Botanical',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&auto=format&fit=crop&q=80',
  'Artisanal Organic Beauty & Skincare',
  'BDT',
  '৳',
  true,
  'Complimentary Express Shipping on Orders Over ৳1000 | Code: SAKIB10 for 10% OFF',
  'SAKIB10',
  10,
  1000,
  60,
  120,
  'ঢাকার ভেতরে (২৪-৪৮ ঘণ্টা)',
  'ঢাকার বাইরে (সারাদেশ ২-৩ দিন)',
  'mdshakib224631@gmail.com',
  '+880 1700-000000',
  'Banani Road 11, Block D, Dhaka 1213, Bangladesh',
  'Everyday: 10:00 AM - 10:00 PM',
  'https://facebook.com/sakibsbotanical',
  'https://instagram.com/sakibsbotanical',
  'https://youtube.com/@sakibsbotanical',
  '+8801700000000',
  'mdshakib224631@gmail.com',
  'EclatAdmin2026!',
  '#c97a7e',
  'Crafting high-performance botanical skincare and artisanal cosmetics infused with pure plant essences, cold-pressed oils, and rare floral hydrosols.',
  '["Skincare", "Serums", "Moisturizers", "Cleansers", "Masks & Treatments", "Haircare", "Body Care", "Organic Oils", "Gift Sets"]'::jsonb,
  '100% Botanical Formulas',
  'Artisanal plant extracts harvested sustainably without synthetic additives.',
  'Leaping Bunny Certified',
  'Strictly cruelty-free and vegan formula standards across our entire lineup.',
  'Recyclable Glass Vessels',
  'Packaged in ultraviolet biophotonic glass to preserve bio-active efficacy.',
  '30-Day Ritual Guarantee',
  'Love your skin results or return for a full complimentary refund.',
  '© 2026 Sakib''s Botanical. All Rights Reserved.',
  'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। কুরিয়ার ডেলিভারি রাইডার কল করে পার্সেল পৌঁছে দিবে।',
  5
)
ON CONFLICT (id) DO UPDATE
SET website_name = EXCLUDED.website_name,
    website_logo_text = EXCLUDED.website_logo_text,
    website_logo_subtext = EXCLUDED.website_logo_subtext;

-- Seed Categories (10 Store Categories)
INSERT INTO public.categories (id, name, slug, icon_name, description)
VALUES
  ('cat_all', 'All Products', 'all', 'Sparkles', 'Browse our complete artisanal collection'),
  ('cat_skincare', 'Skincare', 'skincare', 'Sparkles', 'Nourishing botanical creams, moisturizers & cleansers'),
  ('cat_serums', 'Serums & Oils', 'serums', 'FlaskConical', 'Targeted botanical treatments & glowing face oils'),
  ('cat_moisturizers', 'Moisturizers', 'moisturizers', 'Droplets', 'Deep barrier moisture creams & lotions'),
  ('cat_cleansers', 'Cleansers', 'cleansers', 'Wind', 'Gentle micellar waters, balms & herbal cleansers'),
  ('cat-makeup', 'Makeup & Glow', 'makeup', 'Sun', 'Clean mineral makeup & liquid glow'),
  ('cat-lipcare', 'Lip Care', 'lipcare', 'Sparkles', 'Tinted balms, velvet tints & rich lip oils'),
  ('cat_masks', 'Masks & Treatments', 'masks', 'Moon', 'Rejuvenating sea berry masks & peels'),
  ('cat_haircare', 'Hair & Body', 'haircare', 'Sun', 'Nourishing herbal scalp oils & body elixirs'),
  ('cat-fragrance', 'Fragrance', 'fragrance', 'FlaskConical', 'Handcrafted botanical perfumes & solid oils')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description;

-- Seed Hero Slides (4 Botanical Hero Banners)
INSERT INTO public.hero_slides (id, title, subtitle, tag, image_url, button_text, target_category, accent_color)
VALUES
  ('hero-1', 'Luminous Rose Water Infusion', 'Pure damask rose essence enriched with hyaluronic acid for 72-hour deep botanical hydration.', 'NEW ARRIVAL', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80', 'Discover Elixir', 'Serums & Oils', '#e8beac'),
  ('hero-2', 'Velvet Satin Lip Elixirs', 'Nourishing organic jojoba and berry wax formula offering rich, weightless pigmentation.', 'BEST SELLER', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1600&q=80', 'Shop Shades', 'Lip Care', '#c97a7e'),
  ('hero-3', 'Botanical Renewal Night Cream', 'Potent bakuchiol and cold-pressed plum oil to visibly firm and rejuvenate while you rest.', 'ECO-CERTIFIED', 'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=1600&q=80', 'Explore Skincare', 'Skincare', '#8a9a86'),
  ('hero-4', 'Artisanal Glow Bronzing Serum', 'Sun-kissed luminescence infused with niacinamide and golden sea kelp extract.', 'SUMMER SPECIAL', 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1600&q=80', 'Shop Radiance', 'Makeup', '#d4a373')
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, 
    subtitle = EXCLUDED.subtitle, 
    image_url = EXCLUDED.image_url, 
    button_text = EXCLUDED.button_text;

-- Seed Promo Codes
INSERT INTO public.promo_codes (id, code, discount_percentage, min_order_amount, is_active)
VALUES
  ('promo_sakib10', 'SAKIB10', 10, 500, true),
  ('promo_eclat15', 'ECLAT15', 15, 1000, true),
  ('promo_botanical20', 'BOTANICAL20', 20, 1500, true)
ON CONFLICT (id) DO UPDATE SET discount_percentage = EXCLUDED.discount_percentage, is_active = true;

-- Seed Products (Complete 12 Artisanal Products with Variants, Ingredients & Specs)
INSERT INTO public.products (
  id, name, tagline, category, price, original_price, rating, review_count,
  description, ingredients, how_to_use, benefits, images, variants, skin_types,
  in_stock, stock_count, is_new, is_bestseller, is_organic, featured
) VALUES
(
  'prod-1',
  'Aura Radiance Vitamin C Serum',
  'Brightening botanical complex with wild rosehip',
  'Serums & Oils',
  1450, 1750, 4.9, 128,
  'A silky concentrated serum enriched with 15% stabilized Vitamin C, organic Rosehip oil, and Ferulic acid. Restores natural radiance, fades dark spots, and shields skin against daily environmental stressors.',
  '["15% L-Ascorbic Acid", "Organic Rosehip Seed Oil", "Botanical Ferulic Acid", "Hyaluronic Acid", "Kakadu Plum Extract"]'::jsonb,
  'Apply 3-4 drops to cleansed face and neck every morning. Press gently into skin until absorbed, followed by sunscreen.',
  '["Illuminates dull complexion", "Visibly firms fine lines", "Deep cellular antioxidants", "Non-comedogenic formula"]'::jsonb,
  '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["All Skin Types", "Sensitive", "Dull"]'::jsonb,
  true, 42, false, true, true, true
),
(
  'prod-2',
  'Velvet Satin Lipstick',
  'Weightless pigment infused with shea butter',
  'Lip Care',
  850, 1050, 4.8, 94,
  'An ultra-creamy, feather-light velvet lipstick that cushions lips in moisture while delivering rich, high-impact pigment with a soft matte finish.',
  '["Organic Shea Butter", "Jojoba Seed Wax", "Wild Berry Extract", "Vitamin E", "Natural Mineral Pigments"]'::jsonb,
  'Glide directly onto lips starting from the center outward. Layer for buildable intensity.',
  '["8-hour hydrating wear", "Comfortable matte feel", "100% natural wax base", "Feather-resistant formula"]'::jsonb,
  '["https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[{"id": "v-rose", "name": "Dusty Rose", "hexColor": "#c97a7e", "inStock": true}, {"id": "v-berry", "name": "Plum Nectar", "hexColor": "#8a3b53", "inStock": true}, {"id": "v-nude", "name": "Warm Terracotta", "hexColor": "#bd6a53", "inStock": true}, {"id": "v-coral", "name": "Petal Coral", "hexColor": "#e07a5f", "inStock": true}]'::jsonb,
  '["All Skin Types"]'::jsonb,
  true, 85, true, false, true, true
),
(
  'prod-3',
  'Hydra-Dew Botanical Moisture Cream',
  'Deep moisture barrier repair cream',
  'Moisturizers',
  1650, 1950, 4.7, 76,
  'A cloud-like whipped moisturizing cream with plant ceramides, white tea leaf extract, and squalane to lock in hydration and plump skin elasticity.',
  '["Plant Ceramides", "Olive Squalane", "Organic White Tea Extract", "Gotu Kola (Centella Asiatica)", "Sweet Almond Oil"]'::jsonb,
  'Smooth a nickel-sized amount over clean face and neck, morning and night. Warm between fingertips before applying.',
  '["Plumps dehydrated skin", "Soothes redness & inflammation", "Non-greasy velvety finish"]'::jsonb,
  '["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["Dry", "Normal", "Sensitive"]'::jsonb,
  true, 28, false, true, true, true
),
(
  'prod-4',
  'Celestial Dew Liquid Glow Highlighter',
  'Sheer golden radiance for cheeks & brow bones',
  'Makeup',
  1150, 1350, 4.9, 81,
  'A hybrid liquid serum highlighter infused with ultra-fine pearl micro-pigments and chamomile oil. Gives a glass-skin, lit-from-within sheen without glitter.',
  '["Camellia Flower Oil", "Ethical Mica Pearls", "Chamomile Hydrosol", "Squalane"]'::jsonb,
  'Dab 1-2 dots onto cheekbones, bridge of nose, and cupids bow using fingertips or a damp beauty sponge.',
  '["Glass skin finish", "Blends seamlessly over makeup or bare skin", "Lightweight non-sticky oil base"]'::jsonb,
  '["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[{"id": "v-champagne", "name": "Champagne Pearl", "hexColor": "#f3e8d2", "inStock": true}, {"id": "v-rose-gold", "name": "Blush Gold", "hexColor": "#e8c5b5", "inStock": true}, {"id": "v-bronze", "name": "Sunlit Bronze", "hexColor": "#cfa683", "inStock": true}]'::jsonb,
  '["All Skin Types"]'::jsonb,
  true, 15, true, false, false, true
),
(
  'prod-5',
  'Pure Chamomile Micellar Balm Cleanser',
  'Melts water-proof makeup and impurities gently',
  'Cleansers',
  950, 1150, 4.8, 64,
  'A transformative balm-to-milk cleanser crafted with blue chamomile, calendula, and seabuckthorn oil. Effortlessly dissolves cosmetics while leaving skin soft.',
  '["Blue Chamomile Oil", "Calendula Extract", "Seabuckthorn Berry Oil", "Sunflower Seed Oil"]'::jsonb,
  'Massage onto dry skin to dissolve makeup. Add warm water to emulsify into a soothing milk, then rinse thoroughly.',
  '["Zero tight feeling post-cleansing", "Removes waterproof mascara", "Includes organic muslin cloth"]'::jsonb,
  '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["Sensitive", "Dry", "Combination"]'::jsonb,
  true, 30, false, false, true, false
),
(
  'prod-6',
  'Jardin Nuit Botanical Eau de Parfum',
  'Hand-blended jasmine, sandalwood & bergamot',
  'Fragrance',
  2450, 2800, 4.9, 42,
  'An ethereal scent evoking a moonlit Mediterranean garden. Opens with crisp bergamot and neroli, heart notes of night-blooming jasmine, anchored by warm sandalwood.',
  '["Organic Grape Alcohol", "Night Jasmine Absolute", "Calabrian Bergamot Oil", "Sandalwood Resin"]'::jsonb,
  'Spritz onto pulse points behind ears, wrists, and collarbone. Do not rub wrists together to preserve top notes.',
  '["Clean alcohol base", "Long-lasting 12-hour scent profile", "Artisanal glass flask"]'::jsonb,
  '["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["All Skin Types"]'::jsonb,
  true, 19, true, false, false, false
),
(
  'prod-7',
  'Illuminating Golden Sea Berry Face Mask',
  'Vitamin-rich radiance boosting herbal clay mask',
  'Masks & Treatments',
  1250, 1450, 4.8, 53,
  'Infused with golden sea buckthorn and French yellow clay to brighten and detoxify skin without stripping natural moisture.',
  '["French Yellow Clay", "Sea Buckthorn Berry", "Turmeric Root Extract", "Rose Floral Water"]'::jsonb,
  'Apply an even layer for 10-15 minutes, then rinse with warm water.',
  '["Instant radiance", "Clarifies pores without drying"]'::jsonb,
  '["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["All Skin Types", "Dull", "Oily"]'::jsonb,
  true, 25, false, false, true, false
),
(
  'prod-8',
  'Nectar Glow Tinted Lip Oil',
  'High-shine botanical lip treatment',
  'Lip Care',
  650, 780, 4.8, 89,
  'A cushiony non-sticky lip oil infused with honey blossom nectar and raspberry seed oil for intense shine and sheer tint.',
  '["Cold-pressed Raspberry Seed Oil", "Honey Blossom Nectar", "Vitamin E", "Organic Coconut Oil"]'::jsonb,
  'Apply generous coat with plush applicator whenever lips need moisture and luscious shine.',
  '["Non-tacky glaze finish", "Drenches lips in hydration", "Natural subtle tint"]'::jsonb,
  '["https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[{"id": "v-honey", "name": "Clear Honey", "hexColor": "#f7d070", "inStock": true}, {"id": "v-cherry", "name": "Cherry Blossom", "hexColor": "#d64550", "inStock": true}, {"id": "v-berry-oil", "name": "Wild Fig", "hexColor": "#782d3e", "inStock": true}]'::jsonb,
  '["All Skin Types"]'::jsonb,
  true, 50, false, false, true, false
),
(
  'prod-9',
  'Rosemary & Mint Scalp Stimulating Elixir',
  'Deep root nourishing botanical hair and scalp serum',
  'Hair & Body',
  1100, 1350, 4.9, 67,
  'A nutrient-dense scalp treatment infused with pure rosemary oil, peppermint leaf extract, biotin, and cold-pressed castor seed oil to invigorate hair follicles and encourage lustrous hair growth.',
  '["Organic Rosemary Essential Oil", "Peppermint Leaf Oil", "Pure Castor Oil", "Golden Jojoba", "Biotin & Vitamin E"]'::jsonb,
  'Part hair into sections and apply 4-6 drops directly onto the scalp. Massage thoroughly with fingertips for 3-5 minutes before washing or leave overnight.',
  '["Stimulates healthy hair roots", "Relieves dry and flaky scalp", "Strengthens hair strands without greasiness"]'::jsonb,
  '["https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["All Hair Types", "Dry Scalp", "Fine Hair"]'::jsonb,
  true, 38, false, true, true, true
),
(
  'prod-10',
  'Golden Amber Botanical Body Polish & Soufflé',
  'Whipped shea and warm vanilla amber body butter',
  'Hair & Body',
  1350, 1600, 4.8, 45,
  'A decadent, whipped body butter that melts seamlessly into the skin. Infused with unrefined shea butter, sweet almond oil, and a warm botanical resin of amber and sandalwood.',
  '["Raw Ghanaian Shea Butter", "Virgin Coconut Oil", "Cold-Pressed Sweet Almond Oil", "Amber Botanical Resin"]'::jsonb,
  'Massage liberally into damp skin after showering to lock in 24-hour hydration.',
  '["Deep velvet barrier moisture", "Non-sticky whipped texture", "Warm lingering natural fragrance"]'::jsonb,
  '["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["Dry", "Very Dry", "Normal"]'::jsonb,
  true, 22, false, false, true, false
),
(
  'prod-11',
  'Damask Rose & Peony Hydrating Facial Mist',
  'Refreshing botanical hydrosol spray with hyaluronic acid',
  'Skincare',
  850, 990, 4.8, 92,
  'An invigorating fine mist crafted with steam-distilled organic damask rose hydrosol, French peony flower extract, and aloe vera leaf juice to soothe and hydrate throughout the day.',
  '["Steam-distilled Damask Rose Hydrosol", "White Peony Flower Extract", "Aloe Barbadensis Leaf Juice", "Hyaluronic Acid"]'::jsonb,
  'Mist generously over face and neck after cleansing or anytime skin feels dehydrated or tight.',
  '["Instantly calms irritation", "Sets makeup beautifully", "100% alcohol-free"]'::jsonb,
  '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["All Skin Types", "Sensitive", "Dehydrated"]'::jsonb,
  true, 60, true, false, true, true
),
(
  'prod-12',
  'Gentle Matcha Green Tea Enzyme Cleanser',
  'Purifying gentle foam with organic Japanese ceremonial matcha',
  'Cleansers',
  920, 1100, 4.7, 38,
  'A gentle, pH-balanced gel cleanser formulated with antioxidant-packed Uji matcha green tea, papaya enzymes, and soothing cucumber hydrosol to purify without disrupting the skin barrier.',
  '["Ceremonial Matcha Green Tea", "Papaya Fruit Enzyme", "Cucumber Hydrosol", "Plant Saponins"]'::jsonb,
  'Pump 1-2 times onto wet palms. Lather into a soft foam and massage gently over damp skin, then rinse with lukewarm water.',
  '["Unclogs pores gently", "Calms acne-prone irritation", "Maintains skin pH 5.5"]'::jsonb,
  '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  '[]'::jsonb,
  '["Oily", "Combination", "Acne-Prone", "Sensitive"]'::jsonb,
  true, 35, false, false, true, false
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    variants = EXCLUDED.variants,
    stock_count = EXCLUDED.stock_count,
    in_stock = EXCLUDED.in_stock;

-- Seed Default Customer Profiles
INSERT INTO public.customers (id, name, email, phone, address, total_orders, total_spent, registered_date, status)
VALUES 
  ('usr-101', 'Sophia Laurent', 'sophia.laurent@example.com', '+880 1711-234567', 'House 12, Road 4, Dhanmondi, Dhaka 1205', 3, 3420, '2026-01-15', 'VIP'),
  ('usr-102', 'Elena Rostova', 'elena.rostova@example.com', '+880 1812-345678', 'Road 11, Block D, Banani, Dhaka 1213', 1, 960, '2026-02-02', 'Active'),
  ('usr-103', 'Amara Vance', 'amara.vance@example.com', '+880 1913-456789', 'GEC Circle, Nasirabad, Chattogram', 2, 1840, '2026-02-05', 'New'),
  ('cust_sakib_01', 'Sakib Ahmed', 'mdshakib224631@gmail.com', '+8801700000000', 'Banani Road 11, Block D, Dhaka 1213, Bangladesh', 5, 7500, TO_CHAR(NOW(), 'YYYY-MM-DD'), 'VIP')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone;

-- Seed Demo Orders
INSERT INTO public.orders (id, customer_id, customer_name, customer_phone, email, items, total_amount, delivery_area, delivery_charge, payment_method, status, date, shipping_address, customer_notes)
VALUES
  ('ORD-8921', 'usr-101', 'Sophia Laurent', '+880 1711-234567', 'sophia.laurent@example.com', '[{"productName": "Aura Radiance Vitamin C Serum", "quantity": 1, "price": 1450}, {"productName": "Velvet Satin Lipstick", "variantName": "Dusty Rose", "quantity": 1, "price": 850}]'::jsonb, 2360, 'inside_dhaka', 60, 'Cash on Delivery (COD)', 'Processing', '2026-02-18', 'House 12, Road 4, Dhanmondi, Dhaka 1205', 'Please call before delivery'),
  ('ORD-8922', 'usr-102', 'Elena Rostova', '+880 1812-345678', 'elena.rostova@example.com', '[{"productName": "Hydra-Dew Botanical Moisture Cream", "quantity": 1, "price": 1650}, {"productName": "Damask Rose & Peony Hydrating Facial Mist", "quantity": 1, "price": 850}]'::jsonb, 2560, 'inside_dhaka', 60, 'Cash on Delivery (COD)', 'Shipped', '2026-02-19', 'Road 11, Block D, Banani, Dhaka 1213', 'Urgent delivery requested')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, total_amount = EXCLUDED.total_amount;

-- Success confirmation notice
SELECT 'Sakib''s Botanical Supabase database setup completed successfully! All tables, storage buckets, RLS policies, and initial botanical data are ready.' AS setup_result;
