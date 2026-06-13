import React from 'react'
import { Header, StatCard } from '../components/ui.jsx'
import { exportJSON, importJSON } from '../lib/store.js'
import { TRAINER, SAFETY_LINE } from '../data/seed.js'

export default function Settings({ state, update, reset, go, toast }) {
  const fileRef = React.useRef(null)

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    update((s) => ({ ...s, settings: { ...(s.settings || {}), theme } }))
    toast?.(`Theme: ${theme}`)
  }

  async function onImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importJSON(file)
      update(() => data)
      toast?.('Data imported.')
    } catch {
      toast?.('Import failed — not valid JSON.')
    }
    e.target.value = ''
  }

  const jeanMode = !!state.settings?.jeanMode
  function toggleJean() {
    update((s) => ({ ...s, settings: { ...(s.settings || {}), jeanMode: !s.settings?.jeanMode } }))
    toast?.(jeanMode ? 'Jean Mode off.' : 'Jean Mode on. No filler.')
  }

  const totalCredits = state.clients.reduce((s, c) => s + c.credits, 0)
  const completed = (state.completedSessions || []).length

  return (
    <div>
      <Header sub="Settings" title={TRAINER.name} />
      <div className="px-5 space-y-4">
        <div className="card p-5">
          <div className="display text-[18px]">{TRAINER.brand}</div>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>{TRAINER.email} · {TRAINER.phone}</div>
          <div className="eyebrow mt-3">{TRAINER.service_area}</div>
        </div>

        {/* Jean Mode — personality toggle */}
        <button onClick={toggleJean} className="card p-4 w-full text-left flex items-center justify-between gap-3"
          style={jeanMode ? { borderColor: 'var(--accent)' } : {}}>
          <div className="min-w-0">
            <div className="display text-[16px]">Jean Mode</div>
            <p className="text-[12px] mt-1" style={{ color: 'var(--ink-dim)' }}>
              {jeanMode ? 'Copy talks like Jean. Direct, sharp, no filler.' : 'Flip the interface into Jean’s voice — more direct, more personality.'}
            </p>
          </div>
          <span className="shrink-0 w-12 h-7 rounded-full relative transition-colors"
            style={{ background: jeanMode ? 'var(--accent)' : 'var(--surface-3)', border: '1px solid var(--line)' }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
              style={{ left: jeanMode ? '26px' : '3px', background: jeanMode ? 'var(--accent-ink)' : 'var(--ink-faint)' }} />
          </span>
        </button>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Clients" value={state.clients.length} />
          <StatCard label="Credits out" value={totalCredits} />
          <StatCard label="Logged" value={completed} accent />
        </div>

        {/* data */}
        <div className="card p-4 space-y-3">
          <div className="eyebrow">Your data</div>
          <p className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>
            Everything lives on this device via localStorage. Back it up or move it between devices with JSON.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn btn-primary text-[13px]" onClick={() => { exportJSON(state); toast?.('Exported JSON.') }}>↓ Export</button>
            <button className="btn btn-ghost text-[13px]" onClick={() => fileRef.current?.click()}>↑ Import</button>
          </div>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
        </div>

        {/* theme switcher */}
        <div className="card p-4">
          <div className="eyebrow mb-3">Theme</div>
          <div className="grid grid-cols-3 gap-2">
            {[['volt', 'Volt', '#c6ff2e'], ['coral', 'Coral', '#ff5a4d'], ['cream', 'Cream', '#0b0b0c']].map(([id, label, swatch]) => {
              const active = (state.settings?.theme || 'volt') === id
              return (
                <button key={id} onClick={() => setTheme(id)}
                  className="card p-3 text-center"
                  style={active ? { borderColor: 'var(--accent)' } : {}}>
                  <span className="block w-7 h-7 rounded-full mx-auto mb-2"
                    style={{ background: swatch, border: id === 'cream' ? '2px solid var(--line)' : 'none' }} />
                  <span className="text-[12px] font-semibold">{label}</span>
                  {active && <span className="block eyebrow mt-1" style={{ color: 'var(--accent)' }}>On</span>}
                </button>
              )
            })}
          </div>
          <p className="text-[11px] mt-3" style={{ color: 'var(--ink-faint)' }}>
            Every color is a CSS variable, so reskinning is one swap. Pick a vibe and the whole app follows.
          </p>
        </div>

        {/* hub: jump to every screen */}
        <div className="card p-2">
          {[
            ['Program builder', 'programs'],
            ['Progress tracker', 'progress'],
            ['Social studio', 'social'],
            ['Content calendar', 'calendar'],
            ['Route board', 'route'],
            ['Client portal preview', 'portal'],
            ['Public landing page', 'landing'],
            ['New intake', 'intake'],
          ].map(([l, r]) => (
            <button key={r} onClick={() => go(r)} className="w-full flex items-center justify-between px-3 py-3 text-[14px] border-b last:border-0"
              style={{ borderColor: 'var(--line-soft)' }}>
              <span>{l}</span><span style={{ color: 'var(--ink-faint)' }}>›</span>
            </button>
          ))}
        </div>

        {/* danger */}
        <button className="btn btn-line w-full text-[13px]" style={{ borderColor: 'rgba(255,92,92,0.4)', color: 'var(--red)' }}
          onClick={() => { if (confirm('Reset all demo data to seeded defaults?')) { reset(); toast?.('Reset to seed data.') } }}>
          Reset demo data
        </button>

        <div className="rounded-xl p-4 mb-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
          <div className="eyebrow mb-1">Disclaimer</div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--ink-faint)' }}>{SAFETY_LINE}</p>
        </div>
      </div>
    </div>
  )
}
