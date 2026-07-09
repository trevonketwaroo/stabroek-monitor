// Fetches Brent crude prices from FRED (no API key required) and writes
// monthly averages to data/brent.json. Run daily by GitHub Actions.
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRED_URL = 'https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU';
const SINCE = '2019-12-01'; // first Guyana oil was produced Dec 2019

const res = await fetch(FRED_URL);
if (!res.ok) throw new Error(`FRED fetch failed: ${res.status}`);
const csv = await res.text();

// CSV: observation_date,DCOILBRENTEU — daily rows, "." for missing days
const monthly = new Map();
for (const line of csv.trim().split('\n').slice(1)) {
  const [date, value] = line.split(',');
  if (!date || date < SINCE || value === '.' || value === '') continue;
  const month = date.slice(0, 7);
  if (!monthly.has(month)) monthly.set(month, []);
  monthly.get(month).push(Number(value));
}

const series = [...monthly.entries()].map(([month, vals]) => ({
  month,
  avg_usd: Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)),
}));

const lastLine = csv.trim().split('\n').filter(l => !l.endsWith(',.')).at(-1);
const [latestDate, latestValue] = lastLine.split(',');

const out = {
  source: 'FRED series DCOILBRENTEU (Brent Europe, daily), aggregated to monthly averages',
  source_url: 'https://fred.stlouisfed.org/series/DCOILBRENTEU',
  updated: new Date().toISOString().slice(0, 10),
  latest: { date: latestDate, usd: Number(latestValue) },
  monthly: series,
};

writeFileSync(path.join(__dirname, '..', 'data', 'brent.json'), JSON.stringify(out, null, 2));
console.log(`brent.json written: ${series.length} months, latest ${latestDate} $${latestValue}`);
