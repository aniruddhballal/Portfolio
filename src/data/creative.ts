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
    title: 'Water Woman',
    date: '19th April 2025',
    excerpt: 'She waited with the sand covering her skin, For she thought the waves would rush to hold her hand.',
    body: `
She waited with the sand covering her skin,
For she thought the waves would rush to hold her hand.
They did, but then they collapsed back into the waters.
She thought that they loved her, but they did not?
Waves rise in beautiful patterns - only to dissolve into the waters they arose from,
Born to return to where they began their short lived journeys.
But she did feel loved, based on what she thought love was.
The waves brought gifts from the deep waters,
As if they were asking to be forgiven for having disappointed her in the past.
They promised to stay and she believed them.
But they were waves, emerging and vanishing cyclically.
Now, in doubt, she whispered:
"Am I being loved?"
"Or am I loving what cannot stay?"
"Do I ask too much?"
"Am I not enough?"
Her love turned into questions, based on fundamental conflict of ideas.
She ignored the answers she got and stayed in silence—
Because she liked it and had danced with the sea too long
To hate it for leaving repeatedly, at times when she needed it the most.
Perplexed and exhausted, she planted herself away from the shore,
and fixed her gaze on the distant waters
with shiny glimmers and the dance of the sunlight on the still waters.
This sight brought peace to her troubled mind.
The mere presence of the deep, still and silent waters was soothing.
She now stayed away from the disturbing waves,
for she liked the way the ocean existed -
Not in motion, but in presence.
The ocean, silent and deep,
soothed what the waves had once stirred.
The sun sank low, and the tides grew bold.
No matter how far away she sat, the waves still reached for her.
She had turned away— 'yet' they came.
This confused her even more, because
The attempts seemed persistent,
as if they loved her, despite and through it all.
“Do they love me?” she wondered,
as she let herself play again, in their rise and fall.
Through the night she stayed, learning at last:
to love the waves was to love their coming
and their leaving.
But that wasn't how she wanted to be loved -
sharply, irregularly - something felt incomplete.
And when dawn broke, with birds composed songs of yearning.
The orange sun emerged from under the deep waters,
and she witnessed a sunrise,
more beautiful than any before.
Now the waves receded back into the oceans—
retreating farther than ever.
The waves who once had crossed seemingly large distances
to reach for her, now slipped from her grasp.
Confusions layered themselves.
She was stranded between
the play with the restless waves
and the sight of the distant, silent sea.
The ocean - steady, glimmering, untouched and eternal-
was a soothing comfort she could only watch, never hold.
The waves, shared proximity with her and
offered joy in motion, but they left. They always left.
They promised consistency, but came in storms or silence.
Too much at times, or not enough, at other times.
Never the same.
She stood exhausted at the shore—
loving both - what reached her, and what never could.
She’d had enough noise in her mind—
the waves seemed to bring the absolute opposite of solace.
She turned her gaze to the distant sea,
unsure of its depths, unsure if it, too,
would someday shift and transform like the waves
that she once held so close.
The deep sea looked back at her,
disappointed and responded in silence observing the irony of it all:
a simple soul, healthily whole in body and mind,
planted deeply and cluelessly into the sand at the distinctive shore,
Her own indecision tearing her insides up,
She was tired and doubtful of her needs and wants beyond words,
For her claims were to have loved the shore,
but the longer she stayed there, she more she felt lost,
trying to understand the pull of the waves and the silence of the sea.
She longed to swim, and to leave the restless waves behind
and lose herself in the quiet depths.
But her doubts held her still.
the ocean was vast, and she, vastly unsure.
She turned back to the shore,
for that made her feel safe, and resonated with the word 'home'.
But clouds gathered, a storm began to stir, reflective of the state of her mind.
For she was the Goddess of Water and she was stuck in this loop -
Creating versions of water and failing to understand
The meaning to all these different forms of her own self.
She hurried away into the land, and a thunderclap cracked the sky open.
Rain poured down, soaking her as she reached for safety in vain.
She didn’t mind because she loved the rain.
In fact, it was the ocean, the ocean that she doubted and loved -
reaching her in fragments after drifting across skies,
and crossing miles, just to touch her skin.
The deep water could not come whole, so it sent what it could:
small offerings, and whispers to convey her what it was made of.
The raindrops were the same water that shaped the waves,
that danced in sunlit stillness far away in the ocean,
that roared in storms — all of it, always water.
`,
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