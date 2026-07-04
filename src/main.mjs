import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import "../assets/firebase-config.js?v=appcheck-v3";

const h = React.createElement;
const SITE_EMAIL = "cyphrontechllp@gmail.com";
const FIREBASE_SDK_VERSION = "12.7.0";
const CONTACT_PROJECT_OPTIONS = [
  "Website or SaaS platform",
  "Mobile app",
  "Automation workflow",
  "AI feature or workflow",
  "UI/UX design",
];
let contactServicePromise;

const cx = (...values) => values.filter(Boolean).join(" ");

const services = [
  {
    slug: "web",
    file: "web-development.html",
    title: "Web Platforms",
    image: "assets/service-web-platforms.jpg",
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
    image: "assets/service-mobile-apps.jpg",
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
    outcomeTitle: "Apps built for adoption, not just installation.",
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
    image: "assets/service-workflow-automation.jpg",
    alt: "Workflow automation dashboard with connected process nodes",
    summary: "AI-assisted automation for CRM, finance, support, and internal teams using APIs, bots, and monitored jobs.",
    eyebrow: "AI automation",
    detailTitle: "AI automation that solves real operational problems",
    detailLead: "We build automation, copilots, dashboards, and workflow tools that help teams move faster without adding fragile buzzword features.",
    cta: "Start an AI Project",
    heroClass: "service-detail-hero--ai",
    introTitle: "AI built for business, not buzzwords.",
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
    image: "assets/service-cloud-engineering.jpg",
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
    outcomeTitle: "Cloud that does not become a mystery box.",
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
    image: "assets/digital-mockup.jpg",
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
];

const extraServiceCard = {
  title: "Data Products",
  image: "assets/service-data-products.jpg",
  alt: "Business intelligence dashboard on desktop and tablet screens",
  summary: "Dashboards, reporting pipelines, and decision tools that turn fragmented business data into usable insight.",
};

const caseStudies = [
  {
    slug: "orbitcart",
    file: "case-orbitcart.html",
    title: "OrbitCart: AI Commerce Operations",
    image: "assets/case-orbitcart.jpg",
    alt: "OrbitCart commerce operations mobile app mockup",
    teaser: "OrbitCart is a wholesale commerce platform concept built around real-time inventory, supplier messaging, and AI reorder recommendations. The dashboard gives sales and warehouse teams a shared view of stock, order health, and fulfillment priorities.",
    metrics: [["Users", "18k+"], ["Country", "USA"], ["Platform", "iOS"]],
    detailLead: "A wholesale commerce operations concept that brings inventory, supplier conversations, fulfillment priorities, and AI reorder recommendations into one mobile-first workflow.",
    stats: [["Users", "18k+"], ["Country", "USA"], ["Platform", "iOS"], ["AI Layer", "Reorders"]],
    overviewTitle: "Shared commerce visibility for sales and warehouse teams.",
    overviewText: [
      "OrbitCart was shaped around the daily tension between stock availability, supplier updates, and fulfillment decisions. The product concept gives teams a single operating surface for order health, inventory movement, and next-best reorder actions.",
      "The AI layer is practical: it helps surface reorder timing, supplier risk, and fulfillment priorities instead of acting as a generic chatbot.",
    ],
    focus: [
      ["Challenge", "Disconnected stock decisions", "Sales, warehouse, and supplier teams needed clearer visibility into order risk, stock movement, and communication history."],
      ["Solution", "AI commerce command layer", "The experience combines inventory views, supplier messaging, reorder signals, and fulfillment queues in a focused mobile workflow."],
      ["Outcome", "Faster operational response", "Teams can review priority orders, understand reorder triggers, and coordinate supplier follow-up without jumping between systems."],
    ],
    scopeTitle: "A mobile-first commerce workspace for teams that manage stock every day.",
    scope: [
      ["01", "Order health", "Priority queues show delayed orders, fulfillment risk, and the next action needed by sales or warehouse teams."],
      ["02", "Inventory visibility", "Stock movement, reserved quantities, and reorder thresholds are shaped into screens that are quick to scan on mobile."],
      ["03", "Supplier context", "Messaging, purchase updates, and expected delivery dates sit beside the products they affect."],
      ["04", "Admin controls", "Managers can adjust reorder rules, review exceptions, and keep product data consistent across the operation."],
    ],
    aiTitle: "AI built around reorder decisions, not generic chat.",
    aiText: "The AI layer is designed to explain why a product needs attention. It combines sales velocity, available stock, supplier lead time, and fulfillment pressure into practical recommendations that a manager can approve.",
    aiItems: [
      ["Demand signals", "Highlights products moving faster than the current replenishment plan."],
      ["Supplier risk", "Flags vendors with delayed updates or longer-than-usual lead times."],
      ["Fulfillment priority", "Ranks the orders most likely to affect customer commitments."],
      ["Human approval", "Keeps reorder decisions reviewable instead of silently changing inventory plans."],
    ],
    implementationTitle: "Built as a durable product system, not a one-off dashboard.",
    implementationText: "The product direction covers API design, mobile state management, inventory data modeling, audit-friendly admin actions, and a clean handoff path for future integrations with ERP or accounting tools.",
    stack: ["React Native", "Node.js", "PostgreSQL", "OpenAI", "AWS", "Stripe"],
    ctaTitle: "Need an AI-ready commerce workflow?",
    ctaText: "We can map the operations, data, and product experience needed to make commerce teams move faster.",
  },
  {
    slug: "leaselens",
    file: "case-leaselens.html",
    title: "LeaseLens: AI Property Scanner",
    image: "assets/case-leaselens.jpg",
    alt: "LeaseLens property inspection mobile app mockup",
    teaser: "LeaseLens is a property inspection app concept for landlords, tenants, and field teams. It uses guided capture, AI condition notes, and report workflows to make move-in and move-out documentation faster, more consistent, and easier to verify.",
    metrics: [["Reports", "10k+"], ["Country", "UAE"], ["Platform", "Android"]],
    detailLead: "A property inspection app concept for guided capture, AI condition notes, and cleaner move-in and move-out reporting for landlords, tenants, and field teams.",
    stats: [["Reports", "10k+"], ["Country", "UAE"], ["Platform", "Android"], ["AI Layer", "Notes"]],
    overviewTitle: "Consistent inspection records without slowing field teams down.",
    overviewText: [
      "LeaseLens was designed to reduce the friction of property documentation by turning inspections into a guided mobile workflow. The experience supports room-by-room capture, issue tagging, photo review, and report generation.",
      "AI condition notes help teams summarize visible issues and keep report language consistent while still leaving review control with the user.",
    ],
    focus: [
      ["Challenge", "Inconsistent inspection evidence", "Field teams needed a repeatable way to collect photos, notes, timestamps, and condition details across many property types."],
      ["Solution", "Guided AI capture workflow", "The app concept combines structured inspection paths, AI condition summaries, report workflows, and review checkpoints."],
      ["Outcome", "Cleaner handoff documentation", "Property teams get reports that are easier to verify, share, and compare across move-in and move-out events."],
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
    image: "assets/case-flowdesk.jpg",
    alt: "FlowDesk automation command center dashboard mockup",
    teaser: "FlowDesk centralizes client intake, approvals, support routing, and status reporting for service teams. The build connects CRM data, Slack alerts, AI triage, billing events, and executive dashboards into a single operations layer.",
    metrics: [["Hours Saved", "4k+"], ["Region", "UK"], ["Platform", "Web"]],
    detailLead: "A service operations concept that connects intake, approvals, support routing, billing events, AI triage, and executive reporting into one web command center.",
    stats: [["Hours Saved", "4k+"], ["Region", "UK"], ["Platform", "Web"], ["AI Layer", "Triage"]],
    overviewTitle: "A single operations layer for service teams.",
    overviewText: [
      "FlowDesk was shaped around the reality that service businesses often run across CRM records, support tickets, approvals, billing tools, and chat alerts. The concept centralizes the operational queue and shows leadership where work is blocked.",
      "The AI layer supports intake triage, summary drafting, priority signals, and routing suggestions while teams remain in control of approvals.",
    ],
    focus: [
      ["Challenge", "Fragmented work queues", "Teams needed to see intake, support, billing, and status reporting in one place instead of chasing updates across tools."],
      ["Solution", "AI-assisted operations hub", "The concept brings routing, alerts, approvals, CRM context, dashboards, and AI triage into a single control surface."],
      ["Outcome", "Less manual coordination", "Managers can spot bottlenecks faster, teams can act from one queue, and leadership gets clearer operational visibility."],
    ],
    scopeTitle: "An operations command center for intake, routing, and visibility.",
    scope: [
      ["01", "Client intake", "Requests enter through structured forms and integrations, then become trackable work items with ownership and SLA context."],
      ["02", "Approvals", "Managers can approve scope, billing changes, escalations, and handoffs without losing the audit trail."],
      ["03", "Team alerts", "Slack and email notifications keep teams informed about blockers, overdue work, and handoff changes."],
      ["04", "Executive reporting", "Leadership dashboards summarize throughput, bottlenecks, revenue events, and service quality signals."],
    ],
    aiTitle: "AI that helps service teams route work faster.",
    aiText: "The AI layer reads intake context, support notes, and client history to recommend routing, draft summaries, and flag work at risk. It gives operators a better first pass without hiding the decision trail.",
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
    image: "assets/case-medsync.jpg",
    alt: "MedSync patient engagement portal mockup across desktop and mobile",
    teaser: "MedSync is a clinic portal concept for appointments, digital intake, AI-assisted follow-up reminders, and care team messaging. It gives administrators a clear queue while giving patients a calm mobile-first experience.",
    metrics: [["Clinics", "80+"], ["Country", "Canada"], ["Platform", "Web + iOS"]],
    detailLead: "A clinic portal concept for appointments, digital intake, AI-assisted reminders, follow-up workflows, and care team messaging across web and mobile touchpoints.",
    stats: [["Clinics", "80+"], ["Country", "Canada"], ["Platform", "Web + iOS"], ["AI Layer", "Reminders"]],
    overviewTitle: "A calmer engagement workflow for clinics and patients.",
    overviewText: [
      "MedSync was designed to simplify the administrative load around appointments, intake, reminders, and care team communication. The concept gives clinic staff a clear operational queue while giving patients a mobile-first experience.",
      "AI-assisted follow-up reminders and content drafting help reduce missed steps without removing clinical review and administrative control.",
    ],
    focus: [
      ["Challenge", "High-friction patient coordination", "Clinics needed a clearer way to manage intake, appointments, reminders, and patient messaging without overwhelming staff."],
      ["Solution", "Unified portal and queue", "The concept combines patient-facing flows with admin queues, care messaging, digital forms, and AI-assisted follow-up prompts."],
      ["Outcome", "Better continuity of care", "Patients get a calmer experience while clinic teams get stronger visibility into pending tasks and follow-up needs."],
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
    image: "assets/case-finsight.jpg",
    alt: "FinSight cloud analytics dashboard mockup",
    teaser: "FinSight brings revenue, churn, pipeline, and support signals into one board for finance and leadership teams. The platform includes secure data ingestion, AI-assisted reports, and anomaly alerts for faster decisions.",
    metrics: [["Revenue Tracked", "$12M"], ["Country", "Singapore"], ["Platform", "Web"]],
    detailLead: "A finance and leadership dashboard concept that brings revenue, churn, pipeline, support signals, secure data ingestion, and AI-assisted reporting into one board.",
    stats: [["Revenue Tracked", "$12M"], ["Country", "Singapore"], ["Platform", "Web"], ["AI Layer", "Alerts"]],
    overviewTitle: "Leadership analytics with signals teams can act on.",
    overviewText: [
      "FinSight was shaped for finance and leadership teams that need a single view across revenue, churn, sales pipeline, and support signals. The dashboard concept turns scattered metrics into a clearer decision workflow.",
      "AI-assisted reports and anomaly alerts help leaders spot changes sooner, explain what is happening, and decide what to inspect next.",
    ],
    focus: [
      ["Challenge", "Signals spread across teams", "Finance and leadership teams needed a clearer way to interpret revenue, churn, pipeline, and support health together."],
      ["Solution", "Secure analytics board", "The concept combines data ingestion, metric modeling, AI report drafting, anomaly alerts, and executive dashboard views."],
      ["Outcome", "Faster decision cycles", "Leaders can review priority signals, understand trend movement, and move from dashboard review to action planning faster."],
    ],
    scopeTitle: "A decision dashboard that turns scattered metrics into a leadership workflow.",
    scope: [
      ["01", "Data ingestion", "Revenue, CRM, support, and product signals are modeled into a clean dashboard-ready data layer."],
      ["02", "Metric modeling", "Churn, pipeline, margin, support pressure, and forecast metrics are shaped around how leaders review performance."],
      ["03", "Executive views", "Dashboards prioritize concise comparisons, trend movement, drilldowns, and board-ready summaries."],
      ["04", "Alert rules", "Teams can define thresholds, anomaly triggers, and ownership for follow-up when metrics shift."],
    ],
    aiTitle: "AI that explains business signals in plain language.",
    aiText: "The AI layer helps leaders understand what changed, why it may matter, and which data points deserve attention. It supports decision review instead of replacing the dashboard with vague generated text.",
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

const techGroups = [
  ["Frontend", [["tech-react.svg", "React"], ["tech-nextjs.svg", "Next.js"], ["tech-typescript.svg", "TypeScript"], ["tech-tailwindcss.svg", "Tailwind CSS"]]],
  ["Backend", [["tech-nodejs.svg", "Node.js"], ["tech-nestjs.svg", "NestJS"], ["tech-python.svg", "Python"], ["tech-postgresql.svg", "PostgreSQL"]]],
  ["Mobile", [["tech-react-native.svg", "React Native"], ["tech-flutter.svg", "Flutter"], ["tech-swift.svg", "Swift"], ["tech-kotlin.svg", "Kotlin"]]],
  ["Cloud", [["tech-aws.svg", "AWS"], ["tech-azure.svg", "Azure"], ["tech-docker.svg", "Docker"], ["tech-kubernetes.svg", "Kubernetes"]]],
  ["Automation", [["tech-zapier.svg", "Zapier"], ["tech-make.svg", "Make"], ["tech-n8n.svg", "n8n"], ["tech-slack.svg", "Slack API"]]],
  ["Data & AI", [["tech-openai.svg", "OpenAI"], ["tech-langchain.svg", "LangChain"], ["tech-bigquery.svg", "BigQuery"], ["tech-powerbi.svg", "Power BI"]]],
];

const homeMeta = {
  title: "CyphronTech | Software Development Agency",
  description: "CyphronTech builds scalable websites, mobile apps, AI automation systems, and cloud platforms for growing companies.",
};

const servicePageTitles = {
  web: "Web Platform Development | CyphronTech",
  mobile: "Mobile App Development | CyphronTech",
  ai: "AI Automation Services | CyphronTech",
  cloud: "Cloud Engineering | CyphronTech",
  ux: "UI/UX Design | CyphronTech",
};

const serviceByFile = new Map(services.map((service) => [service.file, service]));
const caseByFile = new Map(caseStudies.map((study) => [study.file, study]));

function getRoute() {
  const file = window.location.pathname.split("/").filter(Boolean).pop() || "index.html";

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
        description: service.detailLead,
      },
    };
  }

  if (caseByFile.has(file)) {
    const study = caseByFile.get(file);
    return {
      type: "case",
      study,
      meta: {
        title: `${study.title} Case Study | CyphronTech`,
        description: study.detailLead,
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
      href: "index.html#top",
      "aria-label": "CyphronTech home",
    },
    h("img", { src: "assets/logo-mark.png", alt: "", className: "brand__mark" }),
    h("span", { className: "brand__name" }, "Cyphron", h("span", null, "Tech")),
  );
}

function Header({ route }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const onHome = route.type === "home";
  const linkPrefix = onHome ? "" : "index.html";
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
    const updateHeader = () => setIsScrolled(window.scrollY > 10);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return h(
    "header",
    { className: cx("site-header", isScrolled && "is-scrolled"), "data-header": true },
    h(
      "nav",
      { className: "nav", "aria-label": "Primary navigation" },
      h(Brand, null),
      h(
        "button",
        {
          className: "nav-toggle",
          type: "button",
          "aria-expanded": String(isOpen),
          "aria-controls": "primary-menu",
          "data-menu-toggle": true,
          onClick: () => setIsOpen((value) => !value),
        },
        h("span", { className: "nav-toggle__icon", "aria-hidden": "true" }),
        h("span", { className: "sr-only" }, "Open navigation"),
      ),
      h(
        "div",
        { className: cx("nav-menu", isOpen && "is-open"), id: "primary-menu", "data-menu": true },
        links.map(([label, href]) => h("a", { key: href, href: `${linkPrefix}${href}`, onClick: () => setIsOpen(false) }, label)),
      ),
    ),
  );
}

function Footer() {
  return h(
    "footer",
    { className: "footer" },
    h(Brand, { footer: true }),
    h("p", null, "Building the future with code, AI automation, and innovation."),
    h("a", { href: `mailto:${SITE_EMAIL}` }, SITE_EMAIL),
  );
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
      h("p", { className: "eyebrow" }, "Software development agency"),
      h("h1", { id: "hero-title" }, "CyphronTech"),
      h("p", { className: "hero__lead" }, "We design and engineer secure web platforms, mobile apps, AI automation workflows, and cloud systems that help modern teams move faster."),
      h(
        "div",
        { className: "hero__actions", "aria-label": "Primary actions" },
        h("a", { className: "button button--primary", href: "#contact" }, h("span", { className: "button__icon button__icon--arrow", "aria-hidden": "true" }), "Start a Project"),
        h("a", { className: "button button--ghost", href: "#work" }, "Case Studies"),
      ),
      h(
        "dl",
        { className: "hero__stats", "aria-label": "Agency metrics" },
        [["50+", "Projects shipped"], ["20+", "Active clients"], ["99%", "Delivery approval"]].map(([value, label]) =>
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
      [...services, extraServiceCard].map((service) =>
        h(
          "article",
          { className: "service-card", key: service.title },
          h("img", { className: "service-card__image", src: service.image, alt: service.alt, loading: "lazy", decoding: "async" }),
          h("h3", null, service.title),
          h("p", null, service.summary),
          service.file ? h("a", { className: "service-card__link", href: service.file }, "Explore service") : null,
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
        h("h2", { id: "ai-approach-title" }, "AI That Solves Real Problems"),
        h("p", { className: "ai-approach__statement" }, "AI Built for Business, Not Buzzwords."),
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
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      h("div", { className: "case-studies__head" }, h("p", { className: "eyebrow" }, "Case studies"), h("h2", { id: "work-title" }, "AI-ready builds for modern digital teams")),
      h(
        "div",
        { className: "carousel-controls", "aria-label": "Case study carousel controls" },
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
            { className: "case-card", key: study.slug, "aria-hidden": String(!active), "data-carousel-slide": true },
            h(
              "div",
              { className: "case-card__copy" },
              h("h3", null, study.title),
              h("p", null, study.teaser),
              h(
                "div",
                { className: "case-metrics", "aria-label": `${study.title} project details` },
                study.metrics.map(([label, value]) => h("span", { key: label }, h("strong", null, label), " ", value)),
              ),
              h("a", { className: "case-cta", href: study.file, tabIndex: active ? undefined : -1 }, "View Case Study"),
            ),
            h("div", { className: "case-card__visual" }, h("img", { className: "case-card__mockup", src: study.image, alt: study.alt, loading: "lazy", decoding: "async" })),
          );
        }),
      ),
    ),
    h(
      "div",
      { className: "carousel-dots", "aria-label": "Case study slides", "data-carousel-dots": true },
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
      h("p", { className: "eyebrow" }, "Tech stack"),
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
            tags.map(([icon, label]) => h("div", { className: "tech-tag", key: label }, h("img", { src: `assets/tech-logos/${icon}`, alt: "", loading: "lazy", decoding: "async" }), h("span", null, label))),
          ),
        ),
      ),
    ),
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
    h("div", { className: "visual-language" }, h("img", { src: "assets/visual-language.jpg", alt: "Technical visual language showing architecture, code, and interface references", loading: "lazy", decoding: "async" }), h("p", null, "Clean, modern, technical, human. The brand system balances precision with trust so the site feels credible without becoming cold.")),
  );
}

