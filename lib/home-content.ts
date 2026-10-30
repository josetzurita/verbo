export const discoveryLabel = "Schedule a free discovery session";
export const viewLabel = "View";

// Targets are ids on the home page, or a path (starts with "/") for another page. #services and #contact are markers placed by the Work stage and the footer.
export const menu = {
  title: "Menu",
  closeLabel: "Close",
  links: [
    { label: "Why us?", target: "#belief" },
    { label: "Work", target: "/work" },
    { label: "Services", target: "#services" },
    { label: "About", target: "#about" },
    { label: "Contact", target: "#contact" },
  ],
  headerWorkLabel: "Our Work",
  selectedWorkLabel: "Selected work",
  allProjectsLabel: "All projects",
  allProjectsHref: "/work",
  whatsappShort: "WhatsApp",
  previousLabel: "Previous project",
  nextLabel: "Next project",
} as const;

export const heroSlogan = ["Strategy", "Brand & Growth"] as const;

export const heroLead =
  "We are a boutique strategic branding consultancy. We build brands from a deep understanding of the business and the people, with discernment, and with soul.";

export const belief = {
  lines: ["Branding isn’t art.", "It’s the most", "important"] as const,
  resting: ["business", "decision a", "company can", "make."] as const,
  frames: [
    { src: "/belief/sequence-1.webp", border: "var(--trail-blue)" },
    { src: "/belief/sequence-2.webp", border: "var(--trail-amber)" },
    { src: "/belief/sequence-3.webp", border: "var(--trail-yellow)" },
  ] as const,
  paragraphs: [
    "In a world where design lives in the visual and strategy lives in spreadsheets, Verbo proposes that the most powerful brand is not imagined.",
    "It is built from a deep understanding of a business, its people, and its potential.",
    "Because when thoroughness and beauty meet, brands don’t just look good. They connect, grow, and create worlds where people find their place.",
    "In order to connect, you must know, not assume. That, is our only rule.",
  ] as const,
  cta: "Get to know us",
  ctaHref: "#work",
};

export const services = [
  {
    slug: "research-and-benchmark",
    name: "Research and benchmark",
    title: ["Research and", "benchmark"],
    deliverables: ["Positioning map", "Category review", "Reference study", "Opportunity brief"],
    description:
      "Before we start designing, we take the time to understand your market, your audience, and the world your brand lives in. We look closely at competitors, compare how they present themselves, and explore references within and beyond your category. From there, we map out where everyone stands, what feels overdone, and where there is room to do something different, so every creative decision starts with a clear sense of direction.",
  },
  {
    slug: "strategic-north",
    name: "Strategic north",
    title: ["Strategic", "north"],
    deliverables: ["Purpose", "Belief", "Differentials", "Personality"],
    description:
      "The strategic north is the soul of the business, set down so everything that follows has a direction. We define the purpose, the belief, the differentials, and the personality, and we test them against how the company actually behaves. The point is a north that people inside the company can use, not a sentence that only looks good on a wall. When it is clear, naming and identity stop pulling in different directions.",
  },
  {
    slug: "brand-architecture",
    name: "Brand architecture",
    title: ["Brand", "architecture"],
    deliverables: ["Portfolio map", "Hierarchy", "Roles", "Growth rules"],
    description:
      "Brand architecture is the organization of the portfolio: products, services, and initiatives, each with a role that does not eat the others. We map what exists, what is coming, and how the pieces should relate, so the system can grow with order. A clear architecture keeps the brand from splitting into versions that no longer sound like the same company.",
  },
  {
    slug: "naming-and-identity",
    name: "Naming and identity",
    title: ["Naming and", "identity"],
    deliverables: ["Name", "Logo", "Typography", "Color and tone"],
    description:
      "Naming and identity begin with a name that carries the strategy, then an identity that makes that name visible. We shape the logo, the typography, the color, and the tone, and the systems that keep the brand recognizable when other people have to use it. The aim is not a single clever mark. It is a brand someone can recognize before they read the name.",
  },
  {
    slug: "brand-book",
    name: "Brand book",
    title: ["Brand", "book"],
    deliverables: ["Brand book", "Applications", "Voice and tone", "Channel rules"],
    description:
      "The brand book is the system that keeps the brand looking and feeling the same everywhere, no matter who executes it or which channel it lands on. It holds the applications, the voice, and the rules for when the brand has to stretch. It is written for the people who will build the next page, the next post, and the next space, so they are not guessing once the identity leaves our hands.",
  },
  {
    slug: "website-design",
    name: "Website design",
    title: ["Website", "design"],
    deliverables: ["Sitemap", "Wireframes", "Interface design", "Build handoff"],
    description:
      "Website design takes the brand to the place where most people meet it first. We plan the structure around what visitors actually come looking for, shape the content with the brand's voice, and design every page so the identity holds from a phone to a large screen. The aim is not a showcase that ages in a year. It is a site the team can keep updating, that reads clearly, and that feels like the same brand everywhere else.",
  },
  {
    slug: "strategic-accompaniment",
    name: "Strategic accompaniment",
    title: ["Strategic", "accompaniment"],
    deliverables: ["Retainer", "Counsel", "Review", "Partnership"],
    description:
      "Strategic accompaniment is a retainer and ongoing counsel for brands that want to keep growing with judgment. We stay after the identity is in the world, reviewing the choices that show up in real use and helping decide what comes next. We are not vendors who deliver a file and disappear. We are allies for the stretch of work that follows.",
  },
] as const;

