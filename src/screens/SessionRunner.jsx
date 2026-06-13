import React from 'react'
import { Header, SessionBlock, ExerciseRow, Segmented } from '../components/ui.jsx'
import { generateSession, substitutesFor } from '../lib/generator.js'
import { uid } from '../lib/store.js'

const TIMES = [20, 30, 45, 60]
const SPACES = ['living room', 'garage', 'driveway', 'apartment gym', 'office', 'park']
const EQUIP = ['none', 'bands', 'dumbbell', 'kettlebell', 'bench', 'stairs', 'machines']
const STATUS = ['normal', 'sore', 'low energy', 'knee sensitive', 'back sensitive', 'shoulder sensitive']

export default function SessionRunner({ state, update, go, params, toast }) {
  const clients = state.clients
  const [clientId, setClientId] = React.useState(params?.id || clients[0]?.id)
  const client = clients.find((c) => c.id === clientId) || clients[0]

  // generator inputs — pre-seed from client setup
  const [cfg, setCfg] = React.useState({
    time: 45,
    space: client.locationType,
    equipment: client.equipment.length ? client.equipment : ['none'],
    status: 'normal',
  })
  const [session, setSession] = React.useState(null)
  const [notes, setNotes] = React.useState('')
  const [content, setContent] = React.useState([])

  const toggleContent = (tag) =>
    setContent((p) => (p.includes(tag) ? p.filter((x) => x !== tag) : [...p, tag]))

  const toggleEquip = (e) =>
    setCfg((p) => ({ ...p, equipment: p.equipment.includes(e) ? p.equipment.filter((x) => x !== e) : [...p.equipment, e] }))

  function generate() {
    setSession(generateSession(cfg))
    toast?.('Session built. Edit anything before you run it.')
  }

  function editRow(block, row) {
    setSession((s) => ({ ...s, [block]: s[block].map((r) => (r.id === row.id ? row : r)) }))
  }

  function complete() {
    const doNotShare = content.includes('Do not share')
    const rec = {
      id: uid('done'), clientId: client.id, date: new Date().toISOString(),
      cfg: session.meta, notes, blocks: session, content,
    }
    // if something content-worthy happened and the client did not block it,
    // drop a draft idea into the social library so it is not lost.
    const shareable = content.filter((t) => t !== 'Do not share' && t !== 'Ask permission later')
    const makeIdea = shareable.length > 0 && !doNotShare
    const idea = makeIdea ? {
      id: uid('idea'),
      title: `${client.name.split(' ')[0]}: ${shareable[0]}`,
      tone: 'behind-the-scenes',
      day: 'Wednesday',
      status: 'idea',
      hook: `Real session, real ${shareable[0].toLowerCase()}.`,
      angle: shareable.join(' · '),
      clientId: client.id,
      needsConsent: !(client.consent === 'video' || client.consent === 'photo'),
      source: 'session',
      createdAt: new Date().toISOString(),
    } : null

    update((s) => ({
      ...s,
      completedSessions: [rec, ...(s.completedSessions || [])],
      contentIdeas: idea ? [idea, ...(s.contentIdeas || [])] : s.contentIdeas,
      clients: s.clients.map((c) =>
        c.id === client.id ? { ...c, credits: Math.max(0, c.credits - 1), lastNotes: notes || c.lastNotes, checkin: 'current' } : c
      ),
    }))
    toast?.(makeIdea ? 'Session logged. Draft saved to Social Studio.' : 'Session logged. Credit used.')
    setSession(null)
    setNotes('')
    setContent([])
    go('client', { id: client.id })
  }

  return (
    <div>
      <Header sub="Session runner" title={session ? 'Run it' : 'Space → Session'}
        right={<span className="stat-num text-[12px]" style={{ color: 'var(--ink-faint)' }}>{client.credits} credits</span>} />

      <div className="px-5 space-y-4">
        {/* client selector */}
        <div className="card p-2">
          <select value={clientId} onChange={(e) => { setClientId(e.target.value); setSession(null) }}
            className="w-full bg-transparent text-[14px] px-2 py-2 font-semibold" style={{ color: 'var(--ink)' }}>
            {clients.map((c) => <option key={c.id} value={c.id} style={{ color: '#000' }}>{c.name} · {c.locationType}</option>)}
          </select>
        </div>

        {client.injuries.length > 0 && (
          <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,92,92,0.08)', border: '1px solid rgba(255,92,92,0.3)' }}>
            <span className="eyebrow" style={{ color: 'var(--red)' }}>Watch:</span>
            <span className="text-[12px] ml-2" style={{ color: 'var(--ink-dim)' }}>{client.injuries.join(' · ')}</span>
          </div>
        )}

        {!session ? (
          <>
            {/* GENERATOR PANEL — the "mixer" */}
            <div className="card p-5 space-y-5">
              <div>
                <div className="eyebrow mb-2">Available time</div>
                <Segmented options={TIMES.map((t) => ({ value: t, label: `${t}m` }))} value={cfg.time} onChange={(v) => setCfg({ ...cfg, time: v })} />
              </div>
              <div>
                <div className="eyebrow mb-2">Space</div>
                <div className="flex flex-wrap gap-2">
                  {SPACES.map((s) => <button key={s} className="chip py-2.5" data-on={cfg.space === s} onClick={() => setCfg({ ...cfg, space: s })}>{s}</button>)}
                </div>
              </div>
              <div>
                <div className="eyebrow mb-2">Equipment on hand</div>
                <div className="flex flex-wrap gap-2">
                  {EQUIP.map((e) => <button key={e} className="chip py-2.5" data-on={cfg.equipment.includes(e)} onClick={() => toggleEquip(e)}>{e}</button>)}
                </div>
              </div>
              <div>
                <div className="eyebrow mb-2">How’s the client today?</div>
                <div className="flex flex-wrap gap-2">
                  {STATUS.map((s) => <button key={s} className="chip py-2.5" data-on={cfg.status === s} onClick={() => setCfg({ ...cfg, status: s })}>{s}</button>)}
                </div>
              </div>
              <button className="btn btn-primary w-full text-[16px]" onClick={generate}>⚡ Generate session</button>
            </div>
            <p className="text-[12px] text-center" style={{ color: 'var(--ink-faint)' }}>
              Built from local preset logic. Pick a program template instead in Build.
            </p>
          </>
        ) : (
          <>
            <Timer />

            <div className="space-y-3">
              <SessionBlock title="Warmup" accent="var(--yellow)">
                {session.warmup.map((r) => <ExerciseRow key={r.id} row={r} />)}
              </SessionBlock>

              <SessionBlock title="Strength block" accent="var(--accent)">
                {session.strength.map((r) => (
                  <ExerciseRow key={r.id} row={r} onChange={(nr) => editRow('strength', nr)}
                    subs={substitutesFor(r.exId)} />
                ))}
              </SessionBlock>

              <SessionBlock title="Conditioning block" accent="var(--red)">
                {session.conditioning.map((r) => (
                  <ExerciseRow key={r.id} row={r} onChange={(nr) => editRow('conditioning', nr)}
                    subs={substitutesFor(r.exId)} />
                ))}
              </SessionBlock>

              <SessionBlock title="Mobility / cooldown" accent="var(--green)" defaultOpen={false}>
                {session.mobility.map((r) => <ExerciseRow key={r.id} row={r} />)}
              </SessionBlock>
            </div>

            {/* content-worthy capture */}
            <div className="card p-4" style={{ borderColor: 'var(--accent-soft)' }}>
              <div className="eyebrow mb-1" style={{ color: 'var(--accent)' }}>Did anything content-worthy happen?</div>
              <p className="text-[11px] mb-3" style={{ color: 'var(--ink-faint)' }}>
                Tag it now while it is fresh. We will draft it later — nothing posts without consent.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Client PR', 'Funny moment', 'Form improvement', 'Before / after', 'Client quote'].map((t) => (
                  <button key={t} className="chip py-2.5" data-on={content.includes(t)} onClick={() => toggleContent(t)}>{t}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Ask permission later', 'Do not share'].map((t) => {
                  const on = content.includes(t)
                  return (
                    <button key={t} className="chip py-2.5" data-on={on} onClick={() => toggleContent(t)}
                      style={on && t === 'Do not share' ? { borderColor: 'var(--red)', color: 'var(--red)' } : {}}>{t}</button>
                  )
                })}
              </div>
              {content.includes('Do not share') && (
                <p className="text-[11px] mt-3" style={{ color: 'var(--red)' }}>
                  Locked. This session will not generate any draft.
                </p>
              )}
            </div>

            {/* next-session notes */}
            <div className="card p-4">
              <div className="eyebrow mb-2">Notes for next session</div>
              <textarea className="input" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="What moved well, what to progress, any pain flags…" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <button className="btn btn-line" onClick={() => setSession(null)}>Discard</button>
              <button className="btn btn-primary" onClick={complete}>✓ Complete session</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ---- live timer ----
function Timer() {
  const [sec, setSec] = React.useState(0)
  const [run, setRun] = React.useState(false)
  React.useEffect(() => {
    if (!run) return
    const t = setInterval(() => setSec((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [run])
  const mm = String(Math.floor(sec / 60)).padStart(2, '0')
  const ss = String(sec % 60).padStart(2, '0')
  return (
    <div className="card p-4 flex items-center justify-between">
      <div className="stat-num text-[34px]" style={{ color: run ? 'var(--accent)' : 'var(--ink)' }}>{mm}:{ss}</div>
      <div className="flex gap-2">
        <button className="btn btn-ghost px-4" onClick={() => setRun((r) => !r)}>{run ? 'Pause' : 'Start'}</button>
        <button className="btn btn-line px-4" onClick={() => { setSec(0); setRun(false) }}>Reset</button>
      </div>
    </div>
  )
}
