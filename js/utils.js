export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

export function initials(name = "") {
  const clean = String(name).replace(/\s/g, "");
  return clean.slice(0, 1) || "糸";
}