export const about = {
  title: ["A verb does", "not describe.", "It acts."] as const,
  lead: [
    "Verbo Brands grew out of years of building brands for others.\nOf understanding business from the inside, learning what works and what doesn't, and growing as a strategist and as a person.",
    "We are a boutique consultancy based in Bogotá - small by choice, deep in our approach by conviction. We work with only a few brands at a time because we believe full dedication cannot be divided.",
  ] as const,
  aside:
    "What sets us apart isn't the tools we use, but how we think: we start with a genuine understanding of people and businesses, connect strategy with creativity, and measure success in growth, not likes.",
  cta: "Meet the team",
  ctaHref: "#team",
  portrait: "/about/portrait.webp",
  team: [
    { name: "Juliana Cabrera", role: "Strategy", tone: "var(--trail-yellow)" },
    { name: "Juliana Cabrera", role: "Design", tone: "var(--foreground)" },
    { name: "Juliana Cabrera", role: "Research", tone: "var(--trail-blue)" },
    { name: "Juliana Cabrera", role: "Copy", tone: "var(--about-card-plain)" },
    { name: "Juliana Cabrera", role: "Direction", tone: "var(--trail-amber)" },
  ] as const,
  quote: "The most powerful brand is not imagined. It is built, decision by decision.",
};

export const close = {
  label: "Let's talk",
  titleLead: "A trajectory like yours",
  titleRest: "deserves a brand",
  titleEmphasis: "equal to it.",
  body: "If you believe your brand can do more for your business, we want to hear from you.",
  email: "juliana@verbobrands.com",
  emailHref: "mailto:juliana@verbobrands.com",
  whatsappHref: "https://wa.me/573183460278?text=Hi%20Verbo%2C%20I%27d%20like%20to%20talk%20about%20my%20brand.",
  whatsappLabel: "Chat with Verbo on WhatsApp",
  phone: "+57 318 346 0278",
  studio: "Verbo Brands",
  practice: "Strategy, brand and growth",
  plate: "/close/plate.jpg",
  plateAlt: "Hellenistic marble bust in warm side light",
} as const;

export const legalLinks = [
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
] as const;

export const notFound = {
  code: "404",
  title: "Oops! This page doesn't exist.",
  cta: "Home page",
} as const;

