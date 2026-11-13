import { escapeHtml, initials } from "./utils.js";
import { navigate } from "./router.js";

export function renderTable(table, guests) {
  const cards = guests.map((guest) => `
    <button class="guest-card" type="button" data-guest-id="${escapeHtml(guest.id)}">
      <span class="avatar" style="background:${escapeHtml(guest.color || "#758b91")}">
        ${guest.portrait ? `<img src="./${escapeHtml(guest.portrait.replace(/^\\.\\//, ""))}" alt="${escapeHtml(guest.name)}" loading="lazy" onerror="this.remove(); this.parentElement.textContent='${escapeHtml(initials(guest.name))}'">` : escapeHtml(initials(guest.name))}
      </span>
      <p class="guest-name">${escapeHtml(guest.name)}</p>
      <p class="guest-relation">${escapeHtml(guest.relationship || "")}</p>
    </button>`).join("");

  return `
    <section class="content-view">
      <a class="back-link" href="#seating">← 会場図へ戻る</a>
      <div class="section-heading">
        <span class="eyebrow">TABLE GUIDE</span>
        <h1>${escapeHtml(table.name)}</h1>
        <p>同じテーブルを囲むみなさま</p>
      </div>
      <p class="table-intro">${guests.length}名のゲストをご紹介します。似顔絵をタップしてプロフィールをご覧ください。</p>
      <div class="guest-grid">${cards || "<p>このテーブルのゲスト情報はまだありません。</p>"}</div>
    </section>`;
}

export function bindTableEvents(root) {
  root.querySelectorAll("[data-guest-id]").forEach((button) => {
    button.addEventListener("click", () => navigate(`guest/${button.dataset.guestId}`));
  });
}
