import { state, installedIds } from '../state.js';
import { euro, avgStat, invAdd, log, showNotification } from '../helpers.js';
import { clearChildren, createArt, formatStatKey, getItemArt, getPrimaryStat, getTopStats } from './shared.js';

let micTypeListenerAdded = false;

function getUnlockedItems(cat) {
  return (state.itemsByCategory.get(cat) || []).filter(it => Number(it.unlock_level || 1) <= Number(state.player.level || 1));
}

function pickBestItem(cat, statKey) {
  const items = getUnlockedItems(cat);
  if (!items.length) return null;
  if (statKey) {
    const scored = items.map(it => ({ it, val: Number((it.stats && it.stats[statKey]) || 0) }));
    scored.sort((a, b) => b.val - a.val || Number(a.it.price || 0) - Number(b.it.price || 0));
    return scored[0].it;
  }
  items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  return items[0];
}

function pickItemByName(name) {
  if (!name) return null;
  for (const it of state.itemsById.values()) {
    if (it && it.name === name) return it;
  }
  return null;
}

function buildBundles(roomIndex) {
  const bundles = [];
  const room = state.db.rooms[roomIndex];
  const roomType = room ? room.type : 'control_room';
  const isSmallControlRoom = roomType === 'control_room' && Number(room && room.size_m2 || 0) > 0 && Number(room.size_m2) <= 16;

  if (isSmallControlRoom) {
    const bundleItems = [
      pickItemByName('t.akustik QRD Diffusor'),
      pickItemByName('t.akustik QRD Diffusor'),
      pickItemByName('Mackie CR4-X'),
      pickItemByName('Mackie CR4-X'),
      pickItemByName('Audacity')
    ].filter(Boolean);
    if (bundleItems.length) {
      bundles.push({ name: 'Control Room Essentials', items: bundleItems, total: 350, fixedTotal: true });
    }
    const vocalItems = [
      pickItemByName('Micròfon Condensador Vocal'),
      pickItemByName('Behringer MIC200 Tube Ultragain'),
      pickItemByName('Tascam TH-02'),
      pickItemByName('the sssnake XLR3 Basic'),
      pickItemByName('the sssnake XLR3 Basic'),
      pickItemByName('Millenium MS3003'),
      pickItemByName('Focusrite Scarlett Solo 4th Gen')
    ].filter(Boolean);
    if (vocalItems.length) {
      bundles.push({ name: 'Vocal Starter Pack', items: vocalItems, total: 300, fixedTotal: true });
    }
    // const bundleCheat = [
    //   pickItemByName('RPG Skyline Diffuser'),
    //   pickItemByName('RPG Skyline Diffuser'),
    //   pickItemByName('RPG Skyline Diffuser'),
    //   pickItemByName('Vicoustic Multifuser Wood 36'),
    //   pickItemByName('GIK Acoustics Soffit Bass Trap'),
    //   pickItemByName('GIK Acoustics Soffit Bass Trap'),
    //   pickItemByName('Mogami Gold XLR'),
    //   pickItemByName('Mogami Gold XLR'),
    //   pickItemByName('Mogami Gold XLR'),
    //   pickItemByName('Mogami Gold XLR'),
    //   pickItemByName('Plate Reverb'),
    //   pickItemByName('Grace Design m900'),
    //   pickItemByName('Neumann NDH 20'),
    //   pickItemByName('Neumann NDH 20'),
    //   pickItemByName('Neutrik NYS-SPP-L1-2'),
    //   pickItemByName('MOTU 1248'),
    //   pickItemByName('Neumann TLM102'),
    //   pickItemByName('Neumann TLM102'),
    //   pickItemByName('Triad-Orbit IO-Equipped Micro Adapters Set'),
    //   pickItemByName('Triad-Orbit IO-Equipped Micro Adapters Set'),
    //   pickItemByName('K&M 21090 Heavy Duty'),
    //   pickItemByName('K&M 21090 Heavy Duty'),
    //   pickItemByName('Neumann KH310'),
    //   pickItemByName('Neumann KH310'),
    //   pickItemByName('Avalon VT-737sp'),
    //   pickItemByName('Avalon VT-737sp'),
    //   pickItemByName('Zaor Onda Angled Rack 10U'),
    //   pickItemByName('Pro Tools Ultimate'),
    //   pickItemByName('Native Instruments Komplete Kontrol S88 Mk3'),
    //   pickItemByName('Guitarra Elèctrica Fender')
    // ].filter(Boolean);
    // if (bundleCheat.length) {
    //   bundles.push({ name: 'Bundle Cheat', items: bundleCheat, total: 5000, fixedTotal: true });
    // }
    return bundles;
  }

  const defs = {
    vocal_booth: [
      { name: 'Vocal Booth Kit', items: [
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'preamp', stat: 'preamp_quality' },
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'headphones', stat: 'hp_accuracy' },
        { cat: 'cable' },
        { cat: 'mic_stand' }
      ]}
    ],
    live_room: [
      { name: 'Live Tracking Pack', items: [
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'preamp_multi', stat: 'preamp_quality' },
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'headphone_amp' },
        { cat: 'cable' }
      ]}
    ],
    mastering_suite: [
      { name: 'Mastering Suite', items: [
        { cat: 'monitor', stat: 'monitor_accuracy' },
        { cat: 'acoustic_treatment', stat: 'room_acoustic_add' },
        { cat: 'software_mix_master', stat: 'daw_quality' },
        { cat: 'effects' }
      ]}
    ],
    podcast_studio: [
      { name: 'Podcast Studio Kit', items: [
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'preamp', stat: 'preamp_quality' },
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'headphones', stat: 'hp_accuracy' },
        { cat: 'pop_filter' },
        { cat: 'mic_stand' },
        { cat: 'software_daw', stat: 'daw_quality' }
      ]}
    ],
    foley_room: [
      { name: 'Foley Essentials', items: [
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'preamp', stat: 'preamp_quality' },
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'headphones', stat: 'hp_accuracy' },
        { cat: 'instruments', stat: 'instrument_quality' },
        { cat: 'effects' }
      ]}
    ],
    streaming_room: [
      { name: 'Streaming Rig', items: [
        { cat: 'mic', stat: 'mic_quality' },
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'headphones', stat: 'hp_accuracy' },
        { cat: 'software', stat: 'daw_quality' }
      ]}
    ],
    control_room: [
      { name: 'Mix Suite', items: [
        { cat: 'monitor', stat: 'monitor_accuracy' },
        { cat: 'acoustic_treatment', stat: 'room_acoustic_add' },
        { cat: 'software_mix_master', stat: 'daw_quality' }
      ]},
      { name: 'Production Pack', items: [
        { cat: 'interface', stat: 'conversion_quality' },
        { cat: 'software', stat: 'daw_quality' },
        { cat: 'midi_controller' },
        { cat: 'instruments', stat: 'instrument_quality' }
      ]}
    ]
  };

  const genreBundles = [];
  const genres = state.reputation && state.reputation.byGenre ? Object.keys(state.reputation.byGenre) : [];
  if (genres.includes('rap') || genres.includes('hiphop')) {
    genreBundles.push({ name: 'HipHop Chain', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp', stat: 'preamp_quality' },
      { cat: 'software', stat: 'daw_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' }
    ]});
  }
  if (genres.includes('rock')) {
    genreBundles.push({ name: 'Rock Tracking', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'preamp_multi', stat: 'preamp_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphone_amp' }
    ]});
  }
  if (genres.includes('podcast')) {
    genreBundles.push({ name: 'Podcast Duo', items: [
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'mic', stat: 'mic_quality' },
      { cat: 'interface', stat: 'conversion_quality' },
      { cat: 'headphones', stat: 'hp_accuracy' }
    ]});
  }

  const bundleDefs = [...(defs[roomType] || defs.control_room), ...genreBundles];

  for (const def of bundleDefs) {
    const picks = [];
    for (const entry of def.items) {
      const pick = pickBestItem(entry.cat, entry.stat);
      if (pick) picks.push(pick);
    }
    if (picks.length) {
      const total = picks.reduce((sum, it) => sum + Number(it.price || 0), 0);
      bundles.push({ name: def.name, items: picks, total });
    }
  }
  return bundles;
}

