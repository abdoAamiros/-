/* =====================================================
   CONFIG — edit everything here, in ONE place
   ===================================================== */
const CONFIG = {
  businessName: "[PUT BUSINESS NAME HERE]",
  whatsappNumber: "212XXXXXXXXX",      // digits only, no "+" or spaces (e.g. 212612345678)
  prices: { fresh: "[PRICE]", local: "[PRICE]", breeding: "[PRICE]" },
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Marrakech,Morocco"
};

/* ---------- Helpers ---------- */
const waLink = (text = "") =>
  `https://wa.me/${CONFIG.whatsappNumber}` + (text ? `?text=${encodeURIComponent(text)}` : "");

/* ---------- Fill in config values across the page ---------- */
document.querySelectorAll("[data-biz]").forEach(el => (el.textContent = CONFIG.businessName));
document.querySelectorAll("[data-price]").forEach(el => (el.textContent = CONFIG.prices[el.dataset.price]));
document.querySelectorAll("[data-phone-text]").forEach(el => (el.textContent = "+" + CONFIG.whatsappNumber));
document.querySelectorAll("[data-tel]").forEach(el => (el.href = "tel:+" + CONFIG.whatsappNumber)); // tap-to-call on mobile
document.querySelectorAll("[data-social]").forEach(el => (el.href = CONFIG[el.dataset.social]));
document.querySelectorAll("[data-map]").forEach(el => (el.href = CONFIG.mapsUrl));

/* ---------- General WhatsApp links (hero, floating button, contact) ---------- */
document.querySelectorAll("[data-wa-general]").forEach(el => {
  el.href = waLink(`السلام عليكم، أرغب في طلب دجاج من ${CONFIG.businessName}.`);
  el.target = "_blank";
  el.rel = "noopener";
});

/* ---------- Product cards: pre-written Arabic message with chosen product ---------- */
document.querySelectorAll("[data-order]").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.dataset.order;
    const msg = `السلام عليكم، أرغب في طلب: ${product}.\nمن فضلكم، هل هو متوفر؟`;
    window.open(waLink(msg), "_blank", "noopener");
    // Also preselect the product in the order form
    document.getElementById("productSelect").value = product;
  });
});

/* ---------- Order form -> detailed WhatsApp message ---------- */
const form = document.getElementById("orderForm");
const errorBox = document.getElementById("formError");

form.addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form).entries());
  const phoneOk = /^[+\d\s-]{9,15}$/.test((d.phone || "").trim());

  if (!d.name.trim() || !d.area.trim() || !(Number(d.qty) > 0)) {
    errorBox.textContent = "المرجو ملء الاسم والكمية والمنطقة.";
    return;
  }
  if (!phoneOk) {
    errorBox.textContent = "المرجو إدخال رقم هاتف صحيح.";
    return;
  }
  errorBox.textContent = "";

  const msg = [
    `طلب جديد من ${CONFIG.businessName}`,
    `────────────`,
    `الاسم: ${d.name.trim()}`,
    `الهاتف: ${d.phone.trim()}`,
    `المنتج: ${d.product}`,
    `الكمية: ${d.qty}`,
    `المنطقة: ${d.area.trim()}`,
    `ملاحظات: ${d.notes.trim() || "لا يوجد"}`
  ].join("\n");

  window.open(waLink(msg), "_blank", "noopener");
});

/* ---------- Mobile hamburger menu ---------- */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const setMenu = open => {
  menu.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ---------- Entrance animation: cards/sections fade in once when visible ---------- */
const items = document.querySelectorAll(".card, .gallery figure, .section h2");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(el => { el.classList.add("reveal"); io.observe(el); });
}

/* ---------- Image fallback if a placeholder URL fails to load ---------- */
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("error", () => { img.style.minHeight = "160px"; img.alt = img.alt + " (صورة غير متوفرة)"; }, { once: true });
});
