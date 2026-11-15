import { escapeHtml } from './utils.js';
function svgElement(element) {
  const attrs = Object.entries(element).filter(([key]) => key !== 'type' && key !== 'text').map(([key,value]) => `${key.replace(/[A-Z]/g, m => '-'+m.toLowerCase())}="${escapeHtml(value)}"`).join(' ');
  if (element.type === 'text') return `<text ${attrs} text-anchor="middle" dominant-baseline="middle">${escapeHtml(element.text || '')}</text>`;
  return `<${element.type} ${attrs} />`;
}
export function renderVenue(venue, tables, guests) {
  const base = (venue.elements || []).map(svgElement).join('');
  const nodes = (venue.tables || []).map(position => {
    const table = tables.find(item => item.id === position.id);
    if (!table) return '';
    const count = guests.filter(guest => guest.tableId === table.id).length;
    const x = Number(position.x) - Number(position.width)/2;
    const y = Number(position.y) - Number(position.height)/2;
    const shape = position.shape === 'circle'
      ? `<ellipse cx="${position.x}" cy="${position.y}" rx="${position.width/2}" ry="${position.height/2}" />`
      : `<rect x="${x}" y="${y}" width="${position.width}" height="${position.height}" rx="18" />`;
    return `<g class="table-node" data-table-id="${escapeHtml(table.id)}" tabindex="0" role="button" aria-label="${escapeHtml(table.label)} ${count}名">
      <g fill="#fffdf8" stroke="#b79b68" stroke-width="2">${shape}</g>
      <text x="${position.x}" y="${Number(position.y)-8}" text-anchor="middle" font-family="Noto Serif JP,serif" font-size="27" fill="#514a3e">${escapeHtml(table.label || table.name)}</text>
      <text x="${position.x}" y="${Number(position.y)+24}" text-anchor="middle" font-family="Noto Sans JP,sans-serif" font-size="13" fill="#91836b">${count} GUEST${count === 1 ? '' : 'S'}</text>
    </g>`;
  }).join('');
  return `<svg viewBox="${escapeHtml(venue.viewBox || '0 0 1000 700')}" role="img" aria-label="会場の座席表">${base}${nodes}</svg>`;
}
