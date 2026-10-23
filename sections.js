(()=>{
 const form=document.querySelector('#event-enquiry');
 if(form){
  const occasion=new URLSearchParams(location.search).get('occasion');if([...form.elements.occasion.options].some(o=>o.value===occasion))form.elements.occasion.value=occasion;
  form.elements.date.min=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Jamaica',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);document.querySelector('#enquiry-summary').value=['Hello Angel’s Haven! I’d like a quote.','Occasion: '+data.get('occasion'),'Preferred date: '+data.get('date'),'Guests / boxes: '+data.get('quantity'),'Delivery area: '+data.get('area'),'Products: '+data.get('items'),'Budget (JMD): '+(data.get('budget')||'Please advise'),'Notes: '+(data.get('notes')||'None')].join('\n');document.querySelector('#enquiry-result').hidden=false;document.querySelector('#enquiry-status').textContent='Your message is ready. Copy it, then paste it into WhatsApp to send.';document.querySelector('#enquiry-summary').focus()});
  document.querySelector('#copy-enquiry').addEventListener('click',async()=>{const summary=document.querySelector('#enquiry-summary');try{await navigator.clipboard.writeText(summary.value);document.querySelector('#enquiry-status').textContent='Copied. Open WhatsApp and paste your enquiry.'}catch{summary.focus();summary.select();document.querySelector('#enquiry-status').textContent='Select and copy the message above, then paste it into WhatsApp.'}});
 }
})();
