import { escapeHtml } from "./utils.js";
import { navigate } from "./router.js";

export function renderSeating(venue, tables, guests) {
  const nodes = tables.map((table) => {
    const count = guests.filter((guest) => guest.tableId === table.id).length;
    const x = 70 + table.x * 6.6;
    const y = 35 + table.y * 4.45;
    const isMain = table.type === "main";
    const radius = isMain ? 62 : 53;
    return `
      <g class="table-node ${isMain ? "main-table" : ""}" tabindex="0" role="button"
         aria-label="${escapeHtml(table.name)}を開く" data-table-id="${escapeHtml(table.id)}">
        <circle class="table-circle" cx="${x}" cy="${y}" r="${radius}"></circle>
        <text class="table-name" x="${x}" y="${y - 2}">${escapeHtml(table.name)}</text>
        <text class="table-count" x="${x}" y="${y + 19}">${isMain ? "MAIN TABLE" : `${count}名`}</text>
      </g>`;
  }).join("");

  return `
    <section class="content-view">
      <a class="back-link" href="#home">← TOPへ戻る</a>
      <div class="section-heading">
        <span class="eyebrow">SEATING CHART</span>
        <h1>会場のご案内</h1>
        <p>テーブルをタップすると、ゲストをご覧いただけます。</p>
      </div>
      <div class="venue-frame">
        <div class="venue-scroll">
          <svg class="venue-svg" viewBox="0 0 ${venue.width} ${venue.height}" role="img" aria-label="披露宴会場の座席図">
            <rect x="12" y="12" width="776" height="536" rx="8" fill="#f9f6ef" stroke="#cfc3af" stroke-width="2"/>
            <rect x="260" y="24" width="280" height="54" rx="3" fill="#e8e1d3" stroke="#b59a65"/>
            <text x="400" y="57" text-anchor="middle" class="venue-label">${escapeHtml(venue.stageLabel)}</text>
            <path d="M 50 500 L 750 500" stroke="#d8cdbb" stroke-dasharray="4 6"/>
            <text x="400" y="530" text-anchor="middle" class="venue-label">${escapeHtml(venue.entranceLabel)}</text>
            ${nodes}
          </svg>
        </div>
        <div class="legend"><span><i></i> ゲストテーブル</span><span><i class="main-dot"></i> メインテーブル</span></div>
      </div>
      <p class="venue-hint">※スマートフォンでは左右にスクロールしてご覧ください。</p>
    </section>`;
}

export function bindSeatingEvents(root) {
  root.querySelectorAll("[data-table-id]").forEach((node) => {
    const open = () => navigate(`table/${node.dataset.tableId}`);
    node.addEventListener("click", open);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
    });
  });
}
