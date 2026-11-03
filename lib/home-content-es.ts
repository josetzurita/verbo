import type {
  belief as beliefEn,
  menu as menuEn,
  about as aboutEn,
  close as closeEn,
  legalLinks as legalLinksEn,
  notFound as notFoundEn,
  Ui,
} from "./home-content";

// Spanish twin of home-content.ts. Source: Verbo_traducciones_completas.md.
// "ES: review" marks copy the file does not cover (its English differs from the live site); written from the live English.

type Widen<T> = T extends string ? string : T extends object ? { [K in keyof T]: Widen<T[K]> } : T;

export const menu: Widen<typeof menuEn> = {
  title: "Menú",
  closeLabel: "Cerrar",
  links: [
    { label: "Trabajo", target: "/work" },
    { label: "Servicios", target: "#services" }, // ES: review
    { label: "Nosotros", target: "#about" },
    { label: "Contacto", target: "#contact" },
  ],
  headerWorkLabel: "Nuestro trabajo",
  selectedWorkLabel: "Nuestro trabajo",
  allProjectsLabel: "Todos los proyectos", // ES: review
  allProjectsHref: "/work",
  whatsappShort: "WhatsApp",
  previousLabel: "Proyecto anterior", // ES: review
  nextLabel: "Proyecto siguiente", // ES: review
};

export const discoveryLabel = "Agenda una sesión de descubrimiento gratuita";
export const viewLabel = "Ver";

// Kept in English on purpose: the slogan is not translated.
export const heroSlogan = ["Strategy", "Brand & Growth"] as const;

// From the owner.
export const heroLead =
  "Somos una consultora boutique especializada en estrategia de marca. Construimos marcas a partir de un profundo entendimiento de los negocios y las personas.";

// ES: review (the file's statement is split to fit the live line breaks)
export const belief: Widen<typeof beliefEn> = {
  lines: ["El branding no es arte.", "Es la", "decisión"],
  resting: ["de negocio", "más importante", "que una empresa", "puede tomar."],
  frames: [
    { src: "/belief/sequence-1.webp", border: "var(--trail-blue)" },
    { src: "/belief/sequence-2.webp", border: "var(--trail-amber)" },
    { src: "/belief/sequence-3.webp", border: "var(--trail-yellow)" },
  ],
  paragraphs: [
    "En un mundo donde el diseño vive en lo visual y la estrategia vive en hojas de cálculo, Verbo propone que la marca más poderosa no se imagina.",
    "Se construye desde una comprensión profunda de un negocio, sus personas y su potencial.",
    "Porque cuando la rigurosidad y la belleza se encuentran, las marcas no solo se ven bien. Conectan, crecen y crean mundos donde las personas encuentran su lugar.",
    "Para conectar hay que conocer, no asumir. Esa es nuestra única regla.",
  ],
  cta: "Conócenos",
  ctaHref: "#work",
};

// ES: review (live English differs from the file's section 7). Team roles use neutral nouns.
export const about: Widen<typeof aboutEn> = {
  title: ["Un verbo no", "describe.", "Actúa."],
  lead: [
    "Verbo Brands nació de años construyendo marcas para otros.\nDe entender el negocio desde adentro, aprender qué funciona y qué no, y crecer como estratega y como persona.",
    "Somos una consultora boutique con sede en Bogotá: pequeña por elección, profunda en el enfoque por convicción. Trabajamos con pocas marcas a la vez porque creemos que la dedicación total no se puede dividir.",
  ],
  aside:
    "Lo que nos distingue no son las herramientas que usamos, sino cómo pensamos: partimos de una comprensión genuina de las personas y los negocios, conectamos estrategia con creatividad y medimos el éxito en crecimiento, no en likes.",
  cta: "Conoce al equipo",
  ctaHref: "https://wa.me/573183460278?text=Hola%20Verbo%2C%20%C2%A1quiero%20conocer%20a%20su%20equipo!",
  team: [
    { name: "Juliana", role: "Fundadora y Directora", photo: "/about/juliana.webp", tone: "var(--trail-yellow)" },
    { name: "Adriana", role: "Dirección creativa", photo: "/about/adriana.webp", tone: "var(--foreground)" },
    { name: "José", role: "Diseño web senior", photo: "/about/jose.webp", tone: "var(--trail-blue)" },
    { name: "Andrea", role: "Diseño senior", photo: "/about/andrea.webp", tone: "var(--about-card-plain)" },
    { name: "Valentina", role: "Diseño senior", photo: "/about/valentina.webp", tone: "var(--trail-amber)" },
  ],
};

