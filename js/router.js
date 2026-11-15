export function createRouter(render) {
  const parse = () => {
    const path = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!path.length) return { page: 'home' };
    if (path[0] === 'seating') return { page: 'seating' };
    if (path[0] === 'table' && path[1] && path[2] === 'guest' && path[3]) return { page: 'profile', tableId: path[1], guestId: path[3] };
    if (path[0] === 'table' && path[1]) return { page: 'table', tableId: path[1] };
    return { page: 'notFound' };
  };
  const navigate = path => { location.hash = `/${path}`; };
  window.addEventListener('hashchange', () => render(parse()));
  if (!location.hash) history.replaceState(null, '', `${location.pathname}${location.search}#/`);
  return { parse, navigate };
}
