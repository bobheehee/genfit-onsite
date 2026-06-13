import React from 'react'
import { Header, StatusPill, ProgressChart } from '../components/ui.jsx'
import { ConsentBadge } from '../components/social.jsx'
import { CONSENT_LEVELS, CONSENT_LABEL, SAFETY_LINE } from '../data/seed.js'
import { fmtDay, fmtTime } from '../lib/store.js'
import { FLOURISHES } from '../lib/voice.js'

// Real World Notes — the stuff that actually decides how a session goes.
const RW_FIELDS = [
  ['parking', 'Parking'],
  ['pets', 'Pets'],
  ['gateCode', 'Gate code'],
  ['flooring', 'Weird flooring'],
  ['spaceLimits', 'Space limits'],
  ['equipment', 'Equipment actually available'],
  ['patterns', 'Excuses / patterns'],
  ['motivates', 'What motivates them'],
  ['dontSay', 'What not to say'],
  ['tone', 'Best coaching tone'],
]

export default function ClientDetail({ state, update, go, params, toast }) {
  const c = state.clients.find((x) => x.id === params?.id) || state.clients[0]
  const loc = state.locations.find((l) => l.id === c.locationId)
  const program = state.programs.find((p) => p.id === c.programId)
  const pkg = state.packages.find((p) => p.id === c.packageId)
  const prPoints = state.progressEntries.filter((p) => p.clientId === c.id)
  const [editConsent, setEditConsent] = React.useState(false)

  const patch = (fields) => update((s) => ({ ...s, clients: s.clients.map((x) => (x.id === c.id ? { ...x, ...fields } : x)) }))
  const setConsent = (level) => { patch({ consent: level }); toast?.(`Consent set: ${CONSENT_LABEL[level]}`); setEditConsent(false) }
  const togglePaid = () => { patch({ payment: c.payment === 'paid' ? 'unpaid' : 'paid' }); toast?.('Payment updated') }

  return (
    <div>
      <Header sub="Client" title={c.name} onBack={() => go('dashboard')} right={<StatusPill status={c.status} />} />

      <div className="px-5 space-y-4">
        {/* headline */}
        <div className="card p-5" style={{ borderColor: 'var(--accent)' }}>
          <div className="eyebrow mb-1" style={{ color: 'var(--accent)' }}>Goal</div>
          <div className="display text-[20px] leading-tight">{c.goal}</div>
          {c.milestone && <div className="eyebrow mt-2" style={{ color: 'var(--accent)' }}>★ Milestone: {c.milestone}</div>}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat label="Sessions" v={c.credits} sub="credits left" />
            <Stat label="Done" v={c.sessionsDone ?? '—'} sub="logged" />
            <Stat label="Package" v={pkg ? pkg.sessions : '—'} sub={pkg?.name?.split(' ')[0] || ''} />
          </div>
        </div>

        {/* primary actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-primary" onClick={() => go('session', { id: c.id })}>▶ Run session</button>
          <button className="btn btn-line" onClick={() => go('portal', { id: c.id })}>Open portal</button>
          <button className="btn btn-ghost text-[13px]" onClick={() => go('programs')}>Assign program</button>
          <button className="btn btn-ghost text-[13px]" onClick={togglePaid}>Mark {c.payment === 'paid' ? 'unpaid' : 'paid'}</button>
        </div>

        {/* next session */}
        <div className="card p-4">
          <div className="eyebrow mb-2">Next session</div>
          <div className="display text-[17px]">{fmtDay(c.nextSessionAt)} · {fmtTime(c.nextSessionAt)}</div>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>Focus: {c.nextFocus}</div>
        </div>

        {/* setup */}
        <div className="card p-4 space-y-3">
          <Field label="Location type" v={c.locationType} />
          {loc && <Field label="Where" v={`${loc.nickname} · ${loc.parking}`} />}
          <Field label="Equipment" v={c.equipment.join(', ')} />
          <Field label="Injuries / limits" v={c.injuries.length ? c.injuries.join(' · ') : 'None noted'} danger={c.injuries.length > 0} />
          <Field label="Payment" v={c.payment} danger={c.payment === 'unpaid'} />
          <Field label="Check-in" v={c.checkin} danger={c.checkin !== 'current'} />
        </div>

        {/* No-BS client read + real world notes */}
        {(c.clientRead || c.realWorld) && (
          <div className="card p-4">
            <div className="eyebrow mb-3">Real world notes</div>
            {c.clientRead && (
              <div className="rounded-xl p-3 mb-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--accent-soft)' }}>
                <div className="eyebrow mb-1" style={{ color: 'var(--accent)' }}>No-BS client read</div>
                <p className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>{c.clientRead}</p>
              </div>
            )}
            {c.realWorld && (
              <div className="space-y-3">
                {RW_FIELDS.map(([k, label]) => {
                  const val = c.realWorld[k]
                  if (!val || val === '—') return null
                  return <RWRow key={k} label={label} v={val} />
                })}
              </div>
            )}
            <p className="text-[11px] mt-4" style={{ color: 'var(--ink-faint)' }}>{FLOURISHES.excusesLogged}</p>
          </div>
        )}

        {/* notes */}
        <div className="card p-4">
          <div className="eyebrow mb-2">Last session notes</div>
          <p className="text-[14px]" style={{ color: 'var(--ink)' }}>{c.lastNotes}</p>
          <div className="eyebrow mt-3 mb-2">Next focus</div>
          <p className="text-[14px]" style={{ color: 'var(--ink-dim)' }}>{c.nextFocus}</p>
        </div>

        {/* progress */}
        <div className="card p-4">
          <div className="eyebrow mb-3">Progress</div>
          <ProgressChart points={prPoints} unit={prPoints[0]?.unit} label={prPoints[0]?.metric || 'No metric logged'} />
        </div>

        {/* current program */}
        {program && (
          <div className="card p-4">
            <div className="eyebrow mb-2">Current program</div>
            <div className="display text-[16px]">{program.name}</div>
            <div className="text-[12px] mt-1" style={{ color: 'var(--ink-dim)' }}>{program.focus}</div>
          </div>
        )}

        {/* SOCIAL CONSENT — the gate for everything in Social Studio */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="eyebrow">Social consent</div>
            <button className="eyebrow" style={{ color: 'var(--accent)' }} onClick={() => setEditConsent((e) => !e)}>{editConsent ? 'Close' : 'Change'}</button>
          </div>
          <div className="mt-2"><ConsentBadge level={c.consent} /></div>
          {editConsent && (
            <div className="mt-3 space-y-2">
              {CONSENT_LEVELS.map((lvl) => (
                <button key={lvl} onClick={() => setConsent(lvl)}
                  className="card w-full p-3 text-left flex items-center justify-between"
                  style={c.consent === lvl ? { borderColor: 'var(--accent)' } : {}}>
                  <span className="text-[13px] font-semibold">{CONSENT_LABEL[lvl]}</span>
                  {c.consent === lvl && <span style={{ color: 'var(--accent)' }}>✓</span>}
                </button>
              ))}
              <p className="text-[11px]" style={{ color: 'var(--ink-faint)' }}>Default is no sharing. Only raise this with the client's explicit, documented permission.</p>
            </div>
          )}
          <div className="eyebrow mt-3 mb-1">Content notes</div>
          <p className="text-[13px]" style={{ color: 'var(--ink-dim)' }}>{c.contentNotes || 'No notes yet.'}</p>
        </div>

        <p className="text-[11px] pb-2" style={{ color: 'var(--ink-faint)' }}>{SAFETY_LINE}</p>
      </div>
    </div>
  )
}

function Stat({ label, v, sub }) {
  return (
    <div className="rounded-lg px-2 py-2" style={{ background: 'var(--surface-2)' }}>
      <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--ink-faint)' }}>{label}</div>
      <div className="stat-num text-[18px]">{v}</div>
      <div className="text-[9px]" style={{ color: 'var(--ink-faint)' }}>{sub}</div>
    </div>
  )
}
function RWRow({ label, v }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--ink-faint)' }}>{label}</div>
      <div className="text-[13px]" style={{ color: 'var(--ink)' }}>{v}</div>
    </div>
  )
}
function Field({ label, v, danger }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[12px] shrink-0" style={{ color: 'var(--ink-faint)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right capitalize" style={{ color: danger ? 'var(--red)' : 'var(--ink)' }}>{v}</span>
    </div>
  )
}
