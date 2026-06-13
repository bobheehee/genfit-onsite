import React from 'react'
import { Header, StatusPill, ProgressChart, Segmented } from '../components/ui.jsx'
import { fmtDay, fmtTime, uid } from '../lib/store.js'
import { CONSENT_LABEL, CONSENT_LEVELS } from '../data/seed.js'

export default function ClientPortal({ state, update, go, params }) {
  const clients = state.clients
  const [activeId, setActiveId] = React.useState(params?.id || clients[0]?.id)
  const c = clients.find((x) => x.id === activeId) || clients[0]
  const program = state.programs.find((p) => p.id === c.programId)
  const prPoints = state.progressEntries.filter((p) => p.clientId === c.id)
  const lastCheckin = state.checkins.filter((ci) => ci.clientId === c.id).slice(-1)[0]

  return (
    <div>
      <Header sub="Client portal · preview" title={c.name.split(' ')[0] + "’s space"}
        right={<StatusPill status={c.status} />} />

      <div className="px-5 space-y-4">
        {/* client switcher (demo convenience) */}
        <div className="card p-2">
          <select value={activeId} onChange={(e) => setActiveId(e.target.value)}
            className="w-full bg-transparent text-[13px] px-2 py-1" style={{ color: 'var(--ink-dim)' }}>
            {clients.map((x) => <option key={x.id} value={x.id} style={{ color: '#000' }}>{x.name}</option>)}
          </select>
        </div>

        {/* next session */}
        <div className="card p-5" style={{ borderColor: 'var(--accent)' }}>
          <div className="eyebrow mb-1" style={{ color: 'var(--accent)' }}>Next session</div>
          <div className="display text-[22px]">{fmtDay(c.nextSessionAt)} · {fmtTime(c.nextSessionAt)}</div>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>Focus: {c.nextFocus}</div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button className="btn btn-ghost text-[13px]" onClick={() => go('_noop')}>Message Jean</button>
            <button className="btn btn-line text-[13px]" onClick={() => go('_noop')}>Reschedule</button>
          </div>
        </div>

        {/* between-session assignment */}
        <div className="card p-4">
          <div className="eyebrow mb-2">Today’s between-session assignment</div>
          <p className="text-[14px]" style={{ color: 'var(--ink)' }}>
            10 min mobility: cat/cow, 90/90 hip switch, couch stretch. Log how the {c.injuries[0]?.toLowerCase() || 'body'} feels.
          </p>
        </div>

        {/* weekly check-in */}
        <div className="card p-4">
          <div className="eyebrow mb-3">Weekly check-in</div>
          <CheckinForm last={lastCheckin} />
        </div>

        {/* progress snapshot */}
        <div className="card p-4">
          <div className="eyebrow mb-3">Progress snapshot</div>
          <ProgressChart points={prPoints} unit={prPoints[0]?.unit} label={prPoints[0]?.metric || 'Strength'} />
        </div>

        {/* current program */}
        {program && (
          <div className="card p-4">
            <div className="eyebrow mb-2">Current program</div>
            <div className="display text-[17px]">{program.name}</div>
            <div className="text-[12px] mt-1" style={{ color: 'var(--ink-dim)' }}>{program.focus}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {program.blocks.slice(0, 4).map((b) => <span key={b} className="chip" data-on="false">{b}</span>)}
            </div>
          </div>
        )}

        {/* consent settings */}
        <div className="card p-4">
          <div className="eyebrow mb-3">Sharing + testimonial consent</div>
          <p className="text-[12px] mb-3" style={{ color: 'var(--ink-faint)' }}>
            You control this. Default is no sharing. Pick the most you are comfortable with.
          </p>
          <div className="space-y-2">
            {CONSENT_LEVELS.map((lvl) => {
              const on = c.consent === lvl
              return (
                <button key={lvl} className="card w-full p-3 flex items-center gap-3 text-left"
                  style={on ? { borderColor: 'var(--accent)' } : {}}
                  onClick={() => update((s) => ({ ...s, clients: s.clients.map((x) => x.id === c.id ? { ...x, consent: lvl } : x) }))}>
                  <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[11px]"
                    style={{ background: on ? 'var(--accent)' : 'var(--surface-3)', color: '#000' }}>{on ? '✓' : ''}</span>
                  <span className="text-[13px]">{CONSENT_LABEL[lvl]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* testimonial form */}
        <div className="card p-4">
          <div className="eyebrow mb-3">Leave a testimonial</div>
          <TestimonialForm client={c} update={update} />
        </div>

        {/* recent wins */}
        <div className="card p-4 mb-2">
          <div className="eyebrow mb-2">Recent wins</div>
          <ul className="space-y-2 text-[13px]">
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>★</span> {c.lastNotes}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function TestimonialForm({ client, update }) {
  const [text, setText] = React.useState('')
  const [done, setDone] = React.useState(false)
  if (done) return <div className="text-[13px]" style={{ color: 'var(--green)' }}>✓ Sent to Jean. Thank you.</div>
  return (
    <div className="space-y-3">
      <textarea className="input" rows="4" value={text} onChange={(e) => setText(e.target.value)}
        placeholder="What has changed since you started training?" />
      <button className="btn btn-primary w-full text-[13px]" disabled={!text.trim()}
        style={!text.trim() ? { opacity: 0.4 } : {}}
        onClick={() => {
          update((s) => ({
            ...s,
            testimonials: [
              { id: uid('tst'), clientId: client.id, name: client.name, text: text.trim(), stars: 5, status: 'pending', date: new Date().toISOString() },
              ...(s.testimonials || []),
            ],
          }))
          setDone(true)
        }}>
        Submit testimonial
      </button>
      <p className="text-[11px]" style={{ color: 'var(--ink-faint)' }}>
        Submitting does not make it public. Jean only shares it if your consent above allows it.
      </p>
    </div>
  )
}

function CheckinForm({ last }) {
  const [v, setV] = React.useState({ energy: 3, mood: 3, sleep: 3, soreness: 2 })
  const [done, setDone] = React.useState(false)
  const fields = [['energy', 'Energy'], ['mood', 'Mood'], ['sleep', 'Sleep'], ['soreness', 'Soreness']]
  if (done) return <div className="text-[13px]" style={{ color: 'var(--green)' }}>✓ Check-in sent to Jean. Nice work.</div>
  return (
    <div className="space-y-3">
      {fields.map(([k, l]) => (
        <div key={k}>
          <div className="flex justify-between text-[12px] mb-1">
            <span style={{ color: 'var(--ink-dim)' }}>{l}</span>
            <span className="stat-num" style={{ color: 'var(--accent)' }}>{v[k]}</span>
          </div>
          <input type="range" min="1" max="5" value={v[k]} onChange={(e) => setV({ ...v, [k]: +e.target.value })}
            className="w-full" style={{ accentColor: 'var(--accent)' }} />
        </div>
      ))}
      <button className="btn btn-primary w-full text-[13px]" onClick={() => setDone(true)}>Submit check-in</button>
    </div>
  )
}
