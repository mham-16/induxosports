/* ============================================================
   ADMIN PANEL LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

  const loginGate = document.getElementById("login-gate");
  const panel = document.getElementById("admin-panel");
  const demoBanner = document.getElementById("demo-banner");

  if(SUPABASE_READY){
    const auth = getAuthInstance();

    const applySession = (session) => {
      if(session){
        loginGate.style.display = "none";
        panel.style.display = "block";
        boot();
      } else {
        loginGate.style.display = "block";
        panel.style.display = "none";
      }
    };

    const { data: { session } } = await auth.getSession();
    applySession(session);
    auth.onAuthStateChange((_event, session) => applySession(session));

    document.getElementById("lg-btn").addEventListener("click", async () => {
      const email = document.getElementById("lg-email").value.trim();
      const pass = document.getElementById("lg-pass").value;
      const { error } = await auth.signInWithPassword({ email, password: pass });
      if(error) showToast("Sign-in failed — check email & password.");
    });

    document.getElementById("logout-btn").addEventListener("click", () => auth.signOut());

  } else {
    // No Supabase yet -> open demo mode straight away.
    loginGate.style.display = "none";
    panel.style.display = "block";
    demoBanner.style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
    boot();
  }

  /* ---------- tabs ---------- */
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-categories").style.display = btn.dataset.tab === "categories" ? "grid" : "none";
      document.getElementById("tab-products").style.display = btn.dataset.tab === "products" ? "grid" : "none";
    });
  });

  async function boot(){
    await refreshCategoryUI();
    await refreshProductUI();
  }

  /* ---------- image preview + upload helper ---------- */
  function wireImagePreview(inputId, previewId){
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    input.addEventListener("change", () => {
      const file = input.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = () => { preview.src = reader.result; preview.style.display = "block"; };
      reader.readAsDataURL(file);
    });
  }
  wireImagePreview("cat-img-file", "cat-img-preview");
  wireImagePreview("prod-img-file", "prod-img-preview");

  /* ============================================================
     CATEGORIES
     ============================================================ */
  const catForm = document.getElementById("cat-form");
  catForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = catForm.querySelector("button[type=submit]");
    const existingImage = document.getElementById("cat-existing-img").value;
    const file = document.getElementById("cat-img-file").files[0];

    if(!file && !existingImage){
      showToast("Please choose a picture for this category.");
      return;
    }

    btn.textContent = "Saving…";
    btn.disabled = true;
    try{
      const image = file ? await uploadImage(file, "categories") : existingImage;
      const cat = {
        id: document.getElementById("cat-id").value || null,
        name: document.getElementById("cat-name").value.trim(),
        tag: document.getElementById("cat-tag").value.trim(),
        description: document.getElementById("cat-desc").value.trim(),
        image
      };
      await saveCategory(cat);
      showToast("Category saved.");
      catForm.reset();
      document.getElementById("cat-id").value = "";
      document.getElementById("cat-existing-img").value = "";
      document.getElementById("cat-img-preview").style.display = "none";
      await refreshCategoryUI();
      await refreshProductUI(); // category dropdown may have changed
    }catch(err){
      console.error(err);
      showToast("Couldn't save the category — check the console for details.");
    }
    btn.textContent = "Save Category";
    btn.disabled = false;
  });

  async function refreshCategoryUI(){
    const cats = await getCategories();
    const list = document.getElementById("cat-list");
    list.innerHTML = cats.length ? cats.map(c => `
      <div class="admin-list-item">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${c.image}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:5px;">
          <div>
            <b style="display:block;font-size:14px;">${c.name}</b>
            <span class="muted" style="font-size:12px;">${c.tag || ""}</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="ico-btn" data-edit-cat="${c.id}" title="Edit">✎</button>
          <button class="ico-btn" data-del-cat="${c.id}" title="Delete">✕</button>
        </div>
      </div>
    `).join("") : `<p class="muted" style="font-size:13px;">No categories yet — add your first one.</p>`;

    list.querySelectorAll("[data-edit-cat]").forEach(b => b.addEventListener("click", async () => {
      const c = await getCategory(b.dataset.editCat);
      document.getElementById("cat-id").value = c.id;
      document.getElementById("cat-name").value = c.name;
      document.getElementById("cat-tag").value = c.tag || "";
      document.getElementById("cat-desc").value = c.description || "";
      document.getElementById("cat-existing-img").value = c.image;
      document.getElementById("cat-img-preview").src = c.image;
      document.getElementById("cat-img-preview").style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }));
    list.querySelectorAll("[data-del-cat]").forEach(b => b.addEventListener("click", async () => {
      if(!confirm("Delete this category? Products inside it will remain but won't be linked to a visible category.")) return;
      await deleteCategory(b.dataset.delCat);
      showToast("Category deleted.");
      await refreshCategoryUI();
      await refreshProductUI();
    }));

    // populate product category dropdown
    const sel = document.getElementById("prod-cat");
    const currentVal = sel.value;
    sel.innerHTML = cats.map(c => `<option value="${c.id}">${c.name}</option>`).join("") || `<option value="">No categories yet</option>`;
    if(currentVal) sel.value = currentVal;
  }

  /* ============================================================
     PRODUCTS
     ============================================================ */
  const prodForm = document.getElementById("prod-form");
  prodForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = prodForm.querySelector("button[type=submit]");
    const existingImage = document.getElementById("prod-existing-img").value;
    const file = document.getElementById("prod-img-file").files[0];

    if(!file && !existingImage){
      showToast("Please choose a picture for this product.");
      return;
    }

    btn.textContent = "Saving…";
    btn.disabled = true;
    try{
      const image = file ? await uploadImage(file, "products") : existingImage;
      const priceVal = document.getElementById("prod-price").value;
      const prod = {
        id: document.getElementById("prod-id").value || null,
        categoryId: document.getElementById("prod-cat").value,
        name: document.getElementById("prod-name").value.trim(),
        price: priceVal ? parseFloat(priceVal) : null,
        tagLabel: document.getElementById("prod-taglabel").value.trim(),
        description: document.getElementById("prod-desc").value.trim(),
        image
      };
      await saveProduct(prod);
      showToast("Product saved.");
      prodForm.reset();
      document.getElementById("prod-id").value = "";
      document.getElementById("prod-existing-img").value = "";
      document.getElementById("prod-img-preview").style.display = "none";
      await refreshProductUI();
    }catch(err){
      console.error(err);
      showToast("Couldn't save the product — check the console for details.");
    }
    btn.textContent = "Save Product";
    btn.disabled = false;
  });

  async function refreshProductUI(){
    const [products, cats] = await Promise.all([getProducts(), getCategories()]);
    const catName = id => (cats.find(c => c.id === id) || {}).name || "Uncategorized";
    const list = document.getElementById("prod-list");
    list.innerHTML = products.length ? products.map(p => `
      <div class="admin-list-item">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${p.image}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:5px;">
          <div>
            <b style="display:block;font-size:14px;">${p.name}</b>
            <span class="muted" style="font-size:12px;">${catName(p.categoryId)}${p.price ? " · " + CURRENCY + p.price : ""}</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="ico-btn" data-edit-prod="${p.id}" title="Edit">✎</button>
          <button class="ico-btn" data-del-prod="${p.id}" title="Delete">✕</button>
        </div>
      </div>
    `).join("") : `<p class="muted" style="font-size:13px;">No products yet — add your first one.</p>`;

    list.querySelectorAll("[data-edit-prod]").forEach(b => b.addEventListener("click", async () => {
      const p = await getProduct(b.dataset.editProd);
      document.getElementById("prod-id").value = p.id;
      document.getElementById("prod-cat").value = p.categoryId;
      document.getElementById("prod-name").value = p.name;
      document.getElementById("prod-price").value = p.price;
      document.getElementById("prod-taglabel").value = p.tagLabel || "";
      document.getElementById("prod-desc").value = p.description || "";
      document.getElementById("prod-existing-img").value = p.image;
      document.getElementById("prod-img-preview").src = p.image;
      document.getElementById("prod-img-preview").style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }));
    list.querySelectorAll("[data-del-prod]").forEach(b => b.addEventListener("click", async () => {
      if(!confirm("Delete this product?")) return;
      await deleteProduct(b.dataset.delProd);
      showToast("Product deleted.");
      await refreshProductUI();
    }));
  }
});
