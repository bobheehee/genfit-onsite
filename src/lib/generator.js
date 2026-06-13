import { exercises } from '../data/seed.js'
import { uid } from './store.js'

// Map of which joint each status protects (we avoid loading that joint).
const STATUS_AVOID = {
  normal: [],
  sore: [],
  'low energy': [],
  'knee sensitive': ['knee'],
  'back sensitive': ['back'],
  'shoulder sensitive': ['shoulder'],
}

// Space affects what's realistic (park/driveway = no machines/bench).
const SPACE_EQUIP_BLOCK = {
  'living room': ['machines', 'bench'],
  driveway: ['machines'],
  park: ['machines', 'bench'],
  office: ['machines', 'kettlebell'],
  garage: [],
  'apartment gym': [],
}

function pick(pattern, allowed, avoidJoints, n = 1) {
  const pool = exercises.filter(
    (e) =>
      e.pattern === pattern &&
      e.equip.some((q) => allowed.includes(q)) &&
      !e.joint.some((j) => avoidJoints.includes(j))
  )
  // Fallback to bodyweight in that pattern if nothing matches.
  const safe = pool.length ? pool : exercises.filter((e) => e.pattern === pattern && e.equip.includes('none') && !e.joint.some((j) => avoidJoints.includes(j)))
  return safe.slice(0, n)
}

function reps(status) {
  if (status === 'low energy' || status === 'sore') return { sets: 2, rep: '8–10', rest: '60s', rpe: 'RPE 5–6' }
  return { sets: 3, rep: '8–12', rest: '75s', rpe: 'RPE 7' }
}

// time -> how many strength + conditioning slots.
const TIME_PLAN = {
  20: { strength: 2, cond: 1, mobility: 2 },
  30: { strength: 3, cond: 1, mobility: 2 },
  45: { strength: 4, cond: 2, mobility: 3 },
  60: { strength: 5, cond: 2, mobility: 3 },
}

export function generateSession({ time = 30, space = 'living room', equipment = ['none'], status = 'normal' }) {
  const avoid = STATUS_AVOID[status] || []
  const blocked = SPACE_EQUIP_BLOCK[space] || []
  const allowed = ['none', ...equipment.filter((e) => e !== 'none' && !blocked.includes(e))]
  const plan = TIME_PLAN[time] || TIME_PLAN[30]
  const dose = reps(status)

  const row = (ex, note = '') => ({
    id: uid('row'),
    exId: ex.id,
    name: ex.name,
    sets: dose.sets,
    reps: dose.rep,
    load: ex.equip.includes('none') && allowed.length === 1 ? 'Bodyweight' : '',
    rpe: dose.rpe,
    rest: dose.rest,
    note,
  })

  // Warmup is always low-skill activation.
  const warmup = [
    { id: uid('row'), name: 'Cat / Cow', sets: 1, reps: '8', load: '', rpe: 'easy', rest: '-', note: 'Wake the spine' },
    { id: uid('row'), name: 'March in Place', sets: 1, reps: '45s', load: '', rpe: 'easy', rest: '-', note: 'Raise heart rate' },
    { id: uid('row'), name: '90/90 Hip Switch', sets: 1, reps: '6/side', load: '', rpe: 'easy', rest: '-', note: '' },
  ]

  const strengthPatterns = ['squat', 'push', 'hinge', 'pull', 'lunge']
  const strength = []
  for (let i = 0; i < plan.strength; i++) {
    const got = pick(strengthPatterns[i % strengthPatterns.length], allowed, avoid, 1)
    if (got[0]) strength.push(row(got[0]))
  }

  const condChoices = pick('cardio', allowed, avoid, plan.cond)
    .concat(pick('carry', allowed, avoid, 1))
    .slice(0, plan.cond)
  const conditioning = condChoices.map((ex) => ({
    ...row(ex),
    reps: status === 'low energy' ? '30s' : '40s',
    rpe: status === 'low energy' ? 'RPE 5' : 'RPE 7',
  }))

  const mobChoices = pick('mobility', allowed, avoid, plan.mobility)
  const mobility = mobChoices.map((ex) => ({ ...row(ex), sets: 1, reps: '45s', rpe: 'easy', rest: '-' }))

  return {
    id: uid('gen'),
    meta: { time, space, equipment: allowed, status },
    title: `${time}-min ${space} session`,
    warmup,
    strength,
    conditioning: conditioning.length ? conditioning : [{ id: uid('row'), name: 'Slow Mountain Climber', sets: 3, reps: '30s', load: '', rpe: 'RPE 6', rest: '45s', note: '' }],
    mobility: mobility.length ? mobility : warmup.slice(0, 2),
  }
}

// Substitution suggestions for the Session Runner.
export function substitutesFor(exId) {
  const ex = exercises.find((e) => e.id === exId)
  if (!ex) return []
  return exercises.filter((e) => e.pattern === ex.pattern && e.id !== exId).map((e) => e.name)
}
