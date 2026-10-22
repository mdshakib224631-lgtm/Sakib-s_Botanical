import { Product, HeroSlide, CategoryItem, Order, SiteSettings, CustomerUser } from '../types';
import defaultLogoImg from '../assets/images/eclat_default_logo_1786285186234.jpg';

export const INITIAL_SETTINGS: SiteSettings = {
  websiteName: "Sakib's Botanical",
  websiteLogoUrl: defaultLogoImg,
  websiteLogoText: "Sakib's",
  websiteLogoSubtext: "Botanical",
  tagline: 'Artisanal Organic Beauty',
  showAnnouncementBar: true,
  announcementText: 'Complimentary Express Shipping on Orders Over ৳1000',
  currency: 'BDT',
  currencySymbol: '৳',
  freeShippingThreshold: 1000,
  insideDhakaDeliveryCharge: 60,
  outsideDhakaDeliveryCharge: 120,
  insideDhakaLabel: 'ঢাকার ভেতরে (২৪-৪৮ ঘণ্টা)',
  outsideDhakaLabel: 'ঢাকার বাইরে (সারাদেশ ২-৩ দিন)',
  contactEmail: 'mdshakib224631@gmail.com',
  contactPhone: '+880 1700-000000',
  contactAddress: 'Banani Road 11, Block D, Dhaka 1213, Bangladesh',
  businessHours: 'Everyday: 10:00 AM - 10:00 PM',
  facebookUrl: 'https://facebook.com/eclatbotanicals',
  instagramUrl: 'https://instagram.com/eclatbotanicals',
  youtubeUrl: 'https://youtube.com/@eclatbotanicals',
  whatsappNumber: '+8801700000000',
  adminEmail: 'mdshakib224631@gmail.com',
  adminPassword: 'EclatAdmin2026!',
  accentColor: '#c97a7e',
  promoCode: 'ECLAT15',
  discountPercentage: 15,
  aboutText: 'Crafting high-performance botanical skincare and artisanal cosmetics infused with pure plant essences, cold-pressed oils, and rare floral hydrosols.',
  badge1Title: '100% Botanical Formulas',
  badge1Text: 'Artisanal plant extracts harvested sustainably without synthetic additives.',
  badge2Title: 'Leaping Bunny Certified',
  badge2Text: 'Strictly cruelty-free and vegan formula standards across our entire lineup.',
  badge3Title: 'Recyclable Glass Vessels',
  badge3Text: 'Packaged in ultraviolet biophotonic glass to preserve bio-active efficacy.',
  badge4Title: '30-Day Ritual Guarantee',
  badge4Text: 'Love your skin results or return for a full complimentary refund.',
  copyrightText: '© 2026 Éclat Botanicals Inc. All Rights Reserved. Artisanal Beauty & Organic Skincare.',
  orderSuccessMessage: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! আমাদের কাস্টমার কেয়ার প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।',
  heroSlideIntervalSeconds: 5,
};

