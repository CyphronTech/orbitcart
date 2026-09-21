import React, { useEffect, useMemo, useRef, useState, createRoot, hydrateRoot } from "../assets/vendor/react-bundle.mjs?v=react-18.3.1-h";
import "../assets/firebase-config.js?v=appcheck-v3";
import { SITE, PRIVACY_REQUEST_TYPES, pagePath } from "./site-config.mjs?v=revert-4";
import { CONSENT_OPEN_EVENT, openConsentSettings, readConsent, saveConsent, subscribeConsent } from "./consent.mjs?v=revert-4";
import { legalByFile, legalLinks } from "./legal.mjs?v=revert-4";

const h = React.createElement;
const SITE_EMAIL = SITE.email;
const SITE_PHONE = SITE.phone;
const SITE_PHONE_DISPLAY = SITE.phoneDisplay;
const LINKEDIN_URL = SITE.linkedin;
const LINKEDIN_DISPLAY = SITE.linkedinDisplay;
const FIREBASE_SDK_VERSION = "12.7.0";
const PRIVACY_COLLECTION = "privacyRequests";
const CONTACT_PROJECT_OPTIONS = [
  "Website or SaaS platform",
  "Mobile app",
  "Automation workflow",
  "AI feature or workflow",
  "UI/UX design",
];
let contactServicePromise;

const IMAGE_SIZES = {
  "assets/case-finsight.webp": [
    1100,
    825
  ],
  "assets/case-flowdesk.webp": [
    1100,
    825
  ],
  "assets/case-leaselens.webp": [
    1100,
    825
  ],
  "assets/case-medsync.webp": [
    1100,
    825
  ],
  "assets/case-orbitcart.webp": [
    1100,
    825
  ],
  "assets/digital-mockup.webp": [
    590,
    220
  ],
  "assets/hero-background.webp": [
    1672,
    941
  ],
  "assets/service-cloud-engineering.webp": [
    960,
    720
  ],
  "assets/service-data-products.webp": [
    960,
    720
  ],
  "assets/service-mobile-apps.webp": [
    960,
    720
  ],
  "assets/service-web-platforms.webp": [
    960,
    720
  ],
  "assets/service-workflow-automation.webp": [
    960,
    720
  ],
  "assets/visual-language.webp": [
    330,
    190
  ],
  "assets/logo-mark-small.png": [
    156,
    133
  ]
};

const imageProps = (src) => {
  const size = IMAGE_SIZES[src];
  return size ? { width: size[0], height: size[1] } : {};
};

const cx = (...values) => values.filter(Boolean).join(" ");

const services = [
  {
    slug: "web",
    file: "web-development.html",
    title: "Web Platforms",
    image: "assets/service-web-platforms.webp",
    alt: "Professional web platform dashboard on a desktop monitor",
    summary: "Fast, accessible websites and SaaS portals with resilient front-end architecture and clean content workflows.",
    eyebrow: "Web development",
    detailTitle: "Scalable web platforms built for real business workflows",
    detailLead: "We design and engineer websites, SaaS portals, dashboards, and AI-ready product surfaces that are fast, maintainable, and ready for growth.",
    cta: "Start a Web Project",
    heroClass: "service-detail-hero--web",
    introTitle: "Web systems that stay clear, fast, and easy to operate.",
    introText: "CyphronTech builds frontends and full web platforms with clean architecture, responsive interfaces, secure APIs, and practical AI workflows where they improve the product.",
    builds: [
      ["Marketing and company websites", "High-performing public sites with clear content systems and conversion-focused flows."],
      ["SaaS portals and dashboards", "Authenticated product surfaces, admin panels, reporting views, and customer workspaces."],
      ["AI-enabled web workflows", "Search, summarization, recommendations, document review, and guided product experiences."],
    ],
    focus: [
      ["Product UX", "Information architecture, flows, responsive layouts, and accessible UI components."],
      ["Engineering", "Frontend builds, APIs, integrations, performance work, and deployment readiness."],
      ["Operations", "Analytics, monitoring, documentation, handover, and ongoing improvements after launch."],
    ],
    outcomeTitle: "Built to launch, learn, and scale.",
    outcomeText: "We keep the build practical: strong foundations first, AI where it creates leverage, and documentation your team can actually use.",
    outcomes: [
      ["Fast", "Optimized load, responsive UI, and stable rendering."],
      ["Maintainable", "Clear components, clean data flows, and readable docs."],
      ["AI-ready", "Prepared for copilots, search, insights, and workflow automation."],
    ],
  },
  {
    slug: "mobile",
    file: "mobile-app-development.html",
    title: "Mobile Apps",
    image: "assets/service-mobile-apps.webp",
    alt: "Modern mobile app interfaces on smartphones",
    summary: "Native-feeling cross-platform applications with thoughtful user flows, API integration, and launch-ready QA.",
    eyebrow: "Mobile app development",
    detailTitle: "Mobile apps that feel focused, useful, and production-ready",
    detailLead: "We build mobile products for iOS and Android with strong UX, reliable APIs, QA discipline, and AI features that support real user tasks.",
    cta: "Start a Mobile Project",
    heroClass: "service-detail-hero--mobile",
    introTitle: "Native-feeling apps with the systems behind them.",
    introText: "From first release to growth iterations, we create mobile apps with polished flows, scalable backend integration, and app-store-ready delivery.",
    builds: [
      ["Customer mobile apps", "Product journeys, onboarding, payments, profiles, messaging, and notifications."],
      ["Internal field tools", "Inspection, reporting, approvals, data capture, and AI-assisted notes for teams on the move."],
      ["Cross-platform delivery", "React Native, Flutter, Swift, Kotlin, API integration, and release support."],
    ],
    focus: [
      ["Flow Design", "Clear app journeys, navigation patterns, and interface states for real user behavior."],
      ["App Engineering", "Cross-platform development, secure API calls, offline states, and device-aware details."],
      ["Launch Support", "Testing, store preparation, analytics, release checks, and iteration planning."],
    ],
    outcomeTitle: "Apps people keep using after they install them.",
    outcomeText: "We focus on mobile experiences people can understand quickly, use repeatedly, and trust with important workflows.",
    outcomes: [
      ["Usable", "Clear flows, states, and feedback across screen sizes."],
      ["Connected", "Reliable APIs, data sync, and backend workflows."],
      ["Intelligent", "AI capture, reminders, recommendations, and review support."],
    ],
  },
  {
    slug: "ai",
    file: "ai-automation.html",
    title: "Workflow Automation",
    image: "assets/service-workflow-automation.webp",
    alt: "Workflow automation dashboard with connected process nodes",
    summary: "AI-assisted automation for CRM, finance, support, and internal teams using APIs, bots, and monitored jobs.",
    eyebrow: "AI automation",
    detailTitle: "AI automation that solves real operational problems",
    detailLead: "We build automation, copilots, dashboards, and workflow tools that help teams move faster without adding fragile buzzword features.",
    cta: "Start an AI Project",
    heroClass: "service-detail-hero--ai",
    introTitle: "AI where it saves real work.",
    introText: "We use AI where it improves speed, quality, visibility, or consistency: support triage, report generation, knowledge retrieval, data review, and product workflow assistance.",
    builds: [
      ["Workflow automation", "AI summaries, routing, approvals, quality checks, and triggers across business systems."],
      ["Internal copilots", "Knowledge search, ticket assistance, document review, and staff-facing support tools."],
      ["AI dashboards", "Insights, anomaly alerts, report drafting, and decision support over operational data."],
    ],
    focus: [
      ["Workflow Fit", "Identify where AI removes manual steps without breaking the process people already use."],
      ["Model Integration", "Connect OpenAI, LangChain, data sources, APIs, and human review checkpoints."],
      ["Control and Review", "Design prompts, permissions, guardrails, observability, and escalation paths."],
    ],
    outcomeTitle: "Practical AI with measurable workflow impact.",
    outcomeText: "We build AI features around real business constraints: accuracy, reviewability, privacy, handoff, and operational adoption.",
    outcomes: [
      ["Faster", "Reduce repetitive review, routing, and reporting work."],
      ["Clearer", "Turn raw inputs into summaries, alerts, and next steps."],
      ["Controlled", "Keep humans in the loop where business risk requires it."],
    ],
  },
  {
    slug: "cloud",
    file: "cloud-engineering.html",
    title: "Cloud Engineering",
    image: "assets/service-cloud-engineering.webp",
    alt: "Cloud engineering operations screens and infrastructure dashboards",
    summary: "Secure infrastructure, CI/CD pipelines, observability, and cost-aware deployment on modern cloud stacks.",
    eyebrow: "Cloud engineering",
    detailTitle: "Cloud systems that are stable, observable, and ready to scale",
    detailLead: "We build infrastructure, deployments, monitoring, and cost-aware cloud foundations for web platforms, mobile backends, and AI-enabled workflows.",
    cta: "Start a Cloud Project",
    heroClass: "service-detail-hero--cloud",
    introTitle: "Infrastructure that supports product delivery.",
    introText: "We help teams move from fragile hosting and manual releases to repeatable cloud environments, clean deployments, and visibility into performance and reliability.",
    builds: [
      ["Cloud architecture", "AWS, Azure, containers, Kubernetes, databases, storage, APIs, and secure environment design."],
      ["CI/CD and releases", "Automated builds, deployment pipelines, environment strategy, rollback planning, and release checks."],
      ["Monitoring and support", "Observability, alerts, logging, cost review, performance tuning, and documentation."],
    ],
    focus: [
      ["Foundation", "Choose the right architecture for your stage, traffic, budget, and operational needs."],
      ["Automation", "Set up deployment workflows that reduce manual work and release risk."],
      ["Visibility", "Instrument systems with metrics, alerts, logs, and practical operational dashboards."],
    ],
    outcomeTitle: "Cloud your team can understand and run.",
    outcomeText: "We document how the system works, what to monitor, and how your team can maintain it after launch.",
    outcomes: [
      ["Reliable", "Repeatable infrastructure and fewer manual release steps."],
      ["Observable", "Clear metrics, alerts, logs, and support visibility."],
      ["Cost-aware", "Right-sized architecture and practical scaling plans."],
    ],
  },
  {
    slug: "ux",
    file: "ui-ux-design.html",
    title: "UI/UX Design",
    image: "assets/digital-mockup.webp",
    alt: "Responsive product interface mockups for UI and UX design",
    summary: "User flows, wireframes, design systems, and polished product interfaces built for clear, intuitive experiences.",
    eyebrow: "UI/UX design",
    detailTitle: "Product design that makes complex workflows feel clear",
    detailLead: "We design interfaces, flows, and systems for web and mobile products, including AI-enabled features that need careful trust and usability decisions.",
    cta: "Start a Design Project",
    heroClass: "service-detail-hero--ux",
    introTitle: "Interfaces people can understand, trust, and use repeatedly.",
    introText: "CyphronTech connects product thinking with production design: user flows, wireframes, visual systems, interactive states, and developer-ready UI specs.",
    builds: [
      ["Product UX", "User journeys, information architecture, wireframes, prototypes, and workflow simplification."],
      ["Interface design", "Responsive screens, component systems, visual direction, and polished product UI."],
      ["AI UX patterns", "Review states, confidence cues, human handoff, prompt flows, and explainable AI interactions."],
    ],
    focus: [
      ["Discover", "Clarify users, business goals, constraints, and the workflows the product must support."],
      ["Design", "Create flows, screen systems, responsive layouts, and production-ready interface details."],
      ["Handoff", "Prepare design systems, component specs, states, content guidance, and implementation support."],
    ],
    outcomeTitle: "Design that reduces friction before engineering starts.",
    outcomeText: "We use design to lower product risk: clearer user decisions, fewer ambiguous screens, and smoother engineering delivery.",
    outcomes: [
      ["Clear", "Flows and screens that help users know what to do next."],
      ["Consistent", "Reusable components, states, and design patterns."],
      ["Buildable", "Design decisions that translate cleanly into production UI."],
    ],
  },
  {
    slug: "data",
    file: "data-products.html",
    title: "Data Products",
    image: "assets/service-data-products.webp",
    alt: "Business intelligence dashboard on desktop and tablet screens",
    summary: "Dashboards, reporting pipelines, and decision tools that turn fragmented business data into usable insight.",
    eyebrow: "Data products",
    detailTitle: "Data products that turn scattered numbers into decisions",
    detailLead: "We build dashboards, reporting pipelines, and decision tools that bring fragmented business data together and make it usable for the people who run the business.",
    cta: "Start a Data Project",
    heroClass: "service-detail-hero--data",
    introTitle: "Clear reporting your team can trust and act on.",
    introText: "CyphronTech connects data sources, models the metrics that matter, and builds the dashboards and alerts that let leaders and operators see what is happening without chasing spreadsheets.",
    builds: [
      ["Dashboards and reporting", "Leadership and operations views with clear metric definitions, drilldowns, and shareable summaries."],
      ["Data pipelines", "Ingestion from CRM, billing, product, and support systems into a clean, documented data layer."],
      ["AI-assisted insight", "Plain-language summaries, anomaly alerts, and report drafting that stay reviewable by people."],
    ],
    focus: [
      ["Metrics", "Agree what each number means, who owns it, and where it comes from before anything is built."],
      ["Pipelines", "Reliable ingestion, transformation, and access control using tools such as Python, PostgreSQL, and BigQuery."],
      ["Visualization", "Dashboards in Power BI or custom web views, designed for quick reading and confident decisions."],
    ],
    outcomeTitle: "Numbers everyone agrees on.",
    outcomeText: "We document definitions, sources, and refresh schedules so your team can keep trusting the data after handover.",
    outcomes: [
      ["Consistent", "One set of metric definitions across teams."],
      ["Timely", "Refresh schedules and alerts matched to how you make decisions."],
      ["Governed", "Permissions and audit-friendly access to the data."],
    ],
  },
];

