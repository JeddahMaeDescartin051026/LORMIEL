const products=[
{id:1,name:"BLOOM",type:"Floral · Fresh",category:["floral","fresh"],price:499,image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80",description:"A fresh floral fragrance designed for bright, everyday moments."},
{id:2,name:"LOVELY",type:"Powdery · Musk",category:["powdery"],price:499,image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80",description:"Soft powdery notes balanced with a clean, comforting musk."},
{id:3,name:"AMBERY",type:"Warm · Sweet",category:["warm"],price:499,image:"https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=700&q=80",description:"Warm amber tones with a sweet, inviting character." ,badge:"BEST SELLER"},
{id:4,name:"OCEAN",type:"Fresh · Aquatic",category:["fresh"],price:499,image:"https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=700&q=80",description:"A crisp aquatic scent with a clean, refreshing finish."},
{id:5,name:"SERENITY",type:"Fruity · Floral",category:["floral"],price:499,image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",description:"A gentle fruity-floral blend made for calm, elegant days."},
{id:6,name:"NOIR",type:"Woody · Warm",category:["warm"],price:549,image:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=700&q=80",description:"A deeper woody fragrance with a warm, sophisticated character."},
{id:7,name:"PETAL",type:"Floral · Soft",category:["floral"],price:499,image:"https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=700&q=80",description:"Delicate floral notes with a soft and feminine finish."},
{id:8,name:"AQUA",type:"Fresh · Clean",category:["fresh"],price:499,image:"https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=700&q=80",description:"A clean, airy fragrance inspired by fresh water and open skies."},
  {
  id: 9,
  name: "VELVET",
  type: "Floral · Woody",
  category: ["floral", "warm"],
  price: 499,
  image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80",
  description: "An elegant fragrance combining delicate florals with warm, woody notes."
},
  {
  id: 10,
  name: "VELVET",
  type: "Floral · Woody",
  category: ["floral", "warm"],
  price: 499,
  image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80",
  description: "An elegant fragrance combining delicate florals with warm, woody notes."
}
];

let cart=JSON.parse(localStorage.getItem("scenteCart")||"[]");
let activeFilter="all";
let modalProduct=null;
let modalQty=1;

const $=id=>document.getElementById(id);
const money=n=>"₱"+Number(n).toLocaleString("en-PH",{minimumFractionDigits:2});

function saveCart(){localStorage.setItem("scenteCart",JSON.stringify(cart));updateCartUI()}
function cartCount(){return cart.reduce((sum,item)=>sum+item.qty,0)}

function renderProducts(){
  const grid=$("productGrid");
  const list=products.filter(p=>activeFilter==="all"||p.category.includes(activeFilter));
  grid.innerHTML=list.map(p=>`
    <article class="product">
      ${p.badge?`<span class="badge">${p.badge}</span>`:""}
      <div class="product-image"><img src="${p.image}" alt="${p.name} perfume"></div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-type">${p.type}</div>
        <div class="price">${money(p.price)}</div>
        <div class="product-actions">
          <button onclick="openProduct(${p.id})">VIEW</button>
          <button class="add" onclick="addToCart(${p.id},1)">ADD TO CART</button>
        </div>
      </div>
    </article>`).join("");
}

function addToCart(id,qty=1){
  const p=products.find(x=>x.id===id); if(!p)return;
  const existing=cart.find(x=>x.id===id);
  if(existing)existing.qty+=qty;else cart.push({id:p.id,qty});
  saveCart();openCart();
}

function removeFromCart(id){
  cart=cart.filter(x=>x.id!==id);saveCart();
}

function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);if(!item)return;
  item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();
}

function updateCartUI(){
  $("cartCount").textContent=cartCount();
  const box=$("cartItems"),empty=$("cartEmpty");
  if(!cart.length){box.innerHTML="";empty.style.display="block";$("checkoutBtn").disabled=true;$("checkoutBtn").style.opacity=".45";}
  else{
    empty.style.display="none";$("checkoutBtn").disabled=false;$("checkoutBtn").style.opacity="1";
    box.innerHTML=cart.map(item=>{
      const p=products.find(x=>x.id===item.id);
      return `<div class="cart-item">
        <img src="${p.image}" alt="${p.name}">
        <div><strong>${p.name}</strong><small>${money(p.price)} × ${item.qty}</small>
        <div class="quantity"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div>
        <button class="remove" onclick="removeFromCart(${p.id})">×</button>
      </div>`;
    }).join("");
  }
  const subtotal=cart.reduce((s,item)=>{const p=products.find(x=>x.id===item.id);return s+p.price*item.qty},0);
  $("cartSubtotal").textContent=money(subtotal);
}

function openCart(){
  $("cartDrawer").classList.add("open");$("drawerOverlay").classList.add("open");
}
function closeCart(){
  $("cartDrawer").classList.remove("open");$("drawerOverlay").classList.remove("open");
}
function openProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  modalProduct=p;modalQty=1;
  $("modalImage").src=p.image;$("modalImage").alt=p.name;
  $("modalName").textContent=p.name;$("modalType").textContent=p.type;
  $("modalDescription").textContent=p.description;$("modalPrice").textContent=money(p.price);
  $("modalQty").textContent=modalQty;$("productModal").classList.add("open");
}
function closeModal(id){$(id).classList.remove("open")}

function openCheckout(){
  if(!cart.length)return;
  closeCart();
  const total=cart.reduce((s,item)=>{const p=products.find(x=>x.id===item.id);return s+p.price*item.qty},0);
  $("checkoutSummary").innerHTML=`<div class="checkout-summary">${cart.map(i=>{const p=products.find(x=>x.id===i.id);return `${p.name} × ${i.qty} — ${money(p.price*i.qty)}`}).join("<br>")}<hr style="margin:8px 0;border:0;border-top:1px solid #ddd"><strong>Total: ${money(total)}</strong></div>`;
  $("checkoutModal").classList.add("open");
}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");activeFilter=btn.dataset.filter;renderProducts();
}));

