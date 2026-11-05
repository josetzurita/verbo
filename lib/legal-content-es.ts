import { close } from "./home-content";
import type { LegalDocument } from "./legal-content";

// Spanish twin of legal-content.ts. Source: Verbo_traducciones_completas.md, sections 13 and 14.
// The file recommends a lawyer's review in the target language. Colombian statutes keep their original names.
// The meta descriptions are not in the file (ES: review).

const controller = "Juliana Cabrera Bonilla, actuando como Verbo Brands";
const contact = close.email;
const phone = close.phone;
const updated = "29 de octubre de 2026";

export const privacyPolicyEs: LegalDocument = {
  slug: "privacy",
  title: "Política de privacidad",
  description:
    "Cómo Verbo Brands trata los datos personales en verbobrands.com: qué recopilamos, por qué, qué cookies usamos y cómo ejercer tus derechos.",
  updatedLabel: "Actualizado:",
  updated,
  intro:
    "Esta es la política de datos personales de Verbo Brands (\"Verbo\", \"nosotros\"), una consultora de branding en Bogotá, Colombia. Explica qué recopilamos a través de verbobrands.com, por qué lo recopilamos y qué puedes pedirnos. La mantenemos breve porque recopilamos muy poco.",
  sections: [
    {
      heading: "Quién es responsable",
      paragraphs: [
        `${controller} es responsable del tratamiento de tus datos personales (responsable del tratamiento según la Ley 1581 de 2012, controller según el RGPD).`,
      ],
      list: ["Ubicación: Bogotá, Colombia", `Correo: ${contact}`, `Teléfono y WhatsApp: ${phone}`],
    },
    {
      heading: "Qué recopilamos",
      paragraphs: ["El sitio no tiene formularios ni cuentas de usuario. Solo procesamos lo siguiente:"],
      list: [
        "Lo que nos envías. Si nos escribes por correo electrónico o WhatsApp, recibimos tu nombre, datos de contacto y lo que compartas sobre tu proyecto.",
        "Analítica, solo si aceptas. Si haces clic en Aceptar en el banner de cookies, Google Analytics 4 registra qué páginas visitas, cuánto tiempo permaneces, tu ciudad y país aproximados, tu tipo de dispositivo y navegador, y el sitio que te envió. Google Analytics 4 no registra ni almacena direcciones IP. Si rechazas o ignoras el banner, nada de esto se recopila.",
        "Registros técnicos. Nuestro proveedor de alojamiento, Cloudflare, procesa brevemente tu dirección IP y los detalles de la solicitud para entregar el sitio y protegerlo de ataques.",
      ],
    },
    {
      heading: "Para qué lo usamos",
      paragraphs: ["Usamos datos personales únicamente para:"],
      list: [
        "responder tus mensajes y, si trabajamos juntos, preparar propuestas y prestar nuestros servicios;",
        "entender, de forma agregada, cómo se usa el sitio y poder mejorarlo;",
        "mantener el sitio seguro y cumplir con nuestras obligaciones legales.",
      ],
    },
    {
      heading: "Base legal",
      paragraphs: [
        "Las cookies de analítica se basan en tu consentimiento, que otorgas o rechazas en el banner de cookies. Cuando nos escribes, nos autorizas a usar tus datos para responderte, y nos basamos en esa solicitud y en nuestro interés legítimo de contestarla. Los registros técnicos se basan en nuestro interés legítimo de mantener el sitio funcionando y seguro. Nunca usamos tus datos para fines distintos a estos sin consultarte primero.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: ["El sitio funciona completamente sin cookies. Solo usamos dos tipos de almacenamiento en el navegador:"],
      list: [
        "Tu elección de cookies. Si aceptas la analítica, lo guardamos en el almacenamiento local de tu navegador (como verbo-consent), para que el banner no aparezca en cada visita. Si rechazas, solo lo recordamos hasta que cierres la pestaña y luego volvemos a preguntar. Permanece en tu dispositivo y no nos lo envías.",
        "Cookies de Google Analytics, solo después de que aceptes: _ga y _ga_<ID>. Distinguen las visitas del mismo navegador y expiran después de 2 años.",
      ],
    },
    {
      heading: "Cambiar tu elección de cookies",
      paragraphs: [
        "Puedes cambiar tu elección en cualquier momento con el enlace de Cookies en el pie de página. Si retiras el consentimiento, dejamos de recopilar analítica desde ese momento. También puedes eliminar las cookies en la configuración de tu navegador, o instalar el complemento de exclusión de Google para Google Analytics.",
        "No usamos cookies publicitarias, no creamos perfiles de visitantes y no vendemos ni alquilamos datos personales.",
      ],
    },
    {
      heading: "Con quién lo compartimos",
      paragraphs: [
        "Solo compartimos datos con los proveedores que nos ayudan a gestionar el sitio y nuestro trabajo. Actúan en nuestro nombre (encargados del tratamiento) bajo sus propios términos de protección de datos:",
      ],
      list: [
        "Google LLC (Google Analytics y Google Workspace para correo electrónico);",
        "Cloudflare, Inc. (alojamiento y seguridad);",
        "Sanity AS (el sistema de contenido y entrega de imágenes del sitio);",
        "Meta Platforms, a través de WhatsApp, si nos escribes allí.",
      ],
    },
    {
      heading: "Transferencias internacionales",
      paragraphs: [
        "Algunos de estos proveedores procesan datos en los Estados Unidos y la Unión Europea. La Superintendencia de Industria y Comercio (SIC) de Colombia reconoce a ambos como territorios que ofrecen un nivel adecuado de protección. Para visitantes en la UE, las transferencias a los Estados Unidos se basan en la certificación de los proveedores bajo el Marco de Privacidad de Datos UE-EE.UU. o en cláusulas contractuales estándar.",
      ],
    },
    {
      heading: "Por cuánto tiempo lo conservamos",
      paragraphs: [],
      list: [
        "Mensajes y correspondencia de proyectos: mientras dure la conversación o la relación de trabajo, y después por el tiempo que exijan la ley tributaria y comercial.",
        "Datos de Google Analytics: 14 meses, tras los cuales Google los elimina automáticamente.",
        "Registros de alojamiento: el breve período que Cloudflare los conserva por seguridad.",
      ],
    },
    {
      heading: "Tus derechos",
      paragraphs: ["De conformidad con la Ley 1581 de 2012 tienes derecho a:"],
      list: [
        "conocer, actualizar y rectificar tus datos personales;",
        "solicitar prueba de la autorización que nos otorgaste;",
        "ser informado sobre el uso que hemos dado a tus datos;",
        "revocar tu autorización o solicitar la supresión de tus datos, cuando no exista obligación legal o contractual de conservarlos;",
        "acceder a tus datos de forma gratuita;",
        "presentar quejas ante la Superintendencia de Industria y Comercio (SIC), una vez hayas consultado con nosotros primero.",
      ],
    },
    {
      heading: "Si estás en la Unión Europea",
      paragraphs: [
        "El RGPD también te otorga el derecho a la portabilidad de datos, a oponerte al tratamiento basado en interés legítimo y a restringir el tratamiento. Puedes presentar una queja ante la autoridad de protección de datos del país donde resides.",
      ],
    },
    {
      heading: "Cómo hacer una solicitud",
      paragraphs: [
        `Escríbenos a ${contact} con tu nombre, cómo contactarte y qué estás solicitando. Si la solicitud es sobre datos que nos enviaste, incluye suficiente detalle para que podamos encontrarlos. Respondemos consultas sobre tus datos dentro de los 10 días hábiles siguientes, y reclamos para corregir, actualizar o suprimir tus datos dentro de los 15 días hábiles siguientes. Si necesitamos más tiempo, te explicaremos por qué antes del vencimiento del plazo, dentro de las prórrogas que permite la ley.`,
      ],
    },
    {
      heading: "Menores de edad",
      paragraphs: [
        "El sitio está dirigido a empresas y profesionales. No recopilamos datos a sabiendas de personas menores de 18 años. Si crees que un menor nos ha enviado datos personales, escríbenos y los eliminaremos.",
      ],
    },
    {
      heading: "Seguridad",
      paragraphs: [
        "El sitio se sirve únicamente a través de una conexión cifrada (HTTPS). Limitamos quién puede acceder a mensajes y cuentas, y utilizamos proveedores con prácticas de seguridad reconocidas. Ningún sistema es completamente seguro, pero trabajamos para proteger tus datos contra pérdidas, uso indebido y accesos no autorizados.",
      ],
    },
    {
      heading: "Cambios a esta política",
      paragraphs: [
        `Esta política está vigente desde el ${updated}. Si cambiamos la forma en que tratamos los datos personales, actualizaremos esta página y la fecha en la parte superior. Si un cambio afecta algo a lo que diste tu consentimiento, te lo solicitaremos de nuevo.`,
      ],
    },
  ],
};

export const termsOfUseEs: LegalDocument = {
  slug: "terms",
  title: "Términos de uso",
  description: "Los términos que aplican cuando usas verbobrands.com, el sitio web de Verbo Brands.",
  updatedLabel: "Actualizado:",
  updated,
  intro: `Estos términos aplican al uso que hagas de verbobrands.com, operado por ${controller} en Bogotá, Colombia. Al usar el sitio, aceptas estos términos.`,
  sections: [
    {
      heading: "Sobre el sitio",
      paragraphs: [
        "El sitio presenta el trabajo y los servicios de Verbo Brands. Es solo informativo. Nada en él constituye una oferta vinculante, una cotización o un contrato. Cualquier servicio se acuerda en una propuesta o contrato escrito por separado, y esos documentos establecen el alcance, el precio y las condiciones.",
      ],
    },
    {
      heading: "Propiedad intelectual",
      paragraphs: [
        "El diseño, el texto, el código, el nombre y logo de Verbo, y el aspecto general del sitio pertenecen a Verbo Brands y están protegidos por la legislación colombiana de derechos de autor y propiedad industrial (Ley 23 de 1982 y Decisión 486 de la Comunidad Andina).",
        "Los nombres, logos, imágenes y otras marcas de las empresas mostradas en nuestros casos de estudio pertenecen a sus propietarios. Los mostramos como ejemplos de nuestro trabajo, con autorización. Mostrarlos no te otorga ningún derecho sobre su uso.",
        "Puedes ver el sitio y compartir enlaces. No puedes copiar, adaptar, vender ni republicar su contenido, total ni parcialmente, sin nuestra autorización escrita.",
      ],
    },
    {
      heading: "Uso aceptable",
      paragraphs: ["Al usar el sitio, aceptas no:"],
      list: [
        "usarlo para fines ilícitos o dañinos para terceros;",
        "intentar romper, sobrecargar u obtener acceso no autorizado al sitio o sus sistemas;",
        "copiar su contenido a escala con herramientas automatizadas, ni usarlo para entrenar modelos de inteligencia artificial, sin nuestra autorización;",
        "suplantar la identidad de otra persona al contactarnos.",
      ],
    },
    {
      heading: "Exactitud",
      paragraphs: [
        "Mantenemos la información del sitio precisa y actualizada, pero puede contener errores o quedar desactualizada. Los casos de estudio describen proyectos específicos. No constituyen una garantía de que otro proyecto obtendrá los mismos resultados.",
      ],
    },
    {
      heading: "Enlaces a otros sitios",
      paragraphs: [
        "El sitio enlaza a servicios que no controlamos, como WhatsApp o los sitios web de nuestros clientes. Allí aplican sus propios términos y políticas de privacidad, y no somos responsables de ellos.",
      ],
    },
    {
      heading: "Disponibilidad y responsabilidad",
      paragraphs: [
        "Ofrecemos el sitio tal como está y podemos cambiar, suspender o retirar cualquier parte de él en cualquier momento. En la medida en que la ley lo permita, Verbo Brands no es responsable de pérdidas indirectas, ni de pérdidas causadas por la indisponibilidad del sitio, errores en su contenido o decisiones tomadas con base en él. Nada en estos términos limita los derechos que tienes bajo la ley colombiana de protección al consumidor (Ley 1480 de 2011) u otras leyes que no pueden renunciarse.",
      ],
    },
    {
      heading: "Datos personales",
      paragraphs: [
        "La forma en que tratamos los datos personales se explica en nuestra política de privacidad, que forma parte de estos términos.",
      ],
    },
    {
      heading: "Cambios",
      paragraphs: [
        "Podemos actualizar estos términos. La versión publicada aquí, con la fecha en la parte superior, es la que aplica. Si alguna cláusula resulta inválida, el resto permanece vigente.",
      ],
    },
    {
      heading: "Ley aplicable",
      paragraphs: [
        "Estos términos se rigen por las leyes de Colombia. Las controversias se someten a los jueces competentes de Bogotá, salvo que la ley te otorgue el derecho de acudir a otro lugar.",
      ],
    },
    {
      heading: "Contacto",
      paragraphs: [`Preguntas sobre estos términos: ${contact} o ${phone}.`],
    },
  ],
};
