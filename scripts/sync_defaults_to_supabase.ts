import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qopjbhmmznorkynqdhoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGpiaG1tem5vcmt5bnFkaG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxOTU5NDYsImV4cCI6MjEwNzc3MTk0Nn0.mqerptGJ4nefZOd33vTH2ZFRygh7GtYUzag-V8oBUIY';

const supabase = createClient(supabaseUrl, supabaseKey);

// 1. SITE SETTINGS
const siteSettings = {
  id: 'global',
  website_name: "Sakib's Botanical",
  website_logo_text: "Sakib's",
  website_logo_subtext: "Botanical",
  website_logo_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&auto=format&fit=crop&q=80",
  tagline: "Artisanal Organic Beauty",
  currency: "BDT",
  currency_symbol: "৳",
  show_announcement_bar: true,
  announcement_text: "Complimentary Express Shipping on Orders Over ৳1000 | Code: ECLAT15 for 15% OFF",
  promo_code: "ECLAT15",
  discount_percentage: 15,
  free_shipping_threshold: 1000,
  inside_dhaka_delivery_charge: 60,
  outside_dhaka_delivery_charge: 120,
  inside_dhaka_label: "ঢাকার ভেতরে (২৪-৪৮ ঘণ্টা)",
  outside_dhaka_label: "ঢাকার বাইরে (সারাদেশ ২-৩ দিন)",
  contact_email: "mdshakib224631@gmail.com",
  contact_phone: "+880 1700-000000",
  contact_address: "Banani Road 11, Block D, Dhaka 1213, Bangladesh",
  business_hours: "Everyday: 10:00 AM - 10:00 PM",
  facebook_url: "https://facebook.com/sakibsbotanical",
  instagram_url: "https://instagram.com/sakibsbotanical",
  youtube_url: "https://youtube.com/@sakibsbotanical",
  whatsapp_number: "+8801700000000",
  admin_email: "mdshakib224631@gmail.com",
  admin_password: "EclatAdmin2026!",
  accent_color: "#c97a7e",
  about_text: "Crafting high-performance botanical skincare and artisanal cosmetics infused with pure plant essences, cold-pressed oils, and rare floral hydrosols.",
  categories: ["Skincare", "Serums & Oils", "Moisturizers", "Cleansers", "Makeup", "Lip Care", "Masks & Treatments", "Hair & Body", "Fragrance"],
  badge1_title: "100% Botanical Formulas",
  badge1_text: "Artisanal plant extracts harvested sustainably without synthetic additives.",
  badge2_title: "Leaping Bunny Certified",
  badge2_text: "Strictly cruelty-free and vegan formula standards across our entire lineup.",
  badge3_title: "Recyclable Glass Vessels",
  badge3_text: "Packaged in ultraviolet biophotonic glass to preserve bio-active efficacy.",
  badge4_title: "30-Day Ritual Guarantee",
  badge4_text: "Love your skin results or return for a full complimentary refund.",
  copyright_text: "© 2026 Sakib's Botanical. All Rights Reserved. Artisanal Beauty & Organic Skincare.",
  order_success_message: "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! আমাদের কাস্টমার কেয়ার প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।",
  hero_slide_interval_seconds: 5,
};

