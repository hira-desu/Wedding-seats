import { escapeHtml, initials } from "./utils.js";
import { navigate } from "./router.js";

const fields = [
  ["introduction", "INTRODUCTION", "自己紹介"],
  ["hobby", "HOBBY", "趣味"],
  ["message", "MESSAGE", "メッセージ"]
];

export function renderProfile(guest) {
  const profileFields = fields
    .filter(([key]) => guest[key] && String(guest[key]).trim())
    .map(([key, label, title]) => `<section class="profile-field"><h3>${label} / ${title}</h3><p>${escapeHtml(guest[key])}</p></section>`)
    .join("");

  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <section class="profile-sheet" role="dialog" aria-modal="true" aria-labelledby="profile-name">
        <button class="modal-close" type="button" aria-label="閉じる" data-close-modal>×</button>
        <div class="profile-top">
          <span class="avatar" style="background:${escapeHtml(guest.color || "#758b91")}">
            ${guest.portrait ? `<img src="./${escapeHtml(guest.portrait.replace(/^\\.\\//, ""))}" alt="${escapeHtml(guest.name)}" onerror="this.remove(); this.parentElement.textContent='${escapeHtml(initials(guest.name))}'">` : escapeHtml(initials(guest.name))}
          </span>
          <h2 id="profile-name">${escapeHtml(guest.name)}</h2>
          <p>${escapeHtml(guest.nickname ? `“${guest.nickname}” · ` : "")}${escapeHtml(guest.relationship || "")}</p>
        </div>
        <div class="profile-fields">${profileFields || "<p>プロフィールは準備中です。</p>"}</div>
      </section>
    </div>`;
}

export function bindProfileEvents(root) {
  const close = () => {
    const previous = history.state?.previousRoute;
    navigate(previous || "seating");
  };
  root.querySelector("[data-close-modal]")?.addEventListener("click", close);
  root.querySelector("[data-modal-backdrop]")?.addEventListener("click", (event) => {
    if (event.target.matches("[data-modal-backdrop]")) close();
  });
}
