# Individual project template

This is the structure of a Verbo case study, taken from the live page [verbo-preview.vercel.app/work/lienzo](https://verbo-preview.vercel.app/work/lienzo). Every project uses this same page. Fill the slots. Do not add sections, drop sections, or reorder them.

The route is `/work/{slug}`. The browser title is `{name}, case study`.

The case itself sits on a cream paper field. Navigation, the "More work" strip, and the closing footer stay on the dark field and are shared with the rest of the site. Do not redesign them per project.

Write the case in English, in the same register as Lienzo: short, concrete, no slogans stacked on slogans. Use hyphens, never em dashes or en dashes.

## How to fit a project into this page

Map the client's material onto the slots below. If a story has more points than a slot allows, cut to the limit. If it has less, still fill every required slot. Do not invent a new block for leftover material.

| Material you have | Where it goes |
| --- | --- |
| The change, in one breath | Hero title, two lines |
| What the project is | Summary, under the title |
| Disciplines Verbo practiced | "What we did" list |
| The belief, one sentence | Statement, sticky on the left |
| Outcomes | "What changed", up to 5 lines |
| How the work started | Essay, four short paragraphs |
| The world of the brand | Gallery |
| The idea, said properly | "Built in layers", exactly 3 paragraphs |
| Three parts of the system | Three cards |
| Before and after | Transformation rows, up to 5 |
| A human line from the client | Founder quote |
| Proof you can hold | Four captioned objects |
| Where it shows up | Places list, up to 5 |
| Other Verbo projects | "More work" |

## Hard limits

These counts are what the page is built for. Going past them breaks the layout.

- Hero title: exactly 2 lines. Each line is one line on screen and does not wrap. Keep each line about as short as the live example ("From a trip catalog" / "to a way of seeing"), roughly 20 characters.
- Summary: 20 words or fewer.
- Site link label: 2 words or fewer. Live label is "Visit site".
- Statement: 25 words or fewer. It sits in a narrow column (about 16 characters wide) and wraps to several lines. It stays on screen while the right column scrolls.
- "What changed": 5 lines or fewer. The live page uses 5. Each line is one sentence at display size.
- Essay: short paragraphs, each 25 words or fewer. The live page uses 4.
- Gallery: 1 wide image, then exactly 3 images, then 1 wide plate with exactly 2 corner lines.
- "Built in layers" body: exactly 3 paragraphs. This is the only long copy on the page.
- Cards: exactly 3.
- Card body, quote, and each "making it visible" paragraph: 25 words or fewer.
- Transformation rows: 5 or fewer. The live page uses 5.
- Pair: exactly 2 images.
- "Making it visible": exactly 4 captioned images, plus a 2-line title.
- Places: 5 or fewer. The live page uses 5.
- Practices: short labels, one per line. The live page uses 5 ("Strategy", "Naming", "Identity", "Verbal system", "Web").

Every image needs a src, alt text, width, and height. Crop to the ratio of the slot. Keep the subject in the center, because several frames scale slightly on scroll.

## Page order

Shared chrome, then the case, then shared chrome again.

1. Site navigation (fixed, not project content)
2. Hero title and meta
3. Hero image with wordmark
4. Statement, outcomes, and essay
5. Gallery
6. Built in layers, then three cards
7. Transformation
8. Two images
9. Founder quote
10. Making it visible
11. Places
12. Case details
13. More work
14. Site close (fixed, not project content)

### 1. Site navigation

Fixed header: Menu, the Verbo mark, Why us?, Services, Contact. Leave it alone.

### 2. Hero title and meta

Display title, two lines, full width. Under it, a row in three parts:

- Left: the summary, then a text link to the live site (`siteHref` + `siteLabel`).
- Middle: the fixed label "What we did".
- Right: the practices, stacked, one per line.

### 3. Hero image with wordmark

One full-bleed landscape, 16:9 on desktop, about 78% of the screen tall on a phone. A dark veil sits on the photo. The project name (`wordmark`) is centered on top of it in large cream type. Keep the middle of the photo quiet enough to hold that word.

### 4. Statement, outcomes, and essay

Two columns on desktop.

- Left, sticky: the statement. No label.
- Right, top: a tinted panel. Small title (`impactTitle`, live: "What changed"), then the outcome lines, each separated by a hairline.
- Right, below the panel: the essay paragraphs.

On a phone these stack in that same order: statement, panel, essay.

### 5. Gallery

Three beats, stacked, with a small gap.

1. One wide image, 16:9.
2. Three images in a row. The outer two are wider, the center one is narrower. On desktop they share one height. On a phone they stack: 4:5, 3:4, 4:5.
3. One plate, 21:9 on desktop and 4:5 on a phone, with a dark veil. Two short lines of cream type sit in opposite corners: one top-left (`plateNote` line 1), one bottom-right (`plateNote` line 2). Keep each line short. The live lines are "Every trip is a canvas" and "The gaze paints it". They wrap inside a narrow measure.

### 6. Built in layers, then three cards

First, a row:

- Left: one square image.
- Right: a display title (`layers.title`, live: "Built in layers") and exactly 3 paragraphs.

Then three cards in one row. They get narrower from left to right (about 5, 4, and 3 columns). Each card is a tall portrait photo with a text plate at the bottom:

- A small label (live: "Where", "Who", "How")
- A short title (live: "Place", "Host", "Gaze")
- A body of 25 words or fewer

On a phone the square image, the text, and the cards stack, and each card is still tall.

### 7. Transformation

A small title (`shift.title`, live: "Lienzo's transformation"), then up to 5 rows with hairlines. Each row is a pair:

- Left, quieter type: the before (`from`). Live lines start with "From".
- Right: the after (`to`). Live lines start with "To".

Both sides are display size. On a phone the before sits above the after.

### 8. Two images

One row, no caption. Left image is portrait, 3:4, and takes about a third of the width. Right image is landscape, 4:3, and takes the rest. On a phone they stack, portrait first.

### 9. Founder quote

Centered.

- Small title (`quote.title`, live: "A word from the founder")
- The quote, display size, one sentence, 25 words or fewer, held to a narrow measure
- A fixed caption: "Founder, {project name}"

The word "Founder" is part of the template. Do not swap in another role.

### 10. Making it visible

Four captioned images and a text block, scattered on desktop.

- Image A, 4:3, top left, with a caption under it.
- Image B, square, upper right, dropped lower than A, with a caption.
- Image C, 4:3, center left, pulled up toward B, with a caption.
- Image D, square, lower left, with a caption.
- Text, lower right: a display title that breaks into exactly 2 lines (live: "Making a way of" / "traveling visible"), then short paragraphs, each 25 words or fewer. The live page uses 5.

Captions are one quiet line each. On a phone the order is A, B, C, D, then the text.

### 11. Places

Two columns.

- Left: one portrait image, 4:5.
- Right: a tinted panel. Small label (`places.title`, live: "Where the canvas travels"), then up to 5 rows. Each row is a small thumbnail, the place name at display size, and the region in small type on the right.

Place names should stay short enough to sit on one line beside the thumbnail. On a small phone the region hides. On a phone the portrait stacks above the list.

### 12. Case details

A closing repeat of the hero meta, still on the paper field:

- Fixed label "Case study"
- Project name
- Fixed label "What we did"
- The same practices list

### 13. More work

Dark field. The heading "More work" is fixed and huge. Under it, a horizontal row of the other projects. About two cards show at a time on desktop, and the row moves sideways as you scroll. Each card is:

- Image, 16:10
- Project name
- One short line
- A link

Lienzo lists the other five: Altos de Guayacanes, Boroló, B-Side, Exponencial Confirming, Cenicaña. Point each card at that project's case page when it exists, otherwise at `/#work`.

### 14. Site close

The shared footer: "Let's talk", "A trajectory like yours deserves a brand equal to it.", the contact line, and hola@verbobrands.co. It is not written per project.

## Slot list

Use these names when you hand content back. Counts marked "exact" cannot change.

| Slot | Count | What it is |
| --- | --- | --- |
| `slug` | 1 | URL segment, lowercase, hyphenated |
| `name` | 1 | Project name. Also used in "Founder, {name}" and the case-details row |
| `summary` | 1 | 20 words or fewer |
| `title` | exact 2 | Hero lines, each about 20 characters, no wrap |
| `wordmark` | 1 | Name centered on the hero image |
| `siteHref` | 1 | External URL |
| `siteLabel` | 1 | 2 words or fewer |
| `practices` | short list | One label per line |
| `hero` | exact 1 | 16:9 image |
| `statement` | 1 | 25 words or fewer |
| `impactTitle` | 1 | Small panel title |
| `impact` | up to 5 | One sentence per line |
| `essay` | short list | Each paragraph 25 words or fewer |
| `gallery.wide` | exact 1 | 16:9 image |
| `gallery.trio` | exact 3 | Portrait-leaning images, center one narrower |
| `gallery.plate` | exact 1 | 21:9 image, center quiet enough for type |
| `gallery.plateNote` | exact 2 | Short corner lines |
| `layers.title` | 1 | Display title, one line |
| `layers.body` | exact 3 | The long paragraphs |
| `layers.image` | exact 1 | Square image |
| `layers.cards` | exact 3 | `label`, `title`, `body` (25 words or fewer), portrait image |
| `shift.title` | 1 | Small title |
| `shift.pairs` | up to 5 | `from` and `to`, display length |
| `pair` | exact 2 | Portrait 3:4, then landscape 4:3 |
| `quote.title` | 1 | Small title |
| `quote.body` | 1 | 25 words or fewer |
| `visible.items` | exact 4 | Caption plus image. Order: 4:3, square, 4:3, square |
| `visible.title` | 1 | Two lines, split with a line break |
| `visible.body` | short list | Each paragraph 25 words or fewer |
| `places.title` | 1 | Small label |
| `places.image` | exact 1 | 4:5 image |
| `places.items` | up to 5 | `name`, `region`, square thumbnail |
| `more` | the other projects | `name`, `line`, `href`, 16:10 image |

## What not to build

- No extra sections between these blocks.
- No stats row, logo wall, process diagram, or second quote.
- No third hero line, fourth card, or fifth object photo.
- No rewritten navigation, "More work" heading, or footer.
- No em dashes in any visible line.
