# folio v2 — rebuild plan (rev 2)

Working copy: `~/Personal/folio taste/folio` (clone of github.com/OpalWight/folio, Vercel project `folio` → albertvo.lol).
Rev 1 (comic-book / yellow) was rejected. This revision: **white + blue only, photographic dot-screen flowers, minimal and sharp.**

## 0. Spotify: what broke and the fix

Tested against the real Vercel env vars on 2026-09-11:

    POST accounts.spotify.com/api/token  →  400 {"error":"invalid_grant","error_description":"Refresh token revoked"}

Client id/secret are fine; the refresh token was revoked (password change, "remove access" under Account → Apps,
secret rotation, or dev-mode idle pruning). The old route turned that into a generic 500, so it looked random.

Fix (needs you, once):
1. Spotify dashboard → your app → Settings → Redirect URIs → add exactly `http://127.0.0.1:8888/callback`.
2. `npm run spotify:auth` — opens Spotify login, saves a fresh token into `.env` (never printed).
3. `npm run spotify:push` then `vercel --prod`.

Already in the repo: `scripts/spotify-auth.mjs`, `scripts/spotify-push.mjs`, hardened `src/routes/api/spotify/+server.ts`
(token cache, 204 handling, album art + URL, `Cache-Control: no-store`, specific error logging).

## 1. Direction — "one hue, one flower, hard edges"

Palette (nothing outside white → blue)
- `#FFFFFF` white (page)  · `#F4F6FB` mist (alternate surfaces)  · `#D9DFF5` haze (hairlines, disabled)
- `#2F45D6` dot blue (the dots, links)  · `#101C6E` deep blue (headlines, primary text)  · `#6B7AC4` mid blue (secondary text)

Type
- Display: **Instrument Serif** — sharp hairline serifs, chic at large sizes; italic for the rotating hero word
- Text/UI: **Manrope** — geometric, clean, tight uppercase labels
- Data: **IBM Plex Mono** — coordinates, dates, the Spotify readout

Shapes: no rounded corners anywhere. Chamfered cards (`clip-path: polygon`), 1px hairline rules, a thin diagonal
rule as the section divider (qiaooli's "Work /"), hairline grid backdrop. No logo mark.

The flower: a real photo (white lily) rendered live on canvas as a blue dot screen — dot radius follows luminance,
so the flower reads as white space inside a blue field, exactly like your reference image. Every dot has a spring;
the cursor pushes dots away (mauriciojuba.com behaviour), they settle back. Same engine is reused for the load-in and
for page transitions, so the whole site has one motion vocabulary.

Photo → dots tools (for stills and for choosing the source photo; the site itself does it live in code):
halftone-fx.com, instantgradient.com/tools/halftone-generator (WebGL, local), vectorwitch.com/tools/halftone-generator (SVG export),
ditherimage.online, ascii-magic.com/styles/dither, ezgif.com/halftone. Open-source references for the live version:
github.com/haaarshsingh/halftone-dots, github.com/desandro/breathing-halftone, Maxime Heckel "Shades of Halftone".

## 2. Structure (qiaooli.com as the guide)

- **Header**: floating liquid-glass **pill** (blur + saturate, bright top edge, hairline edge, soft drop). Links only:
  `home · work · playground`, active link filled deep blue. Under 700px it becomes a round glass hamburger button that
  opens a full-screen glass sheet with the links in large serif. No logo, no name.
- **Hero** (viewport minus header): the dot lily fills it and moves on its own (travelling-wave sway + a wandering "wind"
  point); the cursor/touch adds scatter. Bottom-left: `I AM A(N)` and the rotating italic word:
  Researcher / Software Engineer / Data Scientist / Neurotech Engineer. Nothing else in the hero.
- **Work / FEATURED**: four full-width project cards — image left, title + three `→ metric` lines right, date range and role
  in the card footer, tag chips above. Featured: Efferent Systems / pyBCI (placeholder image for now), Computational RNA
  Biology & Medicine Lab, CareFlow, Neurotech Internals.
- **Work / MORE**: carousel with side previews and dot counter — Neurotech rover, EEG glasses, homelab (The Ranch + haybale),
  RoboSub website (+ Cyclone, Moosic, Song Hit Predictor if kept). "View all →" goes to `/playground`.
- **Hobbies** (her "Art" section): big serif word, grid of square tiles — guitar, Overwatch, whatever else you send.
- **Footer**: back to top, © 2026 Albert Vo, email, and the Spotify now-playing line (moved out of the hero). 
- **/projects/[slug]**: cover image, title + metrics block, meta row (role · dates · stack · links), markdown body, gallery.
- **/playground**: the full grid of everything not featured, same card language.

## 3. Motion

| # | Where | What |
|---|-------|------|
| A | First load | Dots start as uniform noise and converge into the flower (~1.2s); hero text unmasks with a hard clip wipe. Once per session. |
| B | Hero, always | Flower moves by itself (slow travelling waves + wandering wind point). Cursor/touch adds scatter; touch never blocks scroll. |
| C | Header | Liquid glass at all times, with a visible edge separating it from the page. |
| D | Sections | Hairline rules draw in; text rises 12px from a visible state. No fades from zero. |
| E | Project cards | Image scales 1.03, chamfer corner grows, metrics arrows slide right. |
| F | Route change | Dot dissolve: the outgoing page breaks into blue dots that scatter, the incoming page's dots settle. View Transitions API + canvas overlay, CSS fallback. |
| G | Spotify line (footer) | Text swaps with a mono character-scramble; tiny three-bar level meter animates while playing. |
| H | Hobby tiles | Halftone-to-photo crossfade on hover (dots resolve into the real image). |

Rules: `prefers-reduced-motion` = static flower + no scatter; canvas DPR ≤ 2, pauses off-screen; mobile grid coarser.

## 4. Stack

SvelteKit 2 / Svelte 5 (as is) + `@sveltejs/adapter-vercel`, mdsvex for project write-ups, one canvas module
`src/lib/dots.ts` (image → dot field, springs, pointer). No animation library. Fonts from Google Fonts.

## 5. Phases

Status 2026-09-12: all phases built, uncommitted. Home = hero → Work heading → two laptop-mockup cards (CareFlow, Neurotech Internals; live site loads in the screen on hover) → carousel → “View all work”. Nav: home · work · about. No numbered kickers, no boxed grids. Project pages are case-study layout with the live site in a laptop. Spotify re-authorized and live. Hero reads “Hi, I'm Albert, a ___.” with the rotating title. Phase 0 still needs your Spotify login. Content still placeholder: result lines and images for pyBCI / RNA lab, write-ups for EEG glasses and RoboSub.

0. Spotify (you re-auth, I deploy)  1. Foundation: tokens, fonts, nav, hairline system  2. Hero: dots engine, load-in,
rotating word, corners  3. Work sections + project pages + dot-dissolve transition  4. Playground + hobbies
5. Polish: OG images, Lighthouse ≥ 90 mobile, ship.

## 6. Needed from you

- A high-res flower photo you like (lily/orchid, white on plain background) or I pick a CC0 one.
- Per project: write-up, 2–4 images or a video, three metric lines (qiaooli-style `→ result`).
- Hobbies list + any images; a resume PDF for the hero corner link.
- Keep or drop Cyclone / Moosic / Song Hit Predictor in the playground?
- Spotify steps 1–3.
