const DATA_PATHS = {
  wedding: "./data/wedding.json",
  venue: "./data/venue.json",
  tables: "./data/tables.json",
  guests: "./data/guests.json"
};

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`データを読み込めませんでした: ${path}`);
  return response.json();
}

export async function loadAllData() {
  const [wedding, venue, tables, guests] = await Promise.all(
    Object.entries(DATA_PATHS).map(async ([key, path]) => [key, await loadJson(path)])
  );
  return { wedding, venue, tables: tables.tables, guests: guests.guests };
}
