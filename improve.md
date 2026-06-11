#### Phase 0 — Setup (do once, before anything)

1. Install the animation library: `cd frontend && npm install framer-motion` (commit both `package.json` and `package-lock.json`)
2. Extend `src/app/globals.css` with shared utilities you'll reuse everywhere:
   - `:focus-visible { outline: 2px solid var(--accent-glow); outline-offset: 2px; }` — accessible focus rings globally
   - `@keyframes marquee` (translateX 0 → -50%) + `.animate-marquee` for infinite loops
   - `.shimmer-border` — a rotating conic-gradient `::before` behind the button, an inset gradient `::after` as the button face; shimmer revealed on hover/focus
   - `.bg-grid-lines` — two 1px linear-gradients at 56px intervals for a subtle grid backdrop
   - `.noise-overlay::after` — inline SVG `feTurbulence` data-URI at ~3.5% opacity for premium grain
   - `.link-underline` — `::after` line scaling X from 0→1 on hover (origin flips for the out animation)
   - `.gradient-border-anim` — padding-box/border-box double background with an animated 300%-wide gradient (for the newsletter input)
   - A `prefers-reduced-motion` media query that kills all animation/transition durations
3. Create a reusable animation kit in `src/components/landing/` (used by every phase):
   - **`Reveal.tsx`** — wraps children in `motion.div`, `initial {opacity:0, y:28}` → `whileInView`, `viewport={{once:true}}`, accepts `delay`; no-op under `useReducedMotion`
   - **`CountUp.tsx`** — counts a number from 0 when scrolled into view using `useInView` + `requestAnimationFrame` with quartic ease-out; props: `value, suffix, decimals, duration`; renders final value instantly under reduced motion
   - **`Magnetic.tsx`** — wrapper using `useMotionValue` + `useSpring`; on `pointermove` offsets child toward cursor by `(cursor − center) × strength`, springs back on leave
   - **`TiltCard.tsx`** — computes pointer position % inside the card; sets `rotateX/rotateY` (capped ~10°, spring-smoothed) and writes `--gx/--gy` CSS vars that drive a radial-gradient glow div following the cursor

---

#### Phase 1 — Landing Page (`src/app/page.tsx`)

**1. Hero**
- Build **`ParticleField.tsx`**: a `<canvas>` with ~100 particles (count scaled by area), each drifting with small velocity, wrapping at edges; particles within 160px of the cursor get gentle attraction; particles within 90px of each other get connecting lines with distance-faded opacity. DPR-aware sizing, `IntersectionObserver` to pause when offscreen, fully disabled under reduced motion. Place it absolutely behind the hero.
- **3D headline reveal:** split "Bridge your" into words, each a `motion.span` with `initial {opacity:0, y:50, rotateX:55}` animating in with 0.12s stagger inside a `perspective: 900` container; "Skill Gap." follows as the gradient line (`.text-gradient`)
- **Parallax:** `useScroll()` → `useTransform(scrollY, [0,700], [0,140])` applied to the background layer; also fade it toward 0.25 opacity as you scroll
- **CTAs:** primary "Start Your Analysis" = `Magnetic` + `.shimmer-border` + arrow that nudges right on hover; secondary = glass card button
- 4 floating skill chips ("React", "Python", "SQL", "AWS") absolutely positioned around the hero, `animate-float` with staggered delays, desktop only

**2. Feature cards** — 3 `TiltCard`s; replace emoji with **stroke-draw SVG icons**: `motion.path` with `pathLength: 0 → 1` `whileInView` (bar chart, winding route, book paths); staggered `Reveal` entrances

**3. How It Works** — new section: eyebrow label, big heading "Zero to hired, three steps."; 3 steps (Map your skills / See the gap / Follow the roadmap) with Lucide icons in glowing rounded squares and numbered badges; a connector line between them animating `scaleX 0→1` on view (desktop); on mobile the steps become a horizontal `snap-x snap-mandatory` scroll row

**4. Stats** — 4 numbers (50+, 2k+, 10k+, 99.2%) in `font-mono font-black` rendered through `CountUp`, sitting on `.bg-grid-lines` with a radial mask so the grid fades at the edges

**5. Skills marquee** — duplicated pill list inside `.animate-marquee` (w-max flex), edges masked with a horizontal linear-gradient mask, pauses on hover

**6. Testimonials** — 3 `TiltCard`s (gentler 6° tilt): quote icon springs in (`scale 0→1, rotate -20→0`), realistic persona copy, gradient avatar circles with initials

**7. Pricing** — Free + Pro cards; monthly/yearly toggle where the active pill is a `motion.span layoutId` that springs between buttons; Pro card gets indigo gradient surface, "Most Popular" badge, shimmer-border CTA; price and billing note swap with the toggle

**8. Newsletter** — input wrapped in `.gradient-border-anim`; on submit, `AnimatePresence` swaps form → success card while 14 particle dots burst outward radially (cos/sin positions, fade to 0)

**9. Footer** — animated SVG wave divider (wave path duplicated at 200% width, slid with `.animate-marquee`), 4-column layout (brand + blurb + social icon buttons, Product links, Company links), `.link-underline` on every link

