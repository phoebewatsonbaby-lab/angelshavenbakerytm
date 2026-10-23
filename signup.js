document.querySelector('#popup-signup').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget,button=form.querySelector('button'),status=document.querySelector('#signup-status');
 if(!form.reportValidity())return;
 button.disabled=true;button.textContent='Saving your signup…';status.textContent='';
 try{const response=await fetch('https://angels-haven-sweet-orders.mythicduck129.chatgpt.site/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.email.value,consent:form.consent.checked,company:form.company.value})});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||'Please try again.');status.textContent='You’re on the list! Look out for Caymanas Park pop-up updates in your inbox.';form.reset();}catch(error){status.textContent=error instanceof TypeError?'We couldn’t save your signup. Please try again or contact us on WhatsApp.':error.message||'We couldn’t save your signup. Please try again.';}finally{button.disabled=false;button.textContent='Keep me in the loop ♡';}
});