export const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: 'usr-101',
    name: 'Sophia Laurent',
    email: 'sophia.laurent@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Beverly Hills, CA 90210',
    totalOrders: 3,
    totalSpent: 342.00,
    registeredDate: '2026-01-15',
    status: 'VIP',
  },
  {
    id: 'usr-102',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 876-5432',
    address: '450 Sutter St, San Francisco, CA 94108',
    totalOrders: 1,
    totalSpent: 96.00,
    registeredDate: '2026-02-02',
    status: 'Active',
  },
  {
    id: 'usr-103',
    name: 'Amara Vance',
    email: 'amara.vance@example.com',
    phone: '+1 (555) 432-1098',
    address: '128 W 57th St, New York, NY 10019',
    totalOrders: 2,
    totalSpent: 184.00,
    registeredDate: '2026-02-05',
    status: 'New',
  },
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'Luminous Rose Water Infusion',
    subtitle: 'Pure damask rose essence enriched with hyaluronic acid for 72-hour deep botanical hydration.',
    tag: 'NEW ARRIVAL',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Discover Elixir',
    targetCategory: 'Serums & Oils',
    accentColor: '#e8beac'
  },
  {
    id: 'hero-2',
    title: 'Velvet Satin Lip Elixirs',
    subtitle: 'Nourishing organic jojoba and berry wax formula offering rich, weightless pigmentation.',
    tag: 'BEST SELLER',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Shop Shades',
    targetCategory: 'Lip Care',
    accentColor: '#c97a7e'
  },
  {
    id: 'hero-3',
    title: 'Botanical Renewal Night Cream',
    subtitle: 'Potent bakuchiol and cold-pressed plum oil to visibly firm and rejuvenate while you rest.',
    tag: 'ECO-CERTIFIED',
    imageUrl: 'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Explore Skincare',
    targetCategory: 'Skincare',
    accentColor: '#8a9a86'
  },
  {
    id: 'hero-4',
    title: 'Artisanal Glow Bronzing Serum',
    subtitle: 'Sun-kissed luminescence infused with niacinamide and golden sea kelp extract.',
    tag: 'SUMMER SPECIAL',
    imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Shop Radiance',
    targetCategory: 'Makeup',
    accentColor: '#d4a373'
  }
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-all', name: 'All Products', slug: 'all', description: 'Browse our complete artisanal collection' },
  { id: 'cat-skincare', name: 'Skincare', slug: 'skincare', description: 'Nourishing botanical creams, moisturizers & cleansers' },
  { id: 'cat-serums', name: 'Serums & Oils', slug: 'serums', description: 'Targeted botanical treatments & glowing face oils' },
  { id: 'cat-moisturizers', name: 'Moisturizers', slug: 'moisturizers', description: 'Deep barrier moisture creams & lotions' },
  { id: 'cat-cleansers', name: 'Cleansers', slug: 'cleansers', description: 'Gentle micellar waters, balms & herbal cleansers' },
  { id: 'cat-makeup', name: 'Makeup & Glow', slug: 'makeup', description: 'Clean mineral makeup & liquid glow' },
  { id: 'cat-lipcare', name: 'Lip Care', slug: 'lipcare', description: 'Tinted balms, velvet tints & rich lip oils' },
  { id: 'cat-masks', name: 'Masks & Treatments', slug: 'masks', description: 'Rejuvenating sea berry masks & peels' },
  { id: 'cat-haircare', name: 'Hair & Body', slug: 'haircare', description: 'Herbal scalp oils & body elixirs' },
  { id: 'cat-fragrance', name: 'Fragrance', slug: 'fragrance', description: 'Handcrafted botanical perfumes & solid oils' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aura Radiance Vitamin C Serum',
    tagline: 'Brightening botanical complex with wild rosehip',
    category: 'Serums & Oils',
    price: 1450,
    originalPrice: 1750,
    rating: 4.9,
    reviewCount: 128,
    description: 'A silky concentrated serum enriched with 15% stabilized Vitamin C, organic Rosehip oil, and Ferulic acid. Restores natural radiance, fades dark spots, and shields skin against daily environmental stressors.',
    ingredients: ['15% L-Ascorbic Acid', 'Organic Rosehip Seed Oil', 'Botanical Ferulic Acid', 'Hyaluronic Acid', 'Kakadu Plum Extract'],
    howToUse: 'Apply 3-4 drops to cleansed face and neck every morning. Press gently into skin until absorbed, followed by sunscreen.',
    benefits: ['Illuminates dull complexion', 'Visibly firms fine lines', 'Deep cellular antioxidants', 'Non-comedogenic formula'],
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['All Skin Types', 'Sensitive', 'Dull'],
    inStock: true,
    stockCount: 42,
    isBestSeller: true,
    isOrganic: true,
    featured: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'prod-2',
    name: 'Velvet Satin Lipstick',
    tagline: 'Weightless pigment infused with shea butter',
    category: 'Lip Care',
    price: 850,
    originalPrice: 1050,
    rating: 4.8,
    reviewCount: 94,
    description: 'An ultra-creamy, feather-light velvet lipstick that cushions lips in moisture while delivering rich, high-impact pigment with a soft matte finish.',
    ingredients: ['Organic Shea Butter', 'Jojoba Seed Wax', 'Wild Berry Extract', 'Vitamin E', 'Natural Mineral Pigments'],
    howToUse: 'Glide directly onto lips starting from the center outward. Layer for buildable intensity.',
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
    skinTypes: ['All Skin Types'],
    inStock: true,
    stockCount: 85,
    isNew: true,
    isOrganic: true,
    featured: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'prod-3',
    name: 'Hydra-Dew Botanical Moisture Cream',
    tagline: 'Deep moisture barrier repair cream',
    category: 'Moisturizers',
    price: 1650,
    originalPrice: 1950,
    rating: 4.7,
    reviewCount: 76,
    description: 'A cloud-like whipped moisturizing cream with plant ceramides, white tea leaf extract, and squalane to lock in hydration and plump skin elasticity.',
    ingredients: ['Plant Ceramides', 'Olive Squalane', 'Organic White Tea Extract', 'Gotu Kola (Centella Asiatica)', 'Sweet Almond Oil'],
    howToUse: 'Smooth a nickel-sized amount over clean face and neck, morning and night. Warm between fingertips before applying.',
    benefits: ['Plumps dehydrated skin', 'Soothes redness & inflammation', 'Non-greasy velvety finish'],
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['Dry', 'Normal', 'Sensitive'],
    inStock: true,
    stockCount: 28,
    isBestSeller: true,
    isOrganic: true,
    featured: true,
    createdAt: '2026-01-20'
  },
  {
    id: 'prod-4',
    name: 'Celestial Dew Liquid Glow Highlighter',
    tagline: 'Sheer golden radiance for cheeks & brow bones',
    category: 'Makeup',
    price: 1150,
    originalPrice: 1350,
    rating: 4.9,
    reviewCount: 81,
    description: 'A hybrid liquid serum highlighter infused with ultra-fine pearl micro-pigments and chamomile oil. Gives a glass-skin,lit-from-within sheen without glitter.',
    ingredients: ['Camellia Flower Oil', 'Ethical Mica Pearls', 'Chamomile Hydrosol', 'Squalane'],
    howToUse: 'Dab 1-2 dots onto cheekbones, bridge of nose, and cupid\'s bow using fingertips or a damp beauty sponge.',
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
    skinTypes: ['All Skin Types'],
    inStock: true,
    stockCount: 15,
    isNew: true,
    featured: true,
    createdAt: '2026-02-05'
  },
  {
    id: 'prod-5',
    name: 'Pure Chamomile Micellar Balm Cleanser',
    tagline: 'Melts water-proof makeup and impurities gently',
    category: 'Cleansers',
    price: 950,
    originalPrice: 1150,
    rating: 4.8,
    reviewCount: 64,
    description: 'A transformative balm-to-milk cleanser crafted with blue chamomile, calendula, and seabuckthorn oil. Effortlessly dissolves cosmetics while leaving skin soft.',
    ingredients: ['Blue Chamomile Oil', 'Calendula Extract', 'Seabuckthorn Berry Oil', 'Sunflower Seed Oil'],
    howToUse: 'Massage onto dry skin to dissolve makeup. Add warm water to emulsify into a soothing milk, then rinse thoroughly.',
    benefits: ['Zero tight feeling post-cleansing', 'Removes waterproof mascara', 'Includes organic muslin cloth'],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['Sensitive', 'Dry', 'Combination'],
    inStock: true,
    stockCount: 30,
    isOrganic: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'prod-6',
    name: 'Jardin Nuit Botanical Eau de Parfum',
    tagline: 'Hand-blended jasmine, sandalwood & bergamot',
    category: 'Fragrance',
    price: 2450,
    originalPrice: 2800,
    rating: 4.9,
    reviewCount: 42,
    description: 'An ethereal scent evoking a moonlit Mediterranean garden. Opens with crisp bergamot and neroli, heart notes of night-blooming jasmine, anchored by warm sandalwood.',
    ingredients: ['Organic Grape Alcohol', 'Night Jasmine Absolute', 'Calabrian Bergamot Oil', 'Sandalwood Resin'],
    howToUse: 'Spritz onto pulse points behind ears, wrists, and collarbone. Do not rub wrists together to preserve top notes.',
    benefits: ['Clean alcohol base', 'Long-lasting 12-hour scent profile', 'Artisanal glass flask'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['All Skin Types'],
    inStock: true,
    stockCount: 19,
    isNew: true,
    createdAt: '2026-02-02'
  },
  {
    id: 'prod-7',
    name: 'Illuminating Golden Sea Berry Face Mask',
    tagline: 'Vitamin-rich radiance boosting herbal clay mask',
    category: 'Masks & Treatments',
    price: 1250,
    originalPrice: 1450,
    rating: 4.8,
    reviewCount: 53,
    description: 'Infused with golden sea buckthorn and French yellow clay to brighten and detoxify skin without stripping natural moisture.',
    ingredients: ['French Yellow Clay', 'Sea Buckthorn Berry', 'Turmeric Root Extract', 'Rose Floral Water'],
    howToUse: 'Apply an even layer for 10-15 minutes, then rinse with warm water.',
    benefits: ['Instant radiance', 'Clarifies pores without drying'],
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['All Skin Types', 'Dull', 'Oily'],
    inStock: true,
    stockCount: 25,
    isOrganic: true,
    createdAt: '2026-01-25'
  },
  {
    id: 'prod-8',
    name: 'Nectar Glow Tinted Lip Oil',
    tagline: 'High-shine botanical lip treatment',
    category: 'Lip Care',
    price: 650,
    originalPrice: 780,
    rating: 4.8,
    reviewCount: 89,
    description: 'A cushiony non-sticky lip oil infused with honey blossom nectar and raspberry seed oil for intense shine and sheer tint.',
    ingredients: ['Cold-pressed Raspberry Seed Oil', 'Honey Blossom Nectar', 'Vitamin E', 'Organic Coconut Oil'],
    howToUse: 'Apply generous coat with plush applicator whenever lips need moisture and luscious shine.',
    benefits: ['Non-tacky glaze finish', 'Drenches lips in hydration', 'Natural subtle tint'],
    images: [
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-honey', name: 'Clear Honey', hexColor: '#f7d070', inStock: true },
      { id: 'v-cherry', name: 'Cherry Blossom', hexColor: '#d64550', inStock: true },
      { id: 'v-berry-oil', name: 'Wild Fig', hexColor: '#782d3e', inStock: true }
    ],
    skinTypes: ['All Skin Types'],
    inStock: true,
    stockCount: 50,
    isOrganic: true,
    createdAt: '2026-01-28'
  },
  {
    id: 'prod-9',
    name: 'Rosemary & Mint Scalp Stimulating Elixir',
    tagline: 'Deep root nourishing botanical hair and scalp serum',
    category: 'Hair & Body',
    price: 1100,
    originalPrice: 1350,
    rating: 4.9,
    reviewCount: 67,
    description: 'A nutrient-dense scalp treatment infused with pure rosemary oil, peppermint leaf extract, biotin, and cold-pressed castor seed oil to invigorate hair follicles and encourage lustrous hair growth.',
    ingredients: ['Organic Rosemary Essential Oil', 'Peppermint Leaf Oil', 'Pure Castor Oil', 'Golden Jojoba', 'Biotin & Vitamin E'],
    howToUse: 'Part hair into sections and apply 4-6 drops directly onto the scalp. Massage thoroughly with fingertips for 3-5 minutes before washing or leave overnight.',
    benefits: ['Stimulates healthy hair roots', 'Relieves dry and flaky scalp', 'Strengthens hair strands without greasiness'],
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597263-000799965d8f?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['All Hair Types', 'Dry Scalp', 'Fine Hair'],
    inStock: true,
    stockCount: 38,
    isOrganic: true,
    isBestSeller: true,
    featured: true,
    createdAt: '2026-02-03'
  },
  {
    id: 'prod-10',
    name: 'Golden Amber Botanical Body Polish & Soufflé',
    tagline: 'Whipped shea and warm vanilla amber body butter',
    category: 'Hair & Body',
    price: 1350,
    originalPrice: 1600,
    rating: 4.8,
    reviewCount: 45,
    description: 'A decadent, whipped body butter that melts seamlessly into the skin. Infused with unrefined shea butter, sweet almond oil, and a warm botanical resin of amber and sandalwood.',
    ingredients: ['Raw Ghanaian Shea Butter', 'Virgin Coconut Oil', 'Cold-Pressed Sweet Almond Oil', 'Amber Botanical Resin'],
    howToUse: 'Massage liberally into damp skin after showering to lock in 24-hour hydration.',
    benefits: ['Deep velvet barrier moisture', 'Non-sticky whipped texture', 'Warm lingering natural fragrance'],
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['Dry', 'Very Dry', 'Normal'],
    inStock: true,
    stockCount: 22,
    isOrganic: true,
    createdAt: '2026-02-04'
  },
  {
    id: 'prod-11',
    name: 'Damask Rose & Peony Hydrating Facial Mist',
    tagline: 'Refreshing botanical hydrosol spray with hyaluronic acid',
    category: 'Skincare',
    price: 850,
    originalPrice: 990,
    rating: 4.8,
    reviewCount: 92,
    description: 'An invigorating fine mist crafted with steam-distilled organic damask rose hydrosol, French peony flower extract, and aloe vera leaf juice to soothe and hydrate throughout the day.',
    ingredients: ['Steam-distilled Damask Rose Hydrosol', 'White Peony Flower Extract', 'Aloe Barbadensis Leaf Juice', 'Hyaluronic Acid'],
    howToUse: 'Mist generously over face and neck after cleansing or anytime skin feels dehydrated or tight.',
    benefits: ['Instantly calms irritation', 'Sets makeup beautifully', '100% alcohol-free'],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['All Skin Types', 'Sensitive', 'Dehydrated'],
    inStock: true,
    stockCount: 60,
    isNew: true,
    isOrganic: true,
    featured: true,
    createdAt: '2026-02-06'
  },
  {
    id: 'prod-12',
    name: 'Gentle Matcha Green Tea Enzyme Cleanser',
    tagline: 'Purifying gentle foam with organic Japanese ceremonial matcha',
    category: 'Cleansers',
    price: 920,
    originalPrice: 1100,
    rating: 4.7,
    reviewCount: 38,
    description: 'A gentle, pH-balanced gel cleanser formulated with antioxidant-packed Uji matcha green tea, papaya enzymes, and soothing cucumber hydrosol to purify without disrupting the skin barrier.',
    ingredients: ['Ceremonial Matcha Green Tea', 'Papaya Fruit Enzyme', 'Cucumber Hydrosol', 'Plant Saponins'],
    howToUse: 'Pump 1-2 times onto wet palms. Lather into a soft foam and massage gently over damp skin, then rinse with lukewarm water.',
    benefits: ['Unclogs pores gently', 'Calms acne-prone irritation', 'Maintains skin pH 5.5'],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone', 'Sensitive'],
    inStock: true,
    stockCount: 35,
    isOrganic: true,
    createdAt: '2026-01-18'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    customerName: 'Sophia Montgomery',
    email: 'sophia.m@example.com',
    customerPhone: '+880 1711-000001',
    items: [
      { productName: 'Aura Radiance Vitamin C Serum', quantity: 1, price: 68 },
      { productName: 'Velvet Satin Lipstick', variantName: 'Dusty Rose', quantity: 2, price: 34 }
    ],
    totalAmount: 136,
    status: 'Shipped',
    date: '2026-08-08',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR'
  },
  {
    id: 'ORD-8922',
    customerName: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    customerPhone: '+880 1711-000002',
    items: [
      { productName: 'Hydra-Dew Botanical Cream', quantity: 1, price: 56 },
      { productName: 'Jardin Nuit Botanical Eau de Parfum', quantity: 1, price: 95 }
    ],
    totalAmount: 151,
    status: 'Processing',
    date: '2026-08-09',
    shippingAddress: '128 Fifth Ave, Suite 4B, New York, NY'
  }
];
