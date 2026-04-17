# El Conciergio — Project Context

## What is this project
El Conciergio is a WhatsApp AI concierge service for short-term rental owners (Airbnb, gîtes, small hotels). The website is the main sales/marketing tool to prospect clients. It includes a live interactive WhatsApp simulator powered by the Anthropic Claude API.

## Stack
- Vanilla HTML / CSS / JS (no framework)
- Single page site (one-page scroll)
- Claude API (`claude-sonnet-4-20250514`) for the WhatsApp simulator
- No build step required — open index.html directly

## Project structure
```
/
├── index.html          # Main site (one-page)
├── CLAUDE.md           # This file
├── .claude/
│   ├── design.md       # Colors, typography, components
│   ├── bot.md          # Bot persona, system prompt, conversation
│   └── features.md     # Feature specs & sections
├── assets/
│   ├── logo.svg        # El Conciergio logo (to be added)
│   └── favicon.ico
└── css/
    └── main.css        # If styles are extracted
```

## Brand identity
- **Name:** El Conciergio
- **Domain:** elconciergio.com / elconciergio.io
- **Tagline:** "Toujours disponible. Jamais fatigué."
- **Persona:** El Conciergio is a CHARACTER — a mustachioed AI concierge, warm and professional
- **Language:** French primary, site works in FR (clients are FR/BE/NL)
- See `.claude/design.md` for full design system

## Key business rules
- Service = WhatsApp AI bot setup for vacation rental owners
- Setup fee: from €1,200 (one-time)
- Monthly: €90/month all-inclusive
- Target: Airbnb hosts, gîtes, B&Bs, small hotels
- Main CTA: open WhatsApp chat with owner (`wa.me/[NUMBER]`)
- Secondary CTA: try the live simulator

## The WhatsApp simulator
The hero section includes an animated phone mockup showing a pre-scripted conversation (no API needed — pure CSS/JS animation). There is also a dedicated "Demo" section with a LIVE simulator connected to Claude API where visitors can type real messages and get real AI responses. See `.claude/bot.md` for the full system prompt and conversation scripts.

## Page sections (in order)
1. Nav — logo + links + CTA button
2. Hero — headline + animated phone mockup (scripted)
3. Reassurance bar — 3 stats
4. Problem — 3 pain point cards
5. Solution — what the bot does
6. Features — 8 feature grid
7. Why WhatsApp — 3 big numbers
8. How it works — 3 steps
9. ROI — dark section with impact stats
10. Demo — LIVE simulator (Claude API)
11. Pricing — 2 cards (setup + monthly)
12. FAQ — 5 accordions
13. Final CTA — full green section
14. Footer
See `.claude/features.md` for full copy of each section

## Common tasks
**Add/edit bot content:** Edit system prompt in `.claude/bot.md`, copy into the API call in the demo section of index.html
**Change colors:** All CSS custom properties in `:root` — see `.claude/design.md`
**Edit pricing:** Search `1.200€` and `90€` in index.html
**Edit CTA links:** Search `wa.me` in index.html — replace placeholder number
**Add logo:** Replace logo placeholder in nav and footer with `<img src="assets/logo.svg">`

## WhatsApp number placeholder
All WhatsApp links use: `https://wa.me/XXXXXXXXX`
Replace `XXXXXXXXX` with the real number (no + sign, international format)
Example: `https://wa.me/33612345678`

## Claude API integration
The live demo section calls `https://api.anthropic.com/v1/messages` directly from the browser (no backend). The API key is injected via a meta tag or environment config — never hardcode it in the JS. See `.claude/bot.md` for the full system prompt to pass as `system` parameter.

## Do not
- Do not add any framework (React, Vue, etc.) — keep it vanilla
- Do not add a backend — all API calls are client-side
- Do not change the brand colors without updating ALL instances
- Do not use Lorem Ipsum — all copy is final French content
- Do not remove the WhatsApp sticky button on mobile
