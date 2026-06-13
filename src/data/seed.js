// ---------------------------------------------------------------
// GenFit OnSite — seeded mock data. No backend. Demo only.
// ---------------------------------------------------------------

export const TRAINER = {
  name: 'Jean Allen',
  brand: 'GenFit OnSite',
  tagline: 'Training where life actually happens.',
  phone: '(555) 014-7782',
  email: 'Add Jean’s email',
  service_area: 'East Metro + 20 mi',
}

export const packages = [
  { id: 'pkg_starter', name: 'Starter 8', sessions: 8, price: 600, per: 75, blurb: '8 in-home sessions. Foundation + form.' },
  { id: 'pkg_build', name: 'Build Block', sessions: 12, price: 840, per: 70, blurb: '12 sessions. Real strength progression.' },
  { id: 'pkg_pro', name: 'Pro Standing', sessions: 16, price: 1040, per: 65, blurb: '16 sessions + priority scheduling.' },
]

// Exercise library powers the Session Runner + Space-to-Session generator.
export const exercises = [
  { id: 'ex_squat', name: 'Goblet Squat', pattern: 'squat', equip: ['dumbbell', 'kettlebell'], joint: ['knee'] },
  { id: 'ex_airsquat', name: 'Air Squat', pattern: 'squat', equip: ['none'], joint: ['knee'] },
  { id: 'ex_split', name: 'Split Squat', pattern: 'lunge', equip: ['none', 'dumbbell'], joint: ['knee'] },
  { id: 'ex_hinge', name: 'Hip Hinge / RDL', pattern: 'hinge', equip: ['dumbbell', 'kettlebell', 'bands'], joint: ['back'] },
  { id: 'ex_glutebridge', name: 'Glute Bridge', pattern: 'hinge', equip: ['none'], joint: [] },
  { id: 'ex_pushup', name: 'Push-Up', pattern: 'push', equip: ['none'], joint: ['shoulder'] },
  { id: 'ex_inclpush', name: 'Incline Push-Up', pattern: 'push', equip: ['none', 'bench', 'stairs'], joint: ['shoulder'] },
  { id: 'ex_dbpress', name: 'DB Floor Press', pattern: 'push', equip: ['dumbbell'], joint: ['shoulder'] },
  { id: 'ex_row', name: 'Bent DB Row', pattern: 'pull', equip: ['dumbbell', 'kettlebell'], joint: [] },
  { id: 'ex_bandrow', name: 'Band Row', pattern: 'pull', equip: ['bands'], joint: [] },
  { id: 'ex_carry', name: 'Suitcase Carry', pattern: 'carry', equip: ['dumbbell', 'kettlebell'], joint: [] },
  { id: 'ex_march', name: 'March in Place', pattern: 'cardio', equip: ['none'], joint: [] },
  { id: 'ex_stepup', name: 'Step-Up', pattern: 'lunge', equip: ['none', 'stairs', 'bench'], joint: ['knee'] },
  { id: 'ex_mtclimb', name: 'Slow Mountain Climber', pattern: 'cardio', equip: ['none'], joint: ['shoulder'] },
  { id: 'ex_jumprope', name: 'Jump Rope / Fake Rope', pattern: 'cardio', equip: ['none'], joint: ['knee'] },
  { id: 'ex_kbswing', name: 'KB Swing', pattern: 'hinge', equip: ['kettlebell'], joint: ['back'] },
  { id: 'ex_plank', name: 'Plank', pattern: 'core', equip: ['none'], joint: ['shoulder'] },
  { id: 'ex_deadbug', name: 'Dead Bug', pattern: 'core', equip: ['none'], joint: [] },
  { id: 'ex_birddog', name: 'Bird Dog', pattern: 'core', equip: ['none'], joint: ['back'] },
  { id: 'ex_catcow', name: 'Cat / Cow', pattern: 'mobility', equip: ['none'], joint: [] },
  { id: 'ex_90', name: '90/90 Hip Switch', pattern: 'mobility', equip: ['none'], joint: [] },
  { id: 'ex_tspine', name: 'T-Spine Opener', pattern: 'mobility', equip: ['none'], joint: ['shoulder'] },
  { id: 'ex_couch', name: 'Couch Stretch', pattern: 'mobility', equip: ['none'], joint: ['knee'] },
  { id: 'ex_wallslide', name: 'Wall Slide', pattern: 'mobility', equip: ['none'], joint: ['shoulder'] },
]