// 2. CATEGORIES
const categories = [
  { id: 'cat-all', name: 'All Products', slug: 'all', icon_name: 'Sparkles', description: 'Browse our complete artisanal collection' },
  { id: 'cat-skincare', name: 'Skincare', slug: 'skincare', icon_name: 'Sparkles', description: 'Nourishing botanical creams, moisturizers & cleansers' },
  { id: 'cat-serums', name: 'Serums & Oils', slug: 'serums', icon_name: 'FlaskConical', description: 'Targeted botanical treatments & glowing face oils' },
  { id: 'cat-moisturizers', name: 'Moisturizers', slug: 'moisturizers', icon_name: 'Droplets', description: 'Deep barrier moisture creams & lotions' },
  { id: 'cat-cleansers', name: 'Cleansers', slug: 'cleansers', icon_name: 'Wind', description: 'Gentle micellar waters, balms & herbal cleansers' },
  { id: 'cat-makeup', name: 'Makeup & Glow', slug: 'makeup', icon_name: 'Sun', description: 'Clean mineral makeup & liquid glow' },
  { id: 'cat-lipcare', name: 'Lip Care', slug: 'lipcare', icon_name: 'Sparkles', description: 'Tinted balms, velvet tints & rich lip oils' },
  { id: 'cat-masks', name: 'Masks & Treatments', slug: 'masks', icon_name: 'Moon', description: 'Rejuvenating sea berry masks & peels' },
  { id: 'cat-haircare', name: 'Hair & Body', slug: 'haircare', icon_name: 'Sun', description: 'Herbal scalp oils & body elixirs' },
  { id: 'cat-fragrance', name: 'Fragrance', slug: 'fragrance', icon_name: 'FlaskConical', description: 'Handcrafted botanical perfumes & solid oils' }
];

// 3. HERO SLIDES
const heroSlides = [
  {
    id: 'hero-1',
    title: 'Luminous Rose Water Infusion',
    subtitle: 'Pure damask rose essence enriched with hyaluronic acid for 72-hour deep botanical hydration.',
    tag: 'NEW ARRIVAL',
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
    button_text: 'Discover Elixir',
    target_category: 'Serums & Oils',
    accent_color: '#e8beac'
  },
  {
    id: 'hero-2',
    title: 'Velvet Satin Lip Elixirs',
    subtitle: 'Nourishing organic jojoba and berry wax formula offering rich, weightless pigmentation.',
    tag: 'BEST SELLER',
    image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1600&q=80',
    button_text: 'Shop Shades',
    target_category: 'Lip Care',
    accent_color: '#c97a7e'
  },
  {
    id: 'hero-3',
    title: 'Botanical Renewal Night Cream',
    subtitle: 'Potent bakuchiol and cold-pressed plum oil to visibly firm and rejuvenate while you rest.',
    tag: 'ECO-CERTIFIED',
    image_url: 'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=1600&q=80',
    button_text: 'Explore Skincare',
    target_category: 'Skincare',
    accent_color: '#8a9a86'
  },
  {
    id: 'hero-4',
    title: 'Artisanal Glow Bronzing Serum',
    subtitle: 'Sun-kissed luminescence infused with niacinamide and golden sea kelp extract.',
    tag: 'SUMMER SPECIAL',
    image_url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1600&q=80',
    button_text: 'Shop Radiance',
    target_category: 'Makeup',
    accent_color: '#d4a373'
  }
];

