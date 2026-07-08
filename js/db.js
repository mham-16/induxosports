/* ============================================================
   DATA LAYER
   Same functions work whether Supabase is connected or not.
   - If SUPABASE_READY (see js/config.js): reads/writes Supabase
     (Postgres tables + Storage for images).
   - Otherwise: reads/writes a localStorage copy of the demo data,
     so /admin.html is fully clickable in preview mode, including
     image "uploads" (stored as embedded images, browser-only).
   ============================================================ */

let _sbClient = null;

function getSupabaseClient(){
  if(!SUPABASE_READY) return null;
  if(!_sbClient){
    _sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _sbClient;
}

function getAuthInstance(){
  const client = getSupabaseClient();
  return client ? client.auth : null;
}

function slugify(text){
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ---------- local (demo) storage helpers ---------- */
function _localSeed(){
  if(!localStorage.getItem("induxo_categories")){
    localStorage.setItem("induxo_categories", JSON.stringify(DEMO_CATEGORIES));
  }
  if(!localStorage.getItem("induxo_products")){
    localStorage.setItem("induxo_products", JSON.stringify(DEMO_PRODUCTS));
  }
}
function _localGet(key){ _localSeed(); return JSON.parse(localStorage.getItem(key) || "[]"); }
function _localSet(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }

/* ============================================================
   IMAGE UPLOAD
   Used by the admin panel for actual picture uploads (no URLs needed).
   ============================================================ */
function fileToDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file, folder = "products"){
  if(!file) return null;

  if(!SUPABASE_READY){
    // Demo mode: store the picture directly as an embedded image in this browser.
    return await fileToDataURL(file);
  }

  const client = getSupabaseClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await client.storage.from("images").upload(path, file, { upsert: false });
  if(error) throw error;
  const { data } = client.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

/* ============================================================
   CATEGORIES
   ============================================================ */
async function getCategories(){
  if(SUPABASE_READY){
    const { data, error } = await getSupabaseClient().from("categories").select("*").order("tag");
    if(error) throw error;
    return data;
  }
  return _localGet("induxo_categories");
}

async function getCategory(id){
  const list = await getCategories();
  return list.find(c => c.id === id) || null;
}

async function saveCategory(cat){
  if(SUPABASE_READY){
    if(!cat.id) cat.id = slugify(cat.name) + "-" + Date.now().toString(36).slice(-4);
    const { error } = await getSupabaseClient().from("categories").upsert({
      id: cat.id, name: cat.name, tag: cat.tag, description: cat.description, image: cat.image
    });
    if(error) throw error;
    return cat.id;
  }
  const list = _localGet("induxo_categories");
  if(!cat.id) cat.id = slugify(cat.name) + "-" + Date.now().toString(36).slice(-4);
  const idx = list.findIndex(c => c.id === cat.id);
  if(idx > -1) list[idx] = cat; else list.push(cat);
  _localSet("induxo_categories", list);
  return cat.id;
}

async function deleteCategory(id){
  if(SUPABASE_READY){
    const { error } = await getSupabaseClient().from("categories").delete().eq("id", id);
    if(error) throw error;
    return;
  }
  _localSet("induxo_categories", _localGet("induxo_categories").filter(c => c.id !== id));
}

/* ============================================================
   PRODUCTS
   (DB columns are snake_case; JS objects stay camelCase — mapped here)
   ============================================================ */
function _mapProductFromDb(d){
  return { id: d.id, categoryId: d.category_id, name: d.name, price: d.price, tagLabel: d.tag_label, description: d.description, image: d.image };
}

async function getProducts(categoryId){
  if(SUPABASE_READY){
    let q = getSupabaseClient().from("products").select("*");
    if(categoryId) q = q.eq("category_id", categoryId);
    const { data, error } = await q;
    if(error) throw error;
    return data.map(_mapProductFromDb);
  }
  const list = _localGet("induxo_products");
  return categoryId ? list.filter(p => p.categoryId === categoryId) : list;
}

async function getProduct(id){
  if(SUPABASE_READY){
    const { data, error } = await getSupabaseClient().from("products").select("*").eq("id", id).maybeSingle();
    if(error) throw error;
    return data ? _mapProductFromDb(data) : null;
  }
  return _localGet("induxo_products").find(p => p.id === id) || null;
}

async function saveProduct(prod){
  if(SUPABASE_READY){
    if(!prod.id) prod.id = "p-" + Date.now().toString(36).slice(-6);
    const { error } = await getSupabaseClient().from("products").upsert({
      id: prod.id, category_id: prod.categoryId, name: prod.name, price: prod.price,
      tag_label: prod.tagLabel || "", description: prod.description || "", image: prod.image
    });
    if(error) throw error;
    return prod.id;
  }
  const list = _localGet("induxo_products");
  if(!prod.id) prod.id = "p-" + Date.now().toString(36).slice(-6);
  const idx = list.findIndex(p => p.id === prod.id);
  if(idx > -1) list[idx] = prod; else list.push(prod);
  _localSet("induxo_products", list);
  return prod.id;
}

async function deleteProduct(id){
  if(SUPABASE_READY){
    const { error } = await getSupabaseClient().from("products").delete().eq("id", id);
    if(error) throw error;
    return;
  }
  _localSet("induxo_products", _localGet("induxo_products").filter(p => p.id !== id));
}

/* ============================================================
   CONTACT MESSAGES (from the contact section on index.html)
   ============================================================ */
async function saveContactMessage(msg){
  if(SUPABASE_READY){
    const { error } = await getSupabaseClient().from("messages").insert({
      name: msg.name, contact: msg.contact, message: msg.message
    });
    if(error) throw error;
    return;
  }
  const list = _localGet("induxo_messages");
  list.push({ ...msg, createdAt: new Date().toISOString() });
  _localSet("induxo_messages", list);
}
