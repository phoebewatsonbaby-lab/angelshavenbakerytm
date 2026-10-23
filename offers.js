(function () {
  'use strict';
  const core = window.HavenPromotions;
  const preferenceKey = 'haven-promotions-v1', welcomeKey = 'haven-welcome-seen-v1';
  const codes = ['', 'WELCOME15', 'HAVEN35'];
  const types = ['unknown', 'first', 'returning'];
  let state = {customerType: 'unknown', coupon: ''}, context = null, notice = '';
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey) || '{}');
    if (types.includes(saved.customerType)) state.customerType = saved.customerType;
    if (codes.includes(saved.coupon)) state.coupon = saved.coupon;
  } catch {}
  const money = value => 'J$' + value.toLocaleString('en-JM', {minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2});
  const getQuote = () => core.calculateQuote({...context, ...state});
  function save() {
    try { localStorage.setItem(preferenceKey, JSON.stringify(state)); } catch {}
    render();
  }
  function render() {
    const quote = getQuote();
    document.querySelectorAll('[data-customer-type]').forEach(select => select.value = state.customerType);
    document.querySelectorAll('[data-coupon-input]').forEach(input => {if (document.activeElement !== input) input.value = state.coupon;});
    document.querySelectorAll('[data-active-coupon]').forEach(node => {node.textContent = state.coupon ? 'Selected coupon: ' + state.coupon : ''; node.hidden = !state.coupon;});
    document.querySelectorAll('[data-remove-coupon]').forEach(node => node.hidden = !state.coupon);
    document.querySelectorAll('[data-coupon-status]').forEach(node => {
      const contextualMessage = !context && state.coupon === 'HAVEN35' ? 'HAVEN35 saved. Christmas orders of 10+ boxes receive 35% off and free delivery; box quantities are confirmed with your order.' : quote.message;
      node.textContent = notice || contextualMessage;
      node.classList.toggle('coupon-error', !!notice || quote.couponStatus === 'ineligible');
    });
    const details = document.querySelector('#coupon-entry');
    if (details && state.coupon) details.open = true;
    const breakdown = document.querySelector('#promotion-breakdown');
    if (!breakdown) return;
    breakdown.replaceChildren();
    if (!context || !context.itemCount) return;
    const row = (label, value, className = '') => {
      const line = document.createElement('div'); line.className = 'promotion-row ' + className;
      const name = document.createElement('span'), amount = document.createElement('strong');
      name.textContent = label; amount.textContent = value; line.append(name, amount); breakdown.append(line);
    };
    if (quote.percent) {
      row(quote.code + ' · ' + quote.percent + '% off' + (quote.hasUnpriced ? ' priced items' : ''), '−' + money(quote.discount), 'promotion-discount');
      row(quote.hasUnpriced ? 'Priced items after discount' : 'Items after discount', money(quote.afterDiscount), 'promotion-items-total');
    }
    row('Delivery estimate', quote.freeDelivery ? 'Free' : 'Fee to confirm on WhatsApp', quote.freeDelivery ? 'promotion-discount' : '');
    const note = document.createElement('p'); note.className = 'field-note';
    note.textContent = quote.bulkFree ? 'Free delivery is included with this qualifying Christmas bulk coupon.' : quote.freeDelivery ? 'Your items subtotal qualifies for free delivery. Eligibility is confirmed with your order.' : quote.hasUnpriced ? 'Unpriced items may change delivery eligibility. We’ll confirm your complete subtotal and any fee.' : 'Free delivery on first orders over J$1,000; later orders over J$2,000. Otherwise, we confirm the fee before payment.';
    breakdown.append(note);
  }
  function summaryLines() {
    const q = getQuote();
    const lines = ['Customer: ' + (state.customerType === 'first' ? 'First order (eligibility to confirm)' : state.customerType === 'returning' ? 'Returning customer' : 'First-order status to confirm')];
    if (state.coupon) {
      lines.push('Coupon requested: ' + state.coupon);
      lines.push('Coupon eligibility: ' + (q.couponStatus === 'applied' ? 'Qualifies based on this list; confirm before payment' : q.message));
    }
    if (q.percent) lines.push('Estimated discount on priced items: ' + q.percent + '% (' + money(q.discount) + ')', 'Priced items after discount: ' + money(q.afterDiscount));
    lines.push('Delivery: ' + (q.freeDelivery ? 'Free, subject to order verification' : 'Fee / eligibility to confirm on WhatsApp'));
    lines.push('Delivery thresholds use the items subtotal before discounts. First orders over J$1,000; later orders over J$2,000. One coupon per order.');
    if (q.code === 'HAVEN35') lines.push('Christmas bulk offer: 35% off and free delivery for 10+ boxes. Boxes on this list: ' + q.boxCount + '.');
    return lines;
  }
  document.querySelectorAll('[data-customer-type]').forEach(select => select.addEventListener('change', () => {
    state.customerType = select.value; notice = '';
    if (state.customerType === 'first' && !state.coupon) state.coupon = 'WELCOME15';
    save();
  }));
  document.querySelectorAll('[data-apply-coupon]').forEach(button => button.addEventListener('click', () => {
    const input = button.closest('[data-coupon-controls]').querySelector('input');
    const code = core.normaliseCode(input.value);
    if (!code || !codes.includes(code)) { notice = 'Please enter a recognised code: WELCOME15 or HAVEN35.'; render(); input.focus(); return; }
    state.coupon = code; input.value = code; notice = ''; save();
  }));
  document.querySelectorAll('[data-coupon-input]').forEach(input => {
    input.value = state.coupon;
    input.addEventListener('keydown', event => {if (event.key === 'Enter') { event.preventDefault(); input.closest('[data-coupon-controls]').querySelector('[data-apply-coupon]').click(); }});
  });
  document.querySelectorAll('[data-remove-coupon]').forEach(button => button.addEventListener('click', () => {
    state.coupon = ''; notice = ''; document.querySelectorAll('[data-coupon-input]').forEach(input => input.value = ''); save();
  }));
  const dialog = document.createElement('dialog');
  dialog.id = 'welcome-offer'; dialog.className = 'welcome-offer'; dialog.setAttribute('aria-labelledby', 'welcome-title');
  dialog.innerHTML = '<button type="button" class="welcome-close" aria-label="Close first-order offer">×</button><span class="eyebrow">A LITTLE WELCOME FROM ANGEL’S HAVEN</span><h2 id="welcome-title">Your first bite,<br><em>a little sweeter.</em></h2><div class="welcome-percent">15% <span>OFF</span></div><p>Your first order deserves a little love.<br>Use <strong>WELCOME15</strong> for 15% off.</p><div class="welcome-delivery">♡ Free delivery on first orders over <strong>J$1,000</strong></div><button type="button" class="button full" id="claim-welcome">Claim my first-order offer ↗</button><button type="button" class="welcome-skip">Keep browsing</button><p class="welcome-fine">First orders only. One coupon per order. Delivery thresholds use the items subtotal before discounts. We confirm eligibility and your total on WhatsApp.</p>';
  document.body.append(dialog);
  let previousOverflow = '';
  function showWelcome() {
    if (dialog.open) return;
    previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    try { localStorage.setItem(welcomeKey, 'yes'); } catch { try { sessionStorage.setItem(welcomeKey, 'yes'); } catch {} }
  }
  function closeWelcome() {dialog.close();}
  dialog.addEventListener('close', () => document.body.style.overflow = previousOverflow);
  dialog.querySelector('.welcome-close').addEventListener('click', closeWelcome);
  dialog.querySelector('.welcome-skip').addEventListener('click', closeWelcome);
  dialog.addEventListener('click', event => {if (event.target === dialog) {const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeWelcome();}});
  dialog.querySelector('#claim-welcome').addEventListener('click', () => {
    state.customerType = 'first';
    if (state.coupon !== 'HAVEN35') state.coupon = 'WELCOME15';
    notice = ''; save(); document.querySelectorAll('[data-coupon-input]').forEach(input => input.value = state.coupon);
    closeWelcome();
    const toast = document.querySelector('#cart-toast');
    if (toast) {toast.textContent = state.coupon + ' saved for your order. ♡'; toast.classList.add('visible'); setTimeout(() => toast.classList.remove('visible'), 4000);}
  });
  document.querySelectorAll('[data-open-welcome]').forEach(button => button.addEventListener('click', showWelcome));
  window.HavenOffers = {getPreferences: () => ({...state}), getQuote, summaryLines, setContext: value => {context = value; notice = ''; render();}, showWelcome};
  render();
  let seen = false;
  try {seen = localStorage.getItem(welcomeKey) === 'yes' || sessionStorage.getItem(welcomeKey) === 'yes';} catch {}
  if (!seen && state.customerType !== 'returning') setTimeout(showWelcome, 500);
})();