function buildUpgradePlan(roomIndex) {
  const plan = [];
  const room = state.db.rooms[roomIndex];
  const isSmallControlRoom = room && room.type === 'control_room' && Number(room.size_m2 || 0) > 0 && Number(room.size_m2) <= 16;
  if (isSmallControlRoom) return plan;
  const categories = [
    { cat: 'mic', stat: 'mic_quality' },
    { cat: 'preamp', stat: 'preamp_quality' },
    { cat: 'interface', stat: 'conversion_quality' },
    { cat: 'monitor', stat: 'monitor_accuracy' },
    { cat: 'headphones', stat: 'hp_accuracy' },
    { cat: 'software', stat: 'daw_quality' }
  ];
  for (const entry of categories) {
    const installed = installedIds(roomIndex, entry.cat).map(id => state.itemsById.get(id)).filter(Boolean);
    const current = avgStat(installed, entry.stat);
    const candidates = getUnlockedItems(entry.cat)
      .map(it => ({ it, val: Number((it.stats && it.stats[entry.stat]) || 0) }))
      .filter(row => row.val > current)
      .sort((a, b) => a.it.price - b.it.price || b.val - a.val);
    if (candidates.length) {
      plan.push({
        cat: entry.cat,
        item: candidates[0].it,
        diff: Math.round((candidates[0].val - current) * 10) / 10
      });
    }
  }
  return plan;
}

