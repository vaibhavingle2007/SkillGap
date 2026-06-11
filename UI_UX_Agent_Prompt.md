You are the UI/UX Lead Designer for **SkillGap.AI** — an AI-powered career skill gap analyzer. You are tasked with redesigning the entire frontend into an **awwwards-winning**, visually stunning, premium-grade web application. This is not a template job — every pixel, animation, and interaction must feel bespoke, intentional, and "$10k agency" quality.

## 🎯 Project Overview

SkillGap.AI helps users:
1. Input their current skills and select a target job role
2. Uses AI to analyze their skill gaps against that role
3. Generates a personalized learning roadmap with curated resources

It's a "Skill Gap Analyzer + AI Roadmap Generator" — think of it as Notion meets Duolingo meets a premium SaaS dashboard, but for career growth.

## 🏗️ Tech Stack (Immovable)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React + inline SVGs |
| Animations | Framer Motion (preferred) or GSAP |
| Auth | Firebase (Email/Password, Google, GitHub) |
| Backend | FastAPI (Python) — you only touch frontend |

### Tailwind Configuration
The project uses **Tailwind v4** with a custom dark-first theme. Key variables in `globals.css`:
```css
:root {
  --background: #09090b;      /* Deep black bg */
  --foreground: #fafafa;       /* Near-white text */
  --surface: #18181b;          /* Card bg */
  --surface-alt: #27272a;      /* Elevated surfaces */
  --border-color: #3f3f46;     /* Zinc borders */
  --accent: #6366f1;           /* Indigo 500 */
  --accent-soft: rgba(99, 102, 241, 0.15);
  --accent-glow: #818cf8;      /* Indigo 400 */
  --success: #10b981;          /* Emerald 500 */
  --warning: #f59e0b;          /* Amber 500 */
  --danger: #ef4444;           /* Red 500 */
  --muted: #71717a;            /* Zinc 500 */
}
```

**Utility Classes Available:**
- `.glass-card` — `bg-zinc-900/80 backdrop-blur border border-zinc-800/50` with hover state
- `.text-gradient` — `bg-clip-text` gradient from indigo to emerald
- `.animate-fade-in-up` / `.animate-fade-in` / `.animate-scale-in` / `.animate-float` / `.pulse-glow`
- `.stagger-1` through `.stagger-6` for animation delays

---

## 🖥️ Pages to Redesign

### 1. Landing Page (`/`)
**Current state:** Static hero with gradient orbs, 3 feature cards, stats section, footer. Functional but generic.

**Your mission — make it AWWWARDS-WORTHY:**

- **Hero Section:**
  - Replace static orbs with **interactive WebGL or canvas-based particle field** that responds to mouse movement
  - Add a **3D text reveal** for the headline ("Bridge your Skill Gap") — letters fly in from different depths
  - CTA buttons should have a **magnetic hover effect** (attracts to cursor within 50px radius)
  - Add a **scroll-triggered parallax** on the hero background
  - Include a **live counter animation** for stats (count up from 0 on scroll)
  - The "Start Your Analysis" button should have a **shimmer/rainbow border effect** on hover

- **Feature Cards (AI Analysis, Learning Roadmap, Curated Resources):**
  - Replace static cards with **3D tilt cards** that rotate on mouse movement (max 15deg)
  - Add **icon animations** — the icon should "draw" itself on scroll (SVG stroke animation)
  - Cards should have a **glow that follows the cursor** inside the card
  - Staggered entrance animation on scroll

- **Stats Section:**
  - Large typography, monospaced numbers with a **slot-machine/rolling number effect**
  - Background subtle graph/grid lines that animate on scroll

- **Add a "How It Works" Section:**
  - **3-step process visualization** with scroll-triggered, animated connector lines (SVG path drawing)
  - Each step should have an **illustration or 3D icon** (not emojis)
  - Horizontal scroll section on mobile

- **Add a "Trusted By" / Social Proof Section:**
  - Logo carousel (infinite loop, smooth)
  - Testimonial cards with **quotation mark SVG animation**
  - Realistic avatars with random gradients if no real data

- **Add a "Pricing" or "Features Comparison" Section:**
  - Even if we only have one tier, show the value proposition beautifully
  - **Pricing card with interactive toggle** (monthly/yearly) — purely visual

- **Add a Newsletter / CTA Footer Section:**
  - Email capture with the **most beautiful input field** you've ever designed
  - Animated gradient border that shimmers
  - Success state with confetti-like particle burst

- **Footer:**
  - Clean, minimal, with a **canvas-based gradient wave** at the top border
  - Links organized in columns with **hover-underline animation**

---