export const programTemplates = [
  { id: 'tpl_reset', name: 'Beginner Strength Reset', weeks: 4, days: 3, tag: 'Foundation',
    focus: 'Movement quality + base strength', blocks: ['Goblet Squat 3x8', 'Incline Push-Up 3x10', 'Band Row 3x12', 'Glute Bridge 3x12', 'Dead Bug 3x8/side'] },
  { id: 'tpl_garage', name: 'Garage Dumbbell Build', weeks: 6, days: 3, tag: 'Hypertrophy',
    focus: 'Dumbbell-only muscle build', blocks: ['DB Floor Press 4x8', 'Bent DB Row 4x10', 'Split Squat 3x8/side', 'RDL 3x10', 'Suitcase Carry 3x40yd'] },
  { id: 'tpl_busy30', name: 'Busy Professional 30', weeks: 4, days: 3, tag: 'Efficiency',
    focus: '30-min full-body density', blocks: ['Goblet Squat 4x8', 'Push-Up 4x10', 'KB Swing 4x12', 'Plank 3x40s', 'Couch Stretch 2x60s'] },
  { id: 'tpl_strong50', name: 'Strong After 50', weeks: 6, days: 3, tag: 'Longevity',
    focus: 'Joint-friendly strength + balance', blocks: ['Step-Up 3x8/side', 'Wall Slide 3x10', 'Band Row 3x12', 'Glute Bridge 3x12', 'Bird Dog 3x8/side'] },
  { id: 'tpl_mobility', name: 'Mobility + Core Rebuild', weeks: 4, days: 4, tag: 'Restore',
    focus: 'Hips, spine, core control', blocks: ['Cat / Cow 2x8', '90/90 Hip Switch 3x6', 'Dead Bug 3x8', 'Bird Dog 3x8', 'T-Spine Opener 2x8'] },
  { id: 'tpl_teen', name: 'Teen Athlete Foundation', weeks: 6, days: 3, tag: 'Athletic',
    focus: 'Safe loading + coordination', blocks: ['Air Squat 3x10', 'Push-Up 3x8', 'Step-Up 3x8', 'Plank 3x30s', 'Jump Rope 4x30s'] },
  { id: 'tpl_travel', name: 'Zero Equipment Travel', weeks: 2, days: 4, tag: 'Anywhere',
    focus: 'Bodyweight, hotel-room sized', blocks: ['Air Squat 4x12', 'Incline Push-Up 4x10', 'Split Squat 3x10', 'Plank 3x40s', 'Mountain Climber 4x20s'] },
  { id: 'tpl_fatloss', name: 'Fat Loss Support Conditioning', weeks: 6, days: 3, tag: 'Conditioning',
    focus: 'Strength + low-impact conditioning', blocks: ['Goblet Squat 3x10', 'DB Floor Press 3x10', 'KB Swing 4x15', 'March in Place 4x45s', 'Plank 3x40s'] },
]

const today = new Date()
const iso = (offsetDays = 0, h = 9, m = 0) => {
  const d = new Date(today); d.setDate(d.getDate() + offsetDays); d.setHours(h, m, 0, 0); return d.toISOString()
}