export type WorkCase = {
  index: string;
  name: string;
  tag: string;
  description: string;
  services: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  frame?: string;
  // CSS object-position from the Studio hotspot. Absent means centered.
  focus?: string;
  href: string | null;
  // Service and deliverable slugs, for the work filter.
  serviceSlugs?: readonly string[];
  deliverableSlugs?: readonly string[];
};

export const cases: readonly WorkCase[] = [
  {
    index: "01",
    name: "Lienzo, artesanos de viajes",
    tag: "Marca desde cero / Turismo luxury",
    description:
      "Turismo al Vuelo quería un mundo nuevo: uno donde el lujo no se mide en estrellas sino en momentos que no se olvidan. Nació Lienzo, una marca que entiende que el arte de viajar empieza con una mirada dispuesta a descubrir.",
    services: "Estrategia / Naming / Identidad / Web",
    image: "/work/lienzo.jpg",
    width: 1152,
    height: 864,
    alt: "Still life of linen, a closed notebook, and a cup in warm side light",
    frame: "md:col-span-5 md:col-start-8",
    href: "/work/lienzo",
  },
  {
    index: "02",
    name: "Altos de Guayacanes",
    tag: "Marca territorio / Cartagena",
    description:
      "Hay lugares que no se construyen. Se descubren. Una marca que honra el territorio que la inspira, donde la magia de Cartagena se funde con la sabiduría de la naturaleza Sinú.",
    services: "Investigación / Naming / Identidad / Estrategia verbal / Manual",
    image: "/work/altos.jpg",
    width: 1152,
    height: 864,
    alt: "Guayacan trees and an estuary at dusk",
    frame: "md:col-span-4 md:col-start-9",
    href: null,
  },
  {
    index: "03",
    name: "Boroló",
    tag: "Marca inmobiliaria / Bogotá",
    description:
      "Teusaquillo es de esos barrios que Bogotá tiene pero no sabe que extraña. Boroló nació para una generación que elige quedarse, porque entiende que el futuro más interesante se construye desde las raíces.",
    services: "Estrategia / Naming / Identidad / Valla / Brochure / Manual",
    image: "/work/borolo.jpg",
    width: 864,
    height: 1152,
    alt: "Brick houses and a jacaranda on a quiet residential street",
    frame: "md:col-span-3 md:col-start-9",
    href: null,
  },
  {
    index: "04",
    name: "B-Side",
    tag: "Rebranding / Firma legal",
    description:
      "Las firmas de abogados suelen parecerse entre sí. CRS y RADDF no querían crear una firma más. Querían el lado B de las firmas legales. El que no suena en el radio corporativo, pero es el que más te mueve.",
    services: "Estrategia / Naming / Identidad / Manual / Web",
    image: "/work/bside.jpg",
    width: 1152,
    height: 864,
    alt: "Dark wood listening room beside library shelves",
    frame: "md:col-span-5 md:col-start-8",
    href: null,
  },
  {
    index: "05",
    name: "Exponencial Confirming",
    tag: "Rebranding corporativo / Fintech",
    description:
      "Una fintech con plataforma real y visión de futuro cuya marca no estaba a su altura. Una arquitectura flexible que habla el lenguaje del negocio: ágil, transparente y construida para crecer.",
    services: "Estrategia / Naming / Arquitectura / Identidad / Manual / Web",
    image: "/work/exponencial.jpg",
    width: 1280,
    height: 720,
    alt: "A glass table and blank paper in a night office",
    frame: "md:col-span-5 md:col-start-8",
    href: null,
  },
  {
    index: "06",
    name: "Cenicaña",
    tag: "Rebranding corporativo",
    description:
      "45 años de investigación y conocimiento que vivían en las sombras. Un rebranding que sacó de tras bambalinas a una organización extraordinaria y la convirtió en la referente que siempre había sido.",
    services: "Estrategia / Rebranding / Identidad / Manual",
    image: "/work/cenicana.jpg",
    width: 1280,
    height: 720,
    alt: "Sugarcane rows and a dirt path in morning mist",
    frame: "md:col-span-4 md:col-start-9",
    href: null,
  },
];
