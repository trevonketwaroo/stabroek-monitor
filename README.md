# Stabroek Monitor

**Guyana's oil economy, charted.** A live dashboard tracking Stabroek block production, Brent crude prices, and the Natural Resource Fund — the three numbers that decide what the world's fastest-growing petro-state earns.

<!-- screenshot: docs/screenshot.png — add after first deploy -->

## What I found

1. **Volume up, revenue down.** In 2025, production kept climbing — a fourth FPSO (ONE GUYANA) started up in August and output hit 900,000 bpd by November — yet government oil revenue *fell*, because Brent's slide outweighed the extra barrels. 2026 became the first year the approved NRF withdrawal declined year-over-year (US$2.37B vs US$2.46B). Price risk, not production risk, is now the dominant variable in Guyana's budget.
2. **Zero to a major producer in six years.** Annual average production: 74,000 bpd (2020) → 616,000 bpd (2024), with capacity above 900,000 bpd by late 2025 — one of the fastest offshore ramp-ups ever recorded.
3. **The NRF is a flow-through, not yet a nest egg.** Of ~US$9.3B deposited since 2020, over US$6B has already gone to the national budget. The fund's balance grows far slower than headline revenue suggests.

## How the data works

Two kinds of data, treated differently — deliberately:

| Data | Method | Update |
|---|---|---|
| Brent crude (daily → monthly avg) | Automated from [FRED `DCOILBRENTEU`](https://fred.stlouisfed.org/series/DCOILBRENTEU), no API key needed | Daily via GitHub Actions |
| Production, NRF balances & withdrawals, FPSO fleet | Curated by hand from Ministry of Natural Resources / Ministry of Finance publications and operator press releases — **every row carries its source URL** in [`data/`](data/) | As official reports publish (monthly) |

Government figures live in PDFs and press releases, not APIs. Hand-curating them with per-row citations is the honest way to handle that — and the messiest, most instructive part of the project.

## Stack

Node.js + Express, vanilla JS + Chart.js on the front, JSON data files versioned in git, GitHub Actions for collection. No database yet — the dataset is small and a git history of every data change is itself a feature.

## Run it

```bash
npm install
npm run collect   # fetch fresh Brent data from FRED
npm start         # http://localhost:4600
```

## Roadmap

- Parse monthly production tables from Ministry of Natural Resources report PDFs
- NRF monthly balance series from Ministry of Finance PDFs (currently spot balances)
- Postgres backing once the series justify it; per-FPSO production breakdown
- Lift-price vs Brent tracking (Guyana's crude grades: Liza, Unity Gold, Golden Arrowhead)

---

Built by [Trevon Ketwaroo](https://github.com/trevonketwaroo) in Georgetown, Guyana. Not affiliated with any operator or government body.
