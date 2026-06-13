import React from 'react'

// ---------- Layout shell ----------
export function AppShell({ children, nav }) {
  return (
    <div style={{ background: 'var(--bg)' }} className="min-h-screen flex justify-center">
      <div
        className="w-full flex flex-col relative"
        style={{ maxWidth: 'var(--shell-max)', minHeight: '100vh' }}
      >
        <div className="flex-1 pb-28">{children}</div>
        {nav}
      </div>
    </div>
  )
}

export function Header({ title, sub, right, onBack }) {
  return (
    <div className="sticky top-0 z-20 px-5 pt-5 pb-4"
      style={{ background: 'linear-gradient(var(--bg) 70%, transparent)' }}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {onBack && (
            <button onClick={onBack} className="eyebrow mb-2 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
              ‹ Back
            </button>
          )}
          {sub && <div className="eyebrow mb-1">{sub}</div>}
          <h1 className="display text-[28px] leading-none truncate" style={{ color: 'var(--ink)' }}>{title}</h1>
        </div>
        {right}
      </div>
    </div>
  )
}

// ---------- Bottom nav ----------
const NAV = [
  { id: 'dashboard', label: 'Floor', icon: '◧' },
  { id: 'route', label: 'Route', icon: '⤳' },
  { id: 'session', label: 'Run', icon: '▶' },
  { id: 'social', label: 'Social', icon: '✦' },
  { id: 'settings', label: 'You', icon: '◍' },
]
export function MobileNav({ route, go }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-30"
      style={{ maxWidth: 'var(--shell-max)' }}>
      <div className="mx-3 mb-3 grid grid-cols-5 rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
        {NAV.map((n) => {
          const on = route === n.id
          return (
            <button key={n.id} onClick={() => go(n.id)}
              className="py-3 flex flex-col items-center gap-1 transition-colors"
              style={{ color: on ? 'var(--accent)' : 'var(--ink-faint)' }}>
              <span className="text-[17px] leading-none">{n.icon}</span>
              <span className="text-[10px] font-semibold tracking-wide">{n.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ---------- Status ----------
const STATUS_MAP = {
  green: { c: 'var(--green)', t: 'On track' },
  yellow: { c: 'var(--yellow)', t: 'Watch' },
  red: { c: 'var(--red)', t: 'At risk' },
}
export function StatusPill({ status, label, pulse }) {
  const s = STATUS_MAP[status] || STATUS_MAP.green
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1"
      style={{ background: 'var(--surface-3)', border: '1px solid var(--line)' }}>
      <span className={`w-2 h-2 rounded-full ${pulse ? 'pulse-dot' : ''}`} style={{ background: s.c, color: s.c }} />
      <span className="text-[11px] font-semibold" style={{ color: 'var(--ink-dim)' }}>{label || s.t}</span>
    </span>
  )
}

// ---------- Stat ----------
export function StatCard({ label, value, hint, accent }) {
  return (
    <div className="card p-4">
      <div className="eyebrow mb-2">{label}</div>
      <div className="stat-num text-[26px]" style={{ color: accent ? 'var(--accent)' : 'var(--ink)' }}>{value}</div>
      {hint && <div className="text-[11px] mt-1" style={{ color: 'var(--ink-faint)' }}>{hint}</div>}
    </div>
  )
}

// ---------- Client card ----------
export function ClientCard({ client, location, onClick, compact }) {
  const s = STATUS_MAP[client.status]
  return (
    <button onClick={onClick}
      className="card w-full text-left p-4 active:scale-[0.99] transition-transform animate-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.c }} />
            <h3 className="display text-[18px] truncate" style={{ color: 'var(--ink)' }}>{client.name}</h3>
          </div>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>{client.goal}</div>
        </div>
        {client.payment === 'unpaid' && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-md shrink-0"
            style={{ background: 'rgba(255,92,92,0.12)', color: 'var(--red)' }}>UNPAID</span>
        )}
      </div>
      {!compact && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          <Mini label="Credits" v={`${client.credits}`} />
          <Mini label="Space" v={client.locationType.split(' ')[0]} />
          <Mini label="Check-in" v={client.checkin === 'current' ? 'OK' : 'Missed'}
            danger={client.checkin !== 'current'} />
        </div>
      )}
      {location && (
        <div className="eyebrow mt-3 truncate">⤳ {location.nickname}</div>
      )}
    </button>
  )
}
function Mini({ label, v, danger }) {
  return (
    <div className="rounded-lg px-2 py-2" style={{ background: 'var(--surface-2)' }}>
      <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--ink-faint)' }}>{label}</div>
      <div className="stat-num text-[14px]" style={{ color: danger ? 'var(--red)' : 'var(--ink)' }}>{v}</div>
    </div>
  )
}

// ---------- Session block (Session Runner) ----------
export function SessionBlock({ title, accent, children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3">
        <span className="display text-[15px] flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <span className="w-1.5 h-5 rounded-full" style={{ background: accent || 'var(--accent)' }} />
          {title}
        </span>
        <span style={{ color: 'var(--ink-faint)' }}>{open ? '–' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-4 space-y-2">{children}</div>}
    </div>
  )
}

// ---------- Exercise row ----------
export function ExerciseRow({ row, onChange, subs = [] }) {
  const [showSub, setShowSub] = React.useState(false)
  const set = (k, v) => onChange?.({ ...row, [k]: v })
  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)' }}>
      <div className="flex items-center justify-between">
        <div className="font-semibold text-[14px]" style={{ color: 'var(--ink)' }}>{row.name}</div>
        {subs.length > 0 && (
          <button onClick={() => setShowSub((s) => !s)} className="eyebrow" style={{ color: 'var(--accent)' }}>
            swap
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2 text-[12px]" style={{ color: 'var(--ink-dim)' }}>
        <span className="stat-num">{row.sets}×{row.reps}</span>
        {row.rpe && <span>· {row.rpe}</span>}
        {row.rest && row.rest !== '-' && <span>· rest {row.rest}</span>}
      </div>
      {onChange && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          <NumInput label="Set" v={row.doneSets || ''} on={(v) => set('doneSets', v)} />
          <NumInput label="Reps" v={row.doneReps || ''} on={(v) => set('doneReps', v)} />
          <NumInput label="Load" v={row.load || ''} on={(v) => set('load', v)} text />
          <RpeBox v={row.actualRpe} on={(v) => set('actualRpe', v)} />
        </div>
      )}
      {onChange && (
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => set('pain', !row.pain)}
            className="text-[11px] px-2 py-1 rounded-md font-semibold"
            style={{
              background: row.pain ? 'rgba(255,92,92,0.15)' : 'var(--surface-3)',
              color: row.pain ? 'var(--red)' : 'var(--ink-faint)',
            }}>
            ⚑ Pain flag{row.pain ? ' ON' : ''}
          </button>
        </div>
      )}
      {showSub && (
        <div className="flex flex-wrap gap-2 mt-3">
          {subs.map((s) => (
            <button key={s} className="chip" onClick={() => { set('name', s); setShowSub(false) }}>{s}</button>
          ))}
        </div>
      )}
    </div>
  )
}
function NumInput({ label, v, on, text }) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: 'var(--ink-faint)' }}>{label}</span>
      <input value={v} onChange={(e) => on(e.target.value)} inputMode={text ? 'text' : 'numeric'}
        className="w-full rounded-lg px-2 py-2 text-[14px] stat-num"
        style={{ background: 'var(--surface-3)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
    </label>
  )
}
function RpeBox({ v, on }) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: 'var(--ink-faint)' }}>RPE</span>
      <select value={v || ''} onChange={(e) => on(e.target.value)}
        className="w-full rounded-lg px-1 py-2 text-[14px] stat-num"
        style={{ background: 'var(--surface-3)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
        <option value="">–</option>
        {[5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </label>
  )
}

// ---------- Program template card ----------
export function ProgramTemplateCard({ tpl, onClick }) {
  return (
    <button onClick={onClick} className="card text-left p-4 active:scale-[0.99] transition-transform">
      <div className="flex items-center justify-between">
        <span className="eyebrow" style={{ color: 'var(--accent)' }}>{tpl.tag}</span>
        <span className="stat-num text-[11px]" style={{ color: 'var(--ink-faint)' }}>{tpl.weeks}w · {tpl.days}d</span>
      </div>
      <h3 className="display text-[17px] mt-2 leading-tight" style={{ color: 'var(--ink)' }}>{tpl.name}</h3>
      <p className="text-[12px] mt-1" style={{ color: 'var(--ink-dim)' }}>{tpl.focus}</p>
    </button>
  )
}

// ---------- Simple bar/line progress chart (CSS, no deps) ----------
export function ProgressChart({ points, unit = '', label }) {
  if (!points || points.length === 0)
    return <div className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>No data yet.</div>
  const vals = points.map((p) => p.value)
  const max = Math.max(...vals), min = Math.min(...vals)
  const span = max - min || 1
  return (
    <div>
      {label && <div className="eyebrow mb-2">{label}</div>}
      <div className="flex items-end gap-2 h-28">
        {points.map((p, i) => {
          const h = 20 + ((p.value - min) / span) * 80
          const top = i === points.length - 1
          return (
            <div key={p.id || i} className="flex-1 flex flex-col items-center gap-1">
              <span className="stat-num text-[11px]" style={{ color: top ? 'var(--accent)' : 'var(--ink-faint)' }}>{p.value}</span>
              <div className="w-full rounded-t-md transition-all"
                style={{ height: `${h}%`, background: top ? 'var(--accent)' : 'var(--surface-3)' }} />
            </div>
          )
        })}
      </div>
      <div className="text-[10px] mt-1" style={{ color: 'var(--ink-faint)' }}>{unit && `measured in ${unit}`}</div>
    </div>
  )
}

// ---------- Segmented control ----------
export function Segmented({ options, value, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value
        const l = typeof o === 'string' ? o : o.label
        const on = value === v
        return (
          <button key={v} onClick={() => onChange(v)}
            className="flex-1 py-2 rounded-lg text-[12px] font-semibold transition-colors capitalize"
            style={{ background: on ? 'var(--accent)' : 'transparent', color: on ? 'var(--accent-ink)' : 'var(--ink-dim)' }}>
            {l}
          </button>
        )
      })}
    </div>
  )
}

// ---------- Toast ----------
export function useToast() {
  const [msg, setMsg] = React.useState(null)
  const show = React.useCallback((m) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2200)
  }, [])
  const node = msg ? (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 px-4 py-3 rounded-xl animate-in"
      style={{ background: 'var(--accent)', color: 'var(--accent-ink)', maxWidth: 'calc(var(--shell-max) - 40px)' }}>
      <span className="font-bold text-[13px]">{msg}</span>
    </div>
  ) : null
  return [node, show]
}
