// Content for the legal pages. Block types inside `body`:
//   "text"                      -> paragraph ([label](url) becomes a link)
//   ["a", "b"]                  -> bullet list
//   { table: { head, rows } }   -> table
//
// These are plain-language drafts prepared for Cyphrontech LLP. Have the
// business owner and, ideally, a lawyer confirm them before relying on them
// (see COMPLIANCE.md).

import { SITE, pagePath } from "./site-config.mjs";

const detailList = (items) => items.filter(Boolean);

const businessDetails = detailList([
  `Legal name: ${SITE.legalName}`,
  SITE.registrationNumber && `LLPIN: ${SITE.registrationNumber}`,
  SITE.gstin && `GSTIN: ${SITE.gstin}`,
  SITE.registeredAddress && `Registered office: ${SITE.registeredAddress}`,
  `Email: ${SITE.email}`,
  `Phone: ${SITE.phoneDisplay}`,
  `Website: ${SITE.url}`,
]);

const grievanceLine = `Grievance Officer${SITE.grievanceOfficer.name ? `: ${SITE.grievanceOfficer.name}` : ""}, ${SITE.legalName}, email ${SITE.grievanceOfficer.email}. We acknowledge complaints within 3 working days and aim to resolve them within 30 days.`;

const privacy = {
  file: "privacy-policy.html",
  title: "Privacy Policy",
  description: `How ${SITE.legalName} collects, uses, stores and protects personal data submitted through ${SITE.url}.`,
  intro: `This policy explains what personal data ${SITE.legalName} (“${SITE.brand}”, “we”, “us”) collects through this website, why we collect it, how long we keep it and what choices you have. We keep it short because we collect very little.`,
  sections: [
    {
      id: "who-we-are",
      heading: "Who we are",
      body: [
        `${SITE.legalName} decides why and how your personal data is used (the “data fiduciary” under India's Digital Personal Data Protection Act, 2023, and the “controller” under the GDPR).`,
        businessDetails,
      ],
    },
    {
      id: "what-we-collect",
      heading: "What we collect",
      body: [
        "We only collect what you choose to send us:",
        [
          "Contact form: your name, email address, project type and the message you write. We also keep a record of your consent (that you agreed to this policy and confirmed you are 18 or older), the policy version and the time you submitted the form.",
          "Privacy request form: your name, email address, the type of request and any details you add.",
          "Direct contact: if you email, call or message us on LinkedIn, whatever you tell us.",
          "Technical data: our hosting provider (Google Firebase Hosting) processes your IP address and standard request logs to deliver the site and keep it secure. We do not use analytics, advertising cookies, tracking pixels or fingerprinting, and we do not build visitor profiles.",
        ],
        "We do not ask for payment card details, government ID numbers, health, financial or other sensitive information through this website. Please do not include them in your message.",
      ],
    },
    {
      id: "why-we-use-it",
      heading: "Why we use it",
      body: [
        {
          table: {
            head: ["Purpose", "Lawful basis"],
            rows: [
              ["Reply to your enquiry and prepare a proposal", "Your consent, and steps you ask us to take before a contract"],
              ["Protect the contact form from spam and abuse (Google reCAPTCHA, only if you allow it)", "Your consent"],
              ["Keep records of consent and privacy requests", "Legal obligation and our legitimate interest in proving we honoured your choices"],
              ["Handle disputes, tax and accounting", "Legal obligation"],
            ],
          },
        },
        "We do not use your data for advertising, we do not sell it and we do not make automated decisions about you.",
      ],
    },
    {
      id: "who-we-share-with",
      heading: "Who we share it with",
      body: [
        "We share personal data only with service providers that help us run the site and answer you, and only for that purpose:",
        [
          "Google (Firebase Hosting, Cloud Firestore, Firebase App Check and reCAPTCHA): serves this website and stores the messages you submit through our forms.",
          "Google Workspace / Gmail: the mailbox we use to reply to you.",
        ],
        "The LinkedIn link on this site is a normal link. We do not embed LinkedIn scripts, so LinkedIn learns nothing about you unless you click it and then LinkedIn's own policy applies.",
        "We may disclose data if a law, court order or government authority requires it, or to protect our legal rights.",
      ],
    },
    {
      id: "transfers",
      heading: "Transfers outside your country",
      body: [
        "Our providers may process data in countries other than your own, including outside India. We rely on the safeguards those providers offer, such as contractual data-protection terms, and on the transfer rules that apply to us.",
      ],
    },
    {
      id: "retention",
      heading: "How long we keep it",
      body: [
        [
          "Enquiries that do not lead to a project: up to 12 months after our last reply, then deleted.",
          "If we work together: for the duration of the engagement and afterwards for as long as law requires for tax, accounting and dispute purposes.",
          "Privacy requests and the records of how we handled them: up to 3 years.",
          "Your cookie choice in your browser: up to 12 months, then we ask again.",
        ],
        "You can ask us to delete your data sooner at any time (see Your rights).",
      ],
    },
    {
      id: "security",
      heading: "How we protect it",
      body: [
        "The site is served over HTTPS with security headers. Our forms can only add entries to the database; the public cannot read, change or delete them. Access to submissions is limited to people at CyphronTech who need it to respond. No system is perfectly secure, and if a breach affects your data we will tell you and the authorities as the law requires.",
      ],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      body: [
        "You can ask us to:",
        [
          "give you a copy of the personal data we hold about you and how it is used;",
          "correct or complete data that is wrong;",
          "delete your data;",
          "withdraw your consent at any time (withdrawing does not affect what we did before);",
          "nominate someone to exercise your rights if you cannot (India);",
          "restrict or object to our use of your data, or receive it in a portable format (EU/UK visitors).",
        ],
        "Use the [privacy request form](/privacy-request) or email us. We may need to confirm it is really you before acting. We aim to reply within 30 days, and we will not charge a fee for reasonable requests.",
        `If you are unhappy with our answer, contact our Grievance Officer first. You may also complain to the Data Protection Board of India or, if you are in the EU or UK, to your local data protection authority. ${grievanceLine}`,
      ],
    },
    {
      id: "children",
      heading: "Children",
      body: [
        `Our services are for businesses and adults. This website is not directed at anyone under 18, and the contact form asks you to confirm you are 18 or older. We do not knowingly collect personal data from children. If you believe a child has sent us data, tell us and we will delete it. We would need verifiable parental consent before processing a child's data as the law requires.`,
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and similar technologies",
      body: [
        "We use one browser storage item that is strictly necessary (your cookie choice) and, only if you allow it, Google reCAPTCHA for spam protection. Details and controls are in our [Cookie Policy](/cookie-policy). You can change your choice at any time from “Cookie settings” in the footer.",
      ],
    },
    {
      id: "emails",
      heading: "Emails and unsubscribing",
      body: [
        "We do not send newsletters or marketing emails, and using the contact form does not sign you up to any list. We reply to you one-to-one. If we ever start a mailing list we will ask for your separate opt-in first, and every message will carry a working unsubscribe link and our contact details.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: [
        `We will update this page when our practices change and change the date at the top. Material changes will be highlighted on the site. Current version: ${SITE.policyVersion}.`,
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      body: [businessDetails, grievanceLine],
    },
  ],
};

const terms = {
  file: "terms-of-service.html",
  title: "Terms of Service",
  description: `The terms that apply when you use ${SITE.url} and enquire about ${SITE.brand} services: pricing, payments, IP, liability and governing law.`,
  intro: `These terms apply to your use of this website and to enquiries you send through it. By using the site you agree to them. If you do not agree, please do not use the site. Work we do for you is governed by a separate written proposal or agreement.`,
  sections: [
    {
      id: "about",
      heading: "About us and these terms",
      body: [
        `This website is operated by ${SITE.legalName} (“${SITE.brand}”, “we”, “us”). You must be at least 18 and, if you write on behalf of a company, authorised to do so.`,
        businessDetails,
      ],
    },
    {
      id: "services",
      heading: "What we offer",
      body: [
        "We design and build websites, mobile apps, AI and automation workflows, cloud systems and product interfaces. This website only describes those services and lets you contact us. It does not create a contract for any work. A project starts only when both sides accept a written proposal, statement of work or agreement, which takes priority over these terms if they conflict.",
      ],
    },
    {
      id: "pricing",
      heading: "Pricing, taxes and payments",
      body: [
        [
          "Enquiries and initial conversations are free.",
          "We give you fees, applicable taxes (such as GST), the payment schedule and any third-party costs (for example cloud hosting, licences, domains or API usage) in writing before work starts.",
          "Changes to scope are agreed in writing, with an estimate, before we do the extra work.",
          "This website does not take payments and never asks for card or bank details.",
        ],
        "Refunds and cancellations are covered in our [Refund Policy](/refund-policy).",
      ],
    },
    {
      id: "concepts",
      heading: "Concept case studies and general information",
      body: [
        "OrbitCart and FlowDesk in our case studies are working products built by CyphronTech that are not yet live. The other case studies are illustrative concepts created to show how we approach problems. None of them show real-world usage or client results. Some illustrations and mockup images on this site were created or assisted by AI image tools or design software. They are illustrative and are not photographs of real products, people or clients. Other content is general information and is not professional, legal, medical or financial advice. We do not promise any particular business result.",
      ],
    },
    {
      id: "use",
      heading: "Using the website",
      body: [
        "Please do not:",
        [
          "break the law or infringe anyone's rights through the site;",
          "try to gain unauthorised access, probe or disrupt the site or its forms;",
          "submit false, misleading or someone else's personal information;",
          "use automated tools to send messages through our forms.",
        ],
      ],
    },
    {
      id: "ip",
      heading: "Intellectual property",
      body: [
        `The website, its text, design, code and the ${SITE.brand} name and logo belong to ${SITE.legalName} or its licensors. You may view and share links to the site, but may not copy or reuse its content without written permission. Other companies' names and logos, such as those in our technology list, belong to their owners and appear only to identify the technologies we work with. It does not mean they endorse us. Ownership of deliverables we build for you is set out in your project agreement.`,
      ],
    },
    {
      id: "ai",
      heading: "AI-assisted work",
      body: [
        "Where our work includes AI features, AI output can be wrong or incomplete and should be reviewed by a person before you rely on it for important decisions.",
      ],
    },
    {
      id: "confidentiality",
      heading: "Confidentiality",
      body: [
        "We treat what you tell us in an enquiry as confidential and use it only to respond. If you want a formal non-disclosure agreement before sharing details, say so and we will sign one.",
      ],
    },
    {
      id: "liability",
      heading: "Disclaimers and liability",
      body: [
        "The website is provided “as is” and we try to keep it accurate and available, but we cannot promise it will be error-free or uninterrupted. To the extent the law allows, we are not liable for indirect or consequential loss arising from your use of the website. Liability for project work is set out in your project agreement. Nothing in these terms limits liability that cannot legally be limited, or your rights as a consumer where they apply.",
      ],
    },
    {
      id: "links",
      heading: "Links to other sites",
      body: [
        "We link to third-party sites such as LinkedIn. We do not control them and are not responsible for their content or practices.",
      ],
    },
    {
      id: "privacy",
      heading: "Privacy and cookies",
      body: [
        "How we handle personal data is described in our [Privacy Policy](/privacy-policy) and [Cookie Policy](/cookie-policy).",
      ],
    },
    {
      id: "law",
      heading: "Governing law and disputes",
      body: [
        `These terms are governed by the laws of ${SITE.governingCountry}. If there is a problem, please write to us first so we can try to resolve it in good faith. If it cannot be resolved, the courts of ${SITE.governingCountry} with jurisdiction will decide it, unless your project agreement says otherwise. Mandatory consumer protections that apply where you live are not affected.`,
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: [
        `We may update these terms. The date at the top shows the latest version. Continued use of the site after a change means you accept the updated terms. Current version: ${SITE.policyVersion}.`,
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      body: [businessDetails, grievanceLine],
    },
  ],
};

const refund = {
  file: "refund-policy.html",
  title: "Refund Policy",
  description: `When and how ${SITE.legalName} refunds fees for software development services: cancelling before and after work starts, defects, support plans and how to ask.`,
  intro: `This policy explains how refunds and cancellations work for services we provide. This website does not take payments; fees are agreed in a written proposal and paid by invoice.`,
  sections: [
    {
      id: "scope",
      heading: "Scope",
      body: [
        "This policy applies to fees you pay to us for design, development, automation, cloud and support services. If your signed proposal or agreement says something different, that document applies to the extent it differs. Your legal rights are not affected.",
      ],
    },
    {
      id: "before-start",
      heading: "Cancelling before work starts",
      body: [
        "If you cancel in writing before the project kickoff, we refund any advance you paid in full. The only deduction we may make is bank or payment-gateway charges that the processor does not return to us, and we will tell you the exact amount before we refund.",
      ],
    },
    {
      id: "after-start",
      heading: "Cancelling after work has started",
      body: [
        "Projects are billed in milestones listed in your proposal.",
        [
          "Milestones we have delivered and you have accepted are not refundable.",
          "Milestones we have not started are refunded in full.",
          "For a milestone in progress, we refund the part not yet performed, calculated fairly from the milestone breakdown in the proposal, and we show you the working.",
          "Third-party costs we paid for you with your prior approval (for example licences or domain registrations) that cannot be cancelled are not refundable. They are listed in your proposal in advance, so there are no surprises.",
        ],
      ],
    },
    {
      id: "defects",
      heading: "Problems with delivered work",
      body: [
        "If something we delivered does not meet the acceptance criteria agreed in writing, tell us within 30 days of delivery. We will fix it at no extra charge. If we cannot fix it within a reasonable time, we will refund the fees for the affected deliverable.",
      ],
    },
    {
      id: "retainers",
      heading: "Support and retainer plans",
      body: [
        "You can cancel a support or retainer plan with 30 days' written notice. We refund any prepaid period that remains unused after the notice period ends, calculated by whole unused months. Time already used is not refundable.",
      ],
    },
    {
      id: "not-refundable",
      heading: "What is not refundable",
      body: [
        [
          "Work you approved and accepted, or that has gone live.",
          "Additional work you requested through an agreed change request and that we have performed.",
          "Fees for delays caused by information, approvals or access that were not provided on time.",
        ],
      ],
    },
    {
      id: "how-to-request",
      heading: "How to ask for a refund",
      body: [
        `Email ${SITE.email} with your project name, the invoice number and the reason. We reply within 5 working days. Approved refunds are paid to the original payment method within 7 working days. Where GST was charged, we issue a credit note and refund the tax on the refunded amount.`,
      ],
    },
    {
      id: "disputes",
      heading: "If you disagree",
      body: [
        `Ask for the decision to be reviewed by our Grievance Officer. ${grievanceLine} If it is still unresolved, the governing law and dispute steps in our [Terms of Service](/terms-of-service) apply.`,
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      body: [businessDetails],
    },
  ],
};

const cookies = {
  file: "cookie-policy.html",
  title: "Cookie Policy",
  description: `The cookie choice and optional Google reCAPTCHA cookie ${SITE.url} uses, what each is for, how long it lasts, and how to accept or decline.`,
  intro: "Cookies and similar technologies are small items stored in your browser. This site uses very few. This page lists each one so you can decide.",
  sections: [
    {
      id: "what-we-use",
      heading: "What we use",
      body: [
        {
          table: {
            head: ["Name / provider", "Purpose", "Type", "Duration"],
            rows: [
              ["cyphron_consent_v1 (this site, browser storage)", "Remembers your cookie choice so we do not keep asking", "Strictly necessary", "Up to 12 months"],
              ["Google reCAPTCHA via Firebase App Check (Google LLC)", "Spam and abuse protection when you send a form. Google may set a cookie such as _GRECAPTCHA on google.com and App Check may keep a token in your browser's IndexedDB", "Optional: loaded only if you allow it, and only when you send a form", "Up to 6 months"],
            ],
          },
        },
        "We do not use analytics, advertising, social-media or tracking cookies, and we do not load third-party fonts or tracking scripts.",
      ],
    },
    {
      id: "your-choices",
      heading: "Your choices",
      body: [
        [
          "When you first visit, a small notice lets you accept or decline the optional item with equal ease.",
          "Change your mind at any time with “Cookie settings” in the footer of every page.",
          "You can also delete cookies and site data in your browser settings.",
        ],
        "If you reject the optional item you can still contact us: tick the optional spam-protection box on a form if you change your mind, use the email draft the form offers, or email or phone us directly. Nothing else on the site depends on it.",
      ],
    },
    {
      id: "google",
      heading: "Google's role",
      body: [
        "If you allow it, Google reCAPTCHA analyses the interaction with the form to tell people from bots. Google's [Privacy Policy](https://policies.google.com/privacy) and [Terms of Service](https://policies.google.com/terms) apply to that check.",
      ],
    },
    {
      id: "more",
      heading: "More information",
      body: [
        `See our [Privacy Policy](/privacy-policy) for how we handle personal data, or contact us at ${SITE.email}.`,
      ],
    },
  ],
};

const accessibility = {
  file: "accessibility.html",
  eyebrow: "Accessibility",
  title: "Accessibility Statement",
  description: `How ${SITE.brand} works to make ${SITE.url} usable by everyone, known limitations, and how to report a problem.`,
  intro: `${SITE.legalName} wants everyone to be able to use this website, including people who use screen readers, keyboards, magnification or other assistive technology. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.`,
  sections: [
    {
      id: "what-we-do",
      heading: "What we have done",
      body: [
        [
          "Every page has a “Skip to content” link and can be used with a keyboard alone, with a clearly visible focus outline.",
          "Text and interface colours were checked against WCAG contrast ratios.",
          "Images that carry information have text alternatives; decorative images are hidden from screen readers.",
          "Form fields have visible labels, and errors are shown next to the field and announced to screen readers.",
          "The mobile menu and the cookie choices banner work with a keyboard, and the Escape key closes the menu.",
          "Animation and automatic movement are reduced or switched off if your device asks for reduced motion.",
          "Layouts adapt to phones, tablets and desktops.",
        ],
      ],
    },
    {
      id: "known-limitations",
      heading: "Known limitations",
      body: [
        [
          "The case-study carousel on the home page moves to the next slide every few seconds. It pauses while you hover over it or while keyboard focus is inside it, and it does not move at all if you have reduced motion turned on. You can also use the previous and next buttons or the slide dots to control it, or open each case study directly from the list of pages.",
          "If Google reCAPTCHA (spam protection) shows a challenge, that challenge is provided by Google and we do not control its accessibility. If you prefer, use the email link or phone number instead of the form.",
        ],
      ],
    },
    {
      id: "how-we-test",
      heading: "How we test",
      body: [
        `We ran automated checks with the axe-core testing engine across every page of this site and tested key journeys, such as the navigation, the contact form and the cookie choices, by keyboard. This is our own assessment. The site has not yet been audited by an independent accessibility specialist. This statement was last reviewed on ${SITE.policiesUpdated}.`,
      ],
    },
    {
      id: "feedback",
      heading: "Tell us about a problem",
      body: [
        `If something on this site is hard to use, or you need information in another format, please tell us at ${SITE.email} or on ${SITE.phoneDisplay}. Say which page you were on and what happened. We aim to reply within 5 working days and to fix problems as quickly as we reasonably can.`,
        grievanceLine,
      ],
    },
  ],
};

export const legalPages = { privacy, terms, refund, cookies, accessibility };
export const legalByFile = new Map(Object.values(legalPages).map((page) => [page.file, page]));
export const legalLinks = [
  ["Privacy", pagePath(privacy.file)],
  ["Terms", pagePath(terms.file)],
  ["Refunds", pagePath(refund.file)],
  ["Cookies", pagePath(cookies.file)],
  ["Accessibility", pagePath(accessibility.file)],
  ["Data requests", "/privacy-request"],
];
