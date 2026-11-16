# PROJECT PROPOSAL & ACTION PLAN

> **LETTERHEAD — TO BE SUPPLIED**
> Logo: `[CLIENT LOGO]` · Company: `[COMPANY NAME]` · Address: `[ADDRESS]` · Email: `[EMAIL]` · Phone: `[PHONE]`

| | |
|---|---|
| **Project** | Colour Intelligence Platform for Fashion (working title: **MUSE**) |
| **Prepared for** | `[CLIENT NAME]`, `[COMPANY NAME]` |
| **Prepared by** | `[YOUR NAME / STUDIO]` |
| **Date** | 16 November 2026 |
| **Version** | 1.0 — Draft for approval |

---

## 1. Executive summary

We propose a web-first, launchable colour-intelligence product for fashion designers and their clients. The product answers one question — *"which colours and combinations suit this person, this garment, and this outfit?"* — and shows the result on a digital mannequin.

The core is **deterministic colour science**, not generative AI: skin-tone and undertone profiling, personal palettes, garment colour extraction, harmony scoring, and a 2.5D mannequin preview. This makes the product fast, explainable, testable, cheap to run, and **free at the point of use** — the mannequin costs $0 per render because it draws in the user's browser.

**Feasibility: yes.** The technical risk is low. The real risks are (a) whether users trust and pay for the advice, and (b) garment content assets. Both are addressed in Phase 0 before significant build spend.

**Recommended next step:** approve Phase 0 (validation + architecture), 3 weeks, before committing to full build.

---

## 2. Understanding of the opportunity

**Problem.** Selecting colour combinations that suit a client's skin tone, a garment, or an outfit is slow, subjective, and repeated constantly. Designers rely on experience and trial; clients rely on guesswork and social media.

**Users.**
- **Fashion designers / stylists** — need speed and repeatability across many clients.
- **Clients / consumers** — need confidence in what suits them and how to combine pieces.

**Why this wins.** The combination of (1) explainable colour science and (2) a mannequin that renders colours against the user's own skin tone is a clear, ownable differentiator.

**Success criteria for v1.** A new user reaches a believable palette in under 60 seconds; a designer can run a client palette and check a garment in under 3 minutes; the free tier converts to paid at a measurable rate.

---

## 3. Deliverables & roadmap

| Phase | Weeks | Key deliverables |
|---|---|---|
| **0 — Validation** | 1–3 | 8–12 user interviews; competitor scan; pricing signal; fashion-consultant review of palette rules; architecture + data model; clickable prototype; validated v1 scope |
| **1 — Design** | 3–5 | Brand/visual system (glassmorphism, per approved style reference); landing page; core screens; mannequin art direction |
| **2 — Build v1** | 5–11 | Colour engine + tests; auth; profiles; palettes; garment colour check; 2.5D mannequin; boards & sharing; free/premium gating; billing |
| **3 — Launch** | 11–13 | QA; privacy & consent copy; analytics; soft launch to research cohort |
| **4 — Post-launch** | Ongoing | Iteration, consultant co-sign, v2 features (true 3D mannequin, paid try-on credits) |

---

## 4. Actions to be taken now

| # | Action | Owner | Needs from client |
|---|---|---|---|
| A | **User research** — 8–12 interviews (designers + clients), competitor scan, willingness-to-pay test | Product/dev | Warm intros to 5–10 designers/clients |
| B | **Fashion consultant engagement** — shortlist AICI-certified image/colour consultants; 2–3 paid sessions to validate harmony rules, terminology, and presentation | Product/dev | Budget approval (~$300–700) |
| C | **Architecture & data model sign-off** — monorepo, colour engine as isolated package, DB schema, hosting plan | Product/dev | Review + approval |
| D | **Visual direction lock** — landing page, brand tokens, mannequin art direction | Product/dev | Feedback on the comp |
| E | **Client inputs** — company name, logo, brand assets, domain, budget confirmation, sample garment images | Client | As listed |

---

## 5. Scope — v1

**In scope**
- Account creation, verification, login (Google/Apple OAuth + magic link, no passwords)
- Skin profile: depth, undertone, hair/eye colour, contrast level
- Personal palette: core colours, colours to avoid, seasonal mapping
- Garment/outfit colour check with match score, explanation, and suggested swaps
- **2.5D digital mannequin** — layered illustration, recolourable garments, user's skin tone
- Saved boards and shareable links
- Designer workspaces with multiple client profiles
- Free / Premium / Designer Pro tiers with billing