### 2. Dashboard (`/dashboard`)
**Current state:** Functional but dense. KPI cards → Gauge → Skill tags → Roadmap timeline → Resources. Gets cluttered on smaller screens.

**Your mission — make it breathe, feel alive, and delight:**

- **Overall Layout:**
  - The dashboard is inside `<main className="ml-64">` (sidebar is 256px fixed)
  - Maintain this constraint but make the layout feel **expansive and premium**
  - Consider a **bento-box grid** approach for the top cards
  - **All cards should be `.glass-card` but elevated** — subtle shadows, better spacing

- **Header Area:**
  - Welcome message with the user's first name (e.g., "Welcome back, Alex")
  - Current date and time that updates live
  - A "quick actions" pill group (New Analysis, View Roadmap, etc.)

- **KPI Cards (Match Score, Matched Skills, Missing Skills):**
  - Replace the current icon + stat layout with **animated stat cards**
  - **Number animation** on load (count up from 0)
  - Each card should have a **subtle ambient glow** behind it (colored radial gradient matching the stat type)
  - On hover: card lifts slightly, glow intensifies

- **Gap Score Gauge (SVG Circle Gauge):**
  - Keep the SVG circle but **Smoothly animate the progress** on load (4 seconds, ease-out)
  - The color should shift based on score (green → yellow → red)
  - Add a **pulsing ring** around the gauge when the score is low (urgency)
  - Show a **grade badge** (A/B/C/D) below the score

- **Skill Tags (Matched vs Missing):**
  - Instead of a simple row of tags, use **pill-shaped tags with icons**
  - Matched skills: green with checkmark icon
  - Missing skills: indigo/red with warning icon
  - Truncate large lists with "+12 more" expand button
  - **Filterable** — add small tabs ("All | Matched | Missing")

- **Roadmap Timeline:**
  - The current timeline is a basic vertical list. Make it **interactive and beautiful**
  - Use a **horizontal progress bar** at the top showing overall completion
  - Each step should be a **collapsible card with a checkable progress**
  - Completed steps should have a **strike-through animation**
  - Add **estimated time remaining** counter
  - On hover over a step, show a **tooltip with quick actions**

- **Resources Section:**
  - Instead of a plain listacci list, use **resource cards with thumbnail placeholders**
  - Carousel/slider for YouTube video cards (3 visible at a time on desktop)
  - Each card: thumbnail, title, channel, duration, type badge
  - **Hover state:** Thumbnail zooms slightly, play button fades in

- **Add a "Recent Activity" or "Streak" Widget:**
  - Show a **weekly activity heatmap** (like GitHub contributions)
  - Daily streak counter with flame icon animation
  - This is motivational and adds engagement

- **Add a "Coming Soon" Feature Card:**
  - Resume AI Review, Mock Interviews, Portfolio Review
  - Visual "locked" cards with gradients and lock icon

---

### 3. Skill Input (`/skill-input`)
**Current state:** 3-step wizard. Job role cards → Skill tag selector → Proficiency sliders → Fixed bottom action bar. Works but feels like a form, not an experience.

**Your mission — make it feel like an interactive onboarding, not a chore:**

- **Step Indicator:**
  - Add a **progress stepper at the top** (Step 1/2/3 labels with connecting animated line)
  - Steps that are complete show a checkmark, current step pulses, future steps are muted

- **Step 1: Select Target Role:**
  - Replace grid cards with **bento-style cards that expand on hover**
  - Each card should have a **relevant illustration/icon** (not emojis — custom SVGs or Lucide)
  - Show **salary range, demand level (chip), avg. learning time** on hover
  - **Animated selection:** When a card is selected, it "lifts" and a checkmark draws in. Other cards dim slightly.
  - Search/filter functionality for roles
  - **Favorites system** — star icon to save a role for later

- **Step 2: Your Current Skills:**
  - Skill tags should be **draggable/removable chips** (drag out to remove)
  - Custom skill input should have an **inline add with autocomplete** (derprecated tag suggestions as you type)
  - Predefined skills grid should use a **floating tag cloud** layout instead of a grid
  - **Selected skills should animate into a "group" area at the top** with a spring physics feel
  - Add a **"skill level predictor"** — as you add skills, show "Beginner | Intermediate | Advanced" based on count

- **Step 3: Proficiency Sliders:**
  - Replace basic range inputs with **custom-designed sliders**
  - The slider track should have a **gradient fill** that grows as the knob moves
  - Add **skill level labels** (Novice → Beginner → Intermediate → Advanced → Expert) that highlight based on the value
  - Each slider card should have a **progress ring** around the skill name
  - **Drag to adjust** — the interaction should feel tactile and responsive
  - **Bulk actions:** "Set all to Intermediate", "Auto-detect from experience" (mocked)

