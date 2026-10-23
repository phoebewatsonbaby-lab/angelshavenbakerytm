(function (root) {
  'use strict';
  const normaliseCode = value => String(value || '').trim().toUpperCase();
  function calculateQuote({subtotal = 0, boxCount = 0, customerType = 'unknown', coupon = '', hasUnpriced = false} = {}) {
    const cents = Math.max(0, Math.round((Number(subtotal) || 0) * 100));
    const boxes = Math.max(0, Math.floor(Number(boxCount) || 0));
    const code = normaliseCode(coupon);
    const firstOrder = customerType === 'first';
    let percent = 0, couponStatus = 'none', message = '';
    if (code === 'WELCOME15') {
      if (firstOrder) { percent = 15; couponStatus = 'applied'; message = 'WELCOME15 · 15% off your first order.'; }
      else { couponStatus = 'ineligible'; message = 'WELCOME15 is for first orders. Choose “My first order” above if this is your first purchase.'; }
    } else if (code === 'HAVEN35') {
      if (boxes >= 10) { percent = 35; couponStatus = 'applied'; message = 'HAVEN35 · 35% off and free delivery for your Christmas bulk order.'; }
      else { couponStatus = 'pending'; message = `HAVEN35 needs 10+ boxes. Your list has ${boxes} ${boxes === 1 ? 'box' : 'boxes'}. Add more boxes, or include other bakery box quantities in the form for confirmation.`; }
    } else if (code) { couponStatus = 'invalid'; message = 'That coupon code isn’t recognised. Please check the spelling.'; }
    const discountCents = Math.round(cents * percent / 100);
    const threshold = firstOrder ? 1000 : 2000;
    const bulkFree = code === 'HAVEN35' && couponStatus === 'applied';
    const freeDelivery = bulkFree || cents > threshold * 100;
    return {subtotal: cents / 100, discount: discountCents / 100, afterDiscount: (cents - discountCents) / 100, percent, code, couponStatus, message, boxCount: boxes, hasUnpriced, firstOrder, threshold, freeDelivery, bulkFree};
  }
  root.HavenPromotions = Object.freeze({normaliseCode, calculateQuote});
})(typeof window === 'undefined' ? globalThis : window);
