import { INGREDIENTS, RECIPES, FORMATS, CATEGORIES, list } from './data.js';

// ---------- storage (browser only, wrapped so private mode never breaks the page) ----------
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem('dinnerwheel:' + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('dinnerwheel:' + key, JSON.stringify(value));
    } catch {
      /* storage unavailable: app still works for this visit */
    }
  },
};

const defaultOwned = () => INGREDIENTS.filter((i) => i.have).map((i) => i.id);

const state = {
  owned: new Set(store.get('owned', defaultOwned())),
  customIngredients: store.get('customIngredients', []),
  customRecipes: store.get('customRecipes', []),
  history: store.get('history', []),
  week: store.get('week', null),
  includeTreats: store.get('includeTreats', false),
  ideas: [],
  tonight: null,
  wheelItems: [],
  recipeFilter: 'ready',
  search: '',
};

const save = {
  owned: () => store.set('owned', [...state.owned]),
  customIngredients: () => store.set('customIngredients', state.customIngredients),
  customRecipes: () => store.set('customRecipes', state.customRecipes),
  history: () => store.set('history', state.history),
  week: () => store.set('week', state.week),
  includeTreats: () => store.set('includeTreats', state.includeTreats),
};

// ---------- helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sample = (arr, n) => shuffle(arr).slice(0, n);
const slug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const allIngredients = () => [...INGREDIENTS, ...state.customIngredients];
let ingMap = new Map();
const rebuildIngMap = () => (ingMap = new Map(allIngredients().map((i) => [i.id, i])));
rebuildIngMap();
const ing = (id) => ingMap.get(id) || { id, name: id.replace(/-/g, ' '), short: id, role: 'other' };

const allRecipes = () => [...RECIPES, ...state.customRecipes];
const recipeById = (id) => allRecipes().find((r) => r.id === id);
const has = (id) => state.owned.has(id);
const missingFor = (r) => r.req.filter((id) => !has(id));
const eligible = (r) => state.includeTreats || !r.occasional;
const recentIds = () => [...new Set(state.history.slice(0, 4).map((h) => h.id))];

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 2600);
}

// ---------- recipe rendering ----------
function ingredientListHTML(r) {
  const row = (id, optional) => {
    const ok = has(id);
    const cls = ok ? 'have' : optional ? 'opt-missing' : 'missing';
    const mark = ok ? '✓' : optional ? '·' : '!';
    const note = !ok && !optional ? '<span class="need">need</span>' : optional ? '<span class="optl">optional</span>' : '';
    return `<li class="${cls}"><span class="mark" aria-hidden="true">${mark}</span>${esc(ing(id).name)}${note}</li>`;
  };
  return `<ul class="ings">${r.req.map((id) => row(id, false)).join('')}${(r.opt || []).map((id) => row(id, true)).join('')}</ul>`;
}

function badgesHTML(r) {
  const miss = missingFor(r).length;
  const b = [];
  b.push(`<span class="badge">${r.minutes} min</span>`);
  b.push(miss === 0 ? '<span class="badge ok">Ready</span>' : `<span class="badge warn">Missing ${miss}</span>`);
  if (r.batch) b.push('<span class="badge">Batch-friendly</span>');
  if (r.occasional) b.push('<span class="badge treat">Occasional</span>');
  if (r.generated) b.push('<span class="badge mine">Your idea</span>');
  return `<div class="badges">${b.join('')}</div>`;
}

function recipeBodyHTML(r) {
  return `
    ${ingredientListHTML(r)}
    <ol class="steps">${r.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
    ${r.tip ? `<p class="tip">${esc(r.tip)}</p>` : ''}
    <p class="plate"><strong>Plate it:</strong> half veg, a palm or more of protein, a fist of carbs.</p>`;
}

// ---------- TONIGHT ----------
let wheel = null;

function wheelPool() {
  const ready = allRecipes().filter((r) => eligible(r) && missingFor(r).length === 0);
  const recent = new Set(recentIds());
  let pool = ready.filter((r) => !recent.has(r.id));
  if (pool.length < 3) pool = ready;
  return shuffle(pool).slice(0, 8);
}