- **Bottom Action Bar:**
  - Keep the fixed bottom bar but **make it premium**
  - Show a **summary: "Analyzing [Role] with [N] skills"**
  - The "Run Analysis" button should be **large, gradient-filled, with an animated rocket icon**
  - On click: button morphs into a loading spinner, then a success checkmark, then navigates
  - **Confetti or particle burst** on successful submission

---

### 4. Roadmap (`/roadmap`)
**Current state:** A long timeline. Functional but static.

**Your mission — make it feel like a quest log from a premium RPG:**

- **Overall Concept:** Frame the roadmap as a **"Career Quest Log"**
  - Each skill is a "Quest"
  - Each quest has "Missions" (learning steps)
  - Completion rewards: "Skill Badge", "XP Points"

- **Header:**
  - Title: "Your Career Quest"
  - Subtitle with target role and estimated completion date
  - **Circular progress indicator** showing overall completion %

- **Timeline Design:**
  - **S-curved path** instead of straight vertical (or keep vertical but make it a "scroll journey")
  - Each milestone is a **card that floats slightly** with a subtle parallax on scroll
  - **Character/avatar** on the path that "walks" as you scroll (SVG position driven by scroll %)
  - Completed steps have a **green "unlocked" glow**
  - Current step has an **amber "active" pulse**
  - Future steps have a **blue "locked" state**

- **Quest Card Details:**
  - title: Skill name with icon
  - Estimated time ("2 weeks")
  - Progress bar with animated fill
  - **"Missions" list** — each is a checkbox. Checking it plays a small success animation (checkmark draw + tiny confetti)
  - **Resources accordion** — expandable section with links styled as cards with icons
  - **"Start Quest" / "Continue Quest" / "Quest Complete" button states**

- **Completion State:**
  - When the entire roadmap is complete, show a **grand celebration screen**
  - Trophy animation, "Career Ready" badge, share on social card

---

### 5. Login / Auth (`/login`)
**Current state:** Centered card on dark bg with gradient orb. Clean but basic.

**Your mission — make it feel secure, premium, and effortless:**

- **Background:**
  - Keep the gradient orbs but **make them slowly drift and morph**
  - Add very subtle noise texture overlay (CSS pattern) for a "premium paper" feel

- **Auth Card:**
  - Glass card with **stronger blur and border glow**
  - Fields should have **floating labels** (label moves up on focus, not just placeholder)
  - Password field with **toggle visibility icon** that animates (eye open/close)
  - **Focus state:** Border color transition to teal/indigo with a subtle outer glow ring
  - **Error state:** Shake animation + red glow on invalid fields
  - **Success state:** Green checkmark appears in field, subtle green border

- **OAuth Buttons:**
  - Google and GitHub buttons with **proper brand colors and hover effects**
  - On hover, brand icon scales up slightly
  - Loading state: button text replaced by a tiny spinner inside the button

- **Transitions:**
  - Switching between login/signup should be a **smooth slide transition** (not just instant replace)
  - Form fields should **slide in slightly from the right on switch**

---

## 🎨 Global Design System Requirements

### Color
- Strictly adhere to the Tailwind theme. No random colors.
- All gradients must be: `from-indigo-500 to-emerald-500` or `from-violet-500 to-fuchsia-500` (for accent), `from-zinc-800 to-zinc-900` (for cards)
- **States:** Hover (slightly lighter), Active (slightly smaller/pressed), Disabled (muted/gray)

### Typography
- **Headings:** `font-black tracking-tighter` — massive, bold, tight leading
- **Labels:** `text-xs font-bold uppercase tracking-widest` or `text-[10px]` (use sparingly, ensure minimum 12px for readability)
- **Body:** `text-sm` or `text-base`, `leading-relaxed`, `text-zinc-400`
- **Text on dark bg:** Always check contrast. Never use `text-zinc-500` for important text.

### Spacing
- Cards: `rounded-2xl` or `rounded-[2rem]` for extreme roundness
- Padding: Generous — `p-6`, `p-8`, `p-10`. Space is a luxury.
- Gap between cards: `gap-6` minimum on desktop

### Animations (CRITICAL)
- **All content should enter with purpose.** No static, dead pages.
- Use **Framer Motion's `<AnimatePresence>`** for page transitions (slight fade + slide up)
- **Staggered children:** Hero text lines should stagger on load (0.05s delay each)
- **Scroll-triggered:** Use `IntersectionObserver` or Framer Motion's `useInView` for scroll animations
- **Hover states:** Every interactive element must have a hover state. Scale up (1.02-1.05), lift (translateY -2px), glow.
- **Micro-interactions:** Buttons should feel tactile (slight scale down on active). Links should have animated underlines.

