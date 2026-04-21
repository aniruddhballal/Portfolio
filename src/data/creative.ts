export type CreativeType = 'poem' | 'article' | 'sketch'

export interface CreativeItem {
  id: number
  type: CreativeType
  title: string
  date: string
  // poems and articles
  excerpt?: string
  body?: string
  // sketches
  imagePath?: string
  imageAlt?: string
  medium?: string
}

export const creativeItems: CreativeItem[] = [
  // ── POEMS ──────────────────────────────────────────────────────────────
  {
    id: 1,
    type: 'poem',
    title: 'Your Poem Title Here',
    date: '2025',
    excerpt: 'First few lines of your poem go here — this is what shows on the card before the reader opens it.',
    body: `Your full poem goes here.

Each stanza separated by a blank line.

Replace this placeholder with your actual poem.
You can write as many stanzas as you like —
the modal scrolls.

The line breaks and spacing
you put here
will be preserved exactly as written.`,
  },
  {
    id: 2,
    type: 'poem',
    title: 'Your Second Poem Title',
    date: '2024',
    excerpt: 'Opening lines of this poem appear here on the card as a teaser for the reader.',
    body: `Replace this with your second poem.

Stanza two here.

And so on — the entire poem
lives in this body field.`,
  },
  {
    id: 3,
    type: 'poem',
    title: 'Your Third Poem Title',
    date: '2024',
    excerpt: 'A short excerpt from this poem — two or three lines that give a flavour of what it is about.',
    body: `Your third poem goes here.

This can be as long as you need it to be.
The modal handles the scroll gracefully.`,
  },

  // ── ARTICLES ───────────────────────────────────────────────────────────
  {
    id: 4,
    type: 'article',
    title: 'Your Article Title Here',
    date: '2025',
    excerpt: 'One or two sentences summarising what this article is about. This is what draws the reader in on the card.',
    body: `Your full article goes here. Replace this paragraph with your actual writing.

This is the second paragraph. Articles can be as long as you need — the modal scrolls. You can structure your writing however you like: paragraphs separated by blank lines will render as distinct blocks.

Third paragraph here. Keep going for as many paragraphs as the piece requires.

You can add as many sections as you want. The reading experience inside the modal is clean and focused — just the text, your name, and the date.`,
  },
  {
    id: 5,
    type: 'article',
    title: 'Your Second Article Title',
    date: '2024',
    excerpt: 'A concise summary of this article. What is the central idea or argument it makes?',
    body: `Second article body goes here.

Paragraph two of the second article. This placeholder is just to show how the layout works — replace it entirely with your actual piece.

Continue writing for as long as the article needs.`,
  },
  {
    id: 6,
    type: 'article',
    title: 'Your Third Article Title',
    date: '2024',
    excerpt: 'What is this piece about? Summarise it in one or two lines for the card preview.',
    body: `Third article body here.

Second paragraph. The modal renders each blank-line-separated block as its own paragraph, so your natural writing structure is preserved.

Third paragraph and so on.`,
  },

  // ── SKETCHES ───────────────────────────────────────────────────────────
  // Drop your image files into /public/creative/ and update the paths below.
  {
    id: 7,
    type: 'sketch',
    title: 'Udupi Shri Krishna',
    date: '2025',
    imagePath: '/creative/20250102_205807.jpg',
    imageAlt: 'Description of what this sketch depicts',
    medium: 'Pencil Sketch + Digital Colouring',
  },
  {
    id: 8,
    type: 'sketch',
    title: 'Bansuri Krishna',
    date: '2023',
    imagePath: '/creative/IMG_20230727_105014.jpg',
    imageAlt: 'Description of what this sketch depicts',
    medium: 'Colour Pencil + Watercolor Paint',
  },
  {
    id: 9,
    type: 'sketch',
    title: 'Hanuman',
    date: '2024',
    imagePath: '/creative/IMG_20260421_205649.jpg',
    imageAlt: 'Description of what this painting depicts',
    medium: 'Pencil Sketch',
  },
  {
    id: 10,
    type: 'sketch',
    title: 'Poster Painting',
    date: '2024',
    imagePath: '/creative/IMG-20240310-WA0053.jpg',
    imageAlt: 'Description of this piece',
    medium: 'Acrylic Paint',
  },
  {
    id: 11,
    type: 'sketch',
    title: 'Rama',
    date: '2023',
    imagePath: '/creative/IMG20240101193636.jpg',
    imageAlt: 'Description of this piece',
    medium: 'Ink Pen Sketch',
  },
  {
    id: 12,
    type: 'sketch',
    title: 'Shiva Parvati',
    date: '2024',
    imagePath: '/creative/IMG20240615161313.jpg',
    imageAlt: 'Description of this piece',
    medium: 'Pencil Sketch',
  },
]