const caseStudies = [
  {
    slug: "orbitcart",
    file: "case-orbitcart.html",
    title: "OrbitCart: AI Commerce Operations",
    image: "assets/case-orbitcart.webp",
    alt: "OrbitCart commerce operations mobile app mockup",
    teaser: "OrbitCart is a wholesale commerce platform built around real-time inventory, supplier messaging, and AI reorder recommendations. The dashboard gives sales and warehouse teams a shared view of stock, order health, and fulfillment priorities.",
    isBuild: true,
    metrics: [["Status", "Working build"], ["Platform", "iOS"], ["AI layer", "Reorders"]],
    detailLead: "A wholesale commerce operations product that brings inventory, supplier conversations, fulfillment priorities, and AI reorder recommendations into one mobile-first workflow.",
    stats: [["Status", "Working build"], ["Platform", "iOS"], ["AI Layer", "Reorders"], ["Focus", "Commerce"]],
    overviewTitle: "Shared commerce visibility for sales and warehouse teams.",
    overviewText: [
      "OrbitCart was shaped around the daily tension between stock availability, supplier updates, and fulfillment decisions. The product gives teams a single operating surface for order health, inventory movement, and next-best reorder actions.",
      "The AI layer surfaces reorder timing, supplier risk, and fulfillment priorities for managers to review.",
    ],
    focus: [
      ["Challenge", "Disconnected stock decisions", "Sales, warehouse, and supplier teams needed clearer visibility into order risk, stock movement, and communication history."],
      ["Solution", "AI commerce command layer", "The experience combines inventory views, supplier messaging, reorder signals, and fulfillment queues in a focused mobile workflow."],
      ["Intended outcome", "Faster operational response", "Teams can review priority orders, understand reorder triggers, and coordinate supplier follow-up without jumping between systems."],
    ],
    scopeTitle: "A mobile-first commerce workspace for teams that manage stock every day.",
    scope: [
      ["01", "Order health", "Priority queues show delayed orders, fulfillment risk, and the next action needed by sales or warehouse teams."],
      ["02", "Inventory visibility", "Stock movement, reserved quantities, and reorder thresholds are shaped into screens that are quick to scan on mobile."],
      ["03", "Supplier context", "Messaging, purchase updates, and expected delivery dates sit beside the products they affect."],
      ["04", "Admin controls", "Managers can adjust reorder rules, review exceptions, and keep product data consistent across the operation."],
    ],
    aiTitle: "AI that supports reorder decisions.",
    aiText: "The AI layer is designed to explain why a product needs attention. It combines sales velocity, available stock, supplier lead time, and fulfillment pressure into practical recommendations that a manager can approve.",
    aiItems: [
      ["Demand signals", "Highlights products moving faster than the current replenishment plan."],
      ["Supplier risk", "Flags vendors with delayed updates or longer-than-usual lead times."],
      ["Fulfillment priority", "Ranks the orders most likely to affect customer commitments."],
      ["Human approval", "Reorder decisions stay reviewable and are never changed silently."],
    ],
    implementationTitle: "A product system designed to last.",
    implementationText: "The product direction covers API design, mobile state management, inventory data modeling, audit-friendly admin actions, and a clean handoff path for future integrations with ERP or accounting tools.",
    stack: ["React Native", "Node.js", "PostgreSQL", "OpenAI", "AWS", "Stripe"],
    ctaTitle: "Need an AI-ready commerce workflow?",
    ctaText: "We can map the operations, data, and product experience needed to make commerce teams move faster.",
  },
  {
    slug: "leaselens",
    file: "case-leaselens.html",
    title: "LeaseLens: AI Property Scanner",
    image: "assets/case-leaselens.webp",
    alt: "LeaseLens property inspection mobile app mockup",
    teaser: "LeaseLens is a property inspection app concept for landlords, tenants, and field teams. It uses guided capture, AI condition notes, and report workflows to make move-in and move-out documentation faster, more consistent, and easier to verify.",
    metrics: [["Format", "Concept"], ["Platform", "Android"], ["AI layer", "Notes"]],
    detailLead: "A property inspection app concept for guided capture, AI condition notes, and cleaner move-in and move-out reporting for landlords, tenants, and field teams.",
    stats: [["Format", "Concept"], ["Platform", "Android"], ["AI Layer", "Notes"], ["Focus", "Inspections"]],
    overviewTitle: "Consistent inspection records without slowing field teams down.",
    overviewText: [
      "LeaseLens was designed to reduce the friction of property documentation by turning inspections into a guided mobile workflow. The experience supports room-by-room capture, issue tagging, photo review, and report generation.",
      "AI condition notes help teams summarize visible issues and keep report language consistent while still leaving review control with the user.",
    ],
    focus: [
      ["Challenge", "Inconsistent inspection evidence", "Field teams needed a repeatable way to collect photos, notes, timestamps, and condition details across many property types."],
      ["Solution", "Guided AI capture workflow", "The app concept combines structured inspection paths, AI condition summaries, report workflows, and review checkpoints."],
      ["Intended outcome", "Cleaner handoff documentation", "Property teams get reports that are easier to verify, share, and compare across move-in and move-out events."],
    ],
    scopeTitle: "Field inspection workflows designed for speed, evidence, and review.",
    scope: [
      ["01", "Guided capture", "Room-by-room checklists help inspectors collect the right photos, condition notes, and timestamps without guesswork."],
      ["02", "Media evidence", "Photo groups, tags, and issue markers keep inspection evidence organized around the exact property area."],
      ["03", "Report review", "Draft reports can be checked, edited, and approved before they are shared with landlords, tenants, or managers."],
      ["04", "Property history", "Move-in and move-out records are structured so teams can compare changes and resolve disputes faster."],
    ],
    aiTitle: "AI that improves documentation without removing review.",
    aiText: "The AI layer supports field teams by drafting condition language, grouping related issues, and flagging missing evidence. Inspectors still approve the final report, keeping accountability clear.",
    aiItems: [
      ["Condition notes", "Turns rough field notes into clearer report-ready language."],
      ["Missing evidence checks", "Highlights inspection areas that need photos, signatures, or required answers."],
      ["Issue grouping", "Connects related damage notes across rooms, fixtures, and media."],
      ["Final review state", "Keeps AI-generated wording editable before reports are sent."],
    ],
    implementationTitle: "Built for offline-friendly capture and clear handoff reporting.",
    implementationText: "The product direction covers mobile capture states, media upload queues, report templates, reviewer permissions, and data structures that support repeat inspections across a property portfolio.",
    stack: ["Kotlin", "Flutter", "Node.js", "PostgreSQL", "OpenAI", "Cloud Storage"],
    ctaTitle: "Need AI-assisted field documentation?",
    ctaText: "We can design capture flows, review states, and reporting tools for mobile teams.",
  },
  {
    slug: "flowdesk",
    file: "case-flowdesk.html",
    title: "FlowDesk: AI Automation Command Center",
    image: "assets/case-flowdesk.webp",
    alt: "FlowDesk automation command center dashboard mockup",
    teaser: "FlowDesk centralizes client intake, approvals, support routing, and status reporting for service teams. The build connects CRM data, Slack alerts, AI triage, billing events, and executive dashboards into a single operations layer.",
    isBuild: true,
    metrics: [["Status", "Working build"], ["Platform", "Web"], ["AI layer", "Triage"]],
    detailLead: "A service operations platform that connects intake, approvals, support routing, billing events, AI triage, and executive reporting into one web command center.",
    stats: [["Status", "Working build"], ["Platform", "Web"], ["AI Layer", "Triage"], ["Focus", "Operations"]],
    overviewTitle: "A single operations layer for service teams.",
    overviewText: [
      "FlowDesk was shaped around the reality that service businesses often run across CRM records, support tickets, approvals, billing tools, and chat alerts. The product centralizes the operational queue and shows leadership where work is blocked.",
      "The AI layer supports intake triage, summary drafting, priority signals, and routing suggestions while teams remain in control of approvals.",
    ],
    focus: [
      ["Challenge", "Fragmented work queues", "Teams needed to see intake, support, billing, and status reporting in one place."],
      ["Solution", "AI-assisted operations hub", "The product brings routing, alerts, approvals, CRM context, dashboards, and AI triage into a single control surface."],
      ["Intended outcome", "Less manual coordination", "Managers can spot bottlenecks faster, teams can act from one queue, and leadership gets clearer operational visibility."],
    ],
    scopeTitle: "An operations command center for intake, routing, and visibility.",
    scope: [
      ["01", "Client intake", "Requests enter through structured forms and integrations, then become trackable work items with ownership and SLA context."],
      ["02", "Approvals", "Managers can approve scope, billing changes, escalations, and handoffs without losing the audit trail."],
      ["03", "Team alerts", "Slack and email notifications keep teams informed about blockers, overdue work, and handoff changes."],
      ["04", "Executive reporting", "Leadership dashboards summarize throughput, bottlenecks, revenue events, and service quality signals."],
    ],
    aiTitle: "AI that helps service teams route work faster.",
    aiText: "The AI layer reads intake context, support notes, and client history to recommend routing, draft summaries, and flag work at risk. It gives operators a first pass and keeps the decision trail visible.",
    aiItems: [
      ["Intake triage", "Classifies incoming requests by urgency, department, client, and workflow type."],
      ["Summary drafting", "Turns long conversations into short handoff notes for internal teams."],
      ["SLA risk alerts", "Flags work likely to miss response or resolution targets."],
      ["Next-step prompts", "Suggests the action most likely to unblock a stalled request."],
    ],
    implementationTitle: "Built around integrations, auditability, and reliable dashboards.",
    implementationText: "The product direction covers CRM and billing connections, role-based queues, webhook-driven automation, notification rules, and reporting models that give operators and leaders the same source of truth.",
    stack: ["Next.js", "NestJS", "PostgreSQL", "OpenAI", "Slack", "Stripe"],
    ctaTitle: "Need to automate service operations?",
    ctaText: "We can connect your systems, automate routing, and build dashboards around the workflows your team actually uses.",
  },
  {
    slug: "medsync",
    file: "case-medsync.html",
    title: "MedSync: AI Patient Engagement Portal",
    image: "assets/case-medsync.webp",
    alt: "MedSync patient engagement portal mockup across desktop and mobile",
    teaser: "MedSync is a clinic portal concept for appointments, digital intake, AI-assisted follow-up reminders, and care team messaging. It gives administrators a clear queue while giving patients a calm mobile-first experience.",
    metrics: [["Format", "Concept"], ["Platform", "Web + iOS"], ["AI layer", "Reminders"]],
    detailLead: "A clinic portal concept for appointments, digital intake, AI-assisted reminders, follow-up workflows, and care team messaging across web and mobile touchpoints.",
    stats: [["Format", "Concept"], ["Platform", "Web + iOS"], ["AI Layer", "Reminders"], ["Focus", "Healthcare admin"]],
    overviewTitle: "A calmer engagement workflow for clinics and patients.",
    overviewText: [
      "MedSync was designed to simplify the administrative load around appointments, intake, reminders, and care team communication. The concept gives clinic staff a clear operational queue while giving patients a mobile-first experience.",
      "AI-assisted follow-up reminders and content drafting help reduce missed steps without removing clinical review and administrative control.",
    ],
    focus: [
      ["Challenge", "High-friction patient coordination", "Clinics needed a clearer way to manage intake, appointments, reminders, and patient messaging without overwhelming staff."],
      ["Solution", "Unified portal and queue", "The concept combines patient-facing flows with admin queues, care messaging, digital forms, and AI-assisted follow-up prompts."],
      ["Intended outcome", "Better continuity of care", "Patients get a calmer experience while clinic teams get stronger visibility into pending tasks and follow-up needs."],
    ],
    scopeTitle: "A patient engagement system that keeps clinical teams in control.",
    scope: [
      ["01", "Digital intake", "Patients complete forms, insurance details, and pre-visit information before clinic staff review the queue."],
      ["02", "Appointment flow", "Scheduling, reminders, and visit status are designed for both patient convenience and admin visibility."],
      ["03", "Care messaging", "Secure message threads organize patient questions, staff responses, and follow-up tasks around each visit."],
      ["04", "Clinic dashboard", "Administrators see outstanding forms, missed reminders, pending responses, and daily appointment readiness."],
    ],
    aiTitle: "AI that supports care coordination without replacing staff judgment.",
    aiText: "The AI layer helps draft patient-friendly reminders, summarize intake information, and flag follow-up needs. Staff review and approve communication before it reaches patients.",
    aiItems: [
      ["Reminder drafting", "Creates clear appointment and follow-up messages for staff review."],
      ["Intake summaries", "Condenses form responses into a readable admin view."],
      ["Queue risk signals", "Highlights patients missing forms, confirmations, or key visit details."],
      ["Follow-up prompts", "Suggests next communication steps based on visit status and patient history."],
    ],
    implementationTitle: "Designed for privacy-aware workflows and reliable patient communication.",
    implementationText: "The product direction covers secure authentication, role-based staff views, form data modeling, notification workflows, mobile-friendly patient screens, and careful review states for AI-assisted content.",
    stack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "OpenAI", "Azure"],
    ctaTitle: "Need a healthcare workflow built with care?",
    ctaText: "We can design calm patient experiences and operational dashboards for appointment-heavy service teams.",
  },
  {
    slug: "finsight",
    file: "case-finsight.html",
    title: "FinSight: AI Cloud Analytics Dashboard",
    image: "assets/case-finsight.webp",
    alt: "FinSight cloud analytics dashboard mockup",
    teaser: "FinSight brings revenue, churn, pipeline, and support signals into one board for finance and leadership teams. The platform includes secure data ingestion, AI-assisted reports, and anomaly alerts for faster decisions.",
    metrics: [["Format", "Concept"], ["Platform", "Web"], ["AI layer", "Alerts"]],
    detailLead: "A finance and leadership dashboard concept that brings revenue, churn, pipeline, support signals, secure data ingestion, and AI-assisted reporting into one board.",
    stats: [["Format", "Concept"], ["Platform", "Web"], ["AI Layer", "Alerts"], ["Focus", "Analytics"]],
    overviewTitle: "Leadership analytics with signals teams can act on.",
    overviewText: [
      "FinSight was shaped for finance and leadership teams that need a single view across revenue, churn, sales pipeline, and support signals. The dashboard concept turns scattered metrics into a clearer decision workflow.",
      "AI-assisted reports and anomaly alerts help leaders spot changes sooner, explain what is happening, and decide what to inspect next.",
    ],
    focus: [
      ["Challenge", "Signals spread across teams", "Finance and leadership teams needed a clearer way to interpret revenue, churn, pipeline, and support health together."],
      ["Solution", "Secure analytics board", "The concept combines data ingestion, metric modeling, AI report drafting, anomaly alerts, and executive dashboard views."],
      ["Intended outcome", "Faster decision cycles", "Leaders can review priority signals, understand trend movement, and move from dashboard review to action planning faster."],
    ],
    scopeTitle: "A decision dashboard that turns scattered metrics into a leadership workflow.",
    scope: [
      ["01", "Data ingestion", "Revenue, CRM, support, and product signals are modeled into a clean dashboard-ready data layer."],
      ["02", "Metric modeling", "Churn, pipeline, margin, support pressure, and forecast metrics are shaped around how leaders review performance."],
      ["03", "Executive views", "Dashboards prioritize concise comparisons, trend movement, drilldowns, and board-ready summaries."],
      ["04", "Alert rules", "Teams can define thresholds, anomaly triggers, and ownership for follow-up when metrics shift."],
    ],
    aiTitle: "AI that explains business signals in plain language.",
    aiText: "The AI layer helps leaders understand what changed, why it may matter, and which data points deserve attention. It supports decision review alongside the dashboard.",
    aiItems: [
      ["Anomaly explanations", "Surfaces likely drivers behind unusual revenue, churn, or support patterns."],
      ["Report drafting", "Creates concise weekly summaries that finance teams can edit and send."],
      ["Trend context", "Connects movement across pipeline, customer health, and support volume."],
      ["Action prompts", "Suggests follow-up questions for teams to investigate before decisions are made."],
    ],
    implementationTitle: "Built for governed data, fast reporting, and trusted AI output.",
    implementationText: "The product direction covers data pipelines, metric definitions, permissions, dashboard UX, anomaly logic, and AI summaries that cite the source metric context before users act on a recommendation.",
    stack: ["Next.js", "Python", "BigQuery", "Power BI", "OpenAI", "AWS"],
    ctaTitle: "Need AI-powered analytics that teams trust?",
    ctaText: "We can build secure dashboards, reporting pipelines, and practical AI insights around your business data.",
  },
];