function buyBundle(bundle, { renderAll } = {}) {
  const items = bundle.items || [];
  const total = bundle.fixedTotal ? Number(bundle.total || 0) : items.reduce((sum, it) => sum + Number(it.price || 0), 0);
  if (state.cash < total) { log(`❌ No tens prou diners (${euro(total)})`); return; }
  state.cash -= total;
  for (const it of items) invAdd(it.id, 1);
  log(`🧺 Bundle comprat per ${euro(total)}`);
  showNotification(`🧺 Bundle comprat`);
  if (typeof window !== 'undefined' && typeof window.saveState === 'function') window.saveState();
  if (typeof renderAll === 'function') renderAll();
}

export function renderShop(options = {}) {
  const { renderRight, renderAll } = options;
  const opts = options;
  const cats = Array.from(state.itemsByCategory.keys()).sort();
  const sel = document.getElementById('selCategory');
  if (!sel.options.length) {
    for (const c of cats) sel.add(new Option(c, c));
  }
  if (!cats.includes(sel.value) && cats.length) sel.value = cats[0];

  const q = document.getElementById('txtSearch').value.trim().toLowerCase();
  const cat = sel.value;
  const micTypeSelect = document.getElementById('selMicType');

  const micTypeDiv = document.getElementById('micTypeFilter');
  if (cat === 'mic') {
    micTypeDiv.style.display = 'block';
    if (!micTypeListenerAdded) {
      const updateMicFilter = () => {
        renderShop(opts);
      };
      micTypeSelect.addEventListener('change', updateMicFilter);
      micTypeSelect.addEventListener('input', updateMicFilter);
      micTypeListenerAdded = true;
    }
  } else {
    micTypeDiv.style.display = 'none';
    micTypeSelect.value = '';
  }

  const micTypeFilter = micTypeSelect.value;

  let items = (state.itemsByCategory.get(cat) || []).filter(it => {
    const unlocked = Number(it.unlock_level || 1) <= Number(state.player.level || 1);
    const matchesSearch = !q || String(it.name || '').toLowerCase().includes(q);
    const matchesMicType = !micTypeFilter || (Array.isArray(it.type) && it.type.includes(micTypeFilter));
    const passes = unlocked && matchesSearch && matchesMicType;
    return passes;
  });

  if (!items.some(it => it.id === state.selected.shopItemId)) {
    state.selected.shopItemId = items.length ? items[0].id : null;
  }

  const shopMeta = document.getElementById('shopMeta'); if (shopMeta) shopMeta.textContent = `${items.length} items`;

  const bundleWrap = document.getElementById('shopBundles');
  if (bundleWrap) {
    clearChildren(bundleWrap);
    const bundles = buildBundles(state.selected.roomIndex);
    const plan = buildUpgradePlan(state.selected.roomIndex);
    if (bundles.length || plan.length) {
      const bundleTitle = document.createElement('div'); bundleTitle.className = 'bundle-title'; bundleTitle.textContent = 'Bundles i plans';
      bundleWrap.appendChild(bundleTitle);
    }
    const bundleGrid = document.createElement('div'); bundleGrid.className = 'bundle-grid';
    for (const b of bundles) {
      const card = document.createElement('div'); card.className = 'bundle-card';
      const name = document.createElement('div'); name.className = 'bundle-name'; name.textContent = b.name;
      const list = document.createElement('div'); list.className = 'bundle-items';
      b.items.forEach(it => {
        const row = document.createElement('div'); row.className = 'bundle-item';
        row.textContent = `${it.name} · ${euro(it.price || 0)}`;
        list.appendChild(row);
      });
      const total = document.createElement('div'); total.className = 'bundle-total'; total.textContent = `Total ${euro(b.total)}`;
      const btn = document.createElement('button'); btn.className = 'btn2 btnOk'; btn.textContent = 'Comprar bundle';
      btn.addEventListener('click', () => buyBundle(b, { renderAll }));
      card.appendChild(name); card.appendChild(list); card.appendChild(total); card.appendChild(btn);
      bundleGrid.appendChild(card);
    }
    if (plan.length) {
      const planCard = document.createElement('div'); planCard.className = 'bundle-card';
      const title = document.createElement('div'); title.className = 'bundle-name'; title.textContent = 'Upgrade Plan';
      const list = document.createElement('div'); list.className = 'bundle-items';
      plan.slice(0, 4).forEach(p => {
        const row = document.createElement('div'); row.className = 'bundle-item';
        row.textContent = `${p.cat}: ${p.item.name} (+${p.diff}) · ${euro(p.item.price || 0)}`;
        list.appendChild(row);
      });
      planCard.appendChild(title); planCard.appendChild(list);
      bundleGrid.appendChild(planCard);
    }
    bundleWrap.appendChild(bundleGrid);
  }

  const list = document.getElementById('shopList');
  clearChildren(list);
  if (list) {
    list.classList.remove('list');
    if (!list.classList.contains('shop-grid')) list.classList.add('shop-grid');
  }
  for (const it of items.slice(0, 200)) {
    const div = document.createElement('div');
    div.className = 'card shop-card' + (it.id === state.selected.shopItemId ? ' active' : '');
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      state.selected.shopItemId = it.id;
      renderShop(opts);
      if (typeof renderRight === 'function') renderRight();
    });
    const layout = document.createElement('div');
    layout.className = 'card-grid';
    const art = createArt(getItemArt(it), `${it.name} art`);
    const body = document.createElement('div');
    body.className = 'card-body';
    const tier = it.tier || 'mid';
    const tierPill = tier === 'pro' ? 'ok' : tier === 'low' ? 'bad' : '';

    const row = document.createElement('div'); row.className = 'row';
    const b = document.createElement('b'); b.textContent = it.name;
    const pill = document.createElement('span'); pill.className = `pill ${tierPill}`; pill.textContent = tier;
    row.appendChild(b); row.appendChild(pill);

    const row2 = document.createElement('div'); row2.className = 'shop-sub';
    const catSpan = document.createElement('span'); catSpan.className = 'shop-cat'; catSpan.textContent = it.category;
    const priceSpan = document.createElement('span'); priceSpan.className = 'shop-price'; priceSpan.textContent = euro(it.price || 0);
    row2.appendChild(catSpan); row2.appendChild(priceSpan);

    const notes = document.createElement('div'); notes.className = 'shop-notes'; notes.textContent = it.notes ? it.notes : '';

    const statWrap = document.createElement('div'); statWrap.className = 'inventory-stats';
    const topStats = getTopStats(it, 3);
    for (const st of topStats) {
      const chip = document.createElement('div'); chip.className = 'stat-chip';
      chip.textContent = `${formatStatKey(st.key)} ${st.value}`;
      statWrap.appendChild(chip);
    }

    const selected = state.itemsById.get(state.selected.shopItemId);
    let compareRow = null;
    let compareStats = null;
    if (selected && selected.id !== it.id && selected.category === it.category) {
      compareRow = document.createElement('div'); compareRow.className = 'compare-row';
      const primary = getPrimaryStat(it);
      const primarySel = getPrimaryStat(selected);
      const chunks = [];
      if (primary && primarySel && primary.key === primarySel.key) {
        const diff = Number(primary.value) - Number(primarySel.value);
        if (diff !== 0) chunks.push({
          text: `${formatStatKey(primary.key)} ${diff > 0 ? `+${diff}` : diff}`,
          cls: diff > 0 ? 'compare-up' : 'compare-down'
        });
      }
      const priceDiff = Number(it.price || 0) - Number(selected.price || 0);
      if (priceDiff !== 0) chunks.push({
        text: `€ ${priceDiff > 0 ? `+${priceDiff}` : priceDiff}`,
        cls: priceDiff > 0 ? 'compare-down' : 'compare-up'
      });
      if (chunks.length) {
        compareRow.appendChild(document.createTextNode('Comparacio: '));
        chunks.forEach((chunk, idx) => {
          const span = document.createElement('span'); span.className = chunk.cls; span.textContent = chunk.text;
          compareRow.appendChild(span);
          if (idx < chunks.length - 1) compareRow.appendChild(document.createTextNode(' · '));
        });
      } else {
        compareRow = null;
      }

      const aStats = it.stats || {};
      const bStats = selected.stats || {};
      const keys = Array.from(new Set([...Object.keys(aStats), ...Object.keys(bStats)]))
        .filter(k => typeof aStats[k] === 'number' || typeof bStats[k] === 'number');
      const diffs = keys.map(k => ({
        key: k,
        diff: Number(aStats[k] || 0) - Number(bStats[k] || 0)
      })).filter(d => d.diff !== 0);
      diffs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
      if (diffs.length) {
        compareStats = document.createElement('div');
        compareStats.className = 'compare-stats';
        diffs.slice(0, 4).forEach(d => {
          const row = document.createElement('div'); row.className = 'compare-stat';
          const label = document.createElement('span'); label.textContent = formatStatKey(d.key);
          const val = document.createElement('span');
          val.className = d.diff > 0 ? 'compare-up' : 'compare-down';
          val.textContent = d.diff > 0 ? `+${d.diff}` : `${d.diff}`;
          row.appendChild(label); row.appendChild(val);
          compareStats.appendChild(row);
        });
      }
    }

    body.appendChild(row); body.appendChild(row2);
    if (notes.textContent) body.appendChild(notes);
    if (statWrap.childNodes.length) body.appendChild(statWrap);
    if (art) layout.appendChild(art);
    layout.appendChild(body);
    div.appendChild(layout);
    if (compareRow) div.appendChild(compareRow);
    if (compareStats) div.appendChild(compareStats);

    if (it.category === 'mic' && it.type && it.type.length) {
      const micTypes = document.createElement('div'); micTypes.className = 'tiny'; micTypes.style.marginTop = '4px'; micTypes.textContent = `Tipus: ${it.type.join(', ')}`;
      div.appendChild(micTypes);
    }

    const quickBtn = document.createElement('button');
    quickBtn.className = 'btn2 btnOk btn-quick';
    quickBtn.textContent = 'Compra rapida';
    quickBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selected.shopItemId = it.id;
      if (typeof window !== 'undefined' && typeof window.buySelected === 'function') window.buySelected();
      renderShop(opts);
      if (typeof renderRight === 'function') renderRight();
    });
    const actions = document.createElement('div'); actions.className = 'shop-actions-row';
    actions.appendChild(quickBtn);
    div.appendChild(actions);

    list.appendChild(div);
  }
}