$("viewAllBtn").addEventListener("click",()=>{
  activeFilter="all";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="all"));renderProducts();
});

$("cartBtn").addEventListener("click",openCart);
$("closeCart").addEventListener("click",closeCart);
$("drawerOverlay").addEventListener("click",closeCart);
$("checkoutBtn").addEventListener("click",openCheckout);

$("modalMinus").addEventListener("click",()=>{if(modalQty>1){modalQty--;$("modalQty").textContent=modalQty}});
$("modalPlus").addEventListener("click",()=>{modalQty++;$("modalQty").textContent=modalQty});
$("modalAdd").addEventListener("click",()=>{if(modalProduct)addToCart(modalProduct.id,modalQty);closeModal("productModal")});

document.querySelectorAll(".modal-close").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.dataset.close)));
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));

$("menuBtn").addEventListener("click",()=>$("mobileNav").classList.toggle("open"));
document.querySelectorAll(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>$("mobileNav").classList.remove("open")));

$("accountBtn").addEventListener("click",()=>$("accountModal").classList.add("open"));
$("accountContinue").addEventListener("click",()=>{
  const email=$("accountEmail").value.trim();
  if(!email)return alert("Please enter your email address.");
  alert("Welcome! Account demo saved for "+email+". A real account system requires a backend/database.");
  closeModal("accountModal");
});

document.querySelectorAll("[data-inquiry]").forEach(btn=>btn.addEventListener("click",()=>{
  $("contactForm").message.value=`I'm interested in ${btn.dataset.inquiry}. Please send me more information.`;
  document.querySelector("#contact").scrollIntoView({behavior:"smooth"});
}));

```javascript
$("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const message = $("contactMessage");
  const button = form.querySelector('button[type="submit"]');

  button.disabled = true;
  button.textContent = "Sending...";
  message.textContent = "";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      message.textContent = "Thank you! Your message has been sent successfully.";
      form.reset();
    } else {
      message.textContent =
        result.message || "Sorry, your message could not be sent. Please try again.";
    }
  } catch (error) {
    message.textContent =
      "A connection error occurred. Please check your internet and try again.";
  } finally {
    button.disabled = false;
    button.textContent = "Send Message";
  }
});
```

$("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const orderNo="SC-"+Date.now().toString().slice(-7);
  $("checkoutMessage").textContent=`Order ${orderNo} received in demo mode. Connect a payment/order backend before accepting live orders.`;
  cart=[];saveCart();
  setTimeout(()=>{closeModal("checkoutModal");$("checkoutMessage").textContent=""},3500);
});

renderProducts();
updateCartUI();