// Which case studies used which services. Drives the "related" links on service and case pages.
const caseServices = {
  orbitcart: ["mobile", "ai", "cloud"],
  leaselens: ["mobile", "ai"],
  flowdesk: ["web", "ai"],
  medsync: ["web", "mobile", "ux"],
  finsight: ["data", "cloud", "ai"],
};

const casesForService = (slug) => caseStudies.filter((study) => caseServices[study.slug]?.includes(slug));
const servicesForCase = (slug) => services.filter((service) => caseServices[slug]?.includes(service.slug));

const clip = (text, max = 155) => {
  if (text.length <= max) {
    return text;
  }

  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}\u2026`;
};

const techGroups = [
  ["Frontend", [["tech-react.svg", "React"], ["tech-nextjs.svg", "Next.js"], ["tech-typescript.svg", "TypeScript"], ["tech-tailwindcss.svg", "Tailwind CSS"]]],
  ["Backend", [["tech-nodejs.svg", "Node.js"], ["tech-nestjs.svg", "NestJS"], ["tech-python.svg", "Python"], ["tech-postgresql.svg", "PostgreSQL"]]],
  ["Mobile", [["tech-react-native.svg", "React Native"], ["tech-flutter.svg", "Flutter"], ["tech-swift.svg", "Swift"], ["tech-kotlin.svg", "Kotlin"]]],
  ["Cloud", [["tech-aws.svg", "AWS"], ["tech-azure.svg", "Azure"], ["tech-docker.svg", "Docker"], ["tech-kubernetes.svg", "Kubernetes"]]],
  ["Automation", [["tech-zapier.svg", "Zapier"], ["tech-make.svg", "Make"], ["tech-n8n.svg", "n8n"], ["tech-slack.svg", "Slack API"]]],
  ["Data & AI", [["tech-openai.svg", "OpenAI"], ["tech-langchain.svg", "LangChain"], ["tech-bigquery.svg", "BigQuery"], ["tech-powerbi.svg", "Power BI"]]],
];

const homeMeta = {
  title: "CyphronTech | Custom Software, Mobile Apps and AI Automation",
  description: "CyphronTech builds scalable websites, mobile apps, AI automation systems, and cloud platforms for growing companies.",
};

const servicePageTitles = {
  web: "Web Platform Development | CyphronTech",
  mobile: "Mobile App Development | CyphronTech",
  ai: "AI Automation Services | CyphronTech",
  cloud: "Cloud Engineering | CyphronTech",
  ux: "UI/UX Design | CyphronTech",
  data: "Data Products and Analytics | CyphronTech",
};

const serviceByFile = new Map(services.map((service) => [service.file, service]));
const caseByFile = new Map(caseStudies.map((study) => [study.file, study]));

// The build script (scripts/build.mjs) sets globalThis.__SSR_FILE__ to pre-render each page.
function currentFile() {
  if (typeof window === "undefined") {
    return globalThis.__SSR_FILE__ || "index.html";
  }

  const last = window.location.pathname.split("/").filter(Boolean).pop();
  return !last ? "index.html" : last.endsWith(".html") ? last : `${last}.html`;
}

function getRoute() {
  const file = currentFile();

  if (file === "index.html") {
    return { type: "home", meta: homeMeta };
  }

  if (serviceByFile.has(file)) {
    const service = serviceByFile.get(file);
    return {
      type: "service",
      service,
      meta: {
        title: servicePageTitles[service.slug],
        description: clip(service.detailLead),
      },
    };
  }

  if (legalByFile.has(file)) {
    const page = legalByFile.get(file);
    return {
      type: "legal",
      page,
      meta: { title: `${page.title} | CyphronTech`, description: page.description },
    };
  }

  if (file === "privacy-request.html") {
    return {
      type: "privacy-request",
      meta: {
        title: "Privacy and Data Requests | CyphronTech",
        description: "Ask CyphronTech for a copy of your data, to correct or delete it, or to withdraw your consent. We reply within 30 days and charge no fee for reasonable requests.",
      },
    };
  }

  if (caseByFile.has(file)) {
    const study = caseByFile.get(file);
    return {
      type: "case",
      study,
      meta: {
        title: `${study.title} | CyphronTech`,
        description: clip(study.detailLead),
      },
    };
  }

  return {
    type: "not-found",
    meta: {
      title: "Page Not Found | CyphronTech",
      description: "CyphronTech page not found.",
    },
  };
}

function usePageSetup(route) {
  useEffect(() => {
    document.title = route.meta.title;
    let description = document.querySelector('meta[name="description"]');

    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }

    description.setAttribute("content", route.meta.description);
  }, [route]);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);

    if (!targetId) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView();
    }, 0);
  }, [route.type]);
}

function Brand({ footer = false }) {
  return h(
    "a",
    {
      className: cx("brand", footer && "brand--footer"),
      href: "/#top",
      "aria-label": "CyphronTech home",
    },
    h("img", { src: "assets/logo-mark-small.png", alt: "", width: 39, height: 33, className: "brand__mark" }),
    h("span", { className: "brand__name", translate: "no" }, "Cyphron", h("span", null, "Tech")),
  );
}

function Header({ route }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const toggleRef = useRef(null);
  const onHome = route.type === "home";
  const linkPrefix = onHome ? "" : "/";
  const links = [
    ["Services", "#services"],
    ["Solutions", "#solutions"],
    ["AI Approach", "#ai-approach"],
    ["Case Studies", "#work"],
    ["Tech Stack", "#tech-stack"],
    ["Process", "#process"],
    ["FAQ", "#faq"],
    ["Contact", "#contact"],
  ];

  useEffect(() => {
    if (!onHome || !("IntersectionObserver" in window)) {
      return undefined;
    }

    // Mark the nav link for the section crossing the middle of the screen.
    const targets = ["top", ...links.map(([, href]) => href.slice(1))].map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id === "top" ? "" : entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return h(
    "header",
    { className: "site-header", "data-header": true },
    h(
      "nav",
      { className: "nav", "aria-label": "Primary navigation" },
      h(Brand, null),
      h(
        "button",
        {
          className: "nav-toggle",
          ref: toggleRef,
          type: "button",
          "aria-expanded": String(isOpen),
          "aria-controls": "primary-menu",
          "data-menu-toggle": true,
          onClick: () => setIsOpen((value) => !value),
        },
        h("span", { className: "nav-toggle__icon", "aria-hidden": "true" }),
        h("span", { className: "sr-only" }, isOpen ? "Close navigation" : "Open navigation"),
      ),
      h(
        "div",
        { className: cx("nav-menu", isOpen && "is-open"), id: "primary-menu", "data-menu": true },
        links.map(([label, href]) => h("a", { key: href, href: `${linkPrefix}${href}`, "aria-current": onHome && activeId === href.slice(1) ? "location" : undefined, onClick: () => setIsOpen(false) }, label)),
      ),
    ),
  );
}

const LINKEDIN_ICON_PATH = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const MAIL_ICON_PATH = "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z";
const PHONE_ICON_PATH = "M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z";

function ContactIcon({ path }) {
  return h("svg", { viewBox: "0 0 24 24", width: 20, height: 20, fill: "currentColor", "aria-hidden": "true", focusable: "false" }, h("path", { d: path }));
}

function ContactLinks() {
  return [
    h("a", { key: "email", className: "contact-link", href: `mailto:${SITE_EMAIL}` }, h(ContactIcon, { path: MAIL_ICON_PATH }), SITE_EMAIL),
    h("a", { key: "phone", className: "contact-link", href: `tel:${SITE_PHONE}` }, h(ContactIcon, { path: PHONE_ICON_PATH }), SITE_PHONE_DISPLAY),
    h(
      "a",
      { key: "linkedin", className: "contact-link", href: LINKEDIN_URL, target: "_blank", rel: "noopener noreferrer", title: "CyphronTech on LinkedIn" },
      h(ContactIcon, { path: LINKEDIN_ICON_PATH }),
      LINKEDIN_DISPLAY,
      h(NewTabNote, null),
    ),
  ];
}

function HomePage() {
  return h(
    React.Fragment,
    null,
    h(HeroSection, null),
    h(ServiceStrip, null),
    h(ServicesSection, null),
    h(SolutionsSection, null),
    h(AiApproachSection, null),
    h(CaseStudiesSection, null),
    h(TechStackSection, null),
    h(ProcessSection, null),
    h(FaqSection, null),
    h(ContactSection, null),
  );
}

function HeroSection() {
  return h(
    "section",
    { className: "hero", id: "top", "aria-labelledby": "hero-title" },
    h(
      "div",
      { className: "hero__content" },
      h("p", { className: "eyebrow" }, "CyphronTech · Software development agency"),
      h("h1", { id: "hero-title" }, "Custom software, mobile apps, and AI automation"),
      h("p", { className: "hero__lead" }, "We design and engineer secure web platforms, mobile apps, AI automation workflows, and cloud systems that help modern teams move faster."),
      h(
        "div",
        { className: "hero__actions", "aria-label": "Primary actions" },
        h("a", { className: "button button--primary", href: "#contact" }, h("span", { className: "button__icon button__icon--arrow", "aria-hidden": "true" }), "Start a Project"),
        h("a", { className: "button button--ghost", href: "#work" }, "Case Studies"),
      ),
      h(
        "dl",
        { className: "hero__stats", "aria-label": "Core services" },
        [["Web", "Platforms and portals"], ["Mobile", "iOS and Android apps"], ["AI + Cloud", "Automation and infrastructure"]].map(([value, label]) =>
          h("div", { key: label }, h("dt", null, value), h("dd", null, label)),
        ),
      ),
    ),
    h("div", { className: "hero__media", "aria-hidden": "true" }),
  );
}

function ServiceStrip() {
  return h(
    "section",
    { className: "service-strip", "aria-label": "Core capabilities" },
    h(
      "div",
      { className: "service-strip__inner" },
      ["Web Development", "App Development", "Automation", "Cloud Solutions", "UI/UX Design", "Data Analytics"].map((label) => h("span", { key: label }, label)),
    ),
  );
}

function ServicesSection() {
  return h(
    "section",
    { className: "section section--light", id: "services", "aria-labelledby": "services-title" },
    h(
      "div",
      { className: "section__head" },
      h("p", { className: "eyebrow" }, "Services"),
      h("h2", { id: "services-title" }, "Digital systems built for scale"),
      h("p", null, "From the first product brief to production support, our team covers the technical layers that keep software dependable."),
    ),
    h(
      "div",
      { className: "services-grid" },
      services.map((service) =>
        h(
          "article",
          { className: "service-card", key: service.title },
          h("img", { className: "service-card__image", src: service.image, alt: service.alt, loading: "lazy", decoding: "async", ...imageProps(service.image) }),
          h("h3", null, service.title),
          h("p", null, service.summary),
          service.file ? h("a", { className: "service-card__link", href: pagePath(service.file) }, "Explore service", h("span", { className: "sr-only" }, `: ${service.title}`)) : null,
        ),
      ),
    ),
  );
}

function SolutionsSection() {
  return h(
    "section",
    { className: "section section--dark", id: "solutions", "aria-labelledby": "solutions-title" },
    h(
      "div",
      { className: "split" },
      h(
        "div",
        null,
        h("p", { className: "eyebrow" }, "Solutions"),
        h("h2", { id: "solutions-title" }, "Product engineering with a practical operating model"),
        h("p", null, "We work best with founders and teams that need a focused technical partner: clear scope, weekly shipping rhythm, visible risk tracking, and maintainable architecture."),
        h(
          "ul",
          { className: "check-list" },
          ["Discovery workshops and technical roadmaps", "Design systems and production-grade UI builds", "API, database, and integration development", "Release management and post-launch support"].map((item) => h("li", { key: item }, item)),
        ),
      ),
      h(
        "div",
        { className: "solution-panel", "aria-label": "Delivery model" },
        [
          ["01", "Define the outcome", "Clarify the business goal, users, constraints, and success metrics before implementation starts."],
          ["02", "Build the system", "Ship in tested increments with transparent demos, issue tracking, and engineering reviews."],
          ["03", "Support the launch", "Monitor adoption, improve performance, and document the system for long-term ownership."],
        ].map(([number, title, text]) =>
          h("div", { className: "panel-row", key: number }, h("span", null, number), h("strong", null, title), h("p", null, text)),
        ),
      ),
    ),
  );
}

function AiApproachSection() {
  const aiCards = [
    ["01", "Automation", "AI-assisted routing, summaries, checks, and workflow triggers that reduce repetitive work across operations."],
    ["02", "Dashboards", "Decision dashboards with anomaly alerts, plain-language insights, and smarter reporting for leadership teams."],
    ["03", "Support Tools", "Internal copilots, ticket triage, knowledge retrieval, and response drafting that keep support teams moving."],
    ["04", "Product Workflows", "AI features embedded into customer journeys, from recommendations and guided capture to review and approval flows."],
  ];

  return h(
    "section",
    { className: "ai-approach", id: "ai-approach", "aria-labelledby": "ai-approach-title" },
    h(
      "div",
      { className: "ai-approach__grid" },
      h(
        "div",
        { className: "ai-approach__copy" },
        h("p", { className: "eyebrow" }, "AI-first approach"),
        h("h2", { id: "ai-approach-title" }, "Where we use AI"),
        h("p", { className: "ai-approach__statement" }, "We add AI to a workflow only when it clearly helps."),
        h("p", null, "CyphronTech uses AI where it improves a real workflow: reducing manual review, making operational data easier to read, helping teams respond faster, and turning product interactions into smarter experiences."),
      ),
      h(
        "div",
        { className: "ai-approach__panel", "aria-label": "AI use cases" },
        aiCards.map(([number, title, text]) => h("article", { key: title }, h("span", null, number), h("h3", null, title), h("p", null, text))),
      ),
    ),
  );
}

function CaseStudiesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduceMotion || isPaused || caseStudies.length < 2) {
      return undefined;
    }

    const id = window.setInterval(() => {
      setCurrentSlide((value) => (value + 1) % caseStudies.length);
    }, 5200);

    return () => window.clearInterval(id);
  }, [isPaused, reduceMotion]);

  const goToSlide = (nextIndex) => {
    setCurrentSlide((nextIndex + caseStudies.length) % caseStudies.length);
  };

  return h(
    "section",
    { className: "case-studies", id: "work", "aria-labelledby": "work-title", onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false), onFocus: () => setIsPaused(true), onBlur: () => setIsPaused(false) },
    h(
      "div",
      { className: "case-studies__top" },
      h("div", { className: "case-studies__head" }, h("p", { className: "eyebrow" }, "Case studies"), h("h2", { id: "work-title" }, "Selected builds and concepts")),
      h(
        "div",
        { className: "carousel-controls", role: "group", "aria-label": "Case study carousel controls" },
        h("button", { type: "button", className: "carousel-button", "aria-label": "Previous case study", "data-carousel-prev": true, onClick: () => goToSlide(currentSlide - 1) }, h("span", { className: "carousel-button__icon carousel-button__icon--prev", "aria-hidden": "true" })),
        h("button", { type: "button", className: "carousel-button", "aria-label": "Next case study", "data-carousel-next": true, onClick: () => goToSlide(currentSlide + 1) }, h("span", { className: "carousel-button__icon carousel-button__icon--next", "aria-hidden": "true" })),
      ),
    ),
    h(
      "div",
      { className: "case-carousel", "data-carousel": true },
      h(
        "div",
        { className: cx("case-track", `case-track--${currentSlide}`), "data-carousel-track": true },
        caseStudies.map((study, index) => {
          const active = index === currentSlide;
          return h(
            "article",
            { className: "case-card", key: study.slug, "aria-hidden": String(!active), inert: active ? undefined : "", "data-carousel-slide": true },
            h(
              "div",
              { className: "case-card__copy" },
              h("h3", null, study.title),
              h("p", null, study.teaser),
              h(
                "div",
                { className: "case-metrics", role: "group", "aria-label": `${study.title} project details` },
                study.metrics.map(([label, value]) => h("span", { key: label }, h("strong", null, label), " ", value)),
              ),
              h("a", { className: "case-cta", href: pagePath(study.file), tabIndex: active ? undefined : -1 }, "View Case Study", h("span", { className: "sr-only" }, `: ${study.title}`)),
            ),
            h("div", { className: "case-card__visual" }, h("img", { className: "case-card__mockup", src: study.image, alt: study.alt, loading: "lazy", decoding: "async", ...imageProps(study.image) })),
          );
        }),
      ),
    ),
    h(
      "div",
      { className: "carousel-dots", role: "group", "aria-label": "Case study slides", "data-carousel-dots": true },
      caseStudies.map((study, index) =>
        h("button", {
          key: study.slug,
          type: "button",
          className: cx("carousel-dot", index === currentSlide && "is-active"),
          "aria-current": index === currentSlide ? "true" : "false",
          "aria-label": `Show case study ${index + 1}`,
          onClick: () => goToSlide(index),
        }),
      ),
    ),
  );
}

function TechStackSection() {
  return h(
    "section",
    { className: "section section--white tech-stack", id: "tech-stack", "aria-labelledby": "tech-stack-title" },
    h(
      "div",
      { className: "section__head" },
      h("h2", { id: "tech-stack-title" }, "Tools selected for stable, scalable delivery"),
      h("p", null, "We choose familiar, maintainable technologies that make products easier to ship, operate, and hand over."),
    ),
    h(
      "div",
      { className: "tech-grid" },
      techGroups.map(([group, tags]) =>
        h(
          "article",
          { className: "tech-card", key: group },
          h("h3", null, group),
          h(
            "div",
            { className: "tech-tags" },
            tags.map(([icon, label]) => h("div", { className: "tech-tag", key: label }, h("img", { src: `assets/tech-logos/${icon}`, alt: "", width: 24, height: 24, loading: "lazy", decoding: "async" }), h("span", null, label))),
          ),
        ),
      ),
    ),
    h("p", { className: "tech-note" }, "Product names and logos are trademarks of their respective owners. They are shown only to identify technologies we work with and do not imply endorsement."),
  );
}

function ProcessSection() {
  const steps = [
    ["timeline__card--map", "Map", "Requirements, architecture, data model, integrations, and release plan."],
    ["timeline__card--build", "Build", "Design, engineering, QA, security checks, and weekly product demos."],
    ["timeline__card--scale", "Scale", "Production deployment, monitoring, documentation, and improvement backlog."],
  ];

  return h(
    "section",
    { className: "section section--white", id: "process", "aria-labelledby": "process-title" },
    h("div", { className: "section__head" }, h("p", { className: "eyebrow" }, "Process"), h("h2", { id: "process-title" }, "A tighter path from idea to launch"), h("p", null, "Every engagement is structured around visible decisions, measurable delivery, practical AI opportunities, and code that can be owned by your team.")),
    h("div", { className: "timeline" }, steps.map(([className, title, text]) => h("article", { className: cx("timeline__card", className), key: title }, h("h3", null, title), h("p", null, text)))),
    h("div", { className: "visual-language" }, h("img", { src: "assets/visual-language.webp", ...imageProps("assets/visual-language.webp"), alt: "Technical visual language showing architecture, code, and interface references", loading: "lazy", decoding: "async" }), h("p", null, "One consistent visual language across architecture diagrams, code, and interface, so each project is easy to follow and to hand over.")),
  );
}

const faqs = [
  ["How long does a typical software project take?", "Most focused builds take 4 to 10 weeks, depending on scope, integrations, content readiness, and review speed. Larger platforms are planned in phases."],
  ["Can you work with our existing codebase?", "Yes. We usually begin with a technical audit, then define the safest path for fixes, new features, modernization, or handover."],
  ["Do you provide design as well as development?", "Yes. We can create product UX, interface design, component systems, and production implementation in one delivery workflow."],
  ["What happens after launch?", "We can stay involved for monitoring, improvements, security updates, performance tuning, documentation, and support retainers."],
  ["How does pricing work?", "We quote in writing before work starts: scope, fees, applicable taxes such as GST, the payment schedule, and any third-party costs like cloud hosting or licences. Extra work is agreed in writing before it begins. This website never takes payments. Cancellations and refunds are explained in our Refund Policy."],
  ["Can you build automation and AI features?", "Yes. We build practical automation around real operations, including internal tools, workflow bots, AI-assisted review, reporting, and data pipelines."],
];

function FaqSection() {
  return h(
    "section",
    { className: "section section--light faq", id: "faq", "aria-labelledby": "faq-title" },
    h("div", { className: "section__head" }, h("h2", { id: "faq-title" }, "Common questions before a build starts")),
    h("div", { className: "faq-list" }, faqs.map(([question, answer]) => h("details", { key: question }, h("summary", null, question), h("p", null, answer)))),
  );
}

function ContactSection() {
  return h(
    "section",
    { className: "contact", id: "contact", "aria-labelledby": "contact-title" },
    h(
      "div",
      { className: "contact__copy" },
      h("h2", { id: "contact-title" }, "Build the next version of your business software"),
      h("p", null, "Share what you need to launch, automate with AI, or improve. We will map the technical path and next steps."),
      h("div", { className: "contact-meta" }, h(ContactLinks, null)),
    ),
    h(ContactForm, null),
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmailField(formData, errors) {
  const email = normalizeInput(formData.get("email"), 120);

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address, for example name@company.com.";
  }
}

function validateContact(form) {
  const formData = new FormData(form);
  const errors = {};

  if (!normalizeInput(formData.get("name"), 80)) {
    errors.name = "Enter your name.";
  }

  validateEmailField(formData, errors);

  if (!CONTACT_PROJECT_OPTIONS.includes(formData.get("project"))) {
    errors.project = "Choose a project type.";
  }

  if (!normalizeInput(formData.get("brief"), 2000)) {
    errors.brief = "Tell us a little about what you need.";
  }

  if (formData.get("consent") !== "on") {
    errors.consent = "Tick this box to confirm and agree before sending.";
  }

  return errors;
}

function validatePrivacyRequest(form) {
  const formData = new FormData(form);
  const errors = {};

  if (!normalizeInput(formData.get("name"), 80)) {
    errors.name = "Enter your name.";
  }

  validateEmailField(formData, errors);

  if (!PRIVACY_REQUEST_TYPES.includes(formData.get("requestType"))) {
    errors.requestType = "Choose what you would like us to do.";
  }

  return errors;
}

function useSecureSubmit({ collectionKey, buildPayload, buildMailto, successMessage, validate }) {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: "", tone: "neutral" });
  const [emailDraftUrl, setEmailDraftUrl] = useState("");
  const [errors, setErrors] = useState({});
  // Start as "consented" so the pre-rendered HTML has no opt-in box; it is shown after mount
  // only when the visitor has not accepted cookies in the launch dialog.
  const [securityConsent, setSecurityConsent] = useState(true);

  useEffect(() => {
    const sync = () => setSecurityConsent(Boolean(readConsent()?.security));
    sync();
    return subscribeConsent(sync);
  }, []);

  const send = async () => {
    const form = formRef.current;
    let payload;

    if (!form) {
      return;
    }

    setIsSubmitting(true);
    setEmailDraftUrl("");
    setFormStatus({ message: "Sending your message…", tone: "neutral" });

    try {
      payload = buildPayload(form);

      if (!payload) {
        form.reset();
        setFormStatus({ message: successMessage, tone: "success" });
        return;
      }

      // Ticking the optional box in the form counts as accepting spam protection.
      if (form.elements.security?.checked) {
        saveConsent({ security: true });
      }

      if (!readConsent()?.security) {
        // Nothing from Google is loaded without permission.
        setEmailDraftUrl(buildMailto(payload));
        setFormStatus({
          message: "To send through this form, tick the spam protection box above. Or use the email draft.",
          tone: "error",
        });
        form.elements.security?.focus();
        return;
      }

      const contactService = await getContactService();
      await contactService.addSubmission(collectionKey, payload);
      form.reset();
      setFormStatus({ message: successMessage, tone: "success" });
    } catch (error) {
      console.error("Form submission failed", error);

      if (payload) {
        setEmailDraftUrl(buildMailto(payload));
      }

      setFormStatus({
        message: `We could not send this from the website. Please use the email draft below, or write to ${SITE_EMAIL}.`,
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitIfValid = () => {
    const form = formRef.current;
    const found = validate(form);
    const names = Object.keys(found);

    if (names.length) {
      setErrors(found);
      setEmailDraftUrl("");
      setFormStatus({ message: `Please fix ${names.length === 1 ? "the highlighted field" : "the highlighted fields"} and send again.`, tone: "error" });
      form.elements[names[0]]?.focus();
      return false;
    }

    setErrors({});
    return true;
  };

  return {
    formRef,
    isSubmitting,
    formStatus,
    emailDraftUrl,
    securityConsent,
    errors,
    handleSubmit: (event) => {
      event.preventDefault();

      if (submitIfValid()) {
        send();
      }
    },
    clearError: (event) => {
      const name = event.target?.name;

      if (name && errors[name]) {
        setErrors((current) => {
          const { [name]: removed, ...rest } = current;
          return rest;
        });
      }
    },
  };
}

function NewTabNote() {
  return h("span", { className: "sr-only" }, " (opens in a new tab)");
}

function FormStatus({ formStatus, emailDraftUrl }) {
  return h(
    "p",
    { className: cx("form-status", formStatus.tone === "success" && "is-success", formStatus.tone === "error" && "is-error"), role: "status", "aria-live": "polite", "data-form-status": true },
    formStatus.message,
    emailDraftUrl ? [" ", h("a", { key: "email-draft", href: emailDraftUrl }, "Open email draft")] : null,
  );
}

// Shown only to visitors who did not accept cookies in the launch dialog.
function SecurityOptIn() {
  return h(
    "div",
    { className: "field field--optin" },
    h(
      "label",
      { className: "form-check" },
      h("input", { type: "checkbox", name: "security" }),
      h("span", null, "Allow Google reCAPTCHA spam protection (uses a cookie). ", h("a", { href: "/cookie-policy", target: "_blank", rel: "noopener" }, "Cookie Policy", h(NewTabNote, null))),
    ),
  );
}

function FieldError({ id, message }) {
  return message ? h("p", { className: "field-error", id }, h("span", { className: "sr-only" }, "Error: "), message) : null;
}

// Wraps one labelled control with an inline, screen-reader-linked error message.
function Field({ formId, name, label, error, checkbox, render }) {
  const errorId = `${formId}-${name}-error`;
  const invalid = error ? { "aria-invalid": "true", "aria-describedby": errorId } : {};

  return h(
    "div",
    { className: cx("field", error && "has-error") },
    checkbox ? render(invalid) : h("label", null, h("span", null, label), render(invalid)),
    h(FieldError, { id: errorId, message: error }),
  );
}

function ContactForm() {
  const { formRef, isSubmitting, formStatus, emailDraftUrl, securityConsent, errors, handleSubmit, clearError } = useSecureSubmit({
    collectionKey: "contact",
    buildPayload: getContactPayload,
    buildMailto: buildMailtoUrl,
    validate: validateContact,
    successMessage: "Thank you. Your message has been sent and we will reply to the email address you gave.",
  });
  const formId = "contact";

  return h(
    "form",
    { ref: formRef, className: "contact-form", "data-contact-form": true, noValidate: true, onSubmit: handleSubmit, onChange: clearError, onInput: clearError, "aria-busy": String(isSubmitting) },
    h("p", { className: "form-note" }, "All fields are required."),
    h(Field, { formId, name: "name", label: "Name", error: errors.name, render: (invalid) => h("input", { type: "text", name: "name", autoComplete: "name", maxLength: 80, required: true, ...invalid }) }),
    h(Field, { formId, name: "email", label: "Email", error: errors.email, render: (invalid) => h("input", { type: "email", name: "email", autoComplete: "email", spellCheck: false, maxLength: 120, required: true, ...invalid }) }),
    h(Field, {
      formId,
      name: "project",
      label: "Project type",
      error: errors.project,
      render: (invalid) => h("select", { name: "project", required: true, ...invalid }, h("option", { value: "" }, "Select one"), CONTACT_PROJECT_OPTIONS.map((option) => h("option", { key: option }, option))),
    }),
    h(Field, {
      formId,
      name: "brief",
      label: "Brief",
      error: errors.brief,
      render: (invalid) => h("textarea", { name: "brief", autoComplete: "off", rows: 5, maxLength: 2000, placeholder: "Describe what you want to build or improve…", required: true, ...invalid }),
    }),
    h("label", { className: "form-honeypot", "aria-hidden": "true" }, h("span", null, "Company website"), h("input", { type: "text", name: "company_website", autoComplete: "off", tabIndex: -1 })),
    h(Field, {
      formId,
      name: "consent",
      checkbox: true,
      error: errors.consent,
      render: (invalid) =>
        h(
          "label",
          { className: "form-check" },
          h("input", { type: "checkbox", name: "consent", required: true, ...invalid }),
          h("span", null, "I am 18 or older, I have read the ", h("a", { href: "/privacy-policy", target: "_blank", rel: "noopener" }, "Privacy Policy", h(NewTabNote, null)), ", and I agree that ", SITE.brand, " may use these details to reply to my enquiry."),
        ),
    }),
    securityConsent ? null : h(SecurityOptIn, null),
    h("button", { className: "button button--primary", type: "submit", disabled: isSubmitting }, isSubmitting ? "Sending Message" : "Send Message"),
    h(FormStatus, { formStatus, emailDraftUrl }),
    h("p", { className: "form-note" }, "Please do not include passwords or sensitive personal data. We use your details only to reply, and never sell them or use them for marketing."),
  );
}

function PrivacyRequestPage() {
  const { formRef, isSubmitting, formStatus, emailDraftUrl, securityConsent, errors, handleSubmit, clearError } = useSecureSubmit({
    collectionKey: "privacy",
    buildPayload: getPrivacyPayload,
    buildMailto: buildPrivacyMailto,
    validate: validatePrivacyRequest,
    successMessage: "Thank you. We have received your request and will reply to the email address you gave within 30 days.",
  });
  const formId = "privacy";

  return h(
    "section",
    { className: "section section--light legal", "aria-labelledby": "privacy-request-title" },
    h(
      "div",
      { className: "legal__inner" },
      h(Breadcrumbs, { items: [["Home", "/"], ["Privacy and data requests"]] }),
      h("p", { className: "eyebrow" }, "Your data"),
      h("h1", { id: "privacy-request-title" }, "Privacy and data requests"),
      h("p", { className: "legal__intro" }, "You can ask us for a copy of the personal data we hold about you, to correct it, to delete it, or to withdraw a consent you gave. Use the form below or email us. Both are treated the same."),
      h("ul", { className: "legal__list" }, [
        "We reply to the email address you give us, and may ask a question to confirm it is you before we act.",
        "We aim to respond within 30 days. There is no fee for reasonable requests.",
        "Deleting your data does not affect records we must keep by law, such as tax records for paid projects.",
      ].map((item) => h("li", { key: item }, item))),
      h("p", null, "Prefer email? Write to ", h("a", { href: `mailto:${SITE_EMAIL}?subject=${encodeURIComponent("Privacy request")}` }, SITE_EMAIL), ". Read how we handle data in our ", h("a", { href: "/privacy-policy" }, "Privacy Policy"), "."),
      h(
        "form",
        { ref: formRef, className: "contact-form contact-form--light", noValidate: true, onSubmit: handleSubmit, onChange: clearError, onInput: clearError, "aria-busy": String(isSubmitting) },
        h("p", { className: "form-note" }, "All fields are required except details."),
        h(Field, { formId, name: "name", label: "Name", error: errors.name, render: (invalid) => h("input", { type: "text", name: "name", autoComplete: "name", maxLength: 80, required: true, ...invalid }) }),
        h(Field, { formId, name: "email", label: "Email", error: errors.email, render: (invalid) => h("input", { type: "email", name: "email", autoComplete: "email", spellCheck: false, maxLength: 120, required: true, ...invalid }) }),
        h(Field, {
          formId,
          name: "requestType",
          label: "What would you like us to do?",
          error: errors.requestType,
          render: (invalid) => h("select", { name: "requestType", required: true, ...invalid }, h("option", { value: "" }, "Select one"), PRIVACY_REQUEST_TYPES.map((option) => h("option", { key: option }, option))),
        }),
        h("label", null, h("span", null, "Details (optional)"), h("textarea", { name: "details", autoComplete: "off", rows: 4, maxLength: 2000, placeholder: "Anything that helps us find your data, such as the date you contacted us…" })),
        h("label", { className: "form-honeypot", "aria-hidden": "true" }, h("span", null, "Company website"), h("input", { type: "text", name: "company_website", autoComplete: "off", tabIndex: -1 })),
        securityConsent ? null : h(SecurityOptIn, null),
        h("button", { className: "button button--primary", type: "submit", disabled: isSubmitting }, isSubmitting ? "Sending Request" : "Send Request"),
        h(FormStatus, { formStatus, emailDraftUrl }),
      ),
    ),
  );
}

function Breadcrumbs({ items }) {
  return h(
    "nav",
    { className: "breadcrumbs", "aria-label": "Breadcrumb" },
    h(
      "ol",
      null,
      items.map(([label, href], index) =>
        h("li", { key: label }, href && index < items.length - 1 ? h("a", { href }, label) : h("span", { "aria-current": "page" }, label)),
      ),
    ),
  );
}

// Contextual cross-links: help visitors and search engines move between related pages.
function RelatedLinks({ groups }) {
  return h(
    "section",
    { className: "related", "aria-label": "Related pages" },
    groups.map(([heading, links]) =>
      h(
        "div",
        { className: "related__group", key: heading },
        h("h2", null, heading),
        h("ul", null, links.map(([title, note, href]) => h("li", { key: href }, h("a", { href }, h("strong", null, title), h("span", null, note))))),
      ),
    ),
  );
}

function ServiceDetailPage({ service }) {
  return h(
    React.Fragment,
    null,
    h(
      "section",
      { className: cx("service-detail-hero", service.heroClass) },
      h(
        "div",
        { className: "service-detail-hero__content" },
        h(Breadcrumbs, { items: [["Home", "/"], ["Services", "/#services"], [service.title]] }),
        h("p", { className: "eyebrow" }, service.eyebrow),
        h("h1", null, service.detailTitle),
        h("p", { className: "service-detail-hero__lead" }, service.detailLead),
        h("div", { className: "service-detail-hero__actions" }, h("a", { className: "button button--primary", href: "/#contact" }, service.cta), h("a", { className: "button button--ghost", href: "/#services" }, "All Services")),
      ),
    ),
    h(
      "section",
      { className: "service-detail" },
      h(
        "div",
        { className: "service-detail__intro" },
        h("div", null, h("p", { className: "eyebrow" }, "What we build"), h("h2", null, service.introTitle), h("p", null, service.introText)),
        h("ul", { className: "service-detail__list" }, service.builds.map(([title, text]) => h("li", { key: title }, h("strong", null, title), h("span", null, text)))),
      ),
      h(
        "div",
        { className: "service-detail__section" },
        h("h2", null, "Delivery focus"),
        h("div", { className: "service-detail__cards" }, service.focus.map(([title, text], index) => h("article", { className: "service-detail__card", key: title }, h("span", null, String(index + 1).padStart(2, "0")), h("h3", null, title), h("p", null, text)))),
      ),
      h(
        "div",
        { className: "service-detail__outcome" },
        h("div", null, h("h2", null, service.outcomeTitle), h("p", null, service.outcomeText)),
        h("div", { className: "service-detail__outcome-grid" }, service.outcomes.map(([title, text]) => h("div", { key: title }, h("strong", null, title), h("span", null, text)))),
      ),
      h(RelatedLinks, {
        groups: [
          ["Work in this area", casesForService(service.slug).map((study) => [study.title, study.isBuild ? "Working build" : "Concept case study", pagePath(study.file)])],
          ["Other services", services.filter((other) => other.slug !== service.slug).slice(0, 4).map((other) => [other.title, other.summary, pagePath(other.file)])],
        ],
      }),
    ),
  );
}

function CaseDetailPage({ study }) {
  return h(
    React.Fragment,
    null,
    h(
      "section",
      { className: cx("case-detail-hero", `case-detail-hero--${study.slug}`) },
      h(
        "div",
        { className: "case-detail-hero__content" },
        h(Breadcrumbs, { items: [["Home", "/"], ["Case studies", "/#work"], [study.title.split(":")[0]]] }),
        h("p", { className: "eyebrow" }, study.isBuild ? "Working build" : "Concept case study"),
        h("h1", null, study.title),
        h("p", { className: "case-detail-hero__lead" }, study.detailLead),
        h("div", { className: "case-detail-hero__actions" }, h("a", { className: "button button--primary", href: "/#contact" }, "Build Something Similar"), h("a", { className: "button button--ghost", href: "/#work" }, "All Case Studies")),
      ),
    ),
    h(
      "section",
      { className: "case-detail" },
      h("div", { className: "case-detail__stats", role: "group", "aria-label": `${study.title} project details` }, study.stats.map(([label, value]) => h("div", { key: label }, h("span", null, label), h("strong", null, value)))),
      h("p", { className: "case-detail__note" }, study.isBuild ? "A working build by CyphronTech that is not yet live. No usage or client results are claimed." : "An illustrative concept designed by CyphronTech. It has not been built for a client and no results are claimed."),
      h(
        "div",
        { className: "case-detail__overview" },
        h("div", null, h("p", { className: "eyebrow" }, "Overview"), h("h2", null, study.overviewTitle), study.overviewText.map((paragraph) => h("p", { key: paragraph }, paragraph))),
        h("div", { className: "case-detail__image" }, h("img", { src: study.image, alt: study.alt, loading: "lazy", decoding: "async", ...imageProps(study.image) })),
      ),
      h(CaseBlocksSection, { title: "What the build focused on", blocks: study.focus }),
      h(CaseBlocksSection, { eyebrow: "Scope", title: study.scopeTitle, blocks: study.scope, four: true }),
      h(
        "div",
        { className: "case-detail__feature" },
        h("div", null, h("p", { className: "eyebrow" }, "AI workflow"), h("h2", null, study.aiTitle), h("p", null, study.aiText)),
        h("ul", { className: "case-detail__feature-list" }, study.aiItems.map(([title, text]) => h("li", { key: title }, h("strong", null, title), text))),
      ),
      h(
        "div",
        { className: "case-detail__section" },
        h("p", { className: "eyebrow" }, "Implementation direction"),
        h("h2", null, study.implementationTitle),
        h("p", null, study.implementationText),
        h("div", { className: "case-detail__stack", "aria-label": `${study.title} technology direction` }, study.stack.map((item) => h("span", { key: item }, item))),
      ),
      h("div", { className: "case-detail__cta" }, h("div", null, h("h2", null, study.ctaTitle), h("p", null, study.ctaText)), h("a", { className: "button button--primary", href: "/#contact" }, "Start a Project")),
      h(RelatedLinks, {
        groups: [
          ["Services behind it", servicesForCase(study.slug).map((service) => [service.title, service.summary, pagePath(service.file)])],
          ["More case studies", caseStudies.filter((other) => other.slug !== study.slug).slice(0, 3).map((other) => [other.title, other.isBuild ? "Working build" : "Concept case study", pagePath(other.file)])],
        ],
      }),
    ),
  );
}

function CaseBlocksSection({ eyebrow, title, blocks, four = false }) {
  return h(
    "div",
    { className: "case-detail__section" },
    eyebrow ? h("p", { className: "eyebrow" }, eyebrow) : null,
    h("h2", null, title),
    h(
      "div",
      { className: cx("case-detail__blocks", four && "case-detail__blocks--four") },
      blocks.map(([label, heading, text]) => h("article", { className: "case-detail__block", key: `${label}-${heading}` }, h("span", null, label), h("h3", null, heading), h("p", null, text))),
    ),
  );
}

function NotFoundPage() {
  return h(
    "section",
    { className: "section section--light not-found", "aria-labelledby": "not-found-title" },
    h("div", { className: "section__head" }, h("p", { className: "eyebrow" }, "404"), h("h1", { id: "not-found-title" }, "Page not found"), h("p", null, "The page you opened is not part of the CyphronTech site.")),
    h("div", { className: "not-found__actions" }, h("a", { className: "button button--primary", href: "/#top" }, "Back Home"), h("a", { className: "button button--ghost", href: "/#contact" }, "Contact")),
  );
}

function normalizeInput(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function buildMailtoUrl(payload) {
  const subject = encodeURIComponent(`New website inquiry from ${payload.name || "CyphronTech site"}`);
  const body = encodeURIComponent([
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Project type: ${payload.project}`,
    "",
    "Brief:",
    payload.brief,
  ].join("\n"));

  return `mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`;
}

