/* ============================================================
   TOASTS
   ============================================================ */
function showToast(message, ms = 3400){
  let stack = document.getElementById("toast-stack");
  if(!stack){
    stack = document.createElement("div");
    stack.id = "toast-stack";
    document.body.appendChild(stack);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 320);
  }, ms);
}

/* ============================================================
   BUY -> INSTAGRAM or WHATSAPP
   ============================================================ */
function productMessage(product){
  const pageUrl = window.location.href.split("#")[0];
  return `Hi! I'd like to order this from Induxo Sports:\n` +
    `Product: ${product.name}\n` +
    `Link: ${pageUrl}#${product.id}`;
}

// Instagram does not let any website pre-fill or attach a message inside a
// DM thread — that's a platform limit, not something the code can override.
// So this copies the message to the clipboard and opens the DM composer;
// the buyer pastes it in as the first message.
function buyOnInstagram(product){
  const message = productMessage(product);
  const openDM = () => window.open(`https://ig.me/m/${INSTAGRAM_USERNAME}`, "_blank", "noopener");

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(message)
      .then(() => { showToast("Product details copied — paste into the Instagram chat that just opened."); openDM(); })
      .catch(() => { showToast("Opening Instagram — mention: " + product.name); openDM(); });
  } else {
    showToast("Opening Instagram — mention: " + product.name);
    openDM();
  }
}

// WhatsApp does support a pre-filled message via its link format, so this
// opens the chat with the product details already typed in.
function buyOnWhatsApp(product){
  const message = productMessage(product);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  showToast("Opening WhatsApp with your order details filled in.");
}
