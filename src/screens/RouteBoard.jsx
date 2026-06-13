import React from 'react'
import { Header } from '../components/ui.jsx'
import { ConsentBadge } from '../components/social.jsx'
import { fmtTime, isToday } from '../lib/store.js'

export default function RouteBoard({ state, go }) {
  const [day, setDay] = React.useState(0) // 0 today, 1 tomorrow
  const stops = state.clients
    .filter((c) => {
      const d = new Date(c.nextSessionAt); const n = new Date(); n.setDate(n.getDate() + day)
      return d.toDateString() === n.toDateString()
    })
    .sort((a, b) => new Date(a.nextSessionAt) - new Date(b.nextSessionAt))

  const angle = (c) => {
    if (c.consent === 'none' || c.consent === 'internal') return 'Do not film. Consent not given.'
    if (c.consent === 'video') return `Clip idea: ${c.nextFocus}`
    if (c.consent === 'photo') return 'Photo OK: before/after of the setup.'
    return 'Quote OK: grab one line after the session.'
  }

  return (
    <div>
      <Header sub="Route board" title="Today's route" right={<span className="stat-num text-[12px]" style={{ color: 'var(--ink-faint)' }}>{stops.length} stops</span>} />
      <div className="px-5 space-y-4">
        <div className="flex gap-2">
          {[['Today', 0], ['Tomorrow', 1]].map(([l, v]) => (
            <button key={v} className="chip py-2.5" data-on={day === v} onClick={() => setDay(v)}>{l}</button>
          ))}
        </div>

        {stops.length === 0 ? (
          <div className="card p-6 text-center text-[13px]" style={{ color: 'var(--ink-faint)' }}>
            No stops {day === 0 ? 'today' : 'tomorrow'}. A clear road is a good day to film content.
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[18px] top-2 bottom-2 w-0.5" style={{ background: 'var(--line)' }} />
            <div className="space-y-3">
              {stops.map((c, i) => {
                const loc = state.locations.find((l) => l.id === c.locationId)
                return (
                  <div key={c.id} className="relative pl-10">
                    <div className="absolute left-2 top-4 w-4 h-4 rounded-full border-2" style={{ background: 'var(--bg)', borderColor: 'var(--accent)' }} />
                    <button onClick={() => go('client', { id: c.id })} className="card w-full p-4 text-left active:scale-[0.99] transition-transform">
                      <div className="flex items-center justify-between">
                        <span className="stat-num text-[16px]" style={{ color: 'var(--accent)' }}>{fmtTime(c.nextSessionAt)}</span>
                        <div className="flex items-center gap-2">
                          {c.payment === 'unpaid' && <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,92,92,0.12)', color: 'var(--red)' }}>UNPAID</span>}
                          <span className="stat-num text-[11px]" style={{ color: 'var(--ink-faint)' }}>{c.credits} left</span>
                        </div>
                      </div>
                      <div className="display text-[17px] mt-1">{c.name}</div>
                      <div className="text-[12px]" style={{ color: 'var(--ink-dim)' }}>{c.nextFocus}</div>
                      <div className="mt-3 rounded-lg px-3 py-2 text-[12px]" style={{ background: 'var(--surface-2)', color: 'var(--ink-dim)' }}>
                        <div className="eyebrow mb-1">{loc?.nickname || c.locationType}</div>
                        {loc?.parking || 'Parking: ask on arrival'} {loc?.pet ? `· ${loc.pet}` : ''}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[11px]" style={{ color: 'var(--ink-faint)' }}>↳ {angle(c)}</span>
                        <ConsentBadge level={c.consent} size="sm" />
                      </div>
                      {i < stops.length - 1 && <div className="eyebrow mt-3">~15 min drive buffer to next</div>}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
