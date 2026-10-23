// ===== ตั้งค่าร้าน =====
const FB_PAGE = "Idshopth26";

// ===== รายการไอดี (ตัวอย่าง) =====
// hot: true = โชว์ในสไลด์ | badge = ป้ายบนสไลด์ | sold: true = ขายแล้ว
const products = [
  { name: "ไอดีตัวท็อป", detail: "เรนเจอร์ครบทีม | รูบี้ 10,000", price: 2900, img: "https://placehold.co/400x220/8b5cf6/white?text=LINE+Rangers", hot: true, badge: "👑 ตัวท็อป" },
  { name: "ไอดีสายแข่ง", detail: "เรนเจอร์ Ultra 15 ตัว | ด่านสูง", price: 1500, img: "https://placehold.co/400x220/ff7a1a/white?text=LINE+Rangers", hot: true, badge: "🔥 ไอดีแรร์" },
  { name: "ไอดีสายฟาร์ม", detail: "เรนเจอร์ Ultra 6 ตัว | รูบี้ 2,000", price: 790, img: "https://placehold.co/400x220/8b5cf6/white?text=LINE+Rangers", hot: true, badge: "⚡ คุ้มสุด" },
  { name: "ไอดีสายเริ่มต้น", detail: "เรนเจอร์ Ultra 2 ตัว | รูบี้ 500", price: 350, img: "https://placehold.co/400x220/ff7a1a/white?text=LINE+Rangers", hot: true, badge: "🍬 ราคาน่ารัก" },
  { name: "ไอดีสายสะสม", detail: "เรนเจอร์ลิมิเต็ด 8 ตัว", price: 1800, img: "https://placehold.co/400x220/ff7a1a/white?text=LINE+Rangers", sold: true },
];

// ===== วาดการ์ดหน้าสินค้า =====
function render(list, boxId) {
  const box = document.getElementById(boxId);
  box.innerHTML = "";

  if (list.length === 0) {
    box.innerHTML = "<p>ยังไม่มีไอดีในช่วงราคานี้ 👻</p>";
    return;
  }

  list.forEach(function (p) {
    box.innerHTML += `
      <div class="card ${p.sold ? 'sold' : ''}">
        <img src="${p.img}" alt="${p.name}">
        <h2>${p.name}</h2>
        <p>${p.detail}</p>
        <p class="price">฿${p.price.toLocaleString()}</p>
        ${p.sold
          ? '<button disabled>ขายแล้ว</button>'
          : `<button onclick="order('${p.name}')">สั่งซื้อ</button>`}
      </div>
    `;
  });
}

// ===== สไลด์หน้าแรก =====
const carousel = document.getElementById("featured");
const dots = document.getElementById("dots");
let current = 0;

function renderFeatured(list) {
  carousel.innerHTML = "";
  dots.innerHTML = "";
  list.forEach(function (p, i) {
    carousel.innerHTML += `
      <div class="slide">
        <span class="badge">${p.badge || "🔥 HOT"}</span>
        <img src="${p.img}" alt="${p.name}">
        <div class="slide-info">
          <h3>${p.name}</h3>
          <p>${p.detail}</p>
          <div class="slide-bottom">
            <span class="price">฿${p.price.toLocaleString()}</span>
            <button onclick="order('${p.name}')">สั่งซื้อ</button>
          </div>
        </div>
      </div>
    `;
    dots.innerHTML += `<span class="dot" onclick="goTo(${i})"></span>`;
  });
  updateDots();
}

function goTo(i) {
  const slides = carousel.querySelectorAll(".slide");
  if (slides.length === 0) return;
  current = (i + slides.length) % slides.length;
  const s = slides[current];
  carousel.scrollTo({
    left: s.offsetLeft - (carousel.clientWidth - s.clientWidth) / 2,
    behavior: "smooth",
  });
}

function slide(step) {
  goTo(current + step);
}

function updateDots() {
  document.querySelectorAll(".dot").forEach(function (d, i) {
    d.classList.toggle("active", i === current);
  });
}

carousel.addEventListener("scroll", function () {
  const center = carousel.scrollLeft + carousel.clientWidth / 2;
  let best = 0;
  let bestDist = Infinity;
  carousel.querySelectorAll(".slide").forEach(function (s, i) {
    const dist = Math.abs(s.offsetLeft + s.clientWidth / 2 - center);
    if (dist < bestDist) { bestDist = dist; best = i; }
  });
  current = best;
  updateDots();
});

let timer = setInterval(function () { slide(1); }, 4000);
carousel.addEventListener("touchstart", function () { clearInterval(timer); });

// ===== กรองตามราคา =====
function filterPrice(min, max) {
  const result = products.filter(function (p) {
    return p.price >= min && p.price <= max;
  });
  render(result, "product-list");
}

