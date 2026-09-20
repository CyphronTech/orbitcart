# Compliance, privacy and accessibility notes

Internal document (not deployed: `**/*.md` is excluded in `firebase.json`).
Prepared 20 September 2026. The legal pages are plain-language **drafts**; have the
business owner and, ideally, a lawyer confirm them before relying on them.

## 1. Where each requirement stands

| Requirement | Status | Where |
| --- | --- | --- |
| Privacy policy | Done (draft) | `privacy-policy.html`, text in `src/legal.mjs` |
| Terms of service | Done (draft) | `terms-of-service.html` |
| Refund policy | Done (draft, terms need your confirmation) | `refund-policy.html` |
| Cookie policy | Done | `cookie-policy.html` |
| Cookie consent notice | Done. A small notice at the bottom of the screen on arrival; Decline and Accept have equal weight; choice expires after 12 months; "Cookie settings" in the footer reopens it | `ConsentBanner` in `src/main.mjs`, `src/consent.mjs` |
| Form consents | Done. One unticked, required box confirms the visitor is 18 or older, has read the privacy policy and agrees to the reply use. The consent flag, policy version and time are stored with the submission | `ContactForm`, `firestore.rules` |
| Don't collect unnecessary data | Done. Removed the page URL. Only name, email, project type, message, plus the consent record | `getContactPayload` |
| Third-party SDK audit | Done, see section 3. React is now served from this site, not `esm.sh` | `assets/vendor/` |
| Remove dark patterns | Done, see section 4 | |
| Remove hidden fees | No prices or payments exist on the site. Added an FAQ, terms and refund wording that commit to written quotes with taxes and third-party costs itemised | FAQ, Terms, Refund Policy |
| Remove fake reviews | None found. There are no testimonials, ratings or review widgets | |
| Remove unsupported claims | Done, see section 5 | |
| Alt text | Audited. Content images have descriptive alt text; logos and decorative images use empty alt or `aria-hidden` | |
| Colour contrast | Fixed. axe-core reports 0 violations on all 19 pages; gradient text (which axe cannot judge) was checked by calculation, lowest 5.49:1 | `styles.css` |
| Keyboard navigation | Done. Visible focus ring everywhere, Escape closes the mobile menu, hidden carousel slides are inert (the carousel still auto-rotates; it pauses on hover, focus and reduced-motion. Removing auto-rotation would fully satisfy WCAG 2.2.2), the cookie notice takes focus only when the visitor reopens it | |
| Business details | In the footer and legal pages. Some values are missing, see section 2 | `src/site-config.mjs` |
| Age consent / children's data | 18+ confirmation is part of the single consent checkbox on the contact form; children's section in the privacy policy | |
| Unsubscribe link in emails | Not applicable today: the site sends no automated or marketing email. The privacy policy promises opt-in plus an unsubscribe link if that changes. Template in section 6 | |
| Licences for bots and images | Audited, see section 7. The site has no chatbot | |
| Data deletion request option | Done. Form plus email path | `privacy-request.html`, runbook in section 8 |

## 2. What only you can supply or confirm

1. **Business details** in `src/site-config.mjs` (empty ones are not shown):
   `registeredAddress`, `registrationNumber` (LLPIN), `gstin`, `grievanceOfficer.name`.
   Indian law expects a grievance officer's name and contact to be published.
2. **Legal name.** "Cyphrontech LLP" was taken from the repository history. Confirm it is exact.
3. **Business terms I assumed** (edit `src/legal.mjs` if they are wrong):
   - enquiries deleted 12 months after last reply; privacy-request records kept 3 years;
   - 30-day fix-it window for defects and 30 days' notice for support plans;
   - refund rules in `refund-policy.html` (full refund of an advance before kickoff, milestone-based after);
   - we reply to privacy requests within 30 days and to complaints within 3 working days;
   - governing law is India, with no named city for courts.
4. **Case studies and stats.** I removed "50+ projects", "20+ clients", "99% delivery approval" and all case-study
   metrics and countries, because nothing in the repository supports them. OrbitCart and FlowDesk are labelled
   "Working build" (built, not yet live); LeaseLens, MedSync and FinSight remain labelled as concepts. If any of the
   three are also working builds, or if any project has real users or clients, tell me. Keep any usage numbers or client
   names only with evidence and, for client work, the client's written permission. Once OrbitCart or FlowDesk go live,
   update their status.
5. **Firebase data region.** Confirm where Firestore data lives (Firebase console > Firestore > Settings) and that the
   Google Cloud data-processing terms are accepted. The privacy policy says data may be processed outside India.
6. **Image licences**, see section 7.
7. **Legal review**, especially if you sell to visitors in the EU/UK (GDPR), where an EU representative may be needed.

## 3. Third-party audit

| Service | What it does | Loaded when | Status |
| --- | --- | --- | --- |
| React 18.3.1 / ReactDOM | Renders the site | Always | Was fetched live from `esm.sh`. Now bundled in `assets/vendor/react-bundle.mjs` (MIT, see `assets/vendor/`). No third-party request on page load, `esm.sh` removed from the CSP |
| Firebase App / Firestore SDK (`gstatic.com`, v12.7.0, Google) | Saves form submissions | Only after the visitor accepts the cookie banner and sends a form | Kept, disclosed in the privacy policy |
| Firebase App Check + reCAPTCHA v3 (Google) | Blocks spam and abuse | Same as above | Kept, consent-gated. If declined, the form offers an email draft instead |
| Firebase Analytics | Not loaded (only a `measurementId` sits in the config) | Never | Keep it that way, or add a consent category first |
| Google Fonts, social widgets, ad or tracking pixels | None used | Never | Nothing to remove |
| LinkedIn | Plain outbound link | On click only | No embed or script |