export const locations = [
  { id: 'loc_1', nickname: "Maya's Loft", type: 'apartment gym', parking: 'Visitor spots level P1, badge at gate', pet: 'No pets' },
  { id: 'loc_2', nickname: "Dev's Garage", type: 'garage', parking: 'Driveway, leave room for trash day Tue', pet: 'Big friendly lab — Rex' },
  { id: 'loc_3', nickname: 'Priya HQ', type: 'office', parking: 'Garage level 2, validate at desk', pet: 'None' },
  { id: 'loc_4', nickname: "Tom's Place", type: 'living room', parking: 'Street, 2hr limit — move at :50', pet: 'Cat hides' },
  { id: 'loc_5', nickname: 'Riverside Park', type: 'park', parking: 'North lot by pavilion', pet: 'On-leash zone' },
  { id: 'loc_6', nickname: "Sara's Condo", type: 'apartment gym', parking: 'Guest pass from front desk', pet: 'None' },
]

export const clients = [
  {
    id: 'cl_maya', name: 'Maya Okafor', status: 'green', goal: 'Build strength + confidence',
    locationId: 'loc_1', locationType: 'apartment gym', equipment: ['dumbbell', 'bands', 'machines'],
    injuries: ['Mild right shoulder'], packageId: 'pkg_build', credits: 7,
    nextSessionAt: iso(0, 9, 0), payment: 'paid', checkin: 'current',
    lastNotes: 'Cleaned up squat depth. Shoulder felt good at incline press.',
    nextFocus: 'Add load to RDL, test 3x8 floor press.', programId: 'tpl_garage',
    started: '2025-03-11', age: 34, birthday: '06-20',
  },
  {
    id: 'cl_dev', name: 'Devon Hart', status: 'yellow', goal: 'Fat loss + energy',
    locationId: 'loc_2', locationType: 'garage', equipment: ['dumbbell', 'kettlebell', 'bench'],
    injuries: ['Lower back sensitive'], packageId: 'pkg_starter', credits: 2,
    nextSessionAt: iso(0, 11, 0), payment: 'unpaid', checkin: 'missed',
    lastNotes: 'Skipped last week — work travel. Back felt tight on swings.',
    nextFocus: 'Hinge drills, keep swings light, rebuild momentum.', programId: 'tpl_fatloss',
    started: '2025-01-08', age: 41, birthday: '02-14',
  },
  {
    id: 'cl_priya', name: 'Priya Raman', status: 'green', goal: 'Stay strong, busy schedule',
    locationId: 'loc_3', locationType: 'office', equipment: ['bands', 'none'],
    injuries: [], packageId: 'pkg_pro', credits: 11,
    nextSessionAt: iso(0, 13, 30), payment: 'paid', checkin: 'current',
    lastNotes: 'Crushed the 30-min density block. Wants more conditioning.',
    nextFocus: 'Layer in KB swings, push plank to 45s.', programId: 'tpl_busy30',
    started: '2024-11-02', age: 38, birthday: '09-30',
  },
  {
    id: 'cl_tom', name: 'Tom Becker', status: 'red', goal: 'Move better, lose stiffness',
    locationId: 'loc_4', locationType: 'living room', equipment: ['none'],
    injuries: ['Right knee', 'Tight hips'], packageId: 'pkg_starter', credits: 1,
    nextSessionAt: iso(1, 10, 0), payment: 'unpaid', checkin: 'missed',
    lastNotes: 'Knee flared on step-ups. Switched to box squats, felt better.',
    nextFocus: 'Knee-safe day. Mobility heavy. Check in on pain levels.', programId: 'tpl_mobility',
    started: '2025-04-22', age: 57, birthday: '07-12',
  },
  {
    id: 'cl_sara', name: 'Sara Lindqvist', status: 'green', goal: 'Postpartum rebuild',
    locationId: 'loc_6', locationType: 'apartment gym', equipment: ['dumbbell', 'bands', 'machines'],
    injuries: ['Core / pelvic floor — cleared by MD'], packageId: 'pkg_build', credits: 9,
    nextSessionAt: iso(2, 9, 30), payment: 'paid', checkin: 'current',
    lastNotes: 'Dead bugs solid. Ready to progress glute bridges to single-leg.',
    nextFocus: 'Single-leg bridge, light goblet squats.', programId: 'tpl_reset',
    started: '2025-05-15', age: 32, birthday: '06-15',
  },
  {
    id: 'cl_marcus', name: 'Marcus Reed', status: 'yellow', goal: 'Teen athlete — basketball',
    locationId: 'loc_5', locationType: 'park', equipment: ['none', 'bands'],
    injuries: ['Growing — monitor knees'], packageId: 'pkg_starter', credits: 4,
    nextSessionAt: iso(3, 16, 0), payment: 'paid', checkin: 'current',
    lastNotes: 'Coordination improving. Rushes reps — cue tempo.',
    nextFocus: 'Tempo squats, landing mechanics.', programId: 'tpl_teen',
    started: '2025-05-30', age: 15, birthday: '11-03',
  },
]