function FaqSection() {
  const faqs = [
    ["How long does a typical software project take?", "Most focused builds take 4 to 10 weeks, depending on scope, integrations, content readiness, and review speed. Larger platforms are planned in phases."],
    ["Can you work with our existing codebase?", "Yes. We usually begin with a technical audit, then define the safest path for fixes, new features, modernization, or handover."],
    ["Do you provide design as well as development?", "Yes. We can create product UX, interface design, component systems, and production implementation in one delivery workflow."],
    ["What happens after launch?", "We can stay involved for monitoring, improvements, security updates, performance tuning, documentation, and support retainers."],
    ["Can you build automation and AI features?", "Yes. We build practical automation around real operations, including internal tools, workflow bots, AI-assisted review, reporting, and data pipelines."],
  ];

  return h(
    "section",
    { className: "section section--light faq", id: "faq", "aria-labelledby": "faq-title" },
    h("div", { className: "section__head" }, h("p", { className: "eyebrow" }, "FAQ"), h("h2", { id: "faq-title" }, "Common questions before a build starts")),
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
      h("p", { className: "eyebrow" }, "Contact"),
      h("h2", { id: "contact-title" }, "Build the next version of your business software"),
      h("p", null, "Share what you need to launch, automate with AI, or improve. We will map the technical path and next steps."),
      h("div", { className: "contact-meta" }, h("a", { href: `mailto:${SITE_EMAIL}` }, SITE_EMAIL), h("span", null, "cyphrontech.com")),
    ),
    h(ContactForm, null),
  );
}

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: "", tone: "neutral" });
  const [emailDraftUrl, setEmailDraftUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let payload;

    setIsSubmitting(true);
    setEmailDraftUrl("");
    setFormStatus({ message: "Sending your message...", tone: "neutral" });

    try {
      payload = getContactPayload(form);

      if (!payload) {
        form.reset();
        setFormStatus({ message: "Message sent. We will get back to you soon.", tone: "success" });
        return;
      }

      const contactService = await getContactService();
      const submissionRef = await contactService.addSubmission(payload);
      console.info("Contact submission saved", { path: submissionRef.path });
      form.reset();
      setFormStatus({ message: "Message sent. We will get back to you soon.", tone: "success" });
    } catch (error) {
      console.error("Contact form submission failed", error);
      const mailtoUrl = payload ? buildMailtoUrl(payload) : `mailto:${SITE_EMAIL}`;
      const message = error?.message === "firebase-not-configured" || error?.message === "app-check-not-configured"
        ? `Contact form is not configured yet. Open an email draft to ${SITE_EMAIL}.`
        : `Could not save to Firebase. Open an email draft to ${SITE_EMAIL}.`;

      setEmailDraftUrl(mailtoUrl);
      if (payload) {
        window.location.href = mailtoUrl;
      }
      setFormStatus({ message, tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return h(
    "form",
    { className: "contact-form", action: `mailto:${SITE_EMAIL}`, method: "post", encType: "text/plain", "data-contact-form": true, onSubmit: handleSubmit, "aria-busy": String(isSubmitting) },
    h("label", null, h("span", null, "Name"), h("input", { type: "text", name: "name", autoComplete: "name", maxLength: 80, required: true })),
    h("label", null, h("span", null, "Email"), h("input", { type: "email", name: "email", autoComplete: "email", maxLength: 120, required: true })),
    h(
      "label",
      null,
      h("span", null, "Project type"),
      h("select", { name: "project", required: true }, h("option", { value: "" }, "Select one"), CONTACT_PROJECT_OPTIONS.map((option) => h("option", { key: option }, option))),
    ),
    h("label", null, h("span", null, "Brief"), h("textarea", { name: "brief", rows: 5, maxLength: 2000, placeholder: "What are you trying to build or improve?", required: true })),
    h("label", { className: "form-honeypot", "aria-hidden": "true" }, h("span", null, "Company website"), h("input", { type: "text", name: "company_website", autoComplete: "off", tabIndex: -1 })),
    h("button", { className: "button button--primary", type: "submit", disabled: isSubmitting }, isSubmitting ? "Sending Message" : "Send Message"),
    h(
      "p",
      { className: cx("form-status", formStatus.tone === "success" && "is-success", formStatus.tone === "error" && "is-error"), role: "status", "aria-live": "polite", "data-form-status": true },
      formStatus.message,
      emailDraftUrl ? [" ", h("a", { key: "email-draft", href: emailDraftUrl }, "Open email draft")] : null,
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
        h("p", { className: "eyebrow" }, service.eyebrow),
        h("h1", null, service.detailTitle),
        h("p", { className: "service-detail-hero__lead" }, service.detailLead),
        h("div", { className: "service-detail-hero__actions" }, h("a", { className: "button button--primary", href: "index.html#contact" }, service.cta), h("a", { className: "button button--ghost", href: "index.html#services" }, "All Services")),
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
        h("p", { className: "eyebrow" }, "Case study"),
        h("h1", null, study.title),
        h("p", { className: "case-detail-hero__lead" }, study.detailLead),
        h("div", { className: "case-detail-hero__actions" }, h("a", { className: "button button--primary", href: "index.html#contact" }, "Build Something Similar"), h("a", { className: "button button--ghost", href: "index.html#work" }, "All Case Studies")),
      ),
    ),
    h(
      "section",
      { className: "case-detail" },
      h("div", { className: "case-detail__stats", "aria-label": `${study.title} case metrics` }, study.stats.map(([label, value]) => h("div", { key: label }, h("span", null, label), h("strong", null, value)))),
      h(
        "div",
        { className: "case-detail__overview" },
        h("div", null, h("p", { className: "eyebrow" }, "Overview"), h("h2", null, study.overviewTitle), study.overviewText.map((paragraph) => h("p", { key: paragraph }, paragraph))),
        h("div", { className: "case-detail__image" }, h("img", { src: study.image, alt: study.alt, loading: "lazy", decoding: "async" })),
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
      h("div", { className: "case-detail__cta" }, h("div", null, h("h2", null, study.ctaTitle), h("p", null, study.ctaText)), h("a", { className: "button button--primary", href: "index.html#contact" }, "Start a Project")),
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
    h("div", { className: "not-found__actions" }, h("a", { className: "button button--primary", href: "index.html#top" }, "Back Home"), h("a", { className: "button button--ghost", href: "index.html#contact" }, "Contact")),
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
    `Page: ${payload.page}`,
    "",
    "Brief:",
    payload.brief,
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
    page: `${window.location.origin}${window.location.pathname}`.slice(0, 300),
    source: "website-contact-form",
    status: "new",
  };

  if (!payload.name || !payload.email || !CONTACT_PROJECT_OPTIONS.includes(payload.project) || !payload.brief) {
    throw new Error("missing-fields");
  }

  return payload;
}

function hasFirebaseConfig(config) {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
  return requiredKeys.every((key) => typeof config?.[key] === "string" && config[key].trim());
}

async function getContactService() {
  if (!contactServicePromise) {
    contactServicePromise = (async () => {
      const { firebaseConfig, contactFormSettings } = window.cyphronContactFirebase || {};

      if (!contactFormSettings?.enabled || !hasFirebaseConfig(firebaseConfig)) {
        throw new Error("firebase-not-configured");
      }

      const [{ initializeApp }, firestoreModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`),
      ]);

      const app = initializeApp(firebaseConfig);

      if (!contactFormSettings.appCheck?.enabled || !contactFormSettings.appCheck.siteKey) {
        throw new Error("app-check-not-configured");
      }

      const { initializeAppCheck, ReCaptchaV3Provider } = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-check.js`);
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(contactFormSettings.appCheck.siteKey),
        isTokenAutoRefreshEnabled: true,
      });

      const db = firestoreModule.getFirestore(app);
      const collectionName = contactFormSettings.collectionName || "contactSubmissions";

      return {
        addSubmission: (payload) => firestoreModule.addDoc(firestoreModule.collection(db, collectionName), {
          ...payload,
          createdAt: firestoreModule.serverTimestamp(),
        }),
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

function App() {
  const route = useMemo(getRoute, []);
  usePageSetup(route);

  let page;

  if (route.type === "service") {
    page = h(ServiceDetailPage, { service: route.service });
  } else if (route.type === "case") {
    page = h(CaseDetailPage, { study: route.study });
  } else if (route.type === "not-found") {
    page = h(NotFoundPage, null);
  } else {
    page = h(HomePage, null);
  }

  return h(
    React.Fragment,
    null,
    h("a", { className: "skip-link", href: "#main" }, "Skip to content"),
    h(Header, { route }),
    h("main", { id: "main" }, page),
    h(Footer, null),
  );
}

createRoot(document.getElementById("root")).render(h(App, null));