function refreshWheel() {
  state.wheelItems = wheelPool();
  const labels = state.wheelItems.length ? state.wheelItems.map((r) => r.short || r.name) : ['Restock', 'the', 'pantry'];
  if (wheel) wheel.setItems(labels);
  $('#spin').disabled = state.wheelItems.length === 0;
  $('#wheel-empty').hidden = state.wheelItems.length !== 0;
  $('#wheel-count').textContent = state.wheelItems.length
    ? `${state.wheelItems.length} dinner${state.wheelItems.length === 1 ? '' : 's'} you can make right now`
    : 'Nothing fully stocked';
}

function renderTonightResult() {
  const box = $('#tonight-result');
  const r = state.tonight;
  if (!r) {
    box.innerHTML = `
      <div class="empty-result">
        <p class="eyebrow">Tonight</p>
        <h2>Spin for dinner</h2>
        <p>Only dinners you can make from your pantry go on the wheel, and anything you cooked recently sits out a turn.</p>
      </div>`;
    return;
  }
  box.innerHTML = `
    <p class="eyebrow">Tonight</p>
    <h2>${esc(r.name)}</h2>
    ${badgesHTML(r)}
    ${recipeBodyHTML(r)}
    <div class="actions">
      <button class="btn primary" data-action="cooked" data-id="${esc(r.id)}">Cooked it</button>
      <button class="btn" data-action="spin">Spin again</button>
    </div>`;
  box.classList.remove('pop');
  void box.offsetWidth;
  box.classList.add('pop');
}

