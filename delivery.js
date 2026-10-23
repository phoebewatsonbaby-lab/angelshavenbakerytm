const deliveryForm=document.querySelector('#delivery-form');
const deliveryDate=deliveryForm.elements.deliveryDate;
const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Jamaica',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const part=t=>parts.find(x=>x.type===t).value;
const today=`${part('year')}-${part('month')}-${part('day')}`;
deliveryDate.min=today;
let requestId='AH-'+Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>b.toString(16).padStart(2,'0')).join('');
function checkDate(){const value=deliveryDate.value,dt=new Date(value+'T12:00:00Z');const bad=value&&(value<today||![1,3,6].includes(dt.getUTCDay()));deliveryDate.setCustomValidity(bad?'Please choose a Monday, Wednesday or Saturday that is today or later.':'');document.querySelector('#delivery-date-hint').textContent=bad?'Please choose a Monday, Wednesday or Saturday that is today or later.':'Please choose a Monday, Wednesday or Saturday.';return !bad;}
deliveryDate.addEventListener('change',checkDate);
deliveryForm.querySelectorAll('[name=orderStage]').forEach(r=>r.addEventListener('change',()=>{const future=deliveryForm.elements.orderStage.value==='future';document.querySelector('#stage-note').textContent=future?'You can send your delivery details now. You’ll still need to place your bakery order separately; this does not reserve products or a slot.':'Use the name and WhatsApp number from your order so we can match the details.';deliveryForm.elements.orderDetails.placeholder=future?'Tell us what you’re planning to order, or describe the occasion if you’re still deciding.':'Tell us what you ordered and when you placed the order.';}));
deliveryForm.addEventListener('submit',async event=>{
 event.preventDefault();checkDate();if(!deliveryForm.reportValidity())return;
 const button=deliveryForm.querySelector('button[type=submit]'),status=document.querySelector('#delivery-status');
 const data=Object.fromEntries(new FormData(deliveryForm));data.acknowledged=deliveryForm.elements.acknowledged.checked;data.requestId=requestId;
 const offer=window.HavenOffers?.getPreferences();data.couponCode=offer?.coupon||'';data.customerType=offer?.customerType||'unknown';
 button.disabled=true;button.textContent='Saving your request…';status.textContent='';
 try{const response=await fetch('https://angels-haven-sweet-orders.mythicduck129.chatgpt.site/api/delivery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||'Please try again.');
 document.querySelector('#delivery-reference').textContent='Your delivery request reference: '+result.reference;
 document.querySelector('#future-next-step').hidden=data.orderStage!=='future';document.querySelector('#delivery-order-link').hidden=data.orderStage!=='future';
 deliveryForm.hidden=true;const success=document.querySelector('#delivery-success');success.hidden=false;success.focus();
 }catch(error){status.textContent=error instanceof TypeError?'We couldn’t send your request. Please try again or contact us on WhatsApp.':error.message||'We couldn’t save your request. Please try again.';}finally{button.disabled=false;button.textContent='Send delivery request ↗';}
});
