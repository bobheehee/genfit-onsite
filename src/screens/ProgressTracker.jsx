import React from 'react'
import { Header, ProgressChart, StatCard } from '../components/ui.jsx'
import { ConsentBadge } from '../components/social.jsx'
import { consentAllows } from '../data/seed.js'

export default function ProgressTracker({ state, go, params }) {
  const clients = state.clients
  const [id, setId] = React.useState(params?.id || clients[0]?.id)
  const c = clients.find((x) => x.id === id) || clients[0]

  const pr = state.progressEntries.filter((p) => p.clientId === c.id)
  const checkins = state.checkins.filter((ci) => ci.clientId === c.id)
  const done = (state.completedSessions || []).filter((s) => s.clientId === c.id).length + (c.sessionsDone || 0)
  const photosUnlocked = consentAllows(c.consent, 'photo')

  const energyPoints = checkins.map((ci, i) => ({ id: ci.id, value: ci.energy, unit: '/5' }))

  return (
    <div>
      <Header sub="Progress tracker" title="Progress" onBack={() => go('dashboard')} />
      <div className="px-5 space-y-4">
        <div className="card p-2">
          <select value={id} onChange={(e) => setId(e.target.value)} className="w-full bg-transparent text-[14px] px-2 py-2 font-semibold" style={{ color: 'var(--ink)' }}>
            {clients.map((x) => <option key={x.id} value={x.id} style={{ color: '#000' }}>{x.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Sessions done" value={done} accent />
          <StatCard label="Consistency" value={`${Math.min(99, 60 + done * 2)}%`} hint="last 8 weeks" />
          <StatCard label="Strength PRs" value={pr.length} hint={pr[0]?.metric || 'logged lifts'} />
          <StatCard label="Check-ins" value={checkins.length} hint="this month" />
        </div>

        <div className="card p-4">
          <div className="eyebrow mb-3">Strength PR · {pr[0]?.metric || 'no metric'}</div>
          <ProgressChart points={pr} unit={pr[0]?.unit} />
        </div>

        <div className="card p-4">
          <div className="eyebrow mb-3">Energy trend</div>
          <ProgressChart points={energyPoints} unit="/5" />
        </div>

        <div className="card p-4">
          <div className="eyebrow mb-2">Energy · mood · sleep check-ins</div>
          {checkins.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-faint)' }}>No check-ins logged yet.</p>
          ) : (
            <div className="space-y-2">
              {checkins.map((ci) => (
                <div key={ci.id} className="rounded-lg px-3 py-2" style={{ background: 'var(--surface-2)' }}>
                  <div className="flex gap-4 text-[12px]" style={{ color: 'var(--ink-dim)' }}>
                    <span>⚡ {ci.energy}/5</span><span>🙂 {ci.mood}/5</span><span>😴 {ci.sleep}/5</span>
                  </div>
                  {ci.note && <div className="text-[12px] mt-1" style={{ color: 'var(--ink-faint)' }}>{ci.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Measurements (optional) */}
        <div className="card p-4">
          <div className="eyebrow mb-2">Measurements · optional</div>
          <p className="text-[13px]" style={{ color: 'var(--ink-faint)' }}>Off by default. Add waist, weight, or girths only if the client opts in.</p>
        </div>

        {/* Progress photos — gated by consent */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="eyebrow">Progress photos</div>
            <ConsentBadge level={c.consent} size="sm" />
          </div>
          {photosUnlocked ? (
            <div className="grid grid-cols-3 gap-2">
              {['Day 1', 'Day 30', 'Today'].map((t) => (
                <div key={t} className="rounded-lg grid place-items-center text-center" style={{ aspectRatio: '3/4', background: 'var(--surface-2)', border: '1px dashed var(--line)' }}>
                  <span className="eyebrow">{t}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px]" style={{ color: 'var(--ink-faint)' }}>Disabled. Photos unlock only with photo-level consent.</p>
          )}
        </div>

        {/* Milestones that could become content */}
        <div className="card p-4 mb-2">
          <div className="eyebrow mb-2">Milestones worth a post</div>
          <ul className="space-y-2 text-[13px]">
            {pr.slice(-2).reverse().map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <span className="flex gap-2"><span style={{ color: 'var(--accent)' }}>★</span> {p.metric} {p.value}{p.unit}</span>
                <button className="eyebrow" style={{ color: 'var(--accent)' }} onClick={() => go('social')}>Make post →</button>
              </li>
            ))}
            {pr.length === 0 && <li style={{ color: 'var(--ink-faint)' }}>Log a PR to surface content here.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
