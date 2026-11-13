export function currentRoute() {
  const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (!hash || hash === "home") return { page: "home" };
  if (hash === "seating") return { page: "seating" };
  const [type, id] = hash.split("/");
  if (type === "table" && id) return { page: "table", id };
  if (type === "guest" && id) return { page: "guest", id };
  return { page: "home" };
}

export function navigate(path) {
  if (location.hash === `#${path}`) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    location.hash = path;
  }
}
