import { loadData } from './data.js';
import { createRouter } from './router.js';
import { renderVenue } from './seating.js';
import { openProfile } from './profile.js';
import { $, escapeHtml, setImageFallback } from './utils.js';

const app = $('#app');
const modalRoot = $('#modal-root');
let data;
let router;

function backButton(label='戻る') { return `<div class="back-row"><button class="back-link" type="button" data-back>← ${label}</button></div>`; }
function renderHome() {
  const c = data.config;
  app.innerHTML = `<section class="hero"><div class="hero-content">
    <svg class="hero-mountain" viewBox="0 0 360 110" aria-hidden="true"><path d="M18 91 L116 34 L151 58 L209 8 L342 91" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M175 31 L209 8 L238 38 L219 31 L209 39 L199 29 L188 38Z" fill="#e9dfce" stroke="currentColor" stroke-width=".8"/><path d="M20 92 Q180 82 340 92" fill="none" stroke="currentColor" stroke-width=".8"/></svg>
    <div class="eyebrow">${escapeHtml(c.subtitle || 'OUR WEDDING')}</div>
    <h1 class="hero-title">${escapeHtml(c.weddingTitle || '結び、織りなす一日')}</h1>
    <p class="hero-subtitle">${escapeHtml(c.coupleNames || '')}</p>
    <div class="ornament">✧</div>
    <p class="hero-date">${escapeHtml(c.date || '')}</p>
    <p class="hero-message">${escapeHtml(c.welcomeMessage || '').replace(/\n/g,'<br>')}</p>
    <a class="btn" href="#/seating">SEATING CHART <span aria-hidden="true">→</span></a>
    <p class="top-note">テーブルを選んで、ゲストのプロフィールをご覧ください。</p>
  </div></section>`;
}
function renderSeating() {
  app.innerHTML = `<section class="page"><div class="section-heading"><div class="eyebrow">FIND YOUR SEAT</div><h1>SEATING CHART</h1><p>会場の見取り図からテーブルをお選びください</p></div>
    <div class="seating-layout"><div class="venue-panel"><div class="venue-topline"><span>${escapeHtml(data.config.venueName || 'WEDDING VENUE')}</span><span>会場レイアウト</span></div><div class="venue-canvas">${renderVenue(data.venue,data.tables,data.guests)}</div><p class="map-hint">各テーブルをタップするとゲスト一覧が表示されます</p></div>
    <aside class="venue-side"><h3>ご案内</h3><p>テーブルを選択すると、そのテーブルにお座りのゲストをご覧いただけます。お名前や似顔絵をタップしてプロフィールもお楽しみください。</p><div class="legend"><div class="legend-item"><span class="legend-dot"></span>ゲストテーブル</div><div class="legend-item">✧ 新郎新婦席</div></div></aside></div></section>`;
  app.querySelectorAll('[data-table-id]').forEach(node => {
    const go = () => router.navigate(`table/${node.dataset.tableId}`);
    node.addEventListener('click',go); node.addEventListener('keydown',event => { if(event.key==='Enter'||event.key===' '){event.preventDefault();go();} });
  });
}
function renderTable(tableId) {
  const table = data.tables.find(item => item.id === tableId);
  if (!table) return renderNotFound();
  const guests = data.guests.filter(guest => guest.tableId === tableId);
  app.innerHTML = `<section class="page">${backButton('席次表へ戻る')}<div class="section-heading"><div class="eyebrow">GUESTS AT THIS TABLE</div><h1>${escapeHtml(table.name || table.label)}</h1><p>${escapeHtml(table.description || '')}</p></div>
    <div class="table-intro"><span class="table-number">${escapeHtml(table.label || table.id)}</span><p class="muted">${guests.length}名</p></div>
    ${guests.length ? `<div class="guest-grid">${guests.map(guest => `<button class="guest-card" type="button" data-guest-id="${escapeHtml(guest.id)}"><img class="guest-portrait" src="${escapeHtml(guest.portrait || 'assets/images/fallback/portrait.svg')}" alt="" loading="lazy"><div class="guest-name">${escapeHtml(guest.name)}</div>${guest.nickname ? `<div class="guest-nickname">${escapeHtml(guest.nickname)}</div>` : ''}${guest.relation ? `<div class="guest-relation">${escapeHtml(guest.relation)}</div>` : ''}<div class="guest-card-hint">PROFILE　↗</div></button>`).join('')}</div>` : `<div class="empty-state">このテーブルのゲスト情報はまだ登録されていません。</div>`}
  </section>`;
  app.querySelectorAll('.guest-portrait').forEach(setImageFallback);
  app.querySelectorAll('[data-guest-id]').forEach(button => button.addEventListener('click',() => {
    const guest = data.guests.find(item => item.id === button.dataset.guestId);
    if (guest) openProfile(guest,modalRoot);
  }));
  app.querySelector('[data-back]').addEventListener('click',() => router.navigate('seating'));
}
function renderNotFound() {
  app.innerHTML = `<section class="page error-state"><div class="eyebrow">PAGE NOT FOUND</div><h1>ページが見つかりません</h1><p>お探しのページは存在しないか、移動した可能性があります。</p><a class="btn btn-outline" href="#/">トップへ戻る</a></section>`;
}
function render(route) {
  modalRoot.innerHTML = '';
  if (!data) return;
  if (route.page === 'home') renderHome();
  else if (route.page === 'seating') renderSeating();
  else if (route.page === 'table') renderTable(route.tableId);
  else renderNotFound();
  window.scrollTo({top:0,behavior:'smooth'});
  app.focus({preventScroll:true});
}

async function init() {
  try {
    data = await loadData();
    $('#header-couple').textContent = data.config.coupleNames || 'Wedding Celebration';
    $('#footer-copy').textContent = data.config.footerMessage || 'With love.';
    router = createRouter(render);
    render(router.parse());
    document.addEventListener('click', event => {
      if (event.target.closest('[data-back]') && !event.target.closest('.guest-card')) router.navigate('seating');
    });
  } catch (error) {
    console.error(error);
    app.innerHTML = `<section class="page error-state"><div class="eyebrow">LOAD ERROR</div><h1>データを読み込めませんでした</h1><p>${escapeHtml(error.message)}</p><p>GitHub PagesまたはローカルWebサーバー経由で開いているか、dataフォルダ内のJSONを確認してください。</p></section>`;
  }
}
init();
