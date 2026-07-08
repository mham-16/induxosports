/* ============================================================
   DEMO DATA — used automatically until you connect Supabase
   (see js/config.js). Replace/add through /admin.html once
   Supabase is connected, or edit this file directly for now.
   ============================================================ */

const DEMO_CATEGORIES = [
  {
    id: "training-tees",
    name: "Training Tees",
    tag: "01",
    description: "Breathable performance tees for daily training.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "track-jackets",
    name: "Track Jackets",
    tag: "02",
    description: "Lightweight zip jackets, built for warm-ups and travel.",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "shorts",
    name: "Performance Shorts",
    tag: "03",
    description: "Four-way stretch shorts for match day and training.",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "footwear",
    name: "Footwear",
    tag: "04",
    description: "Imported cleats and trainers, sized for every squad.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop"
  }
];

const DEMO_PRODUCTS = [
  {
    id: "tt-001",
    categoryId: "training-tees",
    name: "Momentum Dry-Fit Tee",
    price: 24,
    tagLabel: "New",
    description: "Moisture-wicking mesh tee with raglan sleeves. Imported, true-to-size fit.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "tt-002",
    categoryId: "training-tees",
    name: "Halfback Training Tee",
    price: 21,
    tagLabel: "Bestseller",
    description: "Classic crew-neck training tee with reinforced stitching.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "tj-001",
    categoryId: "track-jackets",
    name: "Runline Zip Jacket",
    price: 46,
    tagLabel: "New",
    description: "Full-zip track jacket with side pockets and ribbed cuffs.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "sh-001",
    categoryId: "shorts",
    name: "Apex Match Shorts",
    price: 19,
    tagLabel: "Import",
    description: "Lightweight shorts with inner brief and drawcord waist.",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "fw-001",
    categoryId: "footwear",
    name: "Groundstrike Cleats",
    price: 58,
    tagLabel: "Limited",
    description: "Firm-ground cleats with a molded outsole for quick cuts.",
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=900&auto=format&fit=crop"
  }
];
