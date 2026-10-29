import { close } from "./home-content";

// Written against Colombia's Ley 1581 de 2012 and Decreto 1074 de 2015 (habeas data), and the GDPR for visitors
// in the EU. It describes the site as built: GA4 behind the consent banner, no forms, no advertising.
// If the site starts collecting anything new (a form, a newsletter, ads), update this copy in the same change.
export type LegalSection = {
  heading: string;
  paragraphs: readonly string[];
  list?: readonly string[];
};

export type LegalDocument = {
  slug: "privacy" | "terms";
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
};

// Verbo is run by a person (persona natural), named here as the data controller.
const controller = "Juliana Cabrera Bonilla, trading as Verbo Brands";
const contact = close.email;
const phone = close.phone;
const updated = "October 29, 2026";

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy policy",
  description:
    "How Verbo Brands handles personal data on verbobrands.com: what we collect, why, which cookies we use, and how to exercise your rights.",
  updated,
  intro:
    "This is the personal data policy of Verbo Brands (\"Verbo\", \"we\"), a branding consultancy in Bogotá, Colombia. It explains what we collect through verbobrands.com, why we collect it, and what you can ask of us. We keep it short because we collect very little.",
  sections: [
    {
      heading: "Who is responsible",
      paragraphs: [
        `${controller} is responsible for the processing of your personal data (responsable del tratamiento under Ley 1581 de 2012, controller under the GDPR).`,
      ],
      list: [
        "Location: Bogotá, Colombia",
        `Email: ${contact}`,
        `Phone and WhatsApp: ${phone}`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "The site has no forms and no user accounts. We only process the following:",
      ],
      list: [
        "What you send us. If you write to us by email or WhatsApp, we receive your name, contact details and whatever you share about your project.",
        "Analytics, only if you accept. If you click Accept in the cookie banner, Google Analytics 4 records which pages you visit, how long you stay, your approximate city and country, your device and browser type, and the site that sent you. Google Analytics 4 does not log or store IP addresses. If you reject or ignore the banner, none of this is collected.",
        "Technical logs. Our hosting provider, Cloudflare, briefly processes your IP address and request details to deliver the site and protect it from attacks.",
      ],
    },
    {
      heading: "Why we use it",
      paragraphs: ["We use personal data only to:"],
      list: [
        "reply to your messages and, if we work together, prepare proposals and deliver our services;",
        "understand, in aggregate, how the site is used, so we can improve it;",
        "keep the site secure and meet our legal obligations.",
      ],
    },
    {
      heading: "Legal basis",
      paragraphs: [
        "Analytics cookies rely on your consent, which you give or refuse in the cookie banner. When you write to us, you authorize us to use your details to reply, and we rely on that request and on our legitimate interest in answering it. Technical logs rely on our legitimate interest in keeping the site running and secure. We never use your data for purposes other than these without asking you first.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "The site works fully without cookies. We use only two kinds of browser storage:",
      ],
      list: [
        "Your cookie choice. We save whether you accepted or rejected analytics in your browser's local storage (as verbo-consent), so the banner does not appear on every visit. It stays on your device and is not sent to us.",
        "Google Analytics cookies, only after you accept: _ga and _ga_<ID>. They tell apart visits from the same browser and expire after 2 years.",
      ],
    },
    {
      heading: "Changing your cookie choice",
      paragraphs: [
        "You can change your choice at any time with the Cookies link in the footer. If you withdraw consent, we stop collecting analytics from that moment. You can also delete cookies in your browser settings, or install Google's opt-out add-on for Google Analytics.",
        "We do not use advertising cookies, we do not build profiles of visitors, and we do not sell or rent personal data.",
      ],
    },
    {
      heading: "Who we share it with",
      paragraphs: [
        "We only share data with the providers that help us run the site and our work. They act on our behalf (encargados del tratamiento) under their own data protection terms:",
      ],
      list: [
        "Google LLC (Google Analytics, and Google Workspace for email);",
        "Cloudflare, Inc. (hosting and security);",
        "Sanity AS (the content system and image delivery for the site);",
        "Meta Platforms, through WhatsApp, if you message us there.",
      ],
    },
    {
      heading: "International transfers",
      paragraphs: [
        "Some of these providers process data in the United States and the European Union. Colombia's Superintendence of Industry and Commerce (SIC) recognizes both as offering an adequate level of protection. For visitors in the EU, transfers to the United States rely on the providers' certification under the EU-US Data Privacy Framework or on standard contractual clauses.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [],
      list: [
        "Messages and project correspondence: while the conversation or the working relationship lasts, and afterwards for as long as tax and commercial law requires.",
        "Google Analytics data: 14 months, after which Google deletes it automatically.",
        "Hosting logs: the short period Cloudflare keeps them for security.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Under Ley 1581 de 2012 you have the right to:",
      ],
      list: [
        "know, update and correct your personal data;",
        "ask for proof of the authorization you gave us;",
        "be told how we have used your data;",
        "withdraw your authorization or ask us to delete your data, when there is no legal or contractual duty to keep it;",
        "access your data free of charge;",
        "file a complaint with the Superintendence of Industry and Commerce (SIC) once you have contacted us first.",
      ],
    },
    {
      heading: "If you are in the European Union",
      paragraphs: [
        "The GDPR also gives you the right to data portability, to object to processing based on legitimate interest, and to restrict processing. You can complain to the data protection authority of the country where you live.",
      ],
    },
    {
      heading: "How to make a request",
      paragraphs: [
        `Write to ${contact} with your name, how to reach you, and what you are asking for. If the request is about data you sent us, include enough detail for us to find it. We answer questions about your data (consultas) within 10 business days, and requests to correct, update or delete it (reclamos) within 15 business days. If we need more time, we will tell you why before the deadline, within the extensions the law allows.`,
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "The site is meant for businesses and professionals. We do not knowingly collect data from anyone under 18. If you think a minor has sent us personal data, write to us and we will delete it.",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "The site is served only over an encrypted connection (HTTPS). We limit who can access messages and accounts, and we use providers with recognized security practices. No system is completely secure, but we work to protect your data against loss, misuse and unauthorized access.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        `This policy is in force from ${updated}. If we change how we handle personal data, we will update this page and the date at the top. If a change affects something you consented to, we will ask again.`,
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  slug: "terms",
  title: "Terms of use",
  description:
    "The terms that apply when you use verbobrands.com, the website of Verbo Brands.",
  updated,
  intro:
    `These terms apply to your use of verbobrands.com, run by ${controller} in Bogotá, Colombia. By using the site you agree to them.`,
  sections: [
    {
      heading: "About the site",
      paragraphs: [
        "The site presents the work and services of Verbo Brands. It is for information only. Nothing on it is a binding offer, a quote or a contract. Any service is agreed in a separate written proposal or contract, and those documents set the scope, price and conditions.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The design, text, code, the Verbo name and logo, and the overall look of the site belong to Verbo Brands and are protected by Colombian copyright and industrial property law (Ley 23 de 1982 and Decisión 486 of the Andean Community).",
        "The names, logos, images and other marks of the brands shown in our case studies belong to their owners. We show them as examples of our work, with permission. Showing them does not give you any right to use them.",
        "You may view the site and share links to it. You may not copy, adapt, sell or republish its content, in whole or in part, without our written permission.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: ["When you use the site, you agree not to:"],
      list: [
        "use it for anything unlawful or harmful to others;",
        "try to break, overload or gain unauthorized access to the site or its systems;",
        "copy its content at scale with automated tools, or use it to train AI models, without our permission;",
        "impersonate someone else when you contact us.",
      ],
    },
    {
      heading: "Accuracy",
      paragraphs: [
        "We keep the site's information accurate and current, but it may contain errors or become outdated. Case studies describe specific projects. They are not a promise that another project will get the same results.",
      ],
    },
    {
      heading: "Links to other sites",
      paragraphs: [
        "The site links to services we do not control, such as WhatsApp or our clients' websites. Their own terms and privacy policies apply there, and we are not responsible for them.",
      ],
    },
    {
      heading: "Availability and liability",
      paragraphs: [
        "We provide the site as it is and may change, pause or remove any part of it at any time. To the extent the law allows, Verbo Brands is not liable for indirect losses, or for losses caused by the site being unavailable, by errors in its content, or by decisions made based on it. Nothing in these terms limits rights you have under Colombian consumer law (Ley 1480 de 2011) or other law that cannot be waived.",
      ],
    },
    {
      heading: "Personal data",
      paragraphs: [
        "How we handle personal data is explained in our privacy policy, which is part of these terms.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "We may update these terms. The version published here, with the date at the top, is the one that applies. If any clause is found invalid, the rest stays in force.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of Colombia. Disputes go to the competent courts of Bogotá, unless the law gives you the right to go elsewhere.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about these terms: ${contact} or ${phone}.`],
    },
  ],
};