function renderHistory() {
  const el = $('#history');
  if (!state.history.length) {
    el.innerHTML = '<p class="muted small">Nothing logged yet. Hit "Cooked it" after dinner and the wheel will rotate it out for a few nights.</p>';
    return;
  }
  el.innerHTML = `<ul class="history-list">${state.history
    .slice(0, 6)
    .map((h) => `<li><span>${esc(h.name)}</span><time>${new Date(h.at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</time></li>`)
    .join('')}</ul>`;
}

let spinning = false;
async function spin() {
  if (spinning || !state.wheelItems.length) return;
  spinning = true;
  $('#spin').disabled = true;
  const idx = Math.floor(Math.random() * state.wheelItems.length);
  const r = state.wheelItems[idx];
  if (wheel) await wheel.spinTo(idx);
  state.tonight = r;
  renderTonightResult();
  $('#live').textContent = `Tonight: ${r.name}`;
  spinning = false;
  $('#spin').disabled = false;
  if (window.matchMedia('(max-width: 860px)').matches) $('#tonight-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function markCooked(id) {
  const r = recipeById(id) || (state.tonight && state.tonight.id === id ? state.tonight : null);
  if (!r) return;
  state.history.unshift({ id: r.id, name: r.name, at: Date.now() });
  state.history = state.history.slice(0, 30);
  save.history();
  renderHistory();
  toast('Logged. Kitchen closes after this one.');
  state.tonight = null;
  renderTonightResult();
  refreshWheel();
}

// ---------- WEEK ----------
const BATCHABLE = {
  'chicken-breast': 'bake 4 chicken breasts',
  'ground-turkey': 'brown 2 lbs ground turkey',
  'ground-beef': 'brown 2 lbs ground beef',
  'chicken-sausage-meatballs': 'bake a tray of meatballs',
};

function orderByVariety(recipes) {
  const out = [];
  const left = recipes.slice();
  while (left.length) {
    const prev = out[out.length - 1];
    let i = left.findIndex((r) => !prev || r.main !== prev.main);
    if (i < 0) i = 0;
    out.push(left.splice(i, 1)[0]);
  }
  return out;
}

function planWeek() {
  const pool = shuffle(allRecipes().filter(eligible))
    .map((r) => ({ r, miss: missingFor(r).length }))
    .filter((x) => x.miss <= 1)
    .sort((a, b) => a.miss - b.miss);
  const picks = [];
  const perMain = {};
  for (const { r } of pool) {
    if (picks.length >= 6) break;
    if ((perMain[r.main] || 0) >= 2) continue;
    perMain[r.main] = (perMain[r.main] || 0) + 1;
    picks.push(r);
  }
  const ordered = orderByVariety(picks).map((r) => r.id);
  // One leftovers night, placed where batch cooking pays off.
  ordered.splice(Math.min(3, ordered.length), 0, 'leftovers');
  while (ordered.length < 7) ordered.push('leftovers');
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  state.week = { start: start.getTime(), ids: ordered.slice(0, 7) };
  save.week();
  renderWeek();
}

function swapDay(i) {
  const used = new Set(state.week.ids);
  const options = allRecipes().filter((r) => eligible(r) && !used.has(r.id) && missingFor(r).length <= 1);
  if (!options.length) return toast('No other dinners to swap in. Add some ideas or restock.');
  state.week.ids[i] = pick(options).id;
  save.week();
  renderWeek();
}

const LEFTOVERS = {
  id: 'leftovers', name: 'Leftovers night', short: 'Leftovers', minutes: 5, req: [], opt: [],
  steps: ['Reheat whatever batch protein and veg is left. Build a bowl or a wrap.'],
};

function renderWeek() {
  const el = $('#week-body');
  if (!state.week) {
    el.innerHTML = '<div class="empty-block"><p>Plan seven dinners from what you have, with batch-cooking days and a shopping list for anything missing.</p></div>';
    return;
  }
  const days = state.week.ids.map((id, i) => {
    const d = new Date(state.week.start + i * 86400000);
    return { i, d, r: id === 'leftovers' ? LEFTOVERS : recipeById(id) || LEFTOVERS };
  });

  const cards = days
    .map(({ i, d, r }) => {
      const miss = missingFor(r);
      return `
      <article class="day ${r.id === 'leftovers' ? 'leftovers' : ''}">
        <header>
          <span class="dow">${d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
          <span class="date">${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </header>
        <h3>${esc(r.name)}</h3>
        ${miss.length ? `<p class="need-line">Need: ${esc(list(miss.map((m) => ing(m).name.toLowerCase())))}</p>` : '<p class="ok-line">Ready</p>'}
        <div class="day-actions">
          ${r.id !== 'leftovers' ? `<button class="link" data-action="view" data-id="${esc(r.id)}">Recipe</button>` : ''}
          <button class="link" data-action="swap" data-day="${i}">Swap</button>
        </div>
      </article>`;
    })
    .join('');

  // batch prep: first half of the week, second half
  const half = (from, to) => {
    const mains = new Set();
    days.slice(from, to).forEach(({ r }) => {
      [r.main, ...(r.req || [])].forEach((id) => BATCHABLE[id] && mains.add(id));
    });
    return [...mains].map((id) => BATCHABLE[id]);
  };
  const p1 = half(0, 4);
  const p2 = half(4, 7);
  const dayName = (i) => days[i].d.toLocaleDateString(undefined, { weekday: 'long' });
  const prep = `
    <section class="panel-card">
      <h3>Batch cook</h3>
      <ul class="prep">
        <li><strong>${dayName(0)}:</strong> ${p1.length ? esc(list(p1)) : 'nothing to batch'}</li>
        <li><strong>${dayName(4)}:</strong> ${p2.length ? esc(list(p2)) : 'nothing to batch'}</li>
      </ul>
      <p class="muted small">Cooked meat keeps 3 to 4 days in the fridge, so two cook days cover the week.</p>
    </section>`;

  const need = [...new Set(days.flatMap(({ r }) => missingFor(r)))];
  const shopping = `
    <section class="panel-card">
      <h3>Shopping list</h3>
      ${need.length
        ? `<ul class="shop">${need.map((id) => `<li><label><input type="checkbox"> ${esc(ing(id).name)}</label></li>`).join('')}</ul>
           <button class="btn small" data-action="copy-shop">Copy list</button>`
        : '<p class="muted small">You have everything for this week.</p>'}
    </section>`;

  el.innerHTML = `<div class="week-grid">${cards}</div><div class="week-side">${prep}${shopping}</div>`;
}

// ---------- IDEAS ----------
function vegFor(f) {
  return [...f.veg, ...state.customIngredients.filter((i) => i.role === 'veg').map((i) => i.id)];
}
function carbsFor(fk, f) {
  return [...f.carbs, ...state.customIngredients.filter((i) => i.role === 'carb' && (i.formats || []).includes(fk)).map((i) => i.id)];
}
function saucesFor(fk, f) {
  return [...f.sauces, ...state.customIngredients.filter((i) => i.role === 'sauce' && (i.formats || []).includes(fk)).map((i) => i.id)];
}

function generateIdeas(n = 3) {
  const proteins = allIngredients().filter((i) => i.role === 'protein' && has(i.id) && (state.includeTreats || !i.treat));
  const combos = [];
  for (const p of proteins) {
    for (const [fk, f] of Object.entries(FORMATS)) {
      if (!(p.formats || []).includes(fk)) continue;
      if (!f.needs.every(has)) continue;
      const carbs = carbsFor(fk, f).filter(has);
      const sauces = saucesFor(fk, f).filter(has);
      const veg = vegFor(f).filter(has);
      if (!carbs.length || !veg.length) continue;
      if (!sauces.length && !f.sauceOptional) continue;
      combos.push({ fk, f, p, carbs, sauces, veg });
    }
  }
  const shuffled = shuffle(combos);
  const chosen = [];
  const usedF = new Set();
  const usedP = new Set();
  for (const c of shuffled) {
    if (chosen.length >= n) break;
    if (usedF.has(c.fk) || usedP.has(c.p.id)) continue;
    usedF.add(c.fk);
    usedP.add(c.p.id);
    chosen.push(c);
  }
  for (const c of shuffled) {
    if (chosen.length >= n) break;
    if (!chosen.includes(c)) chosen.push(c);
  }
  return chosen.map(buildIdea);
}

function buildIdea({ fk, f, p, carbs, sauces, veg }) {
  const c = ing(pick(carbs));
  const sId = sauces.length && (!f.sauceOptional || Math.random() < 0.75) ? pick(sauces) : null;
  const s = sId ? ing(sId) : null;
  const v = sample(veg, Math.min(f.vegCount, veg.length)).map(ing);
  const x = (f.extras || []).filter((id) => has(id) && id !== sId);
  const req = [...new Set([p.id, c.id, ...v.map((y) => y.id), ...(sId ? [sId] : []), ...f.needs])];
  const name = f.name({ p, c, s: s || { adj: '', name: '' } }).replace(/\s+/g, ' ').trim();
  return {
    id: 'idea-' + slug([fk, p.id, c.id, sId || 'plain', ...v.map((y) => y.id)].join('-')),
    name,
    short: name.length > 20 ? `${p.short} ${f.label}` : name,
    main: p.id,
    minutes: f.minutes,
    req,
    opt: x,
    steps: f.steps({ p, c, v, s, x }).filter(Boolean),
    tip: 'Built from your pantry. Save it and it joins the wheel.',
    generated: true,
    occasional: !!p.treat,
  };
}

function renderIdeas() {
  const el = $('#ideas-body');
  if (!state.ideas.length) {
    el.innerHTML = '<div class="empty-block"><p>Mixes your pantry into new dinners: a protein, a carb, two or three veg, and a sauce, dropped into a format that fits (bowl, stir-fry, tacos, sheet pan, pasta, soup, and more).</p></div>';
    return;
  }
  const savedIds = new Set(state.customRecipes.map((r) => r.id));
  el.innerHTML = `<div class="idea-grid">${state.ideas
    .map(
      (r) => `
      <article class="idea">
        <h3>${esc(r.name)}</h3>
        ${badgesHTML(r)}
        ${recipeBodyHTML(r)}
        <div class="actions">
          ${savedIds.has(r.id)
            ? '<button class="btn" disabled>Saved</button>'
            : `<button class="btn primary" data-action="save-idea" data-id="${esc(r.id)}">Save to recipes</button>`}
          <button class="btn" data-action="cook-idea" data-id="${esc(r.id)}">Make it tonight</button>
        </div>
      </article>`
    )
    .join('')}</div>`;
}

// ---------- RECIPES ----------
function renderRecipes() {
  const el = $('#recipes-body');
  const q = state.search.trim().toLowerCase();
  let rs = allRecipes().filter(eligible);
  if (state.recipeFilter === 'ready') rs = rs.filter((r) => missingFor(r).length === 0);
  if (state.recipeFilter === 'almost') rs = rs.filter((r) => missingFor(r).length > 0 && missingFor(r).length <= 2);
  if (q) rs = rs.filter((r) => (r.name + ' ' + r.req.map((id) => ing(id).name).join(' ')).toLowerCase().includes(q));
  rs.sort((a, b) => missingFor(a).length - missingFor(b).length || a.name.localeCompare(b.name));

  document.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === state.recipeFilter)));

  if (!rs.length) {
    el.innerHTML = '<p class="muted">No recipes match. Try another filter, or generate some ideas.</p>';
    return;
  }
  el.innerHTML = rs
    .map(
      (r) => `
      <details class="recipe" id="r-${esc(r.id)}">
        <summary>
          <span class="r-name">${esc(r.name)}</span>
          ${badgesHTML(r)}
        </summary>
        <div class="recipe-body">
          ${recipeBodyHTML(r)}
          <div class="actions">
            <button class="btn primary" data-action="cook-recipe" data-id="${esc(r.id)}">Make it tonight</button>
            ${r.generated ? `<button class="btn ghost" data-action="remove-recipe" data-id="${esc(r.id)}">Remove</button>` : ''}
          </div>
        </div>
      </details>`
    )
    .join('');
}

