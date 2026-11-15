export function escapeHtml(value='') {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
export function safeText(value) { return value == null ? '' : String(value).trim(); }
export function setImageFallback(img) {
  img.addEventListener('error', () => {
    if (!img.dataset.fallbackApplied) {
      img.dataset.fallbackApplied = 'true';
      img.src = new URL('../assets/images/fallback/portrait.svg', import.meta.url).href;
    }
  }, { once: true });
}
export function $(selector, root=document) { return root.querySelector(selector); }
