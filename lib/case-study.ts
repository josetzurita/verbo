export type CaseImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CaseCard = {
  label: string;
  title: string;
  body: string;
  image: CaseImage;
};

export type CaseCaptioned = {
  caption: string;
  image: CaseImage;
};

export type CaseMoreItem = {
  name: string;
  line: string;
  href: string;
  image: CaseImage;
};

export type CaseStudy = {
  slug: string;
  name: string;
  summary: string;
  title: readonly [string, string];
  wordmark: string;
  siteHref: string;
  siteLabel: string;
  practices: readonly string[];
  hero: CaseImage;
  statement: string;
  impactTitle: string;
  impact: readonly string[];
  essay: readonly string[];
  gallery: {
    wide: CaseImage;
    trio: readonly [CaseImage, CaseImage, CaseImage];
    plate: CaseImage;
    plateNote: readonly [string, string];
  };
  layers: {
    title: string;
    body: readonly string[];
    image: CaseImage;
    cards: readonly [CaseCard, CaseCard, CaseCard];
  };
  shift: {
    title: string;
    pairs: readonly { from: string; to: string }[];
  };
  pair: readonly [CaseImage, CaseImage];
  quote: {
    title: string;
    body: string;
  };
  visible: {
    items: readonly [CaseCaptioned, CaseCaptioned, CaseCaptioned, CaseCaptioned];
    title: string;
    body: readonly string[];
  };
  places: {
    title: string;
    image: CaseImage;
    items: readonly { name: string; region: string; image: CaseImage }[];
  };
  more: readonly CaseMoreItem[];
};

const img = (src: string, alt: string, width: number, height: number): CaseImage => ({
  src,
  alt,
  width,
  height,
});

const street = img("/case/case-street.jpg", "A cobbled colonial street with wooden balconies and bougainvillea", 1024, 576);
const coast = img("/case/case-coast.jpg", "Aerial view of a road winding along a green coast and turquoise sea", 1024, 576);
const boat = img("/case/case-boat.jpg", "A wooden boat with a figure in a straw hat on clear turquoise water", 768, 1024);
const traveler = img("/case/case-traveler.jpg", "A traveler in linen looking over a misty valley of wax palms", 768, 1024);
const courtyard = img("/case/case-courtyard.jpg", "A tree and a stone bench in a clay courtyard", 864, 1152);
const hammock = img("/case/case-hammock.jpg", "A woven hammock between two palms facing a calm beach", 1024, 768);