function buildPrivacyMailto(payload) {
  const subject = encodeURIComponent(`Privacy request: ${payload.requestType}`);
  const body = encodeURIComponent([
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Request: ${payload.requestType}`,
    "",
    "Details:",
    payload.details,
  ].join("\n"));

  return `mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`;
}

function getContactPayload(form) {
  const formData = new FormData(form);
  const honeypot = normalizeInput(formData.get("company_website"), 120);

  if (honeypot) {
    return null;
  }

  const payload = {
    name: normalizeInput(formData.get("name"), 80),
    email: normalizeInput(formData.get("email"), 120).toLowerCase(),
    project: normalizeInput(formData.get("project"), 80),
    brief: normalizeInput(formData.get("brief"), 2000),
    consent: formData.get("consent") === "on",
    consentVersion: SITE.policyVersion,
    source: "website-contact-form",
    status: "new",
  };

  if (!payload.name || !payload.email || !CONTACT_PROJECT_OPTIONS.includes(payload.project) || !payload.brief) {
    throw new Error("missing-fields");
  }

  if (!payload.consent) {
    throw new Error("consent-required");
  }

  return payload;
}

function getPrivacyPayload(form) {
  const formData = new FormData(form);
  const honeypot = normalizeInput(formData.get("company_website"), 120);

  if (honeypot) {
    return null;
  }

  const payload = {
    name: normalizeInput(formData.get("name"), 80),
    email: normalizeInput(formData.get("email"), 120).toLowerCase(),
    requestType: normalizeInput(formData.get("requestType"), 80),
    details: normalizeInput(formData.get("details"), 2000),
    source: "privacy-request-form",
    status: "new",
  };

  if (!payload.name || !payload.email || !PRIVACY_REQUEST_TYPES.includes(payload.requestType)) {
    throw new Error("missing-fields");
  }

  return payload;
}

function hasFirebaseConfig(config) {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
  return requiredKeys.every((key) => typeof config?.[key] === "string" && config[key].trim());
}

async function getContactService() {
  if (!readConsent()?.security) {
    throw new Error("security-consent-required");
  }

  if (!contactServicePromise) {
    contactServicePromise = (async () => {
      const { firebaseConfig, contactFormSettings } = window.cyphronContactFirebase || {};

      if (!contactFormSettings?.enabled || !hasFirebaseConfig(firebaseConfig)) {
        throw new Error("firebase-not-configured");
      }

      if (!contactFormSettings.appCheck?.enabled || !contactFormSettings.appCheck.siteKey) {
        throw new Error("app-check-not-configured");
      }

      const [{ initializeApp }, firestoreModule, appCheckModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-check.js`),
      ]);

      const app = initializeApp(firebaseConfig);
      appCheckModule.initializeAppCheck(app, {
        provider: new appCheckModule.ReCaptchaV3Provider(contactFormSettings.appCheck.siteKey),
        isTokenAutoRefreshEnabled: true,
      });

      const db = firestoreModule.getFirestore(app);
      const collections = {
        contact: contactFormSettings.collectionName || "contactSubmissions",
        privacy: PRIVACY_COLLECTION,
      };

      return {
        addSubmission: (collectionKey, payload) => {
          if (!readConsent()?.security) {
            throw new Error("security-consent-required");
          }

          return firestoreModule.addDoc(firestoreModule.collection(db, collections[collectionKey]), {
            ...payload,
            createdAt: firestoreModule.serverTimestamp(),
          });
        },
      };
    })();
  }

  try {
    return await contactServicePromise;
  } catch (error) {
    contactServicePromise = undefined;
    throw error;
  }
}