export const invoices = [
  { id: 'inv_1', clientId: 'cl_dev', amount: 600, status: 'unpaid', due: iso(-2), label: 'Starter 8 renewal' },
  { id: 'inv_2', clientId: 'cl_tom', amount: 600, status: 'unpaid', due: iso(1), label: 'Starter 8 renewal' },
  { id: 'inv_3', clientId: 'cl_maya', amount: 840, status: 'paid', due: iso(-10), label: 'Build Block' },
  { id: 'inv_4', clientId: 'cl_priya', amount: 1040, status: 'paid', due: iso(-5), label: 'Pro Standing' },
]

export const checkins = [
  { id: 'ci_1', clientId: 'cl_maya', date: iso(-1), energy: 4, mood: 4, sleep: 4, soreness: 2, note: 'Felt strong all week.' },
  { id: 'ci_2', clientId: 'cl_priya', date: iso(-1), energy: 5, mood: 4, sleep: 3, soreness: 1, note: 'Busy but consistent.' },
  { id: 'ci_3', clientId: 'cl_sara', date: iso(-2), energy: 3, mood: 4, sleep: 2, soreness: 2, note: 'Baby up at night, still showed up.' },
]

export const progressEntries = [
  { id: 'pe_1', clientId: 'cl_maya', date: iso(-28), metric: 'Goblet Squat', value: 35, unit: 'lb' },
  { id: 'pe_2', clientId: 'cl_maya', date: iso(-14), metric: 'Goblet Squat', value: 45, unit: 'lb' },
  { id: 'pe_3', clientId: 'cl_maya', date: iso(-1), metric: 'Goblet Squat', value: 50, unit: 'lb' },
  { id: 'pe_4', clientId: 'cl_priya', date: iso(-21), metric: 'Plank', value: 30, unit: 's' },
  { id: 'pe_5', clientId: 'cl_priya', date: iso(-7), metric: 'Plank', value: 45, unit: 's' },
]

export const messages = [
  { id: 'msg_1', clientId: 'cl_maya', from: 'client', text: 'Can we go heavier next time?', date: iso(-1, 18) },
  { id: 'msg_2', clientId: 'cl_dev', from: 'client', text: 'Back at home Thursday, ready to restart.', date: iso(-1, 20) },
]

export const sessions = [
  { id: 'ses_1', clientId: 'cl_maya', date: iso(-7), completed: true, focus: 'Lower + press', rpe: 7 },
  { id: 'ses_2', clientId: 'cl_priya', date: iso(-6), completed: true, focus: '30-min density', rpe: 8 },
  { id: 'ses_3', clientId: 'cl_sara', date: iso(-5), completed: true, focus: 'Core rebuild', rpe: 5 },
]

export const waivers = [
  { id: 'wv_1', clientId: 'cl_maya', signed: true, date: '2025-03-11' },
  { id: 'wv_2', clientId: 'cl_priya', signed: true, date: '2024-11-02' },
]