**10. Cleanup pass on the whole page:** every `text-[10px]` → `text-xs`; body text `zinc-500/600` → `zinc-300/400`; `aria-hidden` on decorative elements; 44px+ touch targets

---

#### Phase 2 — Dashboard (`/dashboard`)

1. **Mobile nav first** — new `components/MobileNav.tsx`: fixed bottom tab bar (`lg:hidden`), 3 tabs with Lucide icons, active indicator as a `layoutId` pill, `pb-[env(safe-area-inset-bottom)]`. Update `AuthGuard.tsx`: `ml-64` → `lg:ml-64 pb-20 lg:pb-0`
2. **Header** — "Welcome back, {firstName}" from `AuthContext`, live clock via interval + `Intl.DateTimeFormat`, quick-action pill links
3. **Bento KPI grid** — `grid-cols-2 lg:grid-cols-4`; Match Score cell spans 2 rows and hosts the gauge; numbers use `CountUp`; each card has a colored radial glow blob behind it (indigo/emerald/red) that intensifies on hover with a lift
4. **Gauge (`ProgressChart.tsx`)** — animate `strokeDashoffset` over 2s ease-out; stroke color by score (≥70 emerald, 40-69 amber, <40 red); `.pulse-glow` outer ring when low; A/B/C/D grade chip
5. **Skill tags** — filter tabs (All/Matched/Missing), icon pills (Check = emerald, AlertTriangle = indigo/red), "+N more" expander with `AnimatePresence`
6. **Roadmap summary** — gradient overall-progress bar (`scaleX` animated), collapsible step cards (rotating chevron, height auto animation), strike-through animation on completed titles, "~X weeks remaining"
7. **Resources** — snap-scroll carousel of cards: gradient thumbnail placeholder, 2-line clamped title, duration + type badges; hover zooms thumbnail and fades in a play button
8. **Heatmap + streak** — log a timestamp on every step completion (extend existing localStorage/Firestore writes); render 12 weeks as a 7×12 grid of squares with activity-scaled opacity; streak counter with `Flame` icon pulsing at 3+ days
9. **Coming Soon cards** — dimmed gradient cards with `Lock` icons (Resume AI Review, Mock Interviews, Portfolio Review)

---

#### Phase 3 — Skill Input (`SkillForm.tsx` rewrite)

1. **Stepper** — 3 nodes + animated connector segments; completed = filled + checkmark `pathLength` draw, current = pulsing ring, future = muted
2. **Role step** — search box filtering title/category; cards reveal salary/demand/learning-time on hover via `max-h` transition; selection lifts the card, draws a check, dims siblings; star-to-favorite persisted in localStorage, favorites sorted first
3. **Skills step** — "Your stack" zone where chosen chips spring in (`motion.div layout`); suggestion tag cloud (`flex-wrap`, varied pill sizes) replaces the grid; custom input with live autocomplete dropdown (+ "Add '{query}'" fallback); profile label (Beginner <5 / Intermediate 5-10 / Advanced >10 skills)
4. **Proficiency step** — custom slider: native hidden range input for a11y/touch + styled track with gradient fill width = value%, 24px glowing knob scaling while dragging; 5-level label row highlighting the active level; mini SVG progress ring beside each skill name; "Set all to Intermediate" bulk button
5. **Action bar** — summary "Analyzing {role} with {N} skills"; submit button is a 3-state machine (idle → loading spinner → success check) morphing via `AnimatePresence`, then particle burst → `router.push`; safe-area padding on mobile

---

#### Phase 4 — Roadmap Quest Log (`LearningTimeline.tsx`, `RoadmapSteps.tsx`)

1. **Header** — "Your Career Quest", `{role} · est. completion {date}` (sum of step estimates), circular progress ring + `Lv. {totalXP/100}` badge
2. **Scroll-drawn path** — S-curved SVG path down the timeline; `useScroll({target})` → `scrollYProgress` bound to `motion.path` `pathLength`; a glowing traveler dot rides the path via CSS `offset-path` driven by the same progress
3. **Quest cards** — three visual states: complete (emerald glow, "Quest Complete"), current (amber pulse, "Continue Quest"), future (dimmed + lock, "Locked"); each card: icon, time chip, animated mission progress bar, "+50 XP" chip
4. **Missions** — checkboxes whose check path draws in + 6-dot mini confetti; label strike-through; persist completion AND timestamp (feeds the Phase 2 heatmap)
5. **Resources accordion** — expandable list of mini cards with type icons
6. **Celebration** — at 100%: full-screen overlay, trophy springs in, "Career Ready" gradient badge, big particle burst, CTA buttons; `celebrated` flag in localStorage so it fires once

---

#### Phase 5 — Login (`login/page.tsx`)

1. **Background** — orbs as `motion.div`s drifting/morphing over 20-30s mirrored loops + `.noise-overlay`
2. **Floating labels** — absolutely positioned label shrinking to top on `peer-focus`/filled; indigo glow ring on focus
3. **States** — error: `shake` keyframe (add to globals) + red glow + message; success: green check inside the field; password `Eye/EyeOff` toggle (44px target)
4. **OAuth** — white Google button with multicolor G, zinc GitHub button; icons scale on hover; inline spinner while pending
5. **Sign-in ↔ sign-up** — `AnimatePresence mode="wait"` slide transition (exit left, enter from right), extra fields staggered