// ES: review (live English differs from the file's section 8)
export const close: Widen<typeof closeEn> = {
  label: "Hablemos",
  titleLead: "Una trayectoria como la tuya",
  titleRest: "merece una marca",
  titleEmphasis: "a su altura.",
  body: "Si crees que tu marca puede hacer más por tu negocio, queremos escucharte.",
  cta: "Hablemos",
  email: "juliana@verbobrands.com",
  emailHref: "mailto:juliana@verbobrands.com",
  whatsappHref: "https://wa.me/573183460278?text=Hola%20Verbo%2C%20me%20gustar%C3%ADa%20hablar%20sobre%20mi%20marca.",
  whatsappLabel: "Escríbele a Verbo por WhatsApp",
  phone: "+57 318 346 0278",
  studio: "Verbo Brands",
  practice: "Estrategia, marca y crecimiento",
  plate: "/close/plate.jpg",
  plateAlt: "Busto helenístico de mármol bajo una luz cálida lateral",
};

export const legalLinks: Widen<typeof legalLinksEn> = [
  { label: "Privacidad", href: "/privacy/" },
  { label: "Términos", href: "/terms/" },
];

export const notFound: Widen<typeof notFoundEn> = {
  code: "404",
  title: "¡Ups! Esta página no existe.",
  cta: "Inicio",
};

export const ui: Ui = {
  workTitle: ["Nuestro", "trabajo"],
  expertiseTitle: ["Nuestra", "experiencia"],
  heroTitle: ["Creando para", "transformar el mundo."],
  heroTitleLabel: "Creando para transformar el mundo.",
  skipLink: "Saltar al contenido",
  homeLabel: "Verbo, inicio",
  primaryNav: "Principal",
  legalNav: "Legal",
  cookiesLink: "Cookies",
  closeLabel: "Cerrar",
  menuOpen: "Abrir menú",
  menuClose: "Cerrar menú",
  seeAllWork: "Ver todo el trabajo",
  viewProject: (name) => `Ver ${name}`,
  filterGroup: "Filtrar por práctica",
  filterAll: "Todos",
  deliverablesOf: (name) => `Entregables de ${name}`,
  projectCount: (count) => (count === 1 ? "1 proyecto" : `${count} proyectos`),
  emptyFilter: "Aún no hay proyectos en esta categoría.",
  showAll: "Ver todos los proyectos",
  caseStudy: "Caso de estudio",
  whatWeDid: "Lo que hicimos",
  designBy: "Diseño",
  founderOf: (name) => `Fundador, ${name}`,
  moreWork: "Más trabajo",
  gallery: "Galería",
  onTheRoad: "En camino",
  caseDetails: "Detalles del caso",
  caseTitle: (name, practices) => {
    const kinds = practices.slice(0, 2).map((practice) => practice.toLowerCase());
    return kinds.length > 0 ? `${name}: caso de estudio de ${kinds.join(" y ")}` : `${name}, caso de estudio`;
  },
  portrait: (name, role) => `Retrato de ${name}, ${role}`,
  notFoundLink: "ve nuestro trabajo",
  languageLabel: "Idioma",
  consent: {
    label: "Preferencias de cookies",
    text: "Usamos cookies para medir cómo se usa el sitio. Nada se registra a menos que aceptes.",
    privacy: "Política de privacidad",
    reject: "Rechazar",
    accept: "Aceptar",
    current: (granted) => `Elección actual: ${granted ? "aceptadas" : "rechazadas"}.`,
  },
  error: {
    label: "Error",
    title: "La página no pudo terminar de cargar.",
    fallback: "Ocurrió un error inesperado.",
    retry: "Intentar de nuevo",
  },
};