// ---------- PANTRY ----------
function renderPantry() {
  const el = $('#pantry-body');
  const items = allIngredients();
  $('#pantry-count').textContent = `${items.filter((i) => has(i.id)).length} of ${items.length} on hand`;
  el.innerHTML = CATEGORIES.map((cat) => {
    const inCat = items.filter((i) => i.cat === cat);
    if (!inCat.length) return '';
    return `
      <section class="pantry-cat">
        <h3>${esc(cat)}</h3>
        <div class="chips">
          ${inCat
            .map(
              (i) => `<span class="chip-wrap"><button class="chip ${i.treat ? 'treat' : ''}" aria-pressed="${has(i.id)}" data-action="toggle-ing" data-id="${esc(i.id)}">${esc(i.name)}</button>${
                i.custom ? `<button class="chip-x" aria-label="Remove ${esc(i.name)}" data-action="remove-ing" data-id="${esc(i.id)}">×</button>` : ''
              }</span>`
            )
            .join('')}
        </div>
      </section>`;
  }).join('');
}

const ROLE_INFO = {
  protein: { cat: 'Protein', formats: ['bowl', 'stirfry', 'tacos', 'sheetpan', 'pasta', 'friedrice', 'scramble', 'flatbread'] },
  carb: { cat: 'Carbs', formats: ['bowl', 'sheetpan', 'scramble'] },
  veg: { cat: 'Produce & Beans', formats: [] },
  sauce: { cat: 'Sauces & Flavor', formats: ['bowl', 'stirfry', 'tacos', 'sheetpan'] },
  other: { cat: 'Other', formats: [] },
};

