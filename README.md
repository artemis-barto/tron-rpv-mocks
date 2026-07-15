# TRON Payments — Four Design Directions

A multi-route design review site containing four responsive homepage concepts:

- `/proof` — Proof of Scale
- `/movement` — Global Movement
- `/future` — Future Protocol
- `/live` — Payments Live

The concept switcher at `/` makes the four directions easy to compare.

## Verified data

Every concept consumes the same server-side TRON dataset from the existing deployed data service. The integration currently uses:

- `/api/b2b` for monthly B2B stablecoin payment volume from `PC_DBT_DB.PROD.agg_tron_rpv_metrics`
- `/api/c2b` for chain-level tracked payment volume from `GOLD.ALTERNATE_DATA.fact_paymentscan_chains`

The second endpoint retains its legacy URL, but the UI correctly labels the data as **tracked payments**, not as the C2B payment segment. Current-month rows are excluded so all concepts present the latest complete month consistently.

Set `TRON_DATA_ORIGIN` only when the data service moves away from `https://tron-rpv.vercel.app`.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm test
npm run lint
```
