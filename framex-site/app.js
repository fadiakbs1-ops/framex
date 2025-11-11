function init() {
  // الزجاج
  const glassSel = document.getElementById('glass');
  Object.keys(PRICING.glassPricesM2).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = `${k} — ${PRICING.glassPricesM2[k]} ر.س/م²`;
    glassSel.appendChild(opt);
  });

  // روابط
  const wa = `https://wa.me/${SITE.whatsapp}`;
  document.getElementById('waTop').href   = wa;
  document.getElementById('waLink').href  = wa;
  document.getElementById('waQuote').href = wa;
  document.getElementById('telLink').href = `tel:${SITE.phone}`;
  document.getElementById('telLink').textContent = SITE.phone;
  document.getElementById('mailLink').href = `mailto:${SITE.email}`;
  document.getElementById('mailLink').textContent = SITE.email;

  document.getElementById('calcBtn').addEventListener('click', calc);
  document.getElementById('resetBtn').addEventListener('click', () => {
    setTimeout(()=>{ document.getElementById('results').classList.add('hidden'); }, 0);
  });
}

function toNum(v, def=0){ const n = Number(v); return isNaN(n)? def : n; }
function fmt(n){ return new Intl.NumberFormat('ar-SA', {maximumFractionDigits:2}).format(n); }

function calc() {
  const w = toNum(document.getElementById('width').value);
  const h = toNum(document.getElementById('height').value);
  const q = Math.max(1, toNum(document.getElementById('qty').value, 1));
  const model = document.getElementById('model').value; // saray | super
  const glassKey = document.getElementById('glass').value;

  const area  = (w/100) * (h/100);
  const perim = 2 * ((w/100) + (h/100));

  const glassPrice = PRICING.glassPricesM2[glassKey] ?? 0;
  const glassCost  = area * glassPrice;

  let linearCostPerM = 0;
  PRICING.linearItems.forEach(item => {
    const mult = (item.trackMultiplier && item.trackMultiplier[model]) ?? 1;
    linearCostPerM += item.pricePerM * mult;
  });
  const linearCost = perim * linearCostPerM;

  let hplPerM2 = 0;
  PRICING.hplItems.forEach(item => { hplPerM2 += item.pricePerM2; });
  const hplCost = area * hplPerM2;

  const internalPerWindow = glassCost + linearCost + hplCost;
  const totalInternal     = internalPerWindow * q;

  document.getElementById('areaOut').textContent = fmt(area);
  document.getElementById('perimOut').textContent = fmt(perim);
  document.getElementById('glassOut').textContent = fmt(glassCost);
  document.getElementById('linearOut').textContent = fmt(linearCost);
  document.getElementById('hplOut').textContent = fmt(hplCost);
  document.getElementById('costPerWindowOut').textContent = fmt(internalPerWindow);
  document.getElementById('totalCostOut').textContent = fmt(totalInternal);

  const msg = [
    "طلب تسعير نافذة:",
    `الموديل: ${model==="saray"?"سرايا":"سوبر سرايا"}`,
    `الزجاج: ${glassKey}`,
    `العرض×الارتفاع (سم): ${w}×${h}`,
    `الكمية: ${q}`,
    `تكلفة داخلية تقديرية: ${fmt(totalInternal)} ر.س`
  ].join("\n");
  const waUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
  document.getElementById('waQuote').href = waUrl;

  document.getElementById('results').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', init);
