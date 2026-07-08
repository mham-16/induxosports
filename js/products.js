/* ============================================================
   RENDERING HELPERS — categories & products
   ============================================================ */

function categoryCardHTML(cat, i){
  return `
    <a href="category.html?id=${encodeURIComponent(cat.id)}" class="cat-card reveal" style="--i:${i}">
      <img src="${cat.image}" alt="${cat.name}" loading="lazy">
      <span class="cat-badge">${cat.tag || String(i+1).padStart(2,"0")}</span>
      <div class="cat-info">
        <h3>${cat.name}</h3>
        <p>${cat.description || ""}</p>
      </div>
      <span class="cat-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>
      </span>
    </a>
  `;
}

function productCardHTML(p){
  return `
    <div class="product-card reveal" id="${p.id}">
      <div class="product-media">
        ${p.tagLabel ? `<span class="product-tag">${p.tagLabel}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-body">
        <h4>${p.name}</h4>
        <p class="product-desc">${p.description || ""}</p>
        <div class="buy-row">
          <button class="btn buy-btn buy-btn-ig" data-buy-ig="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            Instagram
          </button>
          <button class="btn buy-btn buy-btn-wa" data-buy-wa="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12a8 8 0 1 1-3.6-6.7"/><path d="M20 4 12 12"/></svg>
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;
}

function wireBuyButtons(products){
  document.querySelectorAll("[data-buy-ig]").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = products.find(p => p.id === btn.dataset.buyIg);
      if(product) buyOnInstagram(product);
    });
  });
  document.querySelectorAll("[data-buy-wa]").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = products.find(p => p.id === btn.dataset.buyWa);
      if(product) buyOnWhatsApp(product);
    });
  });
}

/* ---------- Category grid (categories.html + home featured) ---------- */
async function mountCategoryGrid(selector, opts = {}){
  const mount = document.querySelector(selector);
  if(!mount) return;
  const cats = await getCategories();
  const list = opts.limit ? cats.slice(0, opts.limit) : cats;

  if(!list.length){
    mount.innerHTML = `
      <div class="empty-state">
        <h3>No categories yet</h3>
        <p>Add your first category from the <a href="admin.html" style="color:var(--orange)">admin panel</a>.</p>
      </div>`;
    return;
  }
  mount.innerHTML = list.map((c,i) => categoryCardHTML(c,i)).join("");
  setupScrollReveal();
}

/* ---------- Single category page (category.html?id=) ---------- */
async function mountCategoryPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const heading = document.getElementById("cat-heading");
  const desc = document.getElementById("cat-desc");
  const grid = document.getElementById("product-grid");
  const bannerImg = document.getElementById("cat-banner-img");

  if(!id){ window.location.href = "categories.html"; return; }

  const cat = await getCategory(id);
  if(!cat){
    heading.textContent = "Category not found";
    desc.textContent = "It may have been renamed or removed.";
    grid.innerHTML = `<div class="empty-state"><h3>Nothing here</h3><p><a href="categories.html" style="color:var(--orange)">Back to all categories</a></p></div>`;
    return;
  }

  document.title = cat.name + " — Induxo Sports";
  heading.textContent = cat.name;
  desc.textContent = cat.description || "";
  if(bannerImg) bannerImg.style.backgroundImage = `url('${cat.image}')`;

  const products = await getProducts(cat.id);
  if(!products.length){
    grid.innerHTML = `<div class="empty-state"><h3>No products yet</h3><p>Add products to this category from the <a href="admin.html" style="color:var(--orange)">admin panel</a>.</p></div>`;
    return;
  }
  grid.innerHTML = products.map(productCardHTML).join("");
  setupScrollReveal();
  wireBuyButtons(products);
}