export const SAFETY_LINE =
  'This app does not diagnose, treat, or provide medical advice. Stop exercise and seek medical guidance for chest pain, dizziness, fainting, unusual shortness of breath, or sharp pain.'

export function seed() {
  const clientsWithConsent = clients.map((c) => ({
    ...c,
    consent: consentByClient[c.id]?.consent || 'none',
    contentNotes: consentByClient[c.id]?.contentNotes || '',
  }))
  return {
    version: 7,
    clients: clientsWithConsent,
    sessions, programs: programTemplates, exercises, checkins,
    invoices, packages, locations, waivers, messages, progressEntries,
    // social + consent layer
    consentRecords, testimonials, contentIdeas, socialPosts, videoShotLists,
    calendar: {}, // weekday -> [ideaId]
    completedSessions: [], editedPrograms: {}, intakeSubmissions: [],
    settings: { theme: 'volt' },
  }
}

// ---------------------------------------------------------------
// SOCIAL + CONSENT LAYER
// ---------------------------------------------------------------

// Consent ladder. Each level implies the ones before it.
export const CONSENT_LEVELS = ['none', 'internal', 'testimonial', 'photo', 'video']
export const CONSENT_LABEL = {
  none: 'No sharing',
  internal: 'Internal only',
  testimonial: 'Testimonial OK',
  photo: 'Photos OK',
  video: 'Video OK',
}
export const CONSENT_RANK = { none: 0, internal: 1, testimonial: 2, photo: 3, video: 4 }
export const consentAllows = (level, need) => CONSENT_RANK[level] >= CONSENT_RANK[need]

// Per-client consent + content notes (merged into clients in seed()).
export const consentByClient = {
  cl_maya:   { consent: 'video',       contentNotes: 'Loves the camera. Great quotes. Down for clips and transformation posts.' },
  cl_dev:    { consent: 'testimonial', contentNotes: 'First name only. Shy on camera, writes a strong testimonial.' },
  cl_priya:  { consent: 'photo',       contentNotes: 'Photos OK, no video. Busy-professional angle is gold.' },
  cl_tom:    { consent: 'none',        contentNotes: 'No sharing. Do not feature anywhere, internal review only off.' },
  cl_sara:   { consent: 'internal',    contentNotes: 'Internal review only for now. Revisit after rebuild milestone.' },
  cl_marcus: { consent: 'internal',    contentNotes: 'MINOR. Internal only, parent media release not signed. Never post.' },
}

const _t = new Date()
const _iso = (off = 0) => { const d = new Date(_t); d.setDate(d.getDate() + off); return d.toISOString() }

export const consentRecords = [
  { id: 'cr_maya',   clientId: 'cl_maya',   level: 'video',       signedAt: _iso(-90), items: ['testimonial', 'firstName', 'photo', 'video', 'milestone'] },
  { id: 'cr_dev',    clientId: 'cl_dev',    level: 'testimonial', signedAt: _iso(-150), items: ['testimonial', 'firstName'] },
  { id: 'cr_priya',  clientId: 'cl_priya',  level: 'photo',       signedAt: _iso(-200), items: ['testimonial', 'firstName', 'photo', 'milestone'] },
  { id: 'cr_tom',    clientId: 'cl_tom',    level: 'none',        signedAt: _iso(-40), items: [] },
  { id: 'cr_sara',   clientId: 'cl_sara',   level: 'internal',    signedAt: _iso(-25), items: [] },
  { id: 'cr_marcus', clientId: 'cl_marcus', level: 'internal',    signedAt: _iso(-12), items: [] },
]

