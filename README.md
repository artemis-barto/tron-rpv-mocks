# TRON Payments — Four Design Directions

A multi-route design review site containing four responsive homepage concepts:

- `/proof` — Proof of Scale
- `/movement` — Global Movement
- `/future` — Future Protocol
- `/live` — Payments Live

The concept switcher at `/` makes the four directions easy to compare.

## Verified data

Every concept contains the same complete data module: overview KPIs, B2B/B2C/C2C/C2B cards, a monthly payment-volume view, global volume, and geography coverage. The integration requests:

- `/api/payments` for the full 36-month payment-segment dataset from `PC_DBT_DB.PROD.AGG_TRON_RPV_METRICS`
- `/api/b2b` for monthly B2B stablecoin payment volume from `PC_DBT_DB.PROD.agg_tron_rpv_metrics`
- `/api/c2b` for chain-level tracked payment volume from `GOLD.ALTERNATE_DATA.fact_paymentscan_chains`

The `/api/b2b` and `/api/c2b` routes provide a verified partial-data fallback until the full dataset endpoint is deployed. By product decision, the chain-wide TRON volume returned by the legacy `/api/c2b` route is used in the C2B card and clearly labeled **TRON chain proxy**. Current-month rows are excluded so all concepts present the latest complete month consistently.

The source repository does not yet provide a verified country or continent dimension. All four concepts show global/world volume while leaving the regional values explicitly unavailable rather than reproducing the original synthetic continent split.

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
