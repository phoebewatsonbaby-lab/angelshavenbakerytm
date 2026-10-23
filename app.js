const form='https://docs.google.com/forms/d/e/1FAIpQLSfh_kAZg2WNbAqzF3lc6wuB86Zr_XLc2tqN66Q8PEILzqutaw/viewform';
document.querySelectorAll('.form-link').forEach(a=>a.href=form);
const products=[
 ["Pumpkin Honey Bun Cake","Cakes","A treat for you and your family to enjoy anywhere, anytime.","pumpkin-honey-bun-cake",800,1600],
 ['Frosted lemon cookies','Cookies','A bright lemon treat with a sweet frosted finish.','lemon-cookies',300,1200],
 ['Chocolate chip cookies','Cookies','The classic chocolate-filled favourite.','chip-cookies-enhanced',250,1000],
 ['Lofthouse cookies','Cookies','Soft frosted cookies with a playful finish.','lofthouse-clean',300,1200],
 ['Chocolate s’more cookies','Cookies','Chocolate and marshmallow in one sweet treat.','smore-cookies',320,1300],
 ['Oreo chocolate chip cookies','Cookies','Oreo meets chocolate chip for double the joy.','oreo-cookies',280,1000],
 ['Strawberry Oreo s’mores cookies','Cookies','A strawberry, Oreo and s’mores combination.','strawberry-cookies',350,1500],
 ['Croissants','Pastries','Golden layers of buttery, flaky goodness.','croissants'],

 ['Vanilla cupcake','Cupcakes','A soft vanilla cupcake with a creamy swirl and colourful sprinkles. A little joy for any day.','vanilla-cupcake'],
 ['Chocolate cupcake','Cupcakes','A rich chocolate cupcake topped with a generous swirl of chocolate frosting. Made for chocolate lovers.','chocolate-cupcake'],
 ['Mini cheesecakes','Cakes','Little treats with a creamy cheesecake centre.','cheesecake'],
 ['Vanilla glazed donuts','Donuts','Sweet vanilla glaze for a little everyday joy.','vanilla-donuts',600,1000],
 ['Chocolate glazed donuts','Donuts','A chocolate-glazed favourite for your treat box.','chocolate-donuts',600,1000],
 ['Cappuccino donuts','Donuts','Coffee-inspired glaze with a delicate drizzle.','cappuccino-donuts',750,1200],
 ['Fresh bread','Pastries','A comforting addition to your breakfast table.','bread'],
 ['Strawberry shortcake','Cakes','A lovely treat for your next sweet occasion.','cake'],
 ['Blueberry cheesecake','Cakes','Creamy cheesecake with a fruity blueberry finish.','cheesecake',null,null,'blueberry-cheesecake'],
 ['Cherry cheesecake','Cakes','A sweet cherry twist on a cheesecake favourite.','cheesecake',null,null,'cherry-cheesecake'],
 ['Lemon cheesecake','Cakes','A bright, citrusy cheesecake treat.','cheesecake',null,null,'lemon-cheesecake']
];
const productId=p=>p[6]||p[3];
const categories=[
 {name:'Cupcakes',title:'Cupcakes',id:'cupcakes',note:'A little celebration, one cupcake at a time. Choose vanilla or chocolate, then message us for quantities and pricing.'},
 {name:'Donuts',title:'Donuts',id:'donuts',note:'Choose your glaze. Order a pack of 3 or a box of 6.'},
 {name:'Cookies',title:'Cookies',id:'cookies',note:'Six sweet flavours, individually or by the box. Please allow at least 3 days for cookie pre-orders.'},
 {name:'Cakes',title:'Cakes & cheesecakes',id:'cakes',note:'A slice to enjoy or something for your next occasion.'},
 {name:'Pastries',title:'Bread & pastries',id:'pastries',note:'Something comforting for your table. Confirm availability and prices with us.'}
];
let cart={},filter='All',frequency='One-time',toastTimer;
try { cart=JSON.parse(sessionStorage.getItem('haven-cart-v2')||'{}'); if(!cart||typeof cart!=='object'||Array.isArray(cart))cart={}; } catch {cart={};}
for(const key of Object.keys(cart)){if(!/^[a-z0-9-]+:(single|box)$/.test(key)||!products.some(p=>productId(p)===key.split(':')[0])||!Number.isInteger(cart[key])||cart[key]<1||cart[key]>999)delete cart[key];}
const $=s=>document.querySelector(s);
const money=n=>'J$'+n.toLocaleString('en-JM',{minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2});
const itemInfo=key=>{const [index,pack]=key.split(':');return {p:products.find(p=>productId(p)===index),index,pack:pack||'single'};};
const packLabels=p=>p[1]==='Cakes'?['1 slice','3 slices']:p[1]==='Donuts'?['Pack of 3','Box of 6']:['1 cookie','Box of 6'];
const itemName=key=>{const {p,pack}=itemInfo(key);return p[0]+(p[4]?' — '+packLabels(p)[pack==='box'?1:0]:'');};
const menuSubtotal=()=>Object.entries(cart).reduce((sum,[key,n])=>{const {p,pack}=itemInfo(key);return sum+n*(p[pack==='box'?5:4]||0)},0);
function productCard(p){
 const labels=packLabels(p),png=['chip-cookies-enhanced','lofthouse-clean','vanilla-donuts','chocolate-donuts','cappuccino-donuts','pumpkin-honey-bun-cake','vanilla-cupcake','chocolate-cupcake'].includes(p[3]);
 const imageInfo=window.HavenProductImages?.[p[3]];
 const sources=imageInfo?`<source type="image/webp" srcset="/assets/gallery/${p[3]}-480.webp ${imageInfo.smallWidth}w${imageInfo.largeWidth>imageInfo.smallWidth?`, /assets/gallery/${p[3]}-960.webp ${imageInfo.largeWidth}w`:''}" sizes="(max-width:700px) 42vw, 28vw">`:'';
 const photo=`<div class="product-photo ${p[3]==='pumpkin-honey-bun-cake'?'pumpkin-photo':''}"><picture>${sources}<img src="/assets/${p[3]}.${png?'png':'jpg'}" alt="${p[4]||p[1]==='Cupcakes'?'Supplied reference image for':'Sample image for'} ${p[0]}" loading="lazy" decoding="async"></picture><span class="product-category">${p[1]}</span></div>`;
 const action=p[1]==='Cupcakes'?'<a class="add" href="https://wa.me/message/J453CRXZDTW3D1" target="_blank" rel="noopener">Enquire on WhatsApp ↗</a>':`<button class="add" data-add="${productId(p)}:single" aria-label="Add ${p[0]} to order">Add to list +</button>`;
 return `<article class="product">${photo}<h4>${p[0]}</h4><p>${p[2]}</p>${p[4]?`<div class="cookie-prices"><span>${labels[0]} <strong>${money(p[4])}</strong></span><span>${labels[1]} <strong>${money(p[5])}</strong></span></div><p class="preorder-note">${p[1]==='Cookies'?'Pre-order at least 3 days ahead':p[1]==='Cakes'?'A little treat or a family share':'Packs of 3, 6 & more · add multiple packs'} · JMD</p><div class="cookie-actions"><button class="add" data-add="${productId(p)}:single" aria-label="Add ${labels[0]} ${p[0]}">Add ${labels[0].toLowerCase()} +</button><button class="add" data-add="${productId(p)}:box" aria-label="Add ${labels[1]} ${p[0]}">Add ${labels[1].toLowerCase()} +</button></div>`:`<div class="product-bottom"><span class="price">Confirm price on WhatsApp</span>${action}</div>`}</article>`;
}
function renderProducts(){
 if(!$('#products'))return;
 const q=($('#search')?.value||'').trim().toLowerCase();
 const found=products.filter(p=>(filter==='All'||p[1]===filter)&&(p[0]+' '+p[1]).toLowerCase().includes(q));
 const groups=categories.filter(category=>found.some(p=>p[1]===category.name));
 $('#products').innerHTML=groups.map((category,index)=>`<section id="${category.id}" class="product-category-section" aria-labelledby="category-title-${category.id}"><div class="category-heading"><span class="category-number" aria-hidden="true">${String(categories.indexOf(category)+1).padStart(2,'0')}</span><div><h3 id="category-title-${category.id}">${category.title}</h3><p>${category.note}</p></div><span class="category-count">${found.filter(p=>p[1]===category.name).length} ${found.filter(p=>p[1]===category.name).length===1?'selection':'selections'}</span></div><div class="products">${found.filter(p=>p[1]===category.name).map(productCard).join('')}</div></section>`).join('')||'<p class="empty">No treats found. Try another search or category.</p>';
 if($('#menu-results'))$('#menu-results').textContent=found.length+' '+(found.length===1?'selection':'selections')+' in '+groups.length+' '+(groups.length===1?'category':'categories');
}
function promotionContext(){const entries=Object.entries(cart);return {subtotal:menuSubtotal(),boxCount:entries.reduce((sum,[key,n])=>{const {p,pack}=itemInfo(key);return sum+(pack==='box'&&['Cookies','Donuts'].includes(p[1])?n:0)},0),hasUnpriced:entries.some(([key])=>{const {p,pack}=itemInfo(key);return !Number.isFinite(p[pack==='box'?5:4])}),itemCount:entries.reduce((sum,[,n])=>sum+n,0)};}
function renderCart(){
 try{sessionStorage.setItem('haven-cart-v2',JSON.stringify(cart))}catch{}
 if($('#bag-label'))$('#bag-label').textContent='Your treats · '+Object.values(cart).reduce((a,b)=>a+b,0);
 window.HavenOffers?.setContext(promotionContext());
 if(!$('#order-list'))return;
 const entries=Object.entries(cart);
 $('#order-list').innerHTML=entries.length?entries.map(([key,n])=>`<div class="order-item"><span>${itemName(key)}</span><div class="quantity"><button data-change="${key}" data-delta="-1" aria-label="Remove one ${itemName(key)}">−</button><span>${n}</span><button data-change="${key}" data-delta="1" aria-label="Add one ${itemName(key)}">+</button></div></div>`).join(''):'<div class="empty">Your sweet list is waiting. <a href="/#menu">Explore the menu ↑</a></div>';
 const total=menuSubtotal();$('.total span').textContent=total?'Menu subtotal':'Order total';$('.total strong').textContent=total?money(total)+' JMD':'Confirmed on WhatsApp';updateMinimumDate();validateDate();
}
document.addEventListener('click',e=>{const add=e.target.closest('[data-add]'),change=e.target.closest('[data-change]');if(add){let key=add.dataset.add;cart[key]=Math.min(999,(cart[key]||0)+1);renderCart();if($('#status'))$('#status').textContent=itemName(key)+' added to your order list.';const toast=$('#cart-toast');toast.textContent=itemName(key)+' added ✓';toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3000)}if(change){let key=change.dataset.change;cart[key]=Math.min(999,cart[key]+Number(change.dataset.delta));if(cart[key]<=0)delete cart[key];renderCart();}});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});renderProducts()}));$('#search')?.addEventListener('input',renderProducts);
const notes={'One-time':'A sweet treat for one delivery.','Weekly':'A regular treat every week. Confirm your start date with us.','Bi-weekly':'A sweet delivery every two weeks. Confirm your dates with us.','Monthly':'Something to look forward to each month. Delivery dates are confirmed with us.'};
document.querySelectorAll('[data-frequency]').forEach(b=>b.addEventListener('click',()=>{frequency=b.dataset.frequency;document.querySelectorAll('[data-frequency]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});$('#frequency-note').textContent=notes[frequency]}));
const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Jamaica',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const part=t=>parts.find(x=>x.type===t).value;const today=`${part('year')}-${part('month')}-${part('day')}`;
function updateMinimumDate(){if(!$("#date"))return;const minDate=new Date(today+'T12:00:00Z');if(Object.keys(cart).some(key=>itemInfo(key).p[1]==='Cookies'))minDate.setUTCDate(minDate.getUTCDate()+3);$('#date').min=minDate.toISOString().slice(0,10);}
updateMinimumDate();
function validateDate(){if(!$("#date"))return true;let value=$('#date').value;let error='';if(value){let date=new Date(value+'T12:00:00Z');let day=date.getUTCDay();if(Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==value)error='Please choose a valid date.';else if(value<$('#date').min)error=$('#date').min>today?'Cookie pre-orders need at least 3 days’ notice. Please choose a later delivery date.':'Please choose a date today or later.';else if(![1,3,6].includes(day))error='Please choose a Monday, Wednesday or Saturday.';else $('#day').value=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][day];}$('#date-error').textContent=error;$('#date').setCustomValidity(error);return !error;}
$('#date')?.addEventListener('change',validateDate);$('#day')?.addEventListener('change',()=>{if($('#date').value){$('#date').value='';validateDate()}});
function orderSummary(){
 const lines=Object.entries(cart).map(([i,n])=>`${n} × ${itemName(i)}`);
 return ['Angel’s Haven order request',lines.length?lines.join('\n'):'Treats: to be chosen in the form','Plan: '+frequency,'Delivery: '+$('#day').value+', '+$('#window').value+' (Jamaica time)',$('#date').value?'Preferred first date: '+$('#date').value:'',menuSubtotal()?'Menu subtotal: '+money(menuSubtotal())+' JMD (unpriced items excluded)':'',...(window.HavenOffers?.summaryLines()||[]),'Cookie pre-orders require at least 3 days’ notice.','Please confirm availability, coupon eligibility, final total and payment link on WhatsApp.'].filter(Boolean).join('\n');
}
$('#copy')?.addEventListener('click',async()=>{if(!validateDate()){$('#date').reportValidity();return}const summary=orderSummary();try{await navigator.clipboard.writeText(summary);$('#status').textContent='Copied! Open the order form and paste your summary, including your coupon, where appropriate.'}catch{const area=document.createElement('textarea');area.value=summary;area.style.width='100%';area.rows=8;area.setAttribute('aria-label','Order summary to copy');$('#status').replaceChildren(area);area.focus();area.select();}});
document.querySelectorAll('.form-link').forEach(a=>a.addEventListener('click',e=>{if(!validateDate()){e.preventDefault();$('#date').reportValidity();}}));
renderProducts();renderCart();
