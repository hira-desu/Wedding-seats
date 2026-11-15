import { escapeHtml, setImageFallback } from './utils.js';
const field = (label, value) => value ? `<section class="profile-field"><h3>${label}</h3><p>${escapeHtml(value)}</p></section>` : '';
export function openProfile(guest, root) {
  const relation = guest.relation ? `<p class="profile-relation">${escapeHtml(guest.relation)}</p>` : '';
  root.innerHTML = `<div class="modal-backdrop" data-close-modal>
    <section class="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-name">
      <button class="modal-close" type="button" aria-label="プロフィールを閉じる">×</button>
      <div class="eyebrow">GUEST PROFILE</div>
      <img class="guest-portrait" src="${escapeHtml(guest.portrait || 'assets/images/fallback/portrait.svg')}" alt="${escapeHtml(guest.name)}の似顔絵">
      <h2 id="profile-name">${escapeHtml(guest.name)}</h2>
      ${guest.nickname ? `<p class="profile-nickname">${escapeHtml(guest.nickname)}</p>` : ''}${relation}
      <div class="ornament">✧</div>
      <div class="profile-fields">${field('ABOUT',guest.introduction)}${field('HOBBY',guest.hobby)}${field('MESSAGE',guest.message)}</div>
      <div class="modal-footer">THANK YOU FOR BEING HERE</div>
    </section>
  </div>`;
  const img = root.querySelector('img'); setImageFallback(img);
  const backdrop = root.querySelector('.modal-backdrop');
  const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', onKey); };
  const onKey = event => { if (event.key === 'Escape') close(); };
  root.querySelector('.modal-close').addEventListener('click', close);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
  document.addEventListener('keydown', onKey);
  root.querySelector('.modal-close').focus();
}
