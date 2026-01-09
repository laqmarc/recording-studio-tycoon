// ui_render.cjs - CommonJS adapter used by Jest tests (minimal implementation)
function clearChildren(el) {
  while (el && el.firstChild) el.removeChild(el.firstChild);
}

function renderShop() {
  const sel = document.getElementById('selCategory');
  if (!sel) return;
  if (!sel.options.length) {
    const cats = Array.from((global.state && global.state.itemsByCategory && global.state.itemsByCategory.keys()) || []).sort();
    for (const c of cats) sel.add(new Option(c, c));
  }
  const q = (document.getElementById('txtSearch') && document.getElementById('txtSearch').value || '').trim().toLowerCase();
  const cat = sel.value || (sel.options[0] && sel.options[0].value) || '';
  const list = document.getElementById('shopList'); if (!list) return;
  clearChildren(list);
  const items = (global.state && global.state.itemsByCategory && global.state.itemsByCategory.get(cat)) || [];
  for (const it of items) {
    if (q && !(String(it.name||'').toLowerCase().includes(q))) continue;
    const div = document.createElement('div');
    div.className = 'card';
    div.style.cursor = 'pointer';
    div.textContent = it.name;
    div.addEventListener('click', () => { if (global.state && global.state.selected) global.state.selected.shopItemId = it.id; });
    list.appendChild(div);
  }
  const meta = document.getElementById('shopMeta'); if (meta) meta.textContent = `${(items && items.length) || 0} items`;
}

function renderRight() {
  const details = document.getElementById('roomDetails');
  if (!details) return;
  clearChildren(details);
  const nm = document.createElement('div'); nm.className = 'muted'; nm.textContent = 'Detalls de la sala';
  details.appendChild(nm);
  const k = document.getElementById('kpis'); if (k) { clearChildren(k); const box = document.createElement('div'); box.className = 'box'; box.textContent = `XP: ${((global.xpToNext && global.xpToNext(global.state && global.state.player && global.state.player.level)) || 0)}`; k.appendChild(box); }
}

function renderAll() { renderShop(); renderRight(); }

module.exports = { renderShop, renderRight, renderAll, clearChildren };
