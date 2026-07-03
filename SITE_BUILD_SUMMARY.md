# Pinnacle Counseling Group — Website Build Summary

A complete write-up of the site, its design system, content architecture, and the technical SEO / Generative Engine Optimization (GEO) work performed. Intended for review by an external strategist (e.g. Gemini).

---

## 1. Practice & business context

- **Practice name:** Pinnacle Counseling Group
- **Legal entity:** Wilson Marriage and Family Therapist Corporation (DBA Pinnacle Counseling Group)
- **Founder:** Enid Wilson, LMFT (California License #149114; Individual NPI 1508588831)
- **Second clinician:** Giana Azizeh, LMFT (California License #157294)
- **Group NPI:** 1053267906
- **Founded:** 2026 (Wilson Marriage and Family Therapist Corporation filed in early 2026)
- **BBS license verification:**
  - Enid Wilson, LMFT — https://search.dca.ca.gov/details/8002/MFT/149114/
  - Giana Azizeh, LMFT — https://search.dca.ca.gov/details/8002/MFT/157294/
- **Locations:**
  - Sacramento (Campus Commons) office — 2335 American River Drive, Suite 305, Sacramento, CA 95825 (38.5703256, -121.4090964) · operational now
  - Gold River office — 11201 Gold Express Drive, Suite 200, Gold River, CA 95670 (38.6233297, -121.2657518) · opens approximately October 1, 2026
- **Hours:** Mon–Fri 9am–8pm, Sat–Sun 9am–4pm
- **Phone:** (916) 990-2326 · **Email:** Info@PinnacleCounselingGroup.com
- **LinkedIn:** https://www.linkedin.com/company/pinnacle-counseling-group
- **Specialties:** high-functioning anxiety; Obsessive-Compulsive Disorder (OCD) with Exposure and Response Prevention (ERP); eating disorders; modern relational therapy; attachment-based therapy
- **Positioning:** LGBTQ-affirming, veteran-friendly, non-pathologizing
- **Brand aesthetic:** "quiet luxury" and "intentional hospitality" — sophisticated, minimalist, premium, warm
- **Audience:** middle-to-upper-class affluence in Sacramento; adults, couples, adolescents/teens
- **Rates:** licensed clinicians $200–225/session; associate clinicians $140–160/session
- **Insurance:** accepts some PPO plans; provides superbills for out-of-network reimbursement

---

## 2. Hosting & infrastructure

- **Host:** Netlify (static site)
- **Stack:** vanilla HTML/CSS/JS, no framework. Single-file `<style>` blocks per page for portability. Lenis smooth-scroll via CDN. No build step required.
- **Domain (assumed):** https://pinnaclecounselinggroup.com (used throughout schema, sitemap, llms.txt, OG tags — flag for confirmation)

Netlify-specific files at site root:
- `netlify.toml` — enables `pretty_urls` (so `/about` resolves to `/about.html`), forces HTTPS, redirects www → non-www, CSS/JS/image minification, 404 fallback.
- `_headers` — security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection) and long-cache for static assets; short cache for HTML/sitemap/robots.
- `_redirects` — clean URL aliases and 404 fallback.

---

## 3. Pages built (14 total + 404)

| URL | Purpose |
|---|---|
| `/` (index.html) | Homepage with hero, intro, services preview, providers preview, brand statement quote breaks, consultation lightbox |
| `/about.html` | Founder letter (Enid, first-person), Beyond Labels approach, Values centerpiece, Sacramento community note |
| `/providers.html` | Team grid (2 LMFTs + 6 AMFT placeholders), full bio lightboxes, clinical supervision section |
| `/services.html` | Services overview |
| `/individual-therapy.html` | Service detail page |
| `/couples-counseling.html` | Service detail page |
| `/children-and-teens.html` | Service detail page |
| `/organizational-consulting.html` | Service (coming-soon framing) |
| `/rates.html` | Two-tier rate card, billing options |
| `/faq.html` | Frequently asked questions |
| `/contact.html` | Contact form, office addresses, Google Maps embeds |
| `/careers.html` | Hiring page |
| `/privacy.html` | Privacy Policy (HIPAA, CMIA, California rights) |
| `/legal.html` | Legal Notice (no-therapist-relationship, not-medical-advice, 988/911) |
| `/404.html` | Branded not-found page |

Files are linked from a consistent footer on every page; nav uses an inline Services dropdown.

---

## 4. Design system

- **Typography:** Cormorant Garamond (serif, weights 300/400, italic enabled) for editorial display + body; Inter (sans-serif, weights 300/400/500) for nav, eyebrows, labels.
- **Color tokens (CSS custom properties):**
  - `--white #ffffff`, `--cream-warm #ddd5c3` (cooled stone), `--cream-soft #f4f1ea`
  - `--ink #2f3535`, `--ink-soft rgba(.72)`, `--ink-faint rgba(.48)`
  - `--clay #a36345` (deepened from `#bd7757` for less peachy/more leather feel), `--clay-deep #9a5a3d`, `--clay-soft #d49a7e`
  - `--sage #4f6361`, `--sage-deep #3a4b49`, `--sage-soft #8a9c99`
- **Radii:** `--radius-md 28px`, `--radius-lg 40px`, `--radius-xl 44px` (tightened from 56px during a subtle "less feminine, more architectural" pass), `--radius-pill 999px`
- **Section rhythm:** alternating cream-warm and white zones with rounded-top shoulders that overlap (negative margin = -radius-xl) so transitions feel curved, not stacked.
- **Motion:** Lenis smooth-scroll, reveal-on-intersect (`opacity` + `translateY` 28px), Ken-burns drift on photo breaks, sage scroll-progress bar at viewport top.
- **Hover language:** subtle 4–6px lifts, sage borders, refined gap/letter-spacing shifts on links. Originally had clay radial "glows" on hover; these were removed per request for restraint.
- **Footer:** cream-warm with rounded shoulder; the original asterisk ornament has been replaced with a "Back to Top" link that smooth-scrolls via Lenis.

---

## 5. Interactive features

- **Consultation lightbox (homepage):** opens from both "Request a Consultation" CTAs. Hairline-only inputs (no boxed borders) for luxury feel, small minimal radio chips for preferred-contact, 660px max-width, 14px corner radius (less pillowy), AJAX submit to Formspree with in-modal thank-you state.
- **Provider bio lightboxes:** identical pattern on homepage, providers page, and about page (clicking "Read Enid's bio" on the founder letter opens her bio in a modal). Sticky portrait + scrollable bio panel with Lenis-prevent on the panel for proper internal scrolling.
- **Contact form (contact.html):** also AJAX-submits to Formspree, shows inline thank-you panel on success.
- **Form handler:** Formspree (form ID `xqejvbak`). All submissions route to Info@PinnacleCounselingGroup.com with distinct `_subject` lines per source.
- **Spam protection:** honeypot fields (`_gotcha`) + Formspree native filtering.
- **Mobile nav:** slide-down panel with serif menu items, animated hamburger toggle.

---

## 6. SEO + GEO (Generative Engine Optimization) work

### 6.1 Meta tags (every page)
- Tightened `<title>` per page (155-char target, location + service words natural, not stuffed)
- `<meta name="description">` rewritten per page for search-result clarity
- Canonical URL via `<link rel="canonical">`
- `<meta name="robots" content="index, follow, max-image-preview:large">`
- Open Graph: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale`
- Twitter Cards: `summary_large_image` with full set
- Geo meta: `geo.region`, `geo.placename`, `geo.position`, `ICBM`
- `theme-color #2f3535`

### 6.2 JSON-LD structured data (every page, all 14 valid)

Schema graph includes (with `@id` cross-references):

- **`MentalHealthCenter` + `ProfessionalService` (multi-type):** the practice node. Includes `legalName` (Wilson MFT Corp), `alternateName`, `slogan` ("Rigorous clinical excellence meets intentional hospitality."), `description`, `foundingDate: 2026`, `founder` (linked to Enid), `sameAs` (LinkedIn), `identifier` (Group NPI), `knowsAbout` (all specialties spelled out), `knowsLanguage` (en), `audience` (Adults, Couples, Adolescents/teens, LGBTQ-affirming, Veterans and military families, High-functioning professionals), `areaServed` (Sacramento, Gold River, Carmichael, Granite Bay, Folsom, El Dorado Hills, Roseville, Loomis + California statewide telehealth), `address` (primary), `location` (cross-refs to two Place nodes), `openingHoursSpecification`, `paymentAccepted`, `priceRange ($140–$225)`, `currenciesAccepted USD`, `contactPoint`.
- **Two `Place` nodes** — distinct `@id`s for Sacramento and Gold River offices. Each has its own `PostalAddress`, `GeoCoordinates` (Google-Maps-precise), and `hasMap` URL.
- **`Person` (Enid):** name + honorific (LMFT), `jobTitle`, `worksFor` (linked), `image`, `identifier` (NPI + CA LMFT License), `hasCredential` (license recognized by California Board of Behavioral Sciences, C-DBT, CCTP), `alumniOf` (Touro, Drexel, Portland), `knowsAbout` (modalities).
- **`Person` (Giana):** parallel structure.
- **`WebSite` node** with `potentialAction: SearchAction` so Google can build a sitelink search box.
- **`Service` nodes** per service page with `category: "Mental health care"`, `availableChannel` for both offices + telehealth, audience targeting, and natural-language descriptions.
- **`FAQPage`** with 8 structured Q&As (locations, specialties, insurance, cost, telehealth, getting started, cancellation, LGBTQ-affirming statement).
- **`BreadcrumbList`** on every interior page.
- **`AboutPage` / `ContactPage` / `WebPage`** types where appropriate.

### 6.3 Crawler & AI bot files
- **`robots.txt`** — allows all crawlers, explicit Allow for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Applebot, Applebot-Extended, Bytespider, CCBot. Disallows `/uploads/`. Links to sitemap.
- **`sitemap.xml`** — all 14 pages with `lastmod`, `changefreq`, and `priority`.
- **`llms.txt`** — markdown index designed for LLMs. Opens with a one-paragraph factual summary covering corporate identity, NPIs, founder, specialties, and positioning. Sections: Specialties, Practice approach, About, Services, Locations & logistics, Service area, Connect (LinkedIn), Crisis support, Optional.

### 6.4 Accessibility / semantic HTML
- `<main id="main">` landmark on every page wrapping content (excluding lightboxes and footer)
- Skip-to-main link at top of `<body>` (visually hidden until focus)
- Exactly one `<h1>` per page (homepage preloader "Welcome" was originally a second h1; downgraded to `<p aria-hidden>`)
- 12 image `alt` attributes rewritten descriptively (photo breaks, service illustrations, sticky photos)
- ARIA labels on nav, mobile panel, lightbox close buttons

---

## 7. Ethics & compliance constraints honored

The site explicitly avoids practices that would violate CAMFT / ACA ethics or undermine trust:

- **No review-soliciting copy anywhere.** No CTAs requesting testimonials from clients.
- **No `AggregateRating` or `Review` schema.** (Would tempt LLMs to fabricate ratings, and active-client testimonials are an ethics concern.)
- **No fake placeholder content** anywhere in schema or copy.
- **No "medical practice" framing.** Schema uses `MentalHealthCenter` (a mental health practice) rather than `MedicalBusiness`. Visible copy uses "therapy / psychotherapy / counseling" exclusively.
- **Crisis disclaimer prominently placed** in legal notice and llms.txt: 988 + 911 reference, plus statement that the website does not provide crisis services.
- **HIPAA + California CMIA** disclosed in privacy policy with mention of separate Notice of Privacy Practices at intake.
- **Licensure jurisdiction** stated explicitly: services provided only to clients located in California at the time of session.
- **All NPIs and license numbers** are the real ones supplied by the practice owner.

---

## 8. Assumptions & known follow-ups

1. **Domain assumed `https://pinnaclecounselinggroup.com`** — used throughout canonicals, sitemap, robots.txt, llms.txt, OG tags, and all schema. If the production domain differs, a single global find-replace across all files corrects it.
2. **Gold River address:** confirmed correct as **11201 Gold Express Drive, Suite 200, Gold River, CA 95670**. Precise lat/long from Google Maps applied. Office opens approximately **October 1, 2026** — Google Business Profile listing intentionally deferred until ~30 days prior to opening to avoid premature-verification flags.
3. **Sacramento (Campus Commons) office** is operational now — Google Business Profile listing will be established immediately using verified address and operating parameters.
4. **Founding date** = **2026** in schema (Wilson Marriage and Family Therapist Corporation filed in early 2026).
5. **`sameAs` Person verification URLs** added for both clinicians pointing to the California Board of Behavioral Sciences (DCA) license lookup pages. Structure also accommodates forthcoming directory profiles (e.g. Psychology Today) — drop in additional URLs to the `sameAs` array on each Person node when those go live.
6. **Visible/structured-data parity:** the eight municipalities listed in `areaServed` (Sacramento, Gold River, Carmichael, Granite Bay, Folsom, El Dorado Hills, Roseville, Loomis) are also named in the About page's Community section copy — no stuffing, but they appear in prose so search engines see the same footprint structurally and visibly.
7. **OG share image** is currently `brand-statement-2.jpg`. A dedicated 1200×630 OG image with logo + tagline would be ideal but is a future task.
8. **Forms** require Formspree to verify the receiving email address (Info@PinnacleCounselingGroup.com) on first submission before forwarding kicks in. Form ID `xqejvbak` is live.
9. **Lazy-loaded Google Maps:** both office iframes on `/contact.html` already carry `loading="lazy"` to safeguard Core Web Vitals.
10. **`llms.txt` enhancements:** specialties bulleted; a markdown clinical-team table with credentials + focus areas was added for rapid LLM parsing; BBS license verification URLs included.

---

## 9. What would you (reviewer) check next?

If reviewing this work, the most useful sanity checks:

1. **Run the homepage URL through Google's Rich Results Test** — confirm the FAQ, LocalBusiness/MentalHealthCenter, Person, and Breadcrumb rich results all parse and validate.
2. **Run `https://pinnaclecounselinggroup.com/llms.txt` through ChatGPT or Claude** with a prompt like *"Summarize this practice and tell me what they specialize in."* Confirm the summary is accurate and quotes the right specialties.
3. **Test the consultation lightbox** by submitting a form on the homepage; verify the AJAX success state appears and an email arrives at Info@PinnacleCounselingGroup.com via Formspree.
4. **Validate the schema** at https://validator.schema.org by pasting any page's `<script type="application/ld+json">` block.
5. **Search for "Sacramento OCD therapy" or "LGBTQ-affirming therapy Sacramento"** in 30–60 days after the site is indexed to see organic ranking.

---

## End

Built as a static Netlify site. All page edits happen in the relevant `.html` file's embedded `<style>` and content blocks. Schema generation script lives in conversation history — re-runnable if specialties or facts change.