// 4. PRODUCTS (12 Botanical Products)
const products: any[] = [
  {
    id: 'prod-1',
    name: 'Aura Radiance Vitamin C Serum',
    tagline: 'Brightening botanical complex with wild rosehip',
    category: 'Serums & Oils',
    price: 1450,
    original_price: 1750,
    rating: 4.9,
    review_count: 128,
    description: 'A silky concentrated serum enriched with 15% stabilized Vitamin C, organic Rosehip oil, and Ferulic acid. Restores natural radiance, fades dark spots, and shields skin against daily environmental stressors.',
    ingredients: ['15% L-Ascorbic Acid', 'Organic Rosehip Seed Oil', 'Botanical Ferulic Acid', 'Hyaluronic Acid', 'Kakadu Plum Extract'],
    how_to_use: 'Apply 3-4 drops to cleansed face and neck every morning. Press gently into skin until absorbed, followed by sunscreen.',
    benefits: ['Illuminates dull complexion', 'Visibly firms fine lines', 'Deep cellular antioxidants', 'Non-comedogenic formula'],
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['All Skin Types', 'Sensitive', 'Dull'],
    in_stock: true,
    stock_count: 42,
    is_bestseller: true,
    is_organic: true,
    featured: true,
    is_new: false,
    created_at: '2026-01-15'
  },
  {
    id: 'prod-2',
    name: 'Velvet Satin Lipstick',
    tagline: 'Weightless pigment infused with shea butter',
    category: 'Lip Care',
    price: 850,
    original_price: 1050,
    rating: 4.8,
    review_count: 94,
    description: 'An ultra-creamy, feather-light velvet lipstick that cushions lips in moisture while delivering rich, high-impact pigment with a soft matte finish.',
    ingredients: ['Organic Shea Butter', 'Jojoba Seed Wax', 'Wild Berry Extract', 'Vitamin E', 'Natural Mineral Pigments'],
    how_to_use: 'Glide directly onto lips starting from the center outward. Layer for buildable intensity.',
    benefits: ['8-hour hydrating wear', 'Comfortable matte feel', '100% natural wax base', 'Feather-resistant formula'],
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-rose', name: 'Dusty Rose', hexColor: '#c97a7e', inStock: true },
      { id: 'v-berry', name: 'Plum Nectar', hexColor: '#8a3b53', inStock: true },
      { id: 'v-nude', name: 'Warm Terracotta', hexColor: '#bd6a53', inStock: true },
      { id: 'v-coral', name: 'Petal Coral', hexColor: '#e07a5f', inStock: true }
    ],
    skin_types: ['All Skin Types'],
    in_stock: true,
    stock_count: 85,
    is_new: true,
    is_organic: true,
    featured: true,
    is_bestseller: false,
    created_at: '2026-02-01'
  },
  {
    id: 'prod-3',
    name: 'Hydra-Dew Botanical Moisture Cream',
    tagline: 'Deep moisture barrier repair cream',
    category: 'Moisturizers',
    price: 1650,
    original_price: 1950,
    rating: 4.7,
    review_count: 76,
    description: 'A cloud-like whipped moisturizing cream with plant ceramides, white tea leaf extract, and squalane to lock in hydration and plump skin elasticity.',
    ingredients: ['Plant Ceramides', 'Olive Squalane', 'Organic White Tea Extract', 'Gotu Kola (Centella Asiatica)', 'Sweet Almond Oil'],
    how_to_use: 'Smooth a nickel-sized amount over clean face and neck, morning and night. Warm between fingertips before applying.',
    benefits: ['Plumps dehydrated skin', 'Soothes redness & inflammation', 'Non-greasy velvety finish'],
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['Dry', 'Normal', 'Sensitive'],
    in_stock: true,
    stock_count: 28,
    is_bestseller: true,
    is_organic: true,
    featured: true,
    is_new: false,
    created_at: '2026-01-20'
  },
  {
    id: 'prod-4',
    name: 'Celestial Dew Liquid Glow Highlighter',
    tagline: 'Sheer golden radiance for cheeks & brow bones',
    category: 'Makeup',
    price: 1150,
    original_price: 1350,
    rating: 4.9,
    review_count: 81,
    description: 'A hybrid liquid serum highlighter infused with ultra-fine pearl micro-pigments and chamomile oil. Gives a glass-skin, lit-from-within sheen without glitter.',
    ingredients: ['Camellia Flower Oil', 'Ethical Mica Pearls', 'Chamomile Hydrosol', 'Squalane'],
    how_to_use: 'Dab 1-2 dots onto cheekbones, bridge of nose, and cupid\'s bow using fingertips or a damp beauty sponge.',
    benefits: ['Glass skin finish', 'Blends seamlessly over makeup or bare skin', 'Lightweight non-sticky oil base'],
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-champagne', name: 'Champagne Pearl', hexColor: '#f3e8d2', inStock: true },
      { id: 'v-rose-gold', name: 'Blush Gold', hexColor: '#e8c5b5', inStock: true },
      { id: 'v-bronze', name: 'Sunlit Bronze', hexColor: '#cfa683', inStock: true }
    ],
    skin_types: ['All Skin Types'],
    in_stock: true,
    stock_count: 15,
    is_new: true,
    featured: true,
    is_bestseller: false,
    is_organic: false,
    created_at: '2026-02-05'
  },
  {
    id: 'prod-5',
    name: 'Pure Chamomile Micellar Balm Cleanser',
    tagline: 'Melts water-proof makeup and impurities gently',
    category: 'Cleansers',
    price: 950,
    original_price: 1150,
    rating: 4.8,
    review_count: 64,
    description: 'A transformative balm-to-milk cleanser crafted with blue chamomile, calendula, and seabuckthorn oil. Effortlessly dissolves cosmetics while leaving skin soft.',
    ingredients: ['Blue Chamomile Oil', 'Calendula Extract', 'Seabuckthorn Berry Oil', 'Sunflower Seed Oil'],
    how_to_use: 'Massage onto dry skin to dissolve makeup. Add warm water to emulsify into a soothing milk, then rinse thoroughly.',
    benefits: ['Zero tight feeling post-cleansing', 'Removes waterproof mascara', 'Includes organic muslin cloth'],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['Sensitive', 'Dry', 'Combination'],
    in_stock: true,
    stock_count: 30,
    is_organic: true,
    is_new: false,
    is_bestseller: false,
    featured: false,
    created_at: '2026-01-10'
  },
  {
    id: 'prod-6',
    name: 'Jardin Nuit Botanical Eau de Parfum',
    tagline: 'Hand-blended jasmine, sandalwood & bergamot',
    category: 'Fragrance',
    price: 2450,
    original_price: 2800,
    rating: 4.9,
    review_count: 42,
    description: 'An ethereal scent evoking a moonlit Mediterranean garden. Opens with crisp bergamot and neroli, heart notes of night-blooming jasmine, anchored by warm sandalwood.',
    ingredients: ['Organic Grape Alcohol', 'Night Jasmine Absolute', 'Calabrian Bergamot Oil', 'Sandalwood Resin'],
    how_to_use: 'Spritz onto pulse points behind ears, wrists, and collarbone. Do not rub wrists together to preserve top notes.',
    benefits: ['Clean alcohol base', 'Long-lasting 12-hour scent profile', 'Artisanal glass flask'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['All Skin Types'],
    in_stock: true,
    stock_count: 19,
    is_new: true,
    is_bestseller: false,
    is_organic: false,
    featured: false,
    created_at: '2026-02-02'
  },
  {
    id: 'prod-7',
    name: 'Illuminating Golden Sea Berry Face Mask',
    tagline: 'Vitamin-rich radiance boosting herbal clay mask',
    category: 'Masks & Treatments',
    price: 1250,
    original_price: 1450,
    rating: 4.8,
    review_count: 53,
    description: 'Infused with golden sea buckthorn and French yellow clay to brighten and detoxify skin without stripping natural moisture.',
    ingredients: ['French Yellow Clay', 'Sea Buckthorn Berry', 'Turmeric Root Extract', 'Rose Floral Water'],
    how_to_use: 'Apply an even layer for 10-15 minutes, then rinse with warm water.',
    benefits: ['Instant radiance', 'Clarifies pores without drying'],
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['All Skin Types', 'Dull', 'Oily'],
    in_stock: true,
    stock_count: 25,
    is_organic: true,
    is_new: false,
    is_bestseller: false,
    featured: false,
    created_at: '2026-01-25'
  },
  {
    id: 'prod-8',
    name: 'Nectar Glow Tinted Lip Oil',
    tagline: 'High-shine botanical lip treatment',
    category: 'Lip Care',
    price: 650,
    original_price: 780,
    rating: 4.8,
    review_count: 89,
    description: 'A cushiony non-sticky lip oil infused with honey blossom nectar and raspberry seed oil for intense shine and sheer tint.',
    ingredients: ['Cold-pressed Raspberry Seed Oil', 'Honey Blossom Nectar', 'Vitamin E', 'Organic Coconut Oil'],
    how_to_use: 'Apply generous coat with plush applicator whenever lips need moisture and luscious shine.',
    benefits: ['Non-tacky glaze finish', 'Drenches lips in hydration', 'Natural subtle tint'],
    images: [
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-honey', name: 'Clear Honey', hexColor: '#f7d070', inStock: true },
      { id: 'v-cherry', name: 'Cherry Blossom', hexColor: '#d64550', inStock: true },
      { id: 'v-berry-oil', name: 'Wild Fig', hexColor: '#782d3e', inStock: true }
    ],
    skin_types: ['All Skin Types'],
    in_stock: true,
    stock_count: 50,
    is_organic: true,
    is_new: false,
    is_bestseller: false,
    featured: false,
    created_at: '2026-01-28'
  },
  {
    id: 'prod-9',
    name: 'Rosemary & Mint Scalp Stimulating Elixir',
    tagline: 'Deep root nourishing botanical hair and scalp serum',
    category: 'Hair & Body',
    price: 1100,
    original_price: 1350,
    rating: 4.9,
    review_count: 67,
    description: 'A nutrient-dense scalp treatment infused with pure rosemary oil, peppermint leaf extract, biotin, and cold-pressed castor seed oil to invigorate hair follicles and encourage lustrous hair growth.',
    ingredients: ['Organic Rosemary Essential Oil', 'Peppermint Leaf Oil', 'Pure Castor Oil', 'Golden Jojoba', 'Biotin & Vitamin E'],
    how_to_use: 'Part hair into sections and apply 4-6 drops directly onto the scalp. Massage thoroughly with fingertips for 3-5 minutes before washing or leave overnight.',
    benefits: ['Stimulates healthy hair roots', 'Relieves dry and flaky scalp', 'Strengthens hair strands without greasiness'],
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['All Hair Types', 'Dry Scalp', 'Fine Hair'],
    in_stock: true,
    stock_count: 38,
    is_organic: true,
    is_bestseller: true,
    featured: true,
    is_new: false,
    created_at: '2026-02-03'
  },
  {
    id: 'prod-10',
    name: 'Golden Amber Botanical Body Polish & Soufflé',
    tagline: 'Whipped shea and warm vanilla amber body butter',
    category: 'Hair & Body',
    price: 1350,
    original_price: 1600,
    rating: 4.8,
    review_count: 45,
    description: 'A decadent, whipped body butter that melts seamlessly into the skin. Infused with unrefined shea butter, sweet almond oil, and a warm botanical resin of amber and sandalwood.',
    ingredients: ['Raw Ghanaian Shea Butter', 'Virgin Coconut Oil', 'Cold-Pressed Sweet Almond Oil', 'Amber Botanical Resin'],
    how_to_use: 'Massage liberally into damp skin after showering to lock in 24-hour hydration.',
    benefits: ['Deep velvet barrier moisture', 'Non-sticky whipped texture', 'Warm lingering natural fragrance'],
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['Dry', 'Very Dry', 'Normal'],
    in_stock: true,
    stock_count: 22,
    is_organic: true,
    is_new: false,
    is_bestseller: false,
    featured: false,
    created_at: '2026-02-04'
  },
  {
    id: 'prod-11',
    name: 'Damask Rose & Peony Hydrating Facial Mist',
    tagline: 'Refreshing botanical hydrosol spray with hyaluronic acid',
    category: 'Skincare',
    price: 850,
    original_price: 990,
    rating: 4.8,
    review_count: 92,
    description: 'An invigorating fine mist crafted with steam-distilled organic damask rose hydrosol, French peony flower extract, and aloe vera leaf juice to soothe and hydrate throughout the day.',
    ingredients: ['Steam-distilled Damask Rose Hydrosol', 'White Peony Flower Extract', 'Aloe Barbadensis Leaf Juice', 'Hyaluronic Acid'],
    how_to_use: 'Mist generously over face and neck after cleansing or anytime skin feels dehydrated or tight.',
    benefits: ['Instantly calms irritation', 'Sets makeup beautifully', '100% alcohol-free'],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['All Skin Types', 'Sensitive', 'Dehydrated'],
    in_stock: true,
    stock_count: 60,
    is_new: true,
    is_organic: true,
    featured: true,
    is_bestseller: false,
    created_at: '2026-02-06'
  },
  {
    id: 'prod-12',
    name: 'Gentle Matcha Green Tea Enzyme Cleanser',
    tagline: 'Purifying gentle foam with organic Japanese ceremonial matcha',
    category: 'Cleansers',
    price: 920,
    original_price: 1100,
    rating: 4.7,
    review_count: 38,
    description: 'A gentle, pH-balanced gel cleanser formulated with antioxidant-packed Uji matcha green tea, papaya enzymes, and soothing cucumber hydrosol to purify without disrupting the skin barrier.',
    ingredients: ['Ceremonial Matcha Green Tea', 'Papaya Fruit Enzyme', 'Cucumber Hydrosol', 'Plant Saponins'],
    how_to_use: 'Pump 1-2 times onto wet palms. Lather into a soft foam and massage gently over damp skin, then rinse with lukewarm water.',
    benefits: ['Unclogs pores gently', 'Calms acne-prone irritation', 'Maintains skin pH 5.5'],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types: ['Oily', 'Combination', 'Acne-Prone', 'Sensitive'],
    in_stock: true,
    stock_count: 35,
    is_organic: true,
    is_new: false,
    is_bestseller: false,
    featured: false,
    created_at: '2026-01-18'
  }
];

