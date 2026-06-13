import React from 'react'
import { Header } from '../components/ui.jsx'
import { SAFETY_LINE } from '../data/seed.js'
import { uid } from '../lib/store.js'

const STEPS = [
  'Basic info', 'Goals', 'Training history', 'Readiness screening',
  'Injuries / limits', 'Home setup', 'Schedule', 'Social consent', 'Waiver', 'Summary',
]

const SOCIAL_ITEMS = [
  'Written testimonial',
  'First name only',
  'Before / after photos',
  'Workout clips',
  'Progress milestones',
  'Anonymous story',
]

const EQUIP = ['none', 'bands', 'dumbbells', 'kettlebell', 'bench', 'stairs', 'machines']
const SPACES = ['living room', 'garage', 'driveway', 'apartment gym', 'office', 'park']
const READINESS = [
  'Chest pain during activity',
  'Dizziness or fainting',
  'Heart condition diagnosed',
  'Bone/joint problem',
  'On medication for blood pressure',
  'Doctor said avoid exercise',
]

export default function Intake({ update, go }) {
  const [step, setStep] = React.useState(0)
  const [f, setF] = React.useState({
    name: '', email: '', age: '', goal: '', goalDetail: '',
    history: 'beginner', equipment: ['none'], space: 'living room',
    injuries: '', readiness: [], days: [],
    social: [], noShare: true, consent: false,
  })
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const toggle = (k, v) => setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }))

  // turn the checkbox picks into a single consent level
  function socialLevel() {
    if (f.noShare || f.social.length === 0) return 'none'
    if (f.social.includes('Workout clips')) return 'video'
    if (f.social.includes('Before / after photos')) return 'photo'
    if (f.social.includes('Written testimonial')) return 'testimonial'
    return 'internal'
  }

  // picking a share item turns off "no sharing", and vice versa
  function toggleSocial(item) {
    setF((p) => {
      const on = p.social.includes(item)
      const social = on ? p.social.filter((x) => x !== item) : [...p.social, item]
      return { ...p, social, noShare: social.length === 0 }
    })
  }
  function setNoShare() {
    setF((p) => ({ ...p, social: [], noShare: true }))
  }

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => (step === 0 ? go('landing') : setStep((s) => s - 1))

  const flagged = f.readiness.length > 0

  function submit() {
    const newClient = {
      id: uid('cl'),
      name: f.name || 'New Client',
      status: flagged ? 'yellow' : 'green',
      goal: f.goal || 'General fitness',
      locationId: null, locationType: f.space,
      equipment: f.equipment.map((e) => (e === 'dumbbells' ? 'dumbbell' : e)),
      injuries: f.injuries ? [f.injuries] : [],
      packageId: 'pkg_starter', credits: 8,
      nextSessionAt: new Date(Date.now() + 86400000).toISOString(),
      payment: 'unpaid', checkin: 'current',
      lastNotes: 'New intake — first session not run yet.',
      nextFocus: 'Assessment + movement screen.', programId: 'tpl_reset',
      started: new Date().toISOString().slice(0, 10),
      age: +f.age || null, birthday: null,
      consent: socialLevel(),
      contentNotes: f.noShare ? 'No social sharing (set at intake).' : `Intake consent: ${f.social.join(', ')}.`,
    }
    update((s) => ({
      ...s,
      clients: [...s.clients, newClient],
      consentRecords: [
        { id: uid('cr'), clientId: newClient.id, level: socialLevel(), signedAt: new Date().toISOString(), items: f.social },
        ...(s.consentRecords || []),
      ],
      intakeSubmissions: [{ id: uid('intake'), at: new Date().toISOString(), name: newClient.name }, ...(s.intakeSubmissions || [])],
    }))
    go('client', { id: newClient.id })
  }

  return (
    <div>
      <Header sub={`Step ${step + 1} of ${STEPS.length}`} title={STEPS[step]} onBack={back} />

      {/* progress bar */}
      <div className="px-5 mb-5">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
          <div className="h-full transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'var(--accent)' }} />
        </div>
      </div>

      <div className="px-5 space-y-4 animate-in" key={step}>
        {step === 0 && (
          <>
            <Field label="Full name"><input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></Field>
            <Field label="Email"><input className="input" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" /></Field>
            <Field label="Age"><input className="input" inputMode="numeric" value={f.age} onChange={(e) => set('age', e.target.value)} placeholder="35" /></Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Primary goal">
              <div className="grid grid-cols-2 gap-2">
                {['Fat loss', 'Build strength', 'Move better', 'Athletic performance', 'General health', 'Comeback'].map((g) => (
                  <button key={g} className="chip py-3" data-on={f.goal === g} onClick={() => set('goal', g)}>{g}</button>
                ))}
              </div>
            </Field>
            <Field label="Anything specific?"><textarea className="input" rows="3" value={f.goalDetail} onChange={(e) => set('goalDetail', e.target.value)} placeholder="e.g. deadlift bodyweight, fit into old jeans, keep up with my kids" /></Field>
          </>
        )}

        {step === 2 && (
          <Field label="Training history">
            <div className="space-y-2">
              {[['beginner', 'New / returning after a long break'], ['some', 'Trained on and off'], ['consistent', 'Consistent for 1+ year']].map(([v, l]) => (
                <button key={v} className="card w-full p-4 text-left" style={f.history === v ? { borderColor: 'var(--accent)' } : {}} onClick={() => set('history', v)}>
                  <div className="font-semibold text-[14px] capitalize">{v}</div>
                  <div className="text-[12px]" style={{ color: 'var(--ink-dim)' }}>{l}</div>
                </button>
              ))}
            </div>
          </Field>
        )}

        {step === 3 && (
          <>
            <div className="rounded-xl p-4 mb-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
              <div className="eyebrow mb-1">Readiness screen</div>
              <p className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>Check any that apply. This isn’t a diagnosis — it tells Jean where to be careful.</p>
            </div>
            <div className="space-y-2">
              {READINESS.map((r) => (
                <button key={r} className="card w-full p-3 flex items-center gap-3 text-left"
                  style={f.readiness.includes(r) ? { borderColor: 'var(--yellow)' } : {}} onClick={() => toggle('readiness', r)}>
                  <span className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center text-[12px]"
                    style={{ background: f.readiness.includes(r) ? 'var(--yellow)' : 'var(--surface-3)', color: '#000' }}>
                    {f.readiness.includes(r) ? '✓' : ''}
                  </span>
                  <span className="text-[13px]">{r}</span>
                </button>
              ))}
            </div>
            {flagged && (
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,197,61,0.1)', border: '1px solid var(--yellow)' }}>
                <p className="text-[12px]" style={{ color: 'var(--yellow)' }}>Flagged. Jean will recommend medical clearance before loading. {SAFETY_LINE}</p>
              </div>
            )}
          </>
        )}

        {step === 4 && (
          <Field label="Injuries or limitations">
            <textarea className="input" rows="4" value={f.injuries} onChange={(e) => set('injuries', e.target.value)}
              placeholder="e.g. right knee sensitive on stairs, lower back tight in the morning" />
            <p className="text-[12px] mt-2" style={{ color: 'var(--ink-faint)' }}>{SAFETY_LINE}</p>
          </Field>
        )}

        {step === 5 && (
          <>
            <Field label="Where will you train?">
              <div className="flex flex-wrap gap-2">
                {SPACES.map((s) => <button key={s} className="chip py-2.5" data-on={f.space === s} onClick={() => set('space', s)}>{s}</button>)}
              </div>
            </Field>
            <Field label="Equipment you have">
              <div className="flex flex-wrap gap-2">
                {EQUIP.map((e) => <button key={e} className="chip py-2.5" data-on={f.equipment.includes(e)} onClick={() => toggle('equipment', e)}>{e}</button>)}
              </div>
            </Field>
          </>
        )}

        {step === 6 && (
          <Field label="Preferred training days">
            <div className="grid grid-cols-4 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <button key={d} className="chip py-3 justify-center text-center" data-on={f.days.includes(d)} onClick={() => toggle('days', d)}>{d}</button>
              ))}
            </div>
          </Field>
        )}

        {step === 7 && (
          <>
            <div className="rounded-xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
              <div className="eyebrow mb-1">Social + testimonial consent</div>
              <p className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>
                Default is no sharing. Nothing about you goes public unless you check it here, and you can change this anytime.
              </p>
            </div>

            <button className="card w-full p-4 flex items-center gap-3 text-left"
              style={f.noShare ? { borderColor: 'var(--accent)' } : {}} onClick={setNoShare}>
              <span className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center"
                style={{ background: f.noShare ? 'var(--accent)' : 'var(--surface-3)', color: '#000' }}>{f.noShare ? '✓' : ''}</span>
              <span className="text-[14px] font-semibold">No social sharing</span>
            </button>

            <div className="eyebrow pt-1" style={{ color: 'var(--ink-faint)' }}>Or pick what you are comfortable with</div>
            <div className="space-y-2">
              {SOCIAL_ITEMS.map((item) => {
                const on = f.social.includes(item)
                return (
                  <button key={item} className="card w-full p-3 flex items-center gap-3 text-left"
                    style={on ? { borderColor: 'var(--accent)' } : {}} onClick={() => toggleSocial(item)}>
                    <span className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center text-[12px]"
                      style={{ background: on ? 'var(--accent)' : 'var(--surface-3)', color: '#000' }}>{on ? '✓' : ''}</span>
                    <span className="text-[13px]">{item}</span>
                  </button>
                )
              })}
            </div>
            <div className="card p-3 flex items-center justify-between">
              <span className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>Resulting permission</span>
              <span className="text-[13px] font-semibold" style={{ color: f.noShare ? 'var(--ink-dim)' : 'var(--accent)' }}>
                {f.noShare ? 'No sharing' : socialLevel()}
              </span>
            </div>
          </>
        )}

        {step === 8 && (
          <>
            <div className="card p-4">
              <div className="eyebrow mb-2">Waiver acknowledgement</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
                I understand training carries inherent risk. {SAFETY_LINE} I confirm the info above is accurate.
              </p>
            </div>
            <button className="card w-full p-4 flex items-center gap-3 text-left"
              style={f.consent ? { borderColor: 'var(--accent)' } : {}} onClick={() => set('consent', !f.consent)}>
              <span className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center"
                style={{ background: f.consent ? 'var(--accent)' : 'var(--surface-3)', color: '#000' }}>{f.consent ? '✓' : ''}</span>
              <span className="text-[14px] font-semibold">I agree and acknowledge.</span>
            </button>
          </>
        )}

        {step === 9 && (
          <div className="space-y-3">
            <div className="eyebrow">Review your application</div>
            <Summary label="Name" v={f.name || '—'} />
            <Summary label="Goal" v={f.goal || '—'} />
            <Summary label="History" v={f.history} />
            <Summary label="Space" v={f.space} />
            <Summary label="Equipment" v={f.equipment.join(', ')} />
            <Summary label="Readiness flags" v={f.readiness.length ? `${f.readiness.length} flagged` : 'None'} danger={flagged} />
            <Summary label="Injuries" v={f.injuries || 'None noted'} />
            <Summary label="Social consent" v={f.noShare ? 'No sharing' : socialLevel()} />
            <Summary label="Waiver" v={f.consent ? 'Signed' : 'Not signed'} danger={!f.consent} />
          </div>
        )}
      </div>

      {/* footer nav */}
      <div className="px-5 mt-6 mb-2">
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary w-full" onClick={next}
            disabled={step === 8 && !f.consent}
            style={step === 8 && !f.consent ? { opacity: 0.4 } : {}}>
            Continue →
          </button>
        ) : (
          <button className="btn btn-primary w-full" onClick={submit} disabled={!f.consent}
            style={!f.consent ? { opacity: 0.4 } : {}}>
            Submit application
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>
}
function Summary({ label, v, danger }) {
  return (
    <div className="card p-3 flex items-center justify-between">
      <span className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right max-w-[60%]" style={{ color: danger ? 'var(--red)' : 'var(--ink)' }}>{v}</span>
    </div>
  )
}