**Out of scope for v1 (roadmap)**
- True 3D mannequin; AR / real-time try-on; generative virtual try-on; automatic body measurement; native mobile apps; multi-language.

---

## 6. Free vs paid model

| | **Free** | **Client Premium** | **Designer Pro** |
|---|---|---|---|
| Swatch + undertone profile | Yes | Yes | Yes |
| Core palette | Yes | Yes | Yes |
| 12-season analysis (hair/eye/contrast) | Preview | Full | Full |
| Foundation-shade mapping | — | Yes | Yes |
| Outfit checks | 3/day | Unlimited | Unlimited |
| Harmony matrix + explanations | Basic | Full | Full |
| Saved boards | 1 | Unlimited | Unlimited |
| Exports (PDF/palette) | — | Yes | Branded |
| Multiple client profiles | — | — | Yes |
| Bulk garment extraction | — | — | Yes |
| Try-on / AR credits | — | Add-on | Included allowance |

**Gating rules:** every paywall previews what it unlocks; anything with per-use API cost is sold as credits, never unlimited.

---

## 7. Technical architecture (summary)

- **Monorepo:** Next.js web app · pure TypeScript colour-engine package · shared UI package · Drizzle DB package.
- **Colour engine (core IP):** CIELAB / D65, ITA° for skin tone, CIEDE2000 for difference, contrast ratios, season mapping — fully unit-tested.
- **Mannequin:** layered SVG with CSS blend modes (v1), upgradable to Three.js 3D later.
- **Data:** Postgres + Drizzle, row-level security; image storage on Cloudflare R2 with signed URLs.
- **Auth:** OAuth + magic link.
- **Background jobs:** image processing and colour extraction queued, not in-request.
- **Hosting:** Vercel; analytics PostHog; errors Sentry; billing Stripe.
- **Privacy:** no face photographs in v1; profiles are self-declared; consent, retention, and deletion policies included.

---

## 8. Costs

**One-time**
| Item | Estimate |
|---|---|
| Fashion consultant (2–3 sessions) | $300–700 |
| 2.5D mannequin illustration | $0–600 |
| Research incentives (optional) | $0–200 |
| Development | `[QUOTE PLACEHOLDER]` |

**Recurring — client-funded, as agreed**
| Item | Estimate |
|---|---|
| Hosting | $0–40 / month |
| Database | $0–25 / month |
| Image storage | $1–10 / month |
| Domain | ~$15 / year |
| Email | $0–20 / month |
| Generative try-on (post-v1 only) | Per-use credits |

**Note:** the mannequin costs **$0 per use**. Only future generative features carry variable cost, and those are credit-based.

---

## 9. Assumptions & dependencies

- Client supplies company name, logo, brand assets, domain, and confirms budget for infrastructure.
- Client provides warm introductions to designers/clients for research.
- Research findings may adjust v1 scope; changes are agreed in writing.
- v1 is UK/EU/US English only.
- No face-image processing in v1.

---

## 10. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Advice perceived as inaccurate | High | Consultant validation; lighting-independent declared input; explainable results |
| Low willingness to pay | High | Phase 0 pricing test; tiered model; concierge validation |
| Garment content is expensive | Medium | Seeded wardrobe for v1; no per-brand assets |
| Scope creep (3D/AR/try-on) | Medium | Explicit out-of-scope list; phased roadmap |
| Privacy concerns | Medium | No face uploads; RLS; deletion; clear consent copy |
| Solo capacity | Medium | Phased plan; fixed v1 scope; consultant only where needed |

---

## 11. Acceptance & next steps

1. Client reviews and approves this proposal, including Phase 0.
2. Client provides brand inputs (name, logo, domain) and research introductions.
3. Phase 0 kickoff: interviews, consultant sessions, architecture sign-off.
4. Visual direction (landing comp) reviewed and locked.
5. Build begins only after Phase 0 findings are accepted.

**Approved by:** ______________________  **Date:** ______________

**Prepared by:** ______________________  **Date:** ______________

---

### Appendix A — Research plan
8–12 interviews (30 min), past-behaviour questions, concept ranking, price-card test, competitor scan (Colorwise.me, Dressika, Style DNA, My Best Colors, Whering), concierge test with 5 designers. Output: one-page findings + validated jobs + pricing signal.

### Appendix B — Roadmap after v1
True 3D mannequin (MakeHuman + Three.js) → generative try-on credits → AR preview → native mobile → designer marketplace/API.