// 5. CUSTOMERS
const customers = [
  {
    id: 'usr-101',
    name: 'Sophia Laurent',
    email: 'sophia.laurent@example.com',
    phone: '+880 1711-234567',
    address: 'House 12, Road 4, Dhanmondi, Dhaka 1205',
    total_orders: 3,
    total_spent: 3420.00,
    registered_date: '2026-01-15',
    status: 'VIP'
  },
  {
    id: 'usr-102',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+880 1812-345678',
    address: 'Road 11, Block D, Banani, Dhaka 1213',
    total_orders: 1,
    total_spent: 960.00,
    registered_date: '2026-02-02',
    status: 'Active'
  },
  {
    id: 'usr-103',
    name: 'Amara Vance',
    email: 'amara.vance@example.com',
    phone: '+880 1913-456789',
    address: 'GEC Circle, Nasirabad, Chattogram',
    total_orders: 2,
    total_spent: 1840.00,
    registered_date: '2026-02-05',
    status: 'New'
  },
  {
    id: 'cust_sakib_01',
    name: 'Sakib Ahmed',
    email: 'mdshakib224631@gmail.com',
    phone: '+8801700000000',
    address: 'Banani Road 11, Block D, Dhaka 1213, Bangladesh',
    total_orders: 5,
    total_spent: 7500.00,
    registered_date: '2026-01-01',
    status: 'VIP'
  }
];

