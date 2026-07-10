/* ============================================================
   SHARED HEADER / FOOTER / LOADER
   Every page includes <div id="site-header"></div> and
   <div id="site-footer"></div> — this file fills them in,
   so navigation only has to be edited in one place.
   ============================================================ */

const NAV_LINKS = [
  { href: "index.html#home",       label: "Home",       key: "home" },
  { href: "index.html#about",      label: "About",       key: "about" },
  { href: "index.html#categories", label: "Categories",  key: "categories" },
  { href: "index.html#contact",    label: "Contact",     key: "contact" }
];

function renderHeader(){
  const mount = document.getElementById("site-header");
  if(!mount) return;
  const current = document.body.dataset.page;
  mount.innerHTML = `
    <div class="wrap header-row">
      <a href="index.html" class="brand">INDUXO<span>.</span>SPORTS</a>
      <nav class="nav-links" id="nav-links">
        <button class="nav-close" id="nav-close" aria-label="Close menu">✕</button>
        ${NAV_LINKS.map(l => `<a href="${l.href}" class="${l.key===current?'active':''}">${l.label}</a>`).join("")}
      </nav>
      <div class="nav-backdrop" id="nav-backdrop"></div>
      <a class="header-cta" href="https://instagram.com/${INSTAGRAM_USERNAME}" target="_blank" rel="noopener">
        Message Us
      </a>
      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  const header = mount;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll);

  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  const backdrop = document.getElementById("nav-backdrop");
  const closeBtn = document.getElementById("nav-close");

  function setMenu(open){
    links.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  closeBtn.addEventListener("click", () => setMenu(false));
  backdrop.addEventListener("click", () => setMenu(false));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
}

function renderFooter(){
  const mount = document.getElementById("site-footer");
  if(!mount) return;
  const year = new Date().getFullYear();
  mount.innerHTML = `
    <div class="wrap footer-grid">
      <div>
        <a href="index.html" class="brand" style="margin-bottom:14px;display:inline-block;">INDUXO<span>.</span>SPORTS</a>
        <p class="muted" style="max-width:280px;font-size:14px;margin-top:6px;">
          Sportswear and streetwear exported worldwide. Every order is confirmed directly with our team on Instagram or WhatsApp.
        </p>
      </div>
      <div>
        <h5>Shop</h5>
        <ul>
          <li><a href="categories.html">All Categories</a></li>
          <li><a href="index.html#about">About Induxo</a></li>
          <li><a href="index.html#contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h5>Ordering</h5>
        <ul>
          <li><a href="https://instagram.com/${INSTAGRAM_USERNAME}" target="_blank" rel="noopener">Message on Instagram</a></li>
          <li><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">Message on WhatsApp</a></li>
        </ul>
      </div>
      <div>
        <h5>Follow</h5>
        <ul>
          <li><a href="https://instagram.com/${INSTAGRAM_USERNAME}" target="_blank" rel="noopener">@${INSTAGRAM_USERNAME}</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>&copy; ${year} Induxo Sports. All rights reserved.</span>
      <span>Built for worldwide export &amp; order-by-DM.</span>
    </div>
  `;
}

function hideLoader(){
  const loader = document.getElementById("page-loader");
  if(!loader) return;
  setTimeout(() => loader.classList.add("hide"), 250);
}

function setupScrollSpy(){
  const sections = ["home","about","categories","contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if(!sections.length) return; // not on the single-page layout

  const links = document.querySelectorAll("#nav-links a");
  const setActive = (key) => links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `index.html#${key}`));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) setActive(e.target.id); });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
}

function setupScrollReveal(){
  const items = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.15 });
  items.forEach(el => obs.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  setupScrollReveal();
  setupScrollSpy();
  hideLoader();
});
