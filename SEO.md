# SEO playbook for cyphrontech.com

Internal document (not deployed: `**/*.md` is excluded in `firebase.json`).
Part 1 is what the site already does. Part 2 is the backlink strategy, which cannot be
built into the code: links have to be earned elsewhere on the web.

---

## Part 1. Technical SEO: state of the site

| Area | Status | Where |
| --- | --- | --- |
| `sitemap.xml` | Generated on every build; lists all 18 indexable pages with clean https URLs | `scripts/build.mjs` |
| `robots.txt` | Generated; allows all crawlers, points to the sitemap | `scripts/build.mjs` |
| `llms.txt` | Generated; plain-language map of the site for AI assistants | `scripts/build.mjs` |
| Canonical tags | On every indexable page, absolute https, matching the sitemap | `scripts/build.mjs` |
| `noindex` | Only on `404.html`, on purpose (Hosting can serve that file directly with a 200, so the tag keeps it out of search). No indexable page carries it | test in `tests/seo.spec.js` |
| Meta titles | Unique, 60 characters or fewer | `getRoute` in `src/main.mjs` |
| Meta descriptions | Unique, 100 to 165 characters | `src/main.mjs`, `src/legal.mjs` |
| One `h1` per page, ordered headings | Enforced by tests (no skipped levels) | `tests/seo.spec.js` |
| Alt text and image sizes | Every image has `alt` (empty when decorative) plus width and height | tests |
| Schema markup | Organization, WebSite, WebPage, FAQPage (home); WebPage, BreadcrumbList, Service (inner pages) | `scripts/build.mjs` |
| Internal links | Visible breadcrumbs on every inner page; "Work in this area" / "Other services" on service pages; "Services behind it" / "More case studies" on case pages | `Breadcrumbs`, `RelatedLinks` |
| Broken links | Crawl test checks every internal link and `#anchor` on every page | tests |
| Images | WebP, about 0.45 MB in total; logo 111 KB down to 9 KB | `assets/` |
| Core Web Vitals (lab: Pixel 5, 4x CPU slowdown, slow 4G, gzip like Hosting) | Inner pages LCP about 1.7 s; home page about 2.3 s (near the 2.5 s "good" line under this deliberately harsh profile); CLS 0.000. Re-measure with `npm run perf` | `tests/perf.mjs` |
| HTTPS | HSTS (1 year, includeSubDomains), `upgrade-insecure-requests`, https-only canonicals and links | `firebase.json` |
| URL slugs | Clean and extensionless (`/web-development`); old `.html` addresses 301-redirect | `firebase.json` (`cleanUrls`) |

### What you still need to do by hand (accounts only you can create)

1. **Google Search Console**: add `https://cyphrontech.com` (domain property), verify via DNS, submit `https://cyphrontech.com/sitemap.xml`. Check the "Pages" report after a week.
2. **Bing Webmaster Tools**: import from Search Console, submit the sitemap.
3. **Connect the `www` host**: in Firebase Hosting add `www.cyphrontech.com` and set it to redirect to `cyphrontech.com`, so only one version exists.
4. **Confirm HTTPS is live**: Firebase provisions the certificate and redirects http to https automatically. Check in a private window.
5. **Consider HSTS preload** later. It is deliberately not enabled: preloading is very hard to undo. Only add `preload` (and submit at hstspreload.org) once every subdomain will stay on https forever.
6. **After each deploy** run `npm run build` first; the sitemap, canonicals and llms.txt are regenerated from the source.

---

## Part 2. Backlink strategy

### Ground rules

- **Earn links; never buy them.** No link farms, private blog networks, paid guest-post packages or comment spam. They risk a manual penalty and a service business lives on trust.
- **Only link to true statements.** OrbitCart and FlowDesk are working builds that are not live, and the other studies are concepts. Never let a directory listing or article claim client results, user numbers or revenue that the site does not.
- **Consistent details everywhere**: name "CyphronTech" (legal name Cyphrontech LLP), `https://cyphrontech.com`, the same email, phone and (once you add it) registered address.
- **Mostly branded and plain-URL anchors.** Roughly: brand name 50%, bare URL 25%, descriptive phrases 20%, exact-match keywords under 5%.
- **Steady pace beats bursts.** Aim for a few good links a month.

### What is genuinely link-worthy on this site

| Asset | Why people would link |
| --- | --- |
| The build itself: a pre-rendered React site with consent-gated reCAPTCHA, App Check and Firestore rules, plus a Playwright and axe test suite | A technical write-up ("How we made a contact form privacy-safe on Firebase") is useful to other developers |
| OrbitCart and FlowDesk, once they are live | Launch stories are the strongest news hook you will have |
| Practical guides drawn from the FAQ: scoping a project, what a proposal should contain, how pricing and refunds work | Buyers and journalists cite clear explainers |
| A short accessibility statement and open, honest legal pages | Trust signal; also useful examples for other small agencies |

