export const discoveryLabel = "Schedule a free discovery session";

export const belief = {
  lines: ["Branding isn’t art.", "It’s the most", "important"] as const,
  resting: ["business", "decision a", "company can", "make."] as const,
  frames: [
    { src: "/belief/sequence-1.png", border: "var(--trail-blue)" },
    { src: "/belief/sequence-2.png", border: "var(--trail-amber)" },
    { src: "/belief/sequence-3.png", border: "var(--trail-yellow)" },
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
    name: "Investigación y benchmark",
    description:
      "Análisis del mercado, la categoría y los referentes. Mapa de posicionamiento y oportunidades reales antes de tomar cualquier decisión.",
  },
  {
    name: "Norte estratégico",
    description:
      "El alma del negocio. Propósito, creencia, diferenciales y personalidad, para que todo lo que venga después tenga dirección.",
  },
  {
    name: "Arquitectura de marca",
    description:
      "Organización del portafolio de productos, servicios e iniciativas. Un sistema que crece con orden y sin canibalizar lo que ya existe.",
  },
  {
    name: "Naming e identidad",
    description:
      "Un nombre con estrategia y una identidad que lo hace visible. Logo, tipografía, color, tono y los sistemas que hacen a una marca reconocible.",
  },
  {
    name: "Manual y aplicaciones",
    description:
      "El sistema que garantiza que la marca se vea y se sienta igual en todo, sin importar quién lo ejecute o en qué canal.",
  },
  {
    name: "Acompañamiento estratégico",
    description:
      "Retainers y asesoría continua para marcas que quieren seguir creciendo con criterio. No somos proveedores. Somos aliados.",
  },
] as const;

export const cases = [
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
  },
] as const;
