# 🍓 ECOFOOTPRINT — Ecological Footprint of Foods

A Next.js web application visualising the ecological footprint of common foods, with a detailed case study on strawberries comparing Germany, Spain and the Netherlands.

**Live:** [ecological-footprint-foods.vercel.app](https://ecological-footprint-foods.vercel.app)

---

## Features

- **Food Explorer** — browse 50+ foods with CO₂ and water footprint data, 3D card flips, leaderboard, and daily CO₂ budget tracker
- **Erdbeere Fallstudie** — in-depth bilingual (DE/EN) case study on strawberries covering:
  - Three-country comparison (DE · ES · NL) with expandable cultivation details
  - CO₂ deep-dive, water analysis, transport routes, season calendar
  - Price trends, production costs, market data
  - Life cycle assessment methodology
  - Overall analysis matrix (Gesamtanalyse)

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | lucide-react |
| Hosting | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Food explorer
│   ├── explorer/page.tsx
│   └── fallstudie/erdbeere/
│       └── page.tsx                # Strawberry case study
├── components/
│   └── EcoApp.tsx                  # Main explorer component
├── data/
│   └── foodItems.ts                # Food database (50+ items)
├── types/
│   └── food.ts                     # TypeScript types
├── constants/
│   └── translations.ts             # i18n strings (DE/EN)
└── services/
    └── foodService.ts
```

## Academic Context

Developed as part of module **M15 ISG — Ökologische Nachhaltigkeit** at Frankfurt University of Applied Sciences.

**Team:** Bianca Wassmann · Ivana Cvijetinović · Jenny Senge · Kartik Chauhan · Lars Krüger · Mohammed Al-Awadhi

**Data sources:** REWE PCF Study · MyCarbon Database · Statista · BMEL · WWF · Water Footprint Network · UN Comtrade · Eurostat
