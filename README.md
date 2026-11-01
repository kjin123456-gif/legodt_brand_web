# LEGODT (레고트) Brand Introduction Page — Unofficial

A one-page, playful pastel brand introduction for the Korean drinkware/lifestyle brand LEGODT (레고트).
This is an **unofficial** page: it is not the official LEGODT site and uses no official logo or product photos (text wordmark + original SVG illustrations only).

- Built: 2026-11-01 · Stack: HTML5 + CSS3 + vanilla JS (no build step)
- Repository: (added after deploy)
- Live site: (added after deploy)

## Sources
- Content: `output/research/brand/legodt/legodt_research.md` (verified facts only; prices as of 2026-11-01; keep/cold hours = brand's own test figures)
- Design: `references/web-design/brand/legodt/design_analysis.md` (layout/components), color mood from the research ("PLAY MY WAY", pastel pop)

## Sections
1. Split hero (lavender panel + "PLAY MY WAY" solid/outline type, SVG tumbler stage)
2. Brand story (word-by-word scroll statement, 3 fact cards, keyword chips)
3. Signature Loop Tumbler (staggered feature cards with counters: 180°, 304, 77 mm, sleeve)
4. Lineup (pill filter: Mini 200 / Standard 400 / Multi 400·600·1000 / Module 414 / Straw 700)
5. Color pick (accessible radio swatches, cross-fade tumbler + background tint)
6. Dark Hot/Cold section (model tabs, CountUp, brand-test disclaimer)
7. TUMGGU / Module customize (28 parts, 180+ combos, 3D configurator; explode/shuffle demo)
8. Daily scenes (4 Unsplash photos; swipe gallery on mobile)
9. Pop-ups & collaborations (marquee + timeline 2024.07–2026.10)
10. Reviews by numbers (Musinsa 4.8/199, 4.9/29; CJ OnStyle +45%) + placeholder for real reviews
11. FAQ accordion (`details`/`summary`; care caveats)
12. Where to buy (legodt.kr, 29CM, Musinsa links; Olive Young, CJ OnStyle, pop-ups)
Footer: big text wordmark + unofficial-page notice + credits

## Libraries
| Name | Version | Purpose | License | Path |
|---|---|---|---|---|
| GSAP | 3.15.0 | Hero timeline, scroll fade-ups, word-by-word scrub, filter animation | GSAP Standard "no charge" license (https://gsap.com/standard-license) | `lib/gsap/gsap.min.js` |
| GSAP ScrollTrigger | 3.15.0 | Scroll-triggered reveals and scrub | same as GSAP | `lib/gsap/ScrollTrigger.min.js` |
| CountUp.js | 2.10.1 | Number counters (features, stats, Hot/Cold, ratings) | MIT | `lib/countup/countup.umd.js` (+ `LICENSE.md`) |

Installed with `npm install` in a temporary folder; only dist files were copied. No CDN is used for scripts at runtime (web fonts Pretendard / Fredoka load from jsDelivr / Google Fonts, with system fallbacks).
`prefers-reduced-motion` disables GSAP motion, counters, marquee and transitions; all content is visible without JS.

## Images
See `img/CREDITS.txt` (4 Unsplash photos under the Unsplash License; all product visuals are original SVG).

## Files
`index.html`, `css/style.css`, `js/main.js`, `lib/`, `img/` (`img/_check/` = verification screenshots, git-ignored), `.gitignore`