The site has no blog yet. A `/insights` section (6 to 8 solid articles over 3 months) is the single biggest enabler for everything below.

### Tactics, in priority order

| # | Tactic | Effort | Notes |
| --- | --- | --- | --- |
| 1 | **Owned and free profiles**: LinkedIn (exists), GitHub organisation, Crunchbase, Google Business Profile (if you have a real address or service area) | 1 day | Use identical name and details. These rarely pass ranking value but establish the brand and are often the first results for the name |
| 2 | **Agency and software directories**: Clutch, GoodFirms, DesignRush, TechBehemoths, Sortlist | 2 to 3 days | Many require reviews; ask only real, willing clients. Never write or buy reviews |
| 3 | **Integration partner listings**: Zapier, Make, n8n and Slack app directories (all appear in your tech stack), Google Cloud and Firebase partner or expert directories | 1 to 2 weeks | Genuine relevance; only apply if you meet each programme's criteria |
| 4 | **Launch links** for OrbitCart and FlowDesk when live: Product Hunt, Show HN, Indie Hackers, BetaList | Around launch | Link to the case study page, not only the app |
| 5 | **Original articles** on `/insights`, cross-posted to dev.to, Hashnode or Medium with a canonical tag pointing to your site | Ongoing | Canonical to your own page so the value returns to you |
| 6 | **Guest posts and podcasts** on developer, founder and operations sites | 2 to 4 pitches a month | Offer something specific from real experience, not a generic keyword post |
| 7 | **Expert quotes** via Qwoted, Featured.com and similar journalist-request services | 30 minutes a week | Only answer where you have first-hand knowledge |
| 8 | **Unlinked mentions**: search for "CyphronTech" and "Cyphrontech LLP", then ask the author to add a link | Monthly | Highest-conversion outreach there is |
| 9 | **Broken-link and resource-page outreach**: find dead links on relevant guides and suggest yours | Monthly | Only when your page is truly a better replacement |
| 10 | **Competitor gap check**: with Ahrefs Webmaster Tools (free for your own site) or a similar tool, see where similar agencies are cited that you are not | Quarterly | Pick realistic targets, not the biggest sites |

### Outreach templates (edit before use)

**Unlinked mention**
> Hi {name}, thanks for mentioning CyphronTech in {article}. Could you link the name to https://cyphrontech.com so readers can find us? Happy to return the favour. Thanks, {you}

**Guest article pitch**
> Hi {name}, I run engineering at CyphronTech. I have been writing up how we built {specific topic, for example a privacy-safe contact form on Firebase with tests}. I think your readers building {audience} would find it useful. Here are three headings I would cover: 1) … 2) … 3) …. Would you like a draft? {you}

**Directory or partner request**
> Hello, we are CyphronTech (Cyphrontech LLP), a software agency working on web, mobile and AI automation. We would like to be listed in {directory}. Details: {URL, one-line description, services}. Please tell us what else you need. {you}

### 90-day plan

| Weeks | Do |
| --- | --- |
| 1 to 2 | Search Console and Bing set up; profiles from tactic 1; connect `www` redirect; pick 3 article topics |
| 3 to 6 | Publish the first 2 articles; submit to 3 directories (tactic 2); start a mentions alert for the brand name |
| 7 to 10 | Publish 2 more articles; first 4 outreach pitches (tactics 6 and 7); partner listing applications (tactic 3) |
| 11 to 13 | Review Search Console: which pages get impressions, which queries; write 1 article aimed at the best-performing gap; competitor gap check |

### How to measure

Track monthly in a simple sheet:

- Referring domains (Ahrefs Webmaster Tools or Search Console "Links" report)
- Impressions, clicks and average position for branded and non-branded queries (Search Console)
- Indexed pages vs pages in the sitemap (Search Console "Pages")
- Enquiries from the contact form, and how visitors arrived (add a "How did you hear about us?" field only if you also update the privacy policy and Firestore rules, because it is new data)

Quality check before accepting any link: is the site real and on-topic, does it have genuine readers, and would you be comfortable being seen next to it? If a low-quality site links to you unasked, ignore it. Only use Google's disavow tool if you receive a manual-action notice.

### What not to do

- Buying links or "guaranteed backlinks" packages
- Mass directory submission tools
- Automated comments, forum signatures or profile spam
- Fake or purchased reviews, or reviews about work you have not done
- Claims in any listing that the website does not support