// ===== สั่งซื้อผ่าน Facebook =====
function order(name) {
  const msg = "สวัสดีครับ สนใจสั่งซื้อ LINE Rangers: " + name;
  navigator.clipboard.writeText(msg);
  window.open("https://m.me/" + FB_PAGE, "_blank");
}

// ===== ระบบสลับหน้า =====
function showPage() {
  let page = location.hash.replace("#", "") || "home";
  if (!document.getElementById(page)) page = "home";

  document.querySelectorAll(".page").forEach(function (sec) {
    sec.classList.toggle("active", sec.id === page);
  });
  document.querySelectorAll(".menu a").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === "#" + page);
  });
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", showPage);

// ===== เริ่มต้นเว็บ =====
document.getElementById("fb-link").href = "https://m.me/" + FB_PAGE;
const featured = products.filter(function (p) { return p.hot && !p.sold; }).slice(0, 4);
renderFeatured(featured);
render(products, "product-list");
showPage();
// ===== พื้นหลังหลอนน่ารัก =====
function setupBackground() {
  const bg = document.createElement("div");
  bg.id = "bg";
  bg.innerHTML = '<div class="moon"></div><div class="fog"></div>';

  // โรยดาว 40 ดวงแบบสุ่มตำแหน่ง
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.top = Math.random() * 70 + "%";
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    bg.appendChild(s);
  }

  // ผีกับค้างคาวลอยผ่าน คนละความเร็ว
  ["👻", "🦇", "👻", "🍬"].forEach(function (emoji, i) {
    const g = document.createElement("span");
    g.className = "ghost-bg";
    g.textContent = emoji;
    g.style.top = 15 + i * 20 + "%";
    g.style.animationDuration = 25 + Math.random() * 20 + "s";
    g.style.animationDelay = -Math.random() * 30 + "s"; // ติดลบ = เริ่มกลางทางเลย
    bg.appendChild(g);
  });

  document.body.prepend(bg);
}
setupBackground();

// ===== ดวงตาโผล่มากะพริบทุก 5 วินาที =====
setInterval(function () {
  const eye = document.createElement("span");
  eye.className = "peek";
  eye.textContent = "👀";
  eye.style.top = 10 + Math.random() * 80 + "%";
  eye.style.left = 10 + Math.random() * 80 + "%";
  document.getElementById("bg").appendChild(eye);
  setTimeout(function () { eye.remove(); }, 2500);
}, 5000);

// ===== แตะตรงไหน ผีเด้งตรงนั้น =====
document.addEventListener("pointerdown", function (e) {
  const icons = ["👻", "🎃", "🍬", "🦇"];
  const b = document.createElement("span");
  b.className = "boo";
  b.textContent = icons[Math.floor(Math.random() * icons.length)];
  b.style.left = e.clientX + "px";
  b.style.top = e.clientY + "px";
  document.body.appendChild(b);
  setTimeout(function () { b.remove(); }, 1500);
});
// ===== หน้าเปิดร้าน (Intro) =====
const INTRO_TIME = 3500;   // แสดงนานกี่มิลลิวินาที (3500 = 3.5 วิ)
const SHOW_ONCE = true;    // true = โชว์ครั้งเดียวต่อการเข้าเว็บ

function closeIntro() {
  const intro = document.getElementById("intro");
  if (!intro || intro.classList.contains("hide")) return;
  intro.classList.add("hide");
  document.body.classList.remove("intro-open");
  setTimeout(function () { intro.remove(); }, 1100);
}

function startIntro() {
  const intro = document.getElementById("intro");
  if (!intro) return;

  // เคยเห็นแล้วในรอบนี้ ข้ามไปเลย
  if (SHOW_ONCE) {
    let seen = false;
    try { seen = sessionStorage.getItem("introSeen") === "yes"; } catch (e) {}
    if (seen) { intro.remove(); return; }
    try { sessionStorage.setItem("introSeen", "yes"); } catch (e) {}
  }

  document.body.classList.add("intro-open");
  intro.querySelector(".intro-bar span").style.animationDuration = INTRO_TIME + "ms";

  // ค้างคาวบินแตกออกจากโลโก้ 14 ตัว
  setTimeout(function () {
    for (let i = 0; i < 14; i++) {
      const bat = document.createElement("span");
      bat.className = "intro-bat";
      bat.textContent = "🦇";
      const angle = (i / 14) * Math.PI * 2;
      const dist = 180 + Math.random() * 180;
      bat.style.setProperty("--x", Math.cos(angle) * dist + "px");
      bat.style.setProperty("--y", Math.sin(angle) * dist + "px");
      bat.style.setProperty("--r", (Math.random() * 60 - 30) + "deg");
      bat.style.animationDelay = Math.random() * 0.3 + "s";
      intro.appendChild(bat);
    }
  }, 800);

  setTimeout(closeIntro, INTRO_TIME);
}
startIntro();