// 6. ORDERS
const orders = [
  {
    id: 'ORD-8921',
    customer_id: 'usr-101',
    customer_name: 'Sophia Laurent',
    email: 'sophia.laurent@example.com',
    customer_phone: '+880 1711-234567',
    items: [
      { productName: 'Aura Radiance Vitamin C Serum', quantity: 1, price: 1450 },
      { productName: 'Velvet Satin Lipstick', variantName: 'Dusty Rose', quantity: 1, price: 850 }
    ],
    total_amount: 2360,
    delivery_area: 'inside_dhaka',
    delivery_charge: 60,
    payment_method: 'Cash on Delivery (COD)',
    status: 'Processing',
    date: '2026-02-18',
    shipping_address: 'House 12, Road 4, Dhanmondi, Dhaka 1205',
    customer_notes: 'Please call before delivery'
  },
  {
    id: 'ORD-8922',
    customer_id: 'usr-102',
    customer_name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    customer_phone: '+880 1812-345678',
    items: [
      { productName: 'Hydra-Dew Botanical Moisture Cream', quantity: 1, price: 1650 },
      { productName: 'Damask Rose & Peony Hydrating Facial Mist', quantity: 1, price: 850 }
    ],
    total_amount: 2560,
    delivery_area: 'inside_dhaka',
    delivery_charge: 60,
    payment_method: 'Cash on Delivery (COD)',
    status: 'Shipped',
    date: '2026-02-19',
    shipping_address: 'Road 11, Block D, Banani, Dhaka 1213',
    customer_notes: 'Urgent delivery requested'
  }
];

