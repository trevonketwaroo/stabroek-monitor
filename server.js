import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const loadJson = (name) =>
  JSON.parse(readFileSync(path.join(__dirname, 'data', name), 'utf8'));

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.get('/api/data', (req, res) => {
  try {
    res.json({
      brent: loadJson('brent.json'),
      production: loadJson('production.json'),
      nrf: loadJson('nrf.json'),
      fpsos: loadJson('fpsos.json'),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4600;
app.listen(PORT, () => console.log(`Stabroek Monitor on http://localhost:${PORT}`));