function renderInline(text) {
  const parts = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;
  let index = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }

    const external = /^https?:/.test(match[2]);
    index += 1;
    parts.push(h("a", { key: `link-${index}`, href: match[2], ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) }, match[1], external ? h(NewTabNote, null) : null));
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}

function LegalBlock({ block, label }) {
  if (typeof block === "string") {
    return h("p", null, renderInline(block));
  }

  if (Array.isArray(block)) {
    return h("ul", { className: "legal__list" }, block.map((item) => h("li", { key: item }, renderInline(item))));
  }

  if (block.table) {
    return h(
      "div",
      { className: "legal__table-wrap", role: "region", "aria-label": `${label} table`, tabIndex: 0 },
      h(
        "table",
        { className: "legal__table" },
        h("thead", null, h("tr", null, block.table.head.map((cell) => h("th", { key: cell, scope: "col" }, cell)))),
        h("tbody", null, block.table.rows.map((row) => h("tr", { key: row[0] }, row.map((cell, index) => (index === 0 ? h("th", { key: cell, scope: "row" }, cell) : h("td", { key: cell }, cell)))))),
      ),
    );
  }

  return null;
}

function LegalPage({ page }) {
  return h(
    "section",
    { className: "section section--light legal", "aria-labelledby": "legal-title" },
    h(
      "div",
      { className: "legal__inner" },
      h(Breadcrumbs, { items: [["Home", "/"], [page.title]] }),
      h("p", { className: "eyebrow" }, page.eyebrow || "Legal"),
      h("h1", { id: "legal-title" }, page.title),
      h("p", { className: "legal__meta" }, `Last updated: ${SITE.policiesUpdated}`),
      h("p", { className: "legal__intro" }, page.intro),
      h(
        "nav",
        { className: "legal__toc", "aria-labelledby": "legal-toc-title" },
        h("h2", { id: "legal-toc-title" }, "On this page"),
        h("ol", null, page.sections.map((section) => h("li", { key: section.id }, h("a", { href: `#${section.id}` }, section.heading)))),
      ),
      page.sections.map((section) =>
        h(
          "section",
          { key: section.id, id: section.id, className: "legal__section", "aria-labelledby": `${section.id}-heading` },
          h("h2", { id: `${section.id}-heading` }, section.heading),
          section.body.map((block, index) => h(LegalBlock, { key: index, block, label: section.heading })),
        ),
      ),
    ),
  );
}