// 7. PROMO CODES
const promoCodes = [
  { id: 'promo_sakib10', code: 'SAKIB10', discount_percentage: 10, min_order_amount: 500, is_active: true },
  { id: 'promo_eclat15', code: 'ECLAT15', discount_percentage: 15, min_order_amount: 1000, is_active: true },
  { id: 'promo_botanical20', code: 'BOTANICAL20', discount_percentage: 20, min_order_amount: 1500, is_active: true },
];

async function runSync() {
  console.log('🚀 Synchronizing all default data directly into Supabase Cloud...');
  console.log('Database URL:', supabaseUrl);

  // 1. Site Settings
  console.log('\n[1/7] Syncing Site Settings...');
  const { error: settingsErr } = await supabase.from('site_settings').upsert(siteSettings);
  if (settingsErr) {
    console.error('Settings error:', settingsErr.message);
  } else {
    console.log('✅ Site Settings synced (id: global, name: "Sakib\'s Botanical", interval: 5s)');
  }

  // 2. Categories
  console.log('\n[2/7] Syncing Categories...');
  for (const cat of categories) {
    const { error: catErr } = await supabase.from('categories').upsert(cat);
    if (catErr) {
      console.error(`Category ${cat.name} error:`, catErr.message);
    } else {
      console.log(`✅ Category [${cat.name}] synced (${cat.slug})`);
    }
  }

  // 3. Hero Slides
  console.log('\n[3/7] Syncing Hero Slides...');
  for (const slide of heroSlides) {
    const { error: slideErr } = await supabase.from('hero_slides').upsert(slide);
    if (slideErr) {
      console.error(`Slide ${slide.title} error:`, slideErr.message);
    } else {
      console.log(`✅ Hero Slide [${slide.title}] synced`);
    }
  }

  // 4. Products
  console.log('\n[4/7] Syncing Products...');
  for (const prod of products) {
    const { error: prodErr } = await supabase.from('products').upsert(prod);
    if (prodErr) {
      console.error(`Product ${prod.name} error:`, prodErr.message);
    } else {
      console.log(`✅ Product [${prod.name}] synced (Price: ৳${prod.price}, Stock: ${prod.stock_count})`);
    }
  }

  // 5. Customers
  console.log('\n[5/7] Syncing Customers...');
  for (const cust of customers) {
    const { error: custErr } = await supabase.from('customers').upsert(cust);
    if (custErr) {
      console.error(`Customer ${cust.name} error:`, custErr.message);
    } else {
      console.log(`✅ Customer [${cust.name}] synced (${cust.email})`);
    }
  }

  // 6. Orders
  console.log('\n[6/7] Syncing Demo Orders...');
  for (const ord of orders) {
    const { error: ordErr } = await supabase.from('orders').upsert(ord);
    if (ordErr) {
      console.error(`Order ${ord.id} error:`, ordErr.message);
    } else {
      console.log(`✅ Order [${ord.id}] synced (৳${ord.total_amount})`);
    }
  }

  // 7. Promo Codes
  console.log('\n[7/7] Syncing Promo Codes...');
  for (const promo of promoCodes) {
    const { error: promoErr } = await supabase.from('promo_codes').upsert(promo);
    if (promoErr) {
      console.error(`Promo ${promo.code} error:`, promoErr.message);
    } else {
      console.log(`✅ Promo Code [${promo.code}] synced (${promo.discount_percentage}%)`);
    }
  }

  console.log('\n✨ ALL DEFAULT DATA SUCCESSFULLY SYNCED INTO SUPABASE! ✨\n');
}

runSync().catch(console.error);
