# GenFit OnSite

Train with Jean — in-home personal training for real lives, real homes, real schedules,
and real progress. Mobile-first operating system for an independent in-home personal
trainer (Jean).
React + Vite + Tailwind. All data persists locally via localStorage. No backend, no auth,
no payments, no real third-party APIs. Seeded demo data on first run.

## Run it

```
npm install
npm run dev
```

Open the local URL Vite prints. To ship a static build:

```
npm run build
```

Then drag the `dist/` folder onto Netlify Drop. A prebuilt `dist/` is already included.

## What's inside

Public + client
- Landing page (packages, how-it-works, FAQ, social links, "Watch Jean work" mock clips)
- Apply / intake flow (10 steps, readiness screen, granular social + testimonial consent, default no-sharing)
- Client portal (next session, weekly check-in, progress, consent controls, testimonial form)

Trainer app (bottom nav: Floor, Route, Run, Social, You)
- Dashboard "Build Floor" (today, attention list, social opportunities, quick actions, roster)
- Route board (timeline of stops, parking/pet notes, consent-gated content angles)
- Session runner (Space-to-Session generator, live timer, end-of-session content capture)
- Program builder (templates, editable blocks, assign to client)
- Progress tracker (charts, check-ins, consent-gated photos, milestones)
- Client detail (consent editor, setup, notes, program)
- Social Studio (profile, idea generator, caption builder, stories, shot lists, library, roadmap)
- Content calendar (weekly rhythm + month grid)
- Settings (theme switcher: Volt / Coral / Cream, JSON export/import, reset, hub links)

## Consent model

Five-level ladder: none -> internal -> testimonial -> photo -> video. Default is no sharing.
Posts and photos are gated by each client's level everywhere they could appear. Minors are
internal-only and never postable.

## Themes

Three themes via `data-theme` on `<html>`, all colors are CSS variables in `src/index.css`.

## Next (backend phase)

Auth, real client accounts, Stripe for packages, Google Maps for routing, real SMS,
and the live TikTok integration mapped in the Social Studio roadmap.

## Safety

Fitness coaching, not medical care. No medical claims, no meal plans.
