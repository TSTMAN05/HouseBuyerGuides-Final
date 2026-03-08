# HouseBuyerGuides.com

First-time homebuyer program directory by city and state. Next.js (App Router) + Airtable + Vercel.

## Setup

1. **Copy env**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` from Airtable.

2. **Airtable**
   Create a base with tables: **States**, **Cities**, **Programs** (include a **Slug** field), **Blog Posts**. Use the exact field names from the project schema (see plan or master prompt). Link fields: Cities ↔ State, Cities ↔ Programs, Programs ↔ States as needed.

3. **Run**
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Build & deploy

- `npm run build` — builds the site and runs `next-sitemap` to generate `sitemap.xml` and `robots.txt`.
- Deploy to Vercel: connect the repo, set `AIRTABLE_BASE_ID` and `AIRTABLE_API_KEY` in project settings. Optional: `NEXT_PUBLIC_SITE_URL` for canonical URLs and sitemap (e.g. `https://housebuyerguides.com`).

## Routes

- `/` — Home (state list)
- `/[state]` — State overview (e.g. `/north-carolina`)
- `/[state]/[city]` — City guide (e.g. `/south-carolina/greenville-sc`)
- `/programs` — Program index
- `/programs/[slug]` — Program detail
- `/blog` — Blog index
- `/blog/[slug]` — Blog post
- `/about` — About

Only cities with **Status = Published** get city pages. Programs need a **Slug** to get a program page.