function addIngredient(name, role) {
  name = name.trim();
  if (!name) return;
  const id = 'c-' + slug(name);
  if (ingMap.has(id) || INGREDIENTS.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
    const existing = INGREDIENTS.find((i) => i.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      state.owned.add(existing.id);
      save.owned();
      onPantryChange();
      return toast(`${existing.name} is already listed. Marked as on hand.`);
    }
    return toast('That one is already in your pantry.');
  }
  const info = ROLE_INFO[role] || ROLE_INFO.other;
  const title = name.replace(/\b\w/g, (m) => m.toUpperCase());
  state.customIngredients.push({
    id, name, short: title, cat: info.cat, role, custom: true, formats: info.formats,
    prep: `Cook the ${name.toLowerCase()} through to a safe internal temperature, then slice or dice.`,
    how: `Prepare the ${name.toLowerCase()}.`,
    adj: title,
  });
  state.owned.add(id);
  save.customIngredients();
  save.owned();
  rebuildIngMap();
  onPantryChange();
  toast(`Added ${name}.`);
}

function onPantryChange() {
  renderPantry();
  refreshWheel();
  renderRecipes();
  renderWeek();
  if (state.tonight) renderTonightResult();
}

// ---------- tabs ----------
function showTab(name) {
  document.querySelectorAll('[role="tab"]').forEach((t) => {
    const on = t.dataset.tab === name;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
  });
  document.querySelectorAll('[role="tabpanel"]').forEach((p) => (p.hidden = p.id !== 'panel-' + name));
  if (name === 'tonight' && wheel) wheel.resumeIdle();
}

