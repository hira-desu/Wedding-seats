const base = new URL('../data/', import.meta.url);
async function readJson(file) {
  const response = await fetch(new URL(file, base));
  if (!response.ok) throw new Error(`${file} の読み込みに失敗しました (${response.status})`);
  return response.json();
}
export async function loadData() {
  const [config, guests, tables, venue] = await Promise.all([
    readJson('config.json'), readJson('guests.json'), readJson('tables.json'), readJson('venue.json')
  ]);
  if (!Array.isArray(guests) || !Array.isArray(tables) || !venue || !Array.isArray(venue.tables)) {
    throw new Error('JSONの形式が正しくありません。READMEのデータ編集方法を確認してください。');
  }
  const tableIds = new Set(tables.map(table => table.id));
  const guestIds = new Set();
  guests.forEach(guest => {
    if (!guest.id || guestIds.has(guest.id)) throw new Error(`ゲストIDが未設定または重複しています: ${guest.id || '(空欄)'}`);
    guestIds.add(guest.id);
    if (!tableIds.has(guest.tableId)) console.warn(`ゲスト ${guest.id} のtableId「${guest.tableId}」に対応するテーブルがありません。`);
  });
  return { config, guests, tables, venue };
}
