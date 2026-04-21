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
    title: 'Woman & the Sea',
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
    title: 'Lullaby of the Other Realm',
    date: '25th October 2024',
    excerpt: 'Lying on my bed, listening to her sing; It is like sitting next to a campfire after trekking into a cold forest, late at night',
    body: `
Lying on my bed, listening to her sing
It is like sitting next to a campfire after trekking into a cold forest, late at night.
I suddenly don’t feel lost anymore,
Or rather it doesn’t bother me as much if im lost or not.
As long as I hear her melody, I know I will find a way out, or maybe I wont-
There is a weird comforting feeling about her voice
Cleansing me of my past sins, with every note that she sings
Getting me closer to reconnecting with a higher energy
It is a lullaby but not one that puts you into any normal sleep, no
It leads me somewhere deeper.
It suddenly puts me in a dream so real,
I begin to question:
Is the world I fell asleep in any more real
Than the dream I’m now in?
Her voice lulls me to sleep, but opens my eyes
It quiets my mind, yet sets my thoughts free.
In this state of ecstasy that her voice puts me in,
I no longer accept the illusory nature of this reality.
Neither do I want to stay here in this dream—
For her voice, comes from another realm.
Her lullabies don’t just carry me into sleep, no
They help me transcend
Into a scary, featureless world
A world that does not know light,
A world that does not think.
A world where everything is a sound.
Khair, light thoughts and sounds – are all vibrations.
So, it’s not a different world, no,
But it’s a way perceive this same world,
Where everything manifests and expresses as sound.
And the visuals are nothing but illusions.
You can’t see this world,
You can only hear it and imagine its shape.
And every night, when she sings,
That’s where she takes me—
To a place where sound is the only truth.
`,
  },
  {
    id: 3,
    type: 'poem',
    title: 'The Runner’s Lament',
    date: '31st December 2024',
    excerpt: 'I have two choices, both asking me to fall off the edge; One whispers faithfully:',
    body: `
I have two choices, both asking me to fall off the edge
One whispers faithfully:
“Offer yourself to the fire, the universe shall conspire,
To guide and protect you, to shape and align your path”
The other shouts in rage:
“Fight back when the stars don’t align
Revolt against the silence, against celestial rules”
This is why I run.
Not because the universe blesses every hop and bounce,
But because it curses me.
I run because of my love for it, because of my want for excellence at it.
And because I am not supposed to.
The pain that follows—sharp, crippling—
Is it the universe’s refutation?
A warning? A denial?
Not for me? But why?
Why give me lungs and legs that help me float with the wind,
A rhythm in my heart that makes running a poetry in motion.
To later castigate me for using them?
Why carve a sculpture so intricate,
If it’s not meant to be seen by anyone?
I rage because it feels like betrayal.
If I weren’t meant to run,
Why make me fall in love with it?
Or better, why make me good at it?
I never sought dancing, I never missed it,
Why not make me indifferent,
Like I am to dancing?
Isn’t the universe cruel?
Gifting me with hunger and food,
To only deny my feast.
Gifting me with technology and the knowledge to use it,
To only deny my technological advancement?
So I revolt.
Simply because I must.
If this desperate, aching joy-
That I derive from running is truly mine,
I would pay for it by breaking rules and experiencing the pain.
Knowing the price that it comes at, I run-
It’s a battle that will leave scars on me,
But what else would my mind let me do?
When my soul was made for motion,
And some stars refuse to let my body soar?
`,
  },

  // ── ARTICLES ───────────────────────────────────────────────────────────
  {
    id: 4,
    type: 'article',
    title: 'A Phonotosynthetic World',
    date: '20th April 2026',
    excerpt: 'A world where sound is the primary energy source for plants, instead of light. How would plants evolve to harness sound energy? What would the ecology of such a world be like?',
    body: `
plants, over millions of years have evolved to make maximum and optimised utilisation of sunlight. the type of star that the planet revolves around, decides which wavelengths the plants absorb, and hence what are all the possible colours that all of the flowers, leaves and branches of plants in that planet end up taking. for example if our sun's wavelength did not peak at the green part of the spectrum - then most of the plants would have evolved naturally to be of different colours. plants are mostly green to avoid the sun's peak energy - they reflect those wavelengths off. this helps them maintain a steady, stable energy supply without damaging their internal mechanisms. an F type star (more massive and hotter than our sun) would peak in blue-UV part of the spectrum - so most of the plants would also appear white in such planetary systems. an M type star on the other hand would peak in the dark red or orange wavelengths - and hence plants there would be dark-almost black - enabling them to absorb any/all wavelengths of light energy.
now, shift perspective, haha.
imagine a world guided and moulded by sound instead of light. there doesnt exist vacuum between the star and the planet - instead there's a subtle medium – an aether that carries sound across vast distances. sunrises and sunsets wouldnt exist - there would instead be a constant source of sound/murmur/whisper/humming from the star to the planet. the planet too would have its own internal sound that all the living things in the planet can feel. so, plants here in this planet would use specific sound frequencies as their energy sources. i mean light could still exist, so some plants would evolve to use only sound energy; some, to use only light and then there would be another set of plants that use both – hybrid, using the best of both worlds.
so in this world, the plants would have internal structures like resonance chambers - tiny, tuned cavities of sorts. and only certain frequencies would vibrate these structures efficiently. the vibration energy would be converted into chemical energy (analogous to the process of photosynthesis but driven by sound instead of light). call it phonotosynthesis. energy would depend on frequency that should match the plant's tuning. when the right sound arrives – with matching frequency, sufficient amplitude, sustained over time – these structures would vibrate. Longer exposure to louder sounds of the right frequency would lead to rich, nutritious yield.
form would follow function. over generations, these plants would evolve to tune themselves to the most dominant type of sound in their surroundings. for example, the plants near waterfalls would be tuned to low, constant rumbling sounds. if the area is filled with insect swarms then maybe the plants would be tuned to special high frequencies. plants near cities would adapt to machinery/human made tones. this is like natural selection, shaped by sound instead of light.
forests would be acoustic instruments themselves – producing and consuming harmonies, their collective structures amplifying and redistributing energy.
ecologies would reorganise - quiet places would turn into deserts – regions starved of usable energy; loud environments would cause diverse and dense growth. shade and sunlight would be replaced with bass/treble zones and interference patterns causing acoustic shadows. animal life would co-evolve. some species evolve to avoid making noise (predators stay near-perfect silent). other species they could generate specific frequencies, singing or vibrating wings to stimulate plants directly, possibly triggering the release of nutrient-ruch sap in real time (symbiosis).
but realistically speaking, sound carries far lesser energy than light and it also gets dissipated sooner/more easily than light, even with this aether like medium. so, even in loud, harmonic areas, the growth rate/speed might be slow and highly sensitive. and plants could mostly become hybrid systems combining light based processes with sound harvesting – one compensating where the other lacks, depending on geographics and demographics.
`,
  },
  {
    id: 5,
    type: 'article',
    title: 'The Chinese Room Argument and the Nature of Consciousness',
    date: '17th April 2026',
    excerpt: '',
    body: `
The Chinese room argument was an idea proposed by Searle – a thought experiment that was in its essence trying to prove that no amount of computation/syntactic complexity/symbol advancement could ever add up to a conscious understanding of anything.
The setup consists of a room, a person who does not know Chinese at all sitting inside that room. But this person has a rulebook, a very detailed guidebook which is written in a language which this person understands. It tells the person the specific Chinese characters/phrases/sentences that the person should be responding with, to specific inputs. The person is locked in that room, with the book – and messages in Chinese are slid under the door.
The person’s duty would be to consider the Chinese parchments of paper as inputs and look up the rulebook, and to produce an output indistinguishable from that of a native speaker, thanks to the extensive detailing present in the rulebook. So, at the end of the day, the people outside the room would have exchanged several parchments of paper with this person – each with a message or a question in Chinese, and the person inside the locked room, with the help of the master rulebook, would be replying to all those messages or questions in Chinese, without actually ever understanding any of the symbols, what the words meant, or what any of the responses that they wrote back – ever meant.
Taking a tangent from here – its like we all have developed our own rulebooks. All of us aren’t so different from the person in the locked room. We experience, imbibe and develop our own custom, internal guidebooks – that help translate what we can sense, to what we can process. It defines how we process what we sense. It is a reference manual that mostly contains “how to respond” to an extensive set of events – and these how to’s can be direct, indirect or chained to one another.
This makes most of one’s life – a script. Most of our daily interactions and emotional expressions are vlookups and xlookups we do, consulting our personal manuals – deciding how to react – instinctively. And that’s what makes our responses feel natural. We have a syntax, and everyone has their own syntax – when relationships (any sort) between two individuals fail, the incompatibility can be seen as misalignment of these internal codebases/rulebooks. The degree of misalignment and alignment can vary, it’s a multidimensional space of vectors.
Outside these “most interactions” are some few interactions that could happen outside the rulebook. A fraction of a second of eye-contact, a tiny expression through wrinkles on the face, or shift in body language – these could act as a direct individual-to-individual interaction. Bypassing the step where both individuals look through their own rulebook internally, to decide what flows as logical and sensible to them.
These few moments don’t have the individuals locked in their own rooms, or standing behind doors. These are raw, biochemphysiological (bruh) and immediate. These moments or interactions don’t need any translation, because the meaning is felt intuitively even before the minds of the two individuals decide to add noise to the signals by trying to route and process it via the rulebook.
True intimacy could be an act of putting this rulebook down – while we spend most of our time in the default social state, there exists this real backdoor – to simply step out of the room we have locked ourselves in – and simply “be” with the other person without the need of sliding parchments or translating events into feelings that only one of the two can make sense out of.
Extending searle’s idea – while the individuals locked in their rooms don’t possess consciousness or actual understanding; the whole setup – consisting of the rooms, the messages, the rulebooks, the people – this whole setup does. Semantic meaning for the codebases arise when components are used together, made to implement a certain feature or idea, the individual codefiles themselves, on their own – with perfect syntax – might barely hold any semantic value.
`,
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