Verified in a browser: loading the home page and submitting the form with spam protection declined makes **zero**
requests to any other origin.

## 4. Dark patterns reviewed

- Cookie notice: "Decline" and "Accept" are the same size and style. Nothing is pre-ticked.
- Contact form: the old behaviour of silently opening the visitor's email app when sending failed was removed;
  the form now explains what happened and offers a link.
- Consent is asked in a small notice on arrival. If declined, the contact form shows an unticked optional checkbox to allow spam protection for that form, plus an email draft; email and phone always work.
- Privacy requests can be made by email, so nobody must accept Google scripts to exercise their rights.
- Carousel auto-rotates every 5 seconds but pauses on hover, keyboard focus and for reduced-motion users. There is no Pause button (removed at the owner's request), so it only partly meets WCAG 2.2.2.
- No countdowns, scarcity messages, confirm-shaming or forced sign-ups exist on the site.

## 5. Claims changed

| Before | After |
| --- | --- |
| Hero: 50+ projects shipped, 20+ active clients, 99% delivery approval | Web / Mobile / AI + Cloud service summary |
| Case studies: "18k+ users", "10k+ reports", "4k+ hours saved", "80+ clinics", "$12M revenue tracked", plus countries | Status (Working build or Concept), platform, AI layer and focus; a visible note explaining which is which and that no usage or client results are claimed |
| Case study "Outcome" labels | "Intended outcome" |

## 6. If you ever email people

Marketing or newsletter email needs a separate opt-in (never a pre-ticked box on the contact form). Every message needs:

```
You are receiving this because you asked us to keep you updated.
Unsubscribe: {{one-click unsubscribe URL}}
Cyphrontech LLP, {{registered address}}, https://cyphrontech.com
Privacy: https://cyphrontech.com/privacy-policy.html
```

Honour unsubscribes immediately and keep a suppression list. Replies to a visitor's own enquiry do not need this.

## 7. Image and asset licence register

| Asset | Finding | Action |
| --- | --- | --- |
| `assets/hero-background.png` | Embedded C2PA metadata shows it was generated with an OpenAI image tool (`trainedAlgorithmicMedia`) | Confirm your plan's terms allow commercial use. Terms page discloses illustrative and AI-assisted imagery |
| `case-*.jpg`, `service-*.jpg`, `digital-mockup.jpg`, `hero-laptop.jpg`, `visual-language.jpg` | No source or licence recorded in the repo (metadata only mentions Adobe Photoshop tags) | Record where each came from (stock licence, your own design, or AI tool) and keep the receipts. Replace any you cannot document |
| `service-security-reviews.jpg` | Not used anywhere on the site | Delete if not needed |
| `logo-mark.*`, `cyphron-c-logo.svg`, `cyphron-attached-logo.png`, `favicon.png` | Your own brand marks | Confirm you own the design rights |
| `assets/tech-logos/*.svg` | Appear to come from the Simple Icons set (CC0). The logos are still the trademarks of their owners | Note added under the tech stack and in the terms. Do not use them to suggest partnership |
| `assets/vendor/react-bundle.mjs` | React, MIT licence | Licence file kept beside it |
| Fonts | None loaded (system fonts) | Nothing to license |

"Bots": the site has no chatbot or scraper. `robots.txt` now exists and allows normal crawling; add `Disallow` lines
if you want to opt out of specific AI crawlers.

## 8. Handling a data request (runbook)

1. New requests appear in Firebase console > Firestore > `privacyRequests` (or in the inbox if sent by email).
2. Reply to the requester's email and confirm it is them before acting.
3. Search `contactSubmissions` by the person's email. Also search the Gmail mailbox.
4. Access: send an export of what you found. Deletion: delete the matching documents and email threads, except
   records you must keep for tax or legal reasons (tell them which). Correction: edit the document.
5. Send a confirmation, set the request document's `status` to `done` in the console, and keep it for 3 years.
6. Target: within 30 days.

## 9. Deploying

Deploy rules and hosting **together**, otherwise the new form fields will be rejected until the rules catch up:

```bash
firebase deploy --only firestore:rules,hosting
```

## 10. SEO, performance and accessibility changes (second pass)

- Pages are pre-rendered at build time (`npm run build`), so crawlers and link previews see the real content.
- Every page has a canonical URL, Open Graph and Twitter tags with a 1200x630 preview image (`assets/og-image.jpg`),
  and JSON-LD (Organization and WebSite on the home page, breadcrumbs and Service on inner pages).
- The home page H1 is now "Custom software, mobile apps, and AI automation".
- Unknown URLs return a real 404 (`404.html`, `noindex`); the catch-all rewrite was removed.
- Images converted to WebP (2.9 MB down to 0.45 MB) with width and height set. Inter is self-hosted.
- "Explore service" and "View Case Study" links carry hidden text naming their target; new-tab links say so to screen readers.
- Forms show inline, screen-reader-linked errors instead of browser pop-ups.
- Accessibility statement page and print styles added. "Data Products" now has its own page.
- Not done: dark colour scheme (the light sections use shared colour variables that also style text on dark
  sections, so it needs a proper redesign and contrast re-audit), and removal of carousel auto-rotation
  (kept at the owner's request; disclosed in the accessibility statement).
- The pages, `sitemap.xml` and `404.html` are generated. Do not edit them by hand; edit `src/` and rebuild.