// ---------- events ----------
document.addEventListener('click', (e) => {
  const tab = e.target.closest('[role="tab"]');
  if (tab) return showTab(tab.dataset.tab);

  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  switch (action) {
    case 'spin':
      showTab('tonight');
      spin();
      break;
    case 'cooked':
      markCooked(id);
      break;
    case 'plan-week':
      planWeek();
      toast('Week planned.');
      break;
    case 'swap':
      swapDay(Number(btn.dataset.day));
      break;
    case 'view': {
      showTab('recipes');
      state.recipeFilter = 'all';
      state.search = '';
      $('#recipe-search').value = '';
      renderRecipes();
      const d = document.getElementById('r-' + id);
      if (d) {
        d.open = true;
        d.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      break;
    }
    case 'copy-shop': {
      const items = [...document.querySelectorAll('.shop li')].map((li) => '- ' + li.textContent.trim()).join('\n');
      navigator.clipboard?.writeText(items).then(() => toast('Shopping list copied.'), () => toast('Copy failed. Select and copy by hand.'));
      break;
    }
    case 'gen-ideas':
      state.ideas = generateIdeas(3);
      if (!state.ideas.length) toast('Not enough on hand to build ideas. Add a protein, a carb, and some veg.');
      renderIdeas();
      break;
    case 'save-idea': {
      const r = state.ideas.find((x) => x.id === id);
      if (r && !state.customRecipes.some((x) => x.id === id)) {
        state.customRecipes.push(r);
        save.customRecipes();
        toast('Saved. It joins the wheel when you have everything.');
        renderIdeas();
        renderRecipes();
        refreshWheel();
      }
      break;
    }
    case 'cook-idea':
    case 'cook-recipe': {
      const r = state.ideas.find((x) => x.id === id) || recipeById(id);
      if (r) {
        state.tonight = r;
        renderTonightResult();
        showTab('tonight');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      break;
    }
    case 'remove-recipe':
      state.customRecipes = state.customRecipes.filter((r) => r.id !== id);
      save.customRecipes();
      renderRecipes();
      refreshWheel();
      renderIdeas();
      break;
    case 'toggle-ing':
      state.owned.has(id) ? state.owned.delete(id) : state.owned.add(id);
      save.owned();
      onPantryChange();
      break;
    case 'remove-ing':
      state.customIngredients = state.customIngredients.filter((i) => i.id !== id);
      state.owned.delete(id);
      save.customIngredients();
      save.owned();
      rebuildIngMap();
      onPantryChange();
      break;
    case 'reset-pantry':
      if (confirm('Reset the pantry to the default list? Custom ingredients are kept but unchecked items go back to default.')) {
        state.owned = new Set([...defaultOwned(), ...state.customIngredients.map((i) => i.id)]);
        save.owned();
        onPantryChange();
      }
      break;
  }
});

document.querySelectorAll('[data-filter]').forEach((b) =>
  b.addEventListener('click', () => {
    state.recipeFilter = b.dataset.filter;
    renderRecipes();
  })
);

$('#recipe-search').addEventListener('input', (e) => {
  state.search = e.target.value;
  renderRecipes();
});

$('#add-ing').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#ing-name');
  addIngredient(name.value, $('#ing-role').value);
  name.value = '';
  name.focus();
});

const treatToggle = $('#treats');
treatToggle.checked = state.includeTreats;
treatToggle.addEventListener('change', () => {
  state.includeTreats = treatToggle.checked;
  save.includeTreats();
  refreshWheel();
  renderRecipes();
});

// keyboard arrows on the tab list
$('[role="tablist"]').addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
  const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
  showTab(next.dataset.tab);
  next.focus();
});

// ---------- boot ----------
async function boot() {
  renderTonightResult();
  renderHistory();
  renderWeek();
  renderIdeas();
  renderRecipes();
  renderPantry();
  try {
    const { createWheel } = await import('./wheel.js');
    wheel = createWheel($('#wheel'));
  } catch (err) {
    console.warn('3D wheel unavailable:', err);
    wheel = null;
  }
  if (!wheel) $('#wheel').classList.add('no-3d');
  refreshWheel();
  document.body.classList.add('ready');
}
boot();
