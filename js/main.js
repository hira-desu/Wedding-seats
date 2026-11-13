import { loadAllData } from "./data.js";
import { currentRoute, navigate } from "./router.js";
import { renderSeating, bindSeatingEvents } from "./seating.js";
import { renderTable, bindTableEvents } from "./table.js";
import { renderProfile, bindProfileEvents } from "./profile.js";
import { escapeHtml } from "./utils.js";

const app = document.querySelector("#app");
const modalRoot = document.querySelector("#modal-root");
let data;

function renderHome() {
  const { wedding } = data;
  return `
    <section class="home-view">
      <p class="eyebrow hero-kicker">A DAY TO REMEMBER</p>
      <h1 class="hero-title">一人ひとりの糸が<br><span>つながり、織り成す。</span></h1>
      <div class="hero-art" aria-hidden="true">
        <svg viewBox="0 0 560 190">
          <path d="M20 120 C120 10 180 180 280 80 S440 20 540 120" fill="none" stroke="#b59a65" stroke-width="1.5"/>
          <path d="M20 80 C130 180 190 10 280 110 S440 170 540 70" fill="none" stroke="#34495e" stroke-width="1.5" opacity=".7"/>
          <path d="M60 20 C130 100 160 100 230 20 S330 20 400 100 S470 170 520 30" fill="none" stroke="#b9a99a" stroke-width="1" opacity=".8"/>
          <circle cx="280" cy="95" r="8" fill="#f5f0e6" stroke="#b59a65" stroke-width="2"/>
          <path d="M230 150 L280 95 L330 150" fill="none" stroke="#34495e" stroke-width="1" opacity=".4"/>
        </svg>
      </div>
      <p class="couple-names">${escapeHtml(wedding.groomName)} <span style="color:var(--gold)">×</span> ${escapeHtml(wedding.brideName)}</p>
      <p class="wedding-date">${escapeHtml(wedding.date)}　${escapeHtml(wedding.venueName)}</p>
      <div class="hero-rule"></div>
      <p class="hero-copy">これまで出会ってきた大切なみなさまとのご縁。<br>それぞれの糸がつながり、今日という一日を織り成します。<br>どうぞ心ゆくまでお楽しみください。</p>
      <div class="home-actions"><button class="primary-button" id="open-seating">席次表を見る <span>→</span></button></div>
    </section>`;
}

function showError(error) {
  console.error(error);
  app.innerHTML = `<section class="content-view"><div class="section-heading"><h1>読み込みに失敗しました</h1><p>ページを再読み込みしてください。ローカルで確認する場合はHTTPサーバーを使用してください。</p></div></section>`;
}

function render() {
  if (!data) return;
  const route = currentRoute();
  modalRoot.innerHTML = "";

  if (route.page === "home") {
    app.innerHTML = renderHome();
    document.querySelector("#open-seating").addEventListener("click", () => navigate("seating"));
    return;
  }
  if (route.page === "seating") {
    app.innerHTML = renderSeating(data.venue, data.tables, data.guests);
    bindSeatingEvents(app);
    return;
  }
  if (route.page === "table") {
    const table = data.tables.find((item) => item.id === route.id);
    if (!table) return navigate("seating");
    const guests = data.guests.filter((guest) => guest.tableId === table.id);
    app.innerHTML = renderTable(table, guests);
    bindTableEvents(app);
    return;
  }
  if (route.page === "guest") {
    const guest = data.guests.find((item) => item.id === route.id);
    if (!guest) return navigate("seating");
    const table = data.tables.find((item) => item.id === guest.tableId);
    if (!history.state?.previousRoute) {
      history.replaceState({ previousRoute: `table/${table?.id || "table01"}` }, "");
    }
    // URL履歴のひとつ前がテーブル一覧になるよう、モーダルを履歴に積む。
    modalRoot.innerHTML = renderProfile(guest);
    bindProfileEvents(modalRoot);
  }
}

async function start() {
  try {
    data = await loadAllData();
    document.querySelector("#header-date").textContent = data.wedding.date;
    if (!location.hash) history.replaceState({}, "", `${location.pathname}${location.search}#home`);
    render();
    window.addEventListener("hashchange", render);
    window.addEventListener("popstate", () => {
      // 戻る操作ではハッシュに応じて画面を再描画する。
      render();
    });
  } catch (error) {
    showError(error);
  }
}

start();