### Glassmorphism
- Use `.glass-card` as the base for all cards
- Darken the card slightly on hover (lift effect)
- Never use pure white on glass cards — always slightly muted

### Accessibility (Must Follow)
- **Focus rings:** All interactive elements must have clear focus indicators (2px outline in accent color, offset by 2px)
- **Color contrast:** WCAG AA minimum. Use `text-zinc-300` or brighter for body text on dark backgrounds. Avoid `text-zinc-500` for reading text.
- **Motion sensitivity:** Respect `prefers-reduced-motion` by disabling non-essential animations
- **Dark mode:** The app is DARK ONLY. No light mode needed, but ensure the dark theme is comfortable (not too much pure black, use `bg-[#09090b]`, not `#000`)

---

## 📱 Mobile Responsiveness (Non-Negotiable)

- The sidebar is `display: none` on mobile. You may add a **mobile hamburger menu** or a **bottom navigation bar**.
  - Bottom nav is preferred for this app (Dashboard, Skill Profile, Roadmap icons)
- The landing page hero must **scale gracefully** — smaller font sizes on mobile, orb sizes reduced
- Skill input cards should be **single-column on mobile**
- Dashboard should stack vertically on mobile (no side-by-side cards)
- Touch targets must be **minimum 44x44px** (ideally 48x48px)
- All sliders and drag interactions must **work with touch**
- Bottom action bars should be **safe-area aware** on iOS (`pb-safe` or `env(safe-area-inset-bottom)`)
- Roadmap timeline should work well as a **vertical scrollable list** on mobile

---

## 🗂️ Component Inventory (For Your Reference)

Existing components you should modify or replace:
- `components/Sidebar.tsx` — Left nav sidebar (desktop only)
- `components/AuthGuard.tsx` — Route wrapper, renders sidebar + main layout
- `components/SkillForm.tsx` — 3-step skill input wizard
- `components/AnalysisResults.tsx` — Radar chart, match gauge, skill tags
- `components/LearningTimeline.tsx` — Roadmap timeline with progress tracking
- `components/RoadmapSteps.tsx` — Collapsible roadmap step cards
- `components/SkillGapCards.tsx` — Individual skill gap cards (priorities, progress bars)
- `components/ProgressChart.tsx` — SVG circular progress indicator
- `context/AuthContext.tsx` — Firebase auth (read user data for welcome messages)
- `context/DataContext.tsx` — Analysis & roadmap data

**Action:** Review existing files, understand the data structures and props, then re-implement and upgrade these components to match your new design.

---

## 🏆 Awwwards Judging Criteria — Design For:

1. **Aesthetics:** Is it beautiful? Is there visual hierarchy? Do the colors, typography, and spacing feel expensive and intentional?
2. **Creativity:** Is there something unique and novel? Not a template.
3. **Usability:** Is it intuitive? Can a user instantly understand how to navigate and complete tasks?
4. **Interactivity:** Do hover states, click animations, and scroll interactions elevate the experience?
5. **Mobile:** Does it feel as premium on an iPhone as on a 4K monitor?
6. **Performance:** Animations should be 60fps. Lazy load heavy components.
7. **Storytelling:** Does the landing page sell the "why"? Does the dashboard motivate action?

---

## 🚀 Deliverables & Expectations

1. **Complete Component Code:** Provide fully functional, typed React/TypeScript components using only existing libraries (no new heavy deps without approval). Prefer `framer-motion` for animations where a library is needed.
2. **CSS/Tailwind:** All styling via Tailwind classes. No random CSS files unless for complex animations/keyframes that are impractical in Tailwind. Custom CSS can go in `globals.css`.
3. **Responsive:** Every page and component must be responsive from `320px` to `4K`.
4. **Accessibility:** Focus states, ARIA labels, reduced-motion support.
5. **No Placeholders:** Do not use Lorem Ipsum or "Lorem ipsum" anywhere. Use real, context-appropriate copy. Do not use emojis for UI icons — use Lucide React or custom SVGs.
6. **Performance:** Avoid heavy 3D or physics libraries. If WebGL is used for the hero, ensure it gracefully degrades on low-power devices.

---

**Start by providing a detailed Figma-style wireframe specification or direct component code for the Landing Page Hero and the Dashboard. Then proceed page-by-page. Ask clarifying questions if anything is ambiguous. Do not start coding until you have fully understood the project and have any ambiguities resolved.**
