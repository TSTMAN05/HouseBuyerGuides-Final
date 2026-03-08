# State outline SVGs

The state shapes on the home page (“Choose your state” cards) use SVG outlines in `public/states/`.

## Regenerating shapes

Shapes are generated from **Census-derived GeoJSON** (PublicaMundi) so they match real state boundaries.

```bash
node scripts/generate-state-svgs.js
```

This fetches the US states GeoJSON, converts **every state** (all 50 + DC, etc.) to an SVG (blue fill), and writes one file per state to `public/states/`. The filename is the state name slug (e.g. `north-carolina.svg`, `georgia.svg`, `district-of-columbia.svg`).

## Adding a new state on the website

1. Add the state in Airtable with a **Slug** that matches the script’s slug (state name, lowercased, spaces → hyphens). Examples: `georgia`, `virginia`, `district-of-columbia`.
2. Run the script once if you haven’t already: `node scripts/generate-state-svgs.js`. It generates SVGs for all states, so the new state’s outline will already be there.
3. The home page loads `/states/${state.Slug}.svg`, so the new state card will show its outline automatically.

No need to edit the script when you add a state—just run it once to populate `public/states/` for all states, then any state you add in Airtable (with a matching slug) will have a picture.
