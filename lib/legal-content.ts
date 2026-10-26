import { close } from "./home-content";

// Draft legal copy. Have a lawyer review it before launch; the entity name, address and governing law are placeholders to confirm.
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

const contact = close.email;

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy policy",
  description:
    "How Verbo Brands collects, uses and protects personal data when you visit verbobrands.com or get in touch with us.",
  updated: "October 26, 2026",
  intro:
    "Verbo Brands (\"Verbo\", \"we\") is a boutique branding consultancy based in Bogotá, Colombia. This policy explains what personal data we handle through verbobrands.com and why.",
  sections: [
    {
      heading: "Who is responsible",
      paragraphs: [
        `Verbo Brands is the controller of the personal data described here. You can reach us at ${contact}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: ["We keep data collection to a minimum."],
      list: [
        "Messages you send us by email or WhatsApp: your name, contact details and anything you choose to share about your project.",
        "Usage data from Google Analytics 4, only if you accept analytics cookies: pages viewed, approximate location, device and browser type, and referral source.",
        "Basic technical logs kept by our hosting provider, such as IP address and request time, used for security and reliability.",
      ],
    },
    {
      heading: "How we use it",
      paragraphs: ["We use personal data to:"],
      list: [
        "reply to your enquiries and, if you hire us, deliver our services;",
        "understand how the site is used and improve it;",
        "keep the site secure and comply with legal obligations.",
      ],
    },
    {
      heading: "Cookies and analytics",
      paragraphs: [
        "The site works without cookies. We use Google Analytics 4 to measure traffic. It sets cookies only after you accept them in the cookie banner. If you reject, analytics cookies are not stored. You can change your choice at any time with the Cookies link in the footer.",
        "We do not use advertising cookies and we do not sell personal data.",
      ],
    },
    {
      heading: "Who we share it with",
      paragraphs: [
        "We share data only with service providers that help us run the site and our work: Google (analytics), Cloudflare (hosting), Sanity (content), and WhatsApp or our email provider when you contact us through them. These providers process data on our behalf and under their own privacy terms. Some of them are located outside Colombia, so your data may be transferred internationally.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep enquiry messages for as long as needed to respond and manage the relationship, and for the period required by law. Analytics data is retained for up to 14 months.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `Under Colombian data protection law (Law 1581 of 2012) and, where it applies, the GDPR, you can ask to access, correct, update or delete your data, and to withdraw consent. Write to ${contact} and we will answer within the legal deadlines. You may also complain to the Superintendence of Industry and Commerce (SIC) in Colombia.`,
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy. The date at the top shows when it last changed.",
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  slug: "terms",
  title: "Terms of use",
  description:
    "The terms that apply when you use verbobrands.com, the website of Verbo Brands.",
  updated: "October 26, 2026",
  intro:
    "These terms apply to your use of verbobrands.com. By using the site you agree to them. If you do not, please do not use the site.",
  sections: [
    {
      heading: "About the site",
      paragraphs: [
        "The site presents the work and services of Verbo Brands, a branding consultancy based in Bogotá, Colombia. Nothing on it is a binding offer. Services are agreed in a separate written proposal or contract.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The site, its design, text, logos and code belong to Verbo Brands. Project images, names and marks shown in our case studies belong to the respective clients and are shown with their permission. You may not copy, modify, distribute or reuse any of it without our written consent, except for personal, non-commercial viewing.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: ["You agree not to:"],
      list: [
        "use the site in a way that is unlawful or harms others;",
        "attempt to disrupt, scrape at scale, or gain unauthorised access to the site or its systems;",
        "misrepresent your identity or affiliation when contacting us.",
      ],
    },
    {
      heading: "Content and accuracy",
      paragraphs: [
        "We work to keep the information on the site accurate and current, but we make no guarantee that it is complete or error free. Case study results describe specific projects and do not promise the same outcome for others.",
      ],
    },
    {
      heading: "Third-party links",
      paragraphs: [
        "The site may link to services we do not control, such as WhatsApp. We are not responsible for their content or practices.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the extent permitted by law, Verbo Brands is not liable for any indirect or consequential loss arising from your use of the site, or for interruptions of the site. The site is provided as it is.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of Colombia. Any dispute will be handled by the competent courts of Bogotá, unless mandatory consumer law says otherwise.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about these terms: ${contact}.`],
    },
  ],
};
