import { uid } from './store.js'

// ----------------------------------------------------------------
// Local content engine. No external API. Pure preset + template logic.
// ----------------------------------------------------------------

const HOOKS = {
  funny: [
    'Your couch is a split squat waiting to happen.',
    'Plot twist: the gym was your hallway all along.',
    'I showed up. Now you have no excuses and one dumbbell.',
  ],
  'tough love': [
    'The perfect gym is the one you actually show up to.',
    'Motivation is a myth. Showing up is a skill.',
    'You do not need more time. You need 30 honest minutes.',
  ],
  educational: [
    'You do not need a gym. You need a hallway.',
    'One dumbbell, three patterns, a full-body day.',
    'Here is what a real in-home session looks like.',
  ],
  inspirational: [
    'This started in a garage with two dumbbells.',
    'Strength is built where you already are.',
    'Ninety days ago this felt impossible.',
  ],
  'myth-busting': [
    'You do NOT need a fancy gym to get strong.',
    'Sore is not the same as progress.',
    'More equipment does not mean more results.',
  ],
  'behind-the-scenes': [
    'No mirrors, no waiting for a rack. Just work.',
    'A day on the road: 6 homes, 6 different setups.',
    'How I build a session in 60 seconds at your door.',
  ],
}

const IDEA_SHAPES = [
  '3 things you can do with {equip} and a {space}',
  'Stop waiting for the perfect gym',
  'Client wins from a {space} workout',
  '{goal}: what it actually takes',
  'The {space} is your gym now',
  'One move, three ways: {space} edition',
  'What in-home training really looks like',
  '{equip}-only full body in {time}',
]

const CTAS = [
  'Want this at your place? Apply at the link.',
  'In-home training, your space, your schedule. Link in bio.',
  'Tap the link to claim a spot. Schedule stays small on purpose.',
  'Message Jean to start.',
]

const HASHTAGS = {
  base: ['#inhometraining', '#personaltrainer', '#onsite', '#trainingwherelifehappens'],
  funny: ['#gymtok', '#fitnesshumor', '#noexcuses'],
  'tough love': ['#disciplineovermotivation', '#showup', '#consistency'],
  educational: ['#formtips', '#trainsmart', '#movementtips'],
  inspirational: ['#transformation', '#progressnotperfection', '#strongereveryday'],
  'myth-busting': ['#fitnessmyths', '#realtalk', '#trainsmart'],
  'behind-the-scenes': ['#dayinthelife', '#trainerlife', '#onlocation'],
}

const fill = (tpl, vars) =>
  tpl
    .replace('{equip}', vars.equip || 'one dumbbell')
    .replace('{space}', vars.space || 'living room')
    .replace('{goal}', vars.goal || 'Fat loss')
    .replace('{time}', vars.time || '30 minutes')

const sample = (arr, n) => {
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  return out
}

// ---- Content Idea Generator ----
export function generateIdeas({ clientType = 'any', space = 'living room', equip = 'one dumbbell', goal = 'Fat loss', tone = 'educational', count = 4 } = {}) {
  const hooks = HOOKS[tone] || HOOKS.educational
  const shapes = sample(IDEA_SHAPES, count)
  return shapes.map((shape, i) => ({
    id: uid('idea'),
    title: fill(shape, { space, equip, goal }),
    tone,
    hook: hooks[i % hooks.length],
    day: '',
    status: 'idea',
    createdAt: new Date().toISOString(),
    meta: { clientType, space, equip, goal },
  }))
}

// ---- Caption Builder ----
export function buildCaption(idea, opts = {}) {
  const tone = idea.tone || 'educational'
  const space = idea.meta?.space || opts.space || 'living room'
  const hook = idea.hook || (HOOKS[tone] || HOOKS.educational)[0]
  const cta = sample(CTAS, 1)[0]
  const tags = [...HASHTAGS.base, ...(HASHTAGS[tone] || [])].map((t) => t.replace(/\s/g, ''))
  return {
    hook,
    caption: `${hook}\n\n${idea.title}. No gym, no commute, no problem. We train in your ${space} and the progress is real.\n\n${cta}`,
    hashtags: tags,
    onScreen: [hook, '↓ watch this', idea.title],
    cta,
    shotList: defaultShots(idea),
    safety: 'Coaching content, not medical advice. Form first, ego never.',
    consentReminder: 'Confirm written/photo/video consent before featuring any client.',
  }
}

function defaultShots(idea) {
  return [
    { id: uid('sh'), type: 'Opening hook', text: idea.hook || 'Grab attention in the first second.' },
    { id: uid('sh'), type: 'Movement demo', text: `Demo the key move for "${idea.title}".` },
    { id: uid('sh'), type: 'Coaching cue', text: 'One clean cue, said out loud.' },
    { id: uid('sh'), type: 'Client-safe alternative', text: 'Show the joint-friendly regression.' },
    { id: uid('sh'), type: 'Result / win', text: 'The payoff: a rep, a smile, a number.' },
    { id: uid('sh'), type: 'CTA', text: sample(CTAS, 1)[0] },
  ]
}

// ---- Video Shot List Builder ----
export function buildShotList(title, idea) {
  return {
    id: uid('shot'),
    title: title || idea?.title || 'New shot list',
    clientId: null,
    createdAt: new Date().toISOString(),
    shots: defaultShots(idea || { hook: '', title: title || 'this clip' }),
  }
}

// ---- Client Story Builder ----
export function buildStory(client, milestone) {
  const goal = (client?.goal || 'their goal').toLowerCase()
  const win = milestone || client?.lastNotes || 'showed up and put in the work'
  const first = client?.name?.split(' ')[0] || 'This client'
  return {
    anonymous: {
      label: 'Anonymous',
      text: `One of my in-home clients just hit a milestone. Started with ${goal} in mind, and ${lower(win)} Proof that your space is enough.`,
    },
    firstName: {
      label: 'First name',
      text: `${first} came to me for ${goal}. Look at this: ${win}. Trained entirely at ${client?.locationType || 'home'}. So proud.`,
    },
    full: {
      label: 'Full testimonial',
      text: `Meet ${first}. Goal: ${goal}. Result: ${win}. We did it in their ${client?.locationType || 'home'}, no gym required. If you want this, the link is in my bio.`,
    },
  }
}

const lower = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s)

// ---- Seasonal / opportunity prompts for the dashboard ----
export const SEASONAL_IDEAS = [
  'New year, no gym: in-home reset challenge',
  'Summer prep: 6-week garage build',
  'Holiday maintenance: 20-minute anywhere workouts',
  'Back-to-school: train while the kids are out',
]
