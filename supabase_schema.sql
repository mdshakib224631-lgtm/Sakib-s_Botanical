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

-- Seed Categories
INSERT INTO public.categories (id, name, slug, icon_name, description)
VALUES
  ('cat_all', 'All Products', 'all', 'Sparkles', 'Complete collection of artisanal botanical formulations.'),
  ('cat_skincare', 'Skincare', 'skincare', 'Sparkles', 'Clean, bio-active organic skincare for healthy, radiant skin.'),
  ('cat_serums', 'Serums & Elixirs', 'serums', 'FlaskConical', 'Concentrated botanical serums and precious restorative facial elixirs.'),
  ('cat_moisturizers', 'Moisturizers', 'moisturizers', 'Droplets', 'Nutrient-rich barrier creams, hydrators, and cold-pressed balms.'),
  ('cat_cleansers', 'Cleansers & Toners', 'cleansers', 'Wind', 'Gentle plant-based purifying cleansers and pure floral hydrosols.'),
  ('cat_masks', 'Masks & Treatments', 'masks', 'Moon', 'Intensive weekly botanical restorative and clarifying face treatments.'),
  ('cat_haircare', 'Hair & Body', 'haircare', 'Sun', 'Nourishing herbal scalp serums, hair oils, and botanical body balms.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- Seed Hero Slides
INSERT INTO public.hero_slides (id, title, subtitle, tag, image_url, button_text, target_category, accent_color)
VALUES
  ('slide_1', 'Petal Infused Radiance', 'Awaken dull skin with wild-harvested French Damask Rose hydrosol and triple-molecular hyaluronic acid.', 'Spring Botanical Harvest', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=85', 'Explore The Ritual', 'serums', '#c97a7e'),
  ('slide_2', 'Artisanal Herbal Elixir', 'Bio-active botanical oils cold-pressed with certified organic sea buckthorn and evening primrose.', 'Pure Cold-Pressed Formula', 'https://images.unsplash.com/photo-1608248597262-18151f18be25?auto=format&fit=crop&w=1600&q=85', 'Shop Elixirs', 'serums', '#9e6266'),
  ('slide_3', 'Deep Velvet Moisture', 'Centella Asiatica and ceramides blended into whipped soufflé cream for lasting 72-hour barrier repair.', 'Dermatologist Approved', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1600&q=85', 'Discover Creams', 'moisturizers', '#8a4e52'),
  ('slide_4', 'Pure Plant-Based Alchemy', 'Handcrafted in micro-batches with sustainably sourced botanicals and certified organic active ingredients.', 'Micro-Batch Craftsmanship', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=85', 'View Collection', 'all', '#5c393c')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle;

-- Seed Promo Code
INSERT INTO public.promo_codes (id, code, discount_percentage, min_order_amount, is_active)
VALUES
  ('promo_sakib10', 'SAKIB10', 10, 500, true),
  ('promo_eclat15', 'ECLAT15', 15, 1000, true)
ON CONFLICT (id) DO UPDATE SET discount_percentage = EXCLUDED.discount_percentage, is_active = true;

-- Seed Products
INSERT INTO public.products (
  id, name, tagline, category, price, original_price, rating, review_count,
  description, ingredients, how_to_use, benefits, images, in_stock, stock_count,
  is_new, is_bestseller, is_organic, featured
) VALUES
(
  'prod_1',
  'Rose Luminescence Restorative Serum',
  'Triple-Molecular Hyaluronic & Damask Rose Elixir',
  'serums',
  1450,
  1750,
  4.9,
  142,
  'A silky bio-active nectar concentrated with organic Damask Rose hydrosol, snow mushroom polysaccharide, and pure plant squalane. Plumps fine lines and restores radiant luminosity.',
  '["Organic Damask Rose Hydrosol", "Triple Molecular Hyaluronic Acid", "Tremella Snow Mushroom", "Plant Squalane", "Niacinamide (Vitamin B3)"]'::jsonb,
  'Smooth 3-4 drops morning and evening over cleansed face and neck before moisturizer.',
  '["Instant deep dermal hydration", "Soothes redness and irritation", "Revives dull, tired skin", "Strengthens moisture barrier"]'::jsonb,
  '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1608248597262-18151f18be25?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 45, true, true, true, true
),
(
  'prod_2',
  'Botanical Dew Hydrating Essence',
  'Fermented Rice Water & Green Tea Toner',
  'cleansers',
  980,
  1200,
  4.8,
  89,
  'A lightweight, micro-nourishing treatment essence that softens the skin texture while preparing epidermal layers to receive moisture and serums.',
  '["Organic Green Tea Hydrosol", "Fermented Camellia Japonica", "Centella Asiatica", "Glycerin", "Allantoin"]'::jsonb,
  'Pat gently onto cleansed face using palms until fully absorbed.',
  '["Pore refinement and balance", "Balances optimal skin pH 5.5", "Enhances serum absorption", "Antioxidant protection"]'::jsonb,
  '["https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 30, false, true, true, true
),
(
  'prod_3',
  'Velvet Petal Barrier Moisture Cream',
  'Whipped Ceramides, Shea Butter & Calendula',
  'moisturizers',
  1650,
  1950,
  5.0,
  210,
  'A rich velvety moisture soufflé that locks in all-day comfort without heaviness. Crafted with oat beta-glucan and organic calendula flower infusion.',
  '["Shea Nilotica Butter", "Ceramide NP & AP", "Colloidal Oat Beta-Glucan", "Organic Calendula Extract", "Evening Primrose Oil"]'::jsonb,
  'Massage a pea-sized amount onto face and neck following your serum ritual.',
  '["72-hour barrier repair", "Calms sensitized and dry skin", "Velvety non-greasy cushion finish", "Protects against pollution"]'::jsonb,
  '["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 28, false, true, true, true
),
(
  'prod_4',
  'Midnight Recovery Botanical Facial Oil',
  'Cold-Pressed Blue Tansy & Rosehip Seed',
  'serums',
  1890,
  2250,
  4.9,
  98,
  'A luxurious sapphire-hued dry face oil loaded with natural Azulene, Bakuchiol, and omega fatty acids that works in synergy with the nightly circadian cycle.',
  '["Moroccan Blue Tansy Essential Oil", "Virgin Cold-Pressed Rosehip Oil", "Bakuchiol (Natural Retinol)", "Jojoba Esters", "Vitamin E"]'::jsonb,
  'Warm 2-3 drops between fingertips and gently press into damp skin as the final night step.',
  '["Recharges cellular vitality", "Smooths rough skin texture", "Non-comedogenic luminous dry finish", "Targeted anti-inflammatory action"]'::jsonb,
  '["https://images.unsplash.com/photo-1608248597262-18151f18be25?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 18, true, false, true, true
),
(
  'prod_5',
  'Purifying Chamomile Silk Gel Cleanser',
  'Sulfate-Free Foam with Willow Bark & Honey',
  'cleansers',
  850,
  1050,
  4.7,
  74,
  'An ultra-gentle foaming gel that dissolves impurities and daily sunscreen without disrupting the delicate moisture barrier.',
  '["Organic Roman Chamomile Water", "White Willow Bark Extract", "Raw Wildflower Honey", "Coconut Glucoside", "Pro-Vitamin B5"]'::jsonb,
  'Lather one pump with water, massage over damp face for 60 seconds, and rinse with lukewarm water.',
  '["Cleanses without tightness", "Unclogs congested pores", "Maintains healthy microbiome", "Gentle for daily twice-a-day use"]'::jsonb,
  '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 50, false, false, true, false
),
(
  'prod_6',
  'Illuminating Golden Sea Berry Face Mask',
  'AHA Enzymatic Glow & Turmeric Butter',
  'masks',
  1250,
  1500,
  4.8,
  63,
  'A weekly transformative enzyme mask infused with organic sea buckthorn, papaya enzymes, and soothing golden turmeric. Unveils fresh, glowing skin in 10 minutes.',
  '["Sea Buckthorn Fruit Oil", "Papaya Enzyme (Papain)", "Organic Turmeric Root Extract", "Kaolin Clay", "Sweet Almond Oil"]'::jsonb,
  'Apply an even layer to clean skin. Leave on for 10-15 minutes, then rinse with warm water.',
  '["Instantly polishes dead surface cells", "Brightens post-blemish marks", "Smoother makeup application", "Energizing botanical aroma"]'::jsonb,
  '["https://images.unsplash.com/photo-1567928815117-640a1b021382?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 22, true, false, true, false
),
(
  'prod_7',
  'Herbal Scalp & Crown Restorative Oil',
  'Bhringraj, Rosemary & Black Seed Elixir',
  'haircare',
  1150,
  1400,
  4.9,
  116,
  'A nutrient-dense scalp treatment infused with certified organic rosemary, cold-pressed kalonji (black seed), and Ayurvedic herbs to foster strong, lustrous hair growth.',
  '["Organic Rosemary Leaf Extract", "Cold-Pressed Black Cumin Seed Oil", "Bhringraj Extract", "Castor Seed Oil", "Cedarwood Oil"]'::jsonb,
  'Part hair and apply a few drops directly to the scalp. Massage for 5 minutes. Leave on for 1 hour or overnight before washing.',
  '["Stimulates healthy hair follicles", "Alleviates dry, flaky scalp", "Tames flyaways and seals split ends", "Naturally scented with rosemary and herbs"]'::jsonb,
  '["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 35, false, true, true, false
),
(
  'prod_8',
  'Botanical Ritual Discovery Gift Set',
  '4-Piece Artisanal Skincare Essentials Box',
  'all',
  2450,
  2900,
  5.0,
  88,
  'The ultimate artisanal curation featuring travel-friendly luxury sizes of our Cleanser, Rose Serum, Velvet Cream, and Midnight Oil in a keepsake presentation box.',
  '["Chamomile Cleanser (30ml)", "Rose Luminescence Serum (15ml)", "Velvet Barrier Cream (25ml)", "Midnight Recovery Oil (10ml)"]'::jsonb,
  'Follow the complete 4-step botanical routine morning and evening.',
  '["Complete 4-step holistic ritual", "Perfect luxury gift packaging", "Flight-friendly travel sizes", "Full 30-day ritual experience"]'::jsonb,
  '["https://images.unsplash.com/photo-1512290900672-1f55a746a583?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 15, true, true, true, true
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description;

-- Seed Default Customer Profile
INSERT INTO public.customers (id, name, email, phone, address, total_orders, total_spent, registered_date, status)
VALUES (
  'cust_sakib_01',
  'Sakib Ahmed',
  'mdshakib224631@gmail.com',
  '+8801700000000',
  'Banani Road 11, Block D, Dhaka 1213, Bangladesh',
  2,
  3100,
  TO_CHAR(NOW(), 'YYYY-MM-DD'),
  'Active'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone;

-- Success confirmation notice
SELECT 'Sakib''s Botanical Supabase database setup completed successfully! All tables, storage buckets, RLS policies, and initial botanical data are ready.' AS setup_result;