const lienzo: CaseStudy = {
  slug: "lienzo",
  name: "Lienzo",
  summary: "A luxury travel house named and built from scratch, where value is measured in moments, not stars.",
  title: ["From a trip catalog", "to a way of seeing"],
  wordmark: "Lienzo",
  siteHref: "https://example.com",
  siteLabel: "Visit site",
  practices: ["Strategy", "Naming", "Identity", "Verbal system", "Web"],
  hero: img("/case/case-estuary.jpg", "Calm estuary at dusk with trees along the bank", 1280, 720),
  statement: "Luxury used to be measured in stars. Lienzo measures it in moments that stay.",
  impactTitle: "What changed",
  impact: [
    "A new travel house, named and launched from scratch",
    "From selling trips to hosting a point of view",
    "One identity across web, print, and the welcome kit",
    "A verbal system the hosts use in every conversation",
    "Room for new destinations without redrawing the brand",
  ],
  essay: [
    "Turismo al Vuelo wanted a new world. Its catalog was full of good trips, but nothing said why this house should take you.",
    "We started with the stance, not the name. Travel as an art that begins with a gaze willing to discover.",
    "Lienzo means canvas. Each trip becomes a surface to paint on, and the brand keeps returning to one material: undyed linen.",
    "The system was built to travel. It works on a welcome card, a hotel door, and a phone screen.",
  ],
  gallery: {
    wide: street,
    trio: [
      boat,
      img("/case/case-window.jpg", "An open wooden window and a linen curtain facing the sea", 768, 1024),
      img("/case/case-table.jpg", "Tropical fruit, coffee, and juice on a stone table in dappled shade", 768, 1024),
    ],
    plate: coast,
    plateNote: ["Every trip is a canvas", "The gaze paints it"],
  },
  layers: {
    title: "Built in layers",
    body: [
      "The catalog listed places. It never said why a traveler should trust this house with the trip. The stance came before the name: travel is an art that begins with a gaze willing to discover. We named the belief before the brand. Lienzo is the canvas, and the traveler's gaze is what paints it.",
      "Every touchpoint carries three layers: the place, the people who host it, and the gaze of the traveler. These are not themes for a deck. They are the order of every decision, from a route to a sentence.",
      "Naming, identity, words, and the site stay one system, so a new destination never needs a new brand. Linen, warm paper, and the light of a late afternoon are the materials the identity returns to. If a line cannot be said at the door, it does not belong on the site. Hosts can say the same line on a welcome card, at the door, and on a phone screen.",
    ],
    image: img("/case/case-stationery.jpg", "Blank cards and a kraft envelope with a wax seal on linen", 1024, 768),
    cards: [
      {
        label: "Where",
        title: "Place",
        body: "Destinations chosen for what they keep, not for what they show.",
        image: courtyard,
      },
      {
        label: "Who",
        title: "Host",
        body: "People who open their house, their table, and their routes.",
        image: img("/case/case-portrait.jpg", "A woman in a linen coat standing in a plaster doorway", 864, 1152),
      },
      {
        label: "How",
        title: "Gaze",
        body: "A slower way to look, written into every line the brand says.",
        image: img("/case/case-key.jpg", "A hand holding a brass room key on a leather tag", 1024, 1024),
      },
    ],
  },
  shift: {
    title: "Lienzo's transformation",
    pairs: [
      { from: "From a trip catalog", to: "To a way of seeing" },
      { from: "From stars and amenities", to: "To moments that stay" },
      { from: "From selling destinations", to: "To hosting travelers" },
      { from: "From a logo on a folder", to: "To a system people use" },
      { from: "From an agency", to: "To a house" },
    ],
  },
  pair: [traveler, hammock],
  quote: {
    title: "A word from the founder",
    body: "We did not need more beaches. We needed a reason to travel with us.",
  },
  visible: {
    items: [
      {
        caption: "The notebook every guest receives",
        image: img("/case/case-hero.jpg", "Closed notebook, ceramic cup, and folded linen on a cloth", 1152, 864),
      },
      {
        caption: "Craft from the places we visit",
        image: img("/case/case-basket.jpg", "Close view of a hand-coiled basket in natural and red fiber", 1024, 1024),
      },
      {
        caption: "Letters before the trip",
        image: img("/case/case-hands.jpg", "Hands holding a stack of blank paper on a wood table", 1152, 864),
      },
      {
        caption: "Linen, the material the brand returns to",
        image: img("/case/case-linen.jpg", "Close view of an undyed linen weave", 1024, 1024),
      },
    ],
    title: "Making a way of\ntraveling visible",
    body: [
      "The house can now say why the trip matters before anyone reads a list of places.",
      "One identity runs across the site, the print, and the welcome kit.",
      "The words arrive first, in the paper a guest holds and the craft on the table.",
      "New destinations fit the same system without redrawing the mark.",
      "Luxury is no longer a star rating. It is a moment that stays.",
    ],
  },
  places: {
    title: "Where the canvas travels",
    image: img("/work/lienzo.jpg", "Still life of linen, a closed notebook, and a cup in warm side light", 1152, 864),
    items: [
      { name: "Cartagena", region: "Caribbean coast", image: street },
      { name: "Tayrona", region: "Sierra Nevada", image: coast },
      { name: "Islas del Rosario", region: "Caribbean sea", image: boat },
      { name: "Salento", region: "Coffee region", image: traveler },
      { name: "Mompox", region: "Magdalena river", image: courtyard },
    ],
  },
  more: [
    {
      name: "Altos de Guayacanes",
      line: "A territory brand rooted in Cartagena.",
      href: "/#work",
      image: img("/work/altos.jpg", "Guayacan trees and an estuary at dusk", 1152, 864),
    },
    {
      name: "Boroló",
      line: "A home for the people who choose to stay.",
      href: "/#work",
      image: img("/work/borolo.jpg", "Brick houses and a jacaranda on a quiet residential street", 864, 1152),
    },
    {
      name: "B-Side",
      line: "The other side of a legal firm.",
      href: "/#work",
      image: img("/work/bside.jpg", "Dark wood listening room beside library shelves", 1152, 864),
    },
    {
      name: "Exponencial Confirming",
      line: "A fintech brand built to grow.",
      href: "/#work",
      image: img("/work/exponencial.jpg", "A glass table and blank paper in a night office", 1280, 720),
    },
    {
      name: "Cenicaña",
      line: "45 years of research, out of the shadows.",
      href: "/#work",
      image: img("/work/cenicana.jpg", "Sugarcane rows and a dirt path in morning mist", 1280, 720),
    },
  ],
};

export const caseStudies = [lienzo] as const;

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}
