/* ============================================================
   INDUXO SPORTS — SITE CONFIG
   Edit the values below. Nothing else needs to change.
   ============================================================ */

// 1) Your Instagram username (no @) — the Buy button opens a DM to this account.
const INSTAGRAM_USERNAME = "induxo_sports";

// 1b) Your WhatsApp number, digits only, with country code, no + or spaces
//     e.g. UK number +44 7911 123456 -> "447911123456"
const WHATSAPP_NUMBER = "923246189428";

// 2) Currency symbol shown next to prices.
const CURRENCY = "$";

// 3) Supabase project config (free plan, no card required).
//    Get these from: Supabase Dashboard -> your project -> Project Settings -> API.
//    - SUPABASE_URL is the "Project URL"
//    - SUPABASE_ANON_KEY is the "anon public" key (safe to use in front-end code)
//    Until you paste real values here, the site automatically runs on the
//    built-in demo data in js/data.js, so you can preview everything immediately.
const SUPABASE_URL = "https://adwqjiivspfhxfzehtfq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_inMVeCKKSY1YhyZkvcEPDA_7HEB91pQ";

// Detects whether real Supabase keys have been entered yet.
const SUPABASE_READY = SUPABASE_URL && !SUPABASE_URL.startsWith("PASTE");