function ConsentBanner() {
  const [consent, setConsent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [wasReopened, setWasReopened] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    // Read the stored choice after mount so the pre-rendered HTML never contains the notice.
    const stored = readConsent();
    setConsent(stored);
    setIsOpen(!stored);

    const sync = () => setConsent(readConsent());
    const reopen = () => {
      setWasReopened(true);
      setIsOpen(true);
    };
    const unsubscribe = subscribeConsent(sync);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);

    return () => {
      unsubscribe();
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  useEffect(() => {
    // Only move focus when the visitor reopened it themselves; on arrival it never steals focus.
    if (isOpen && wasReopened) {
      bannerRef.current?.focus();
    }
  }, [isOpen, wasReopened]);

  if (!isOpen) {
    return null;
  }

  const choose = (security) => {
    saveConsent({ security });
    setIsOpen(false);
    setWasReopened(false);
  };

  return h(
    "section",
    { className: "consent", ref: bannerRef, tabIndex: -1, "aria-label": "Cookie choices" },
    h(
      "p",
      null,
      "We use one optional cookie: Google reCAPTCHA, to protect our contact form from spam. No analytics or ad trackers. ",
      h("a", { href: "/cookie-policy" }, "Cookie Policy"),
      consent ? ` Current choice: ${consent.security ? "accepted" : "declined"}.` : "",
    ),
    h(
      "div",
      { className: "consent__actions" },
      h("button", { type: "button", className: "consent__button", onClick: () => choose(false) }, "Decline"),
      h("button", { type: "button", className: "consent__button", onClick: () => choose(true) }, "Accept"),
      consent ? h("button", { type: "button", className: "consent__close", onClick: () => setIsOpen(false) }, "Close") : null,
    ),
  );
}

function Footer() {
  const registration = [SITE.registrationNumber && `LLPIN ${SITE.registrationNumber}`, SITE.gstin && `GSTIN ${SITE.gstin}`].filter(Boolean).join(" \u00b7 ");
  const details = [
    `\u00a9 ${new Date().getFullYear()} ${SITE.legalName}`,
    registration,
    SITE.registeredAddress,
    h("a", { href: `mailto:${SITE_EMAIL}` }, SITE_EMAIL),
    h("a", { href: `tel:${SITE_PHONE}` }, SITE_PHONE_DISPLAY),
    h("a", { href: LINKEDIN_URL, target: "_blank", rel: "noopener noreferrer" }, "LinkedIn", h(NewTabNote, null)),
    h("a", { href: `mailto:${SITE.grievanceOfficer.email}` }, "Grievance Officer", SITE.grievanceOfficer.name ? `: ${SITE.grievanceOfficer.name}` : ""),
  ].filter(Boolean);

  return h(
    "footer",
    { className: "footer" },
    h(
      "div",
      { className: "footer__main" },
      h(Brand, { footer: true }),
      h(
        "nav",
        { className: "footer__nav", "aria-label": "Footer" },
        h(
          "ul",
          null,
          h("li", { key: "contact" }, h("a", { href: "/#contact" }, "Contact")),
          legalLinks.map(([label, href]) => h("li", { key: href }, h("a", { href }, label))),
          h("li", { key: "cookie-settings" }, h("button", { type: "button", className: "footer__link-button", onClick: openConsentSettings }, "Cookie settings")),
        ),
      ),
    ),
    h("ul", { className: "footer__meta" }, details.map((item, index) => h("li", { key: index }, item))),
  );
}

// Eased "inertia" mouse-wheel scrolling (Lenis, vendored). Skipped for visitors who
// ask for reduced motion and on touch devices, which already scroll smoothly.
function startSmoothScroll() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const touchDevice = window.matchMedia("(pointer: coarse)");
  let lenis;
  let frame = 0;
  let unmounted = false;

  const stop = () => {
    window.cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = undefined;
  };

  const start = async () => {
    if (lenis || reduceMotion.matches || touchDevice.matches) {
      return;
    }

    const { default: Lenis } = await import("../assets/vendor/lenis.mjs?v=lenis-1.1.20");

    if (unmounted || lenis || reduceMotion.matches) {
      return;
    }

    lenis = new Lenis({ lerp: 0.075, smoothWheel: true, anchors: { offset: -70 } });
    const tick = (time) => {
      lenis?.raf(time);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
  };

  const onPreferenceChange = () => (reduceMotion.matches ? stop() : start());
  reduceMotion.addEventListener("change", onPreferenceChange);
  start();

  return () => {
    unmounted = true;
    reduceMotion.removeEventListener("change", onPreferenceChange);
    stop();
  };
}

function App() {
  const route = useMemo(getRoute, []);
  usePageSetup(route);
  useEffect(() => startSmoothScroll(), []);

  // The Contact photo loads when the visitor scrolls near it, so it never competes with the hero.
  useEffect(() => {
    const sections = document.querySelectorAll("#contact");
    const show = (section) => section.classList.add("has-photo");

    if (!("IntersectionObserver" in window)) {
      sections.forEach(show);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && (show(entry.target), observer.unobserve(entry.target))),
      { rootMargin: "800px 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  let page;

  if (route.type === "service") {
    page = h(ServiceDetailPage, { service: route.service });
  } else if (route.type === "case") {
    page = h(CaseDetailPage, { study: route.study });
  } else if (route.type === "legal") {
    page = h(LegalPage, { page: route.page });
  } else if (route.type === "privacy-request") {
    page = h(PrivacyRequestPage, null);
  } else if (route.type === "not-found") {
    page = h(NotFoundPage, null);
  } else {
    page = h(HomePage, null);
  }

  return h(
    React.Fragment,
    null,
    h("a", { className: "skip-link", href: "#main" }, "Skip to content"),
    h(ConsentBanner, null),
    h(Header, { route }),
    h("main", { id: "main" }, page),
    h(Footer, null),
  );
}

export { App, currentFile, getRoute, services, caseStudies, faqs };

if (typeof document !== "undefined" && document.getElementById("root")) {
  const rootElement = document.getElementById("root");

  // Reuse the pre-rendered HTML (no flash, no re-created LCP element); fall back to a fresh render.
  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, h(App, null));
  } else {
    createRoot(rootElement).render(h(App, null));
  }
}