export const testimonials = [
  { id: 'tst_1', clientId: 'cl_maya', text: 'Jean turned my apartment gym into the only gym I need. Down 14 pounds and stronger than ever.', stars: 5, status: 'approved', date: _iso(-8) },
  { id: 'tst_2', clientId: 'cl_priya', text: 'Thirty minutes, twice a week, at my office. No excuses left and I feel incredible.', stars: 5, status: 'approved', date: _iso(-20) },
  { id: 'tst_3', clientId: 'cl_dev', text: 'I restarted three times before Jean. This time it stuck.', stars: 4, status: 'pending', date: _iso(-2) },
]

// Tone library powers the Content Idea Generator + Caption Builder.
export const TONES = ['funny', 'tough love', 'educational', 'inspirational', 'myth-busting', 'behind-the-scenes']

export const contentIdeas = [
  { id: 'idea_1', title: '3 things you can do with one dumbbell and a hallway', tone: 'educational', day: 'Monday', status: 'scheduled', hook: 'You do not need a gym. You need a hallway.', createdAt: _iso(-3) },
  { id: 'idea_2', title: 'Client wins from a garage workout', tone: 'inspirational', day: 'Tuesday', status: 'idea', hook: 'This started in a garage with two dumbbells.', createdAt: _iso(-2) },
  { id: 'idea_3', title: 'The couch is not the enemy, it is equipment', tone: 'funny', day: 'Saturday', status: 'idea', hook: 'Your couch is a split squat waiting to happen.', createdAt: _iso(-1) },
  { id: 'idea_4', title: 'Stop waiting for the perfect gym', tone: 'tough love', day: 'Thursday', status: 'posted', hook: 'The perfect gym is the one you actually show up to.', createdAt: _iso(-7) },
  { id: 'idea_5', title: 'What in-home training actually looks like', tone: 'behind-the-scenes', day: 'Wednesday', status: 'idea', hook: 'No mirrors, no waiting for a rack. Just work.', createdAt: _iso(-1) },
]

export const socialPosts = [
  { id: 'post_1', kind: 'transformation', clientId: 'cl_maya', title: 'Apartment-gym glow-up: 90 days', body: 'Three months, one apartment gym, zero excuses. Strength up, weight down, confidence through the roof.', status: 'draft', consentOk: true },
  { id: 'post_2', kind: 'testimonial', clientId: 'cl_priya', title: 'Busy professional, real results', body: '30-minute sessions at the office. Photos approved. Proof you do not need hours.', status: 'scheduled', consentOk: true },
]

export const videoShotLists = [
  {
    id: 'shot_1', title: 'One Dumbbell Hallway Flow', clientId: 'cl_maya', createdAt: _iso(-2),
    shots: [
      { id: 'sh_1', type: 'Opening hook', text: 'Hold up one dumbbell: "This is the whole gym."' },
      { id: 'sh_2', type: 'Movement demo', text: 'Goblet squat down the hallway, 3 clean reps.' },
      { id: 'sh_3', type: 'Coaching cue', text: '"Chest tall, sit between the heels."' },
      { id: 'sh_4', type: 'Client-safe alternative', text: 'Box squat to the couch for knee-sensitive folks.' },
      { id: 'sh_5', type: 'Result / win', text: 'Maya smiling: "50 pounds, ten reps, in my living room."' },
      { id: 'sh_6', type: 'CTA', text: '"Want this at your place? Apply at the link."' },
    ],
  },
]

// Default weekly content rhythm for the calendar.
export const WEEK_THEMES = {
  Monday: 'Movement tip',
  Tuesday: 'Client win',
  Wednesday: 'Behind the scenes',
  Thursday: 'Myth busting',
  Friday: 'Home workout',
  Saturday: 'Personality / funny',
  Sunday: 'Reset / planning',
}

export const TIKTOK = { handle: '@jeanonsite', url: 'https://www.tiktok.com/@jeanonsite' }
export const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@jeanonsite',
  instagram: 'https://www.instagram.com/jeanonsite',
  facebook: 'https://www.facebook.com/jeanonsite',
  youtube: 'https://www.youtube.com/@jeanonsite',
}
