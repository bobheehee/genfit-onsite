import React from 'react'
import { Header, StatCard, ClientCard, StatusPill, Segmented } from '../components/ui.jsx'
import { fmtTime, isToday } from '../lib/store.js'
import { voice, JEAN_RULES, CLOSE_THE_LOOP, FLOURISHES } from '../lib/voice.js'

export default function Dashboard({ state, go, update, toast }) {
  const [filter, setFilter] = React.useState('all')
  const { clients, invoices, locations } = state
  const v = voice(state.settings?.jeanMode)

  const todays = clients
    .filter((c) => isToday(c.nextSessionAt))
    .sort((a, b) => new Date(a.nextSessionAt) - new Date(b.nextSessionAt))

  const unpaidCount = invoices.filter((i) => i.status === 'unpaid').length
  const unpaidTotal = invoices.filter((i) => i.status === 'unpaid').reduce((s, i) => s + i.amount, 0)
  const missed = clients.filter((c) => c.checkin === 'missed')
  const needAttention = clients.filter((c) => c.status === 'red' || c.status === 'yellow')

  const filtered = clients.filter((c) => filter === 'all' || c.status === filter)
  const locOf = (id) => locations.find((l) => l.id === id)

  // birthdays this month
  const mm = String(new Date().getMonth() + 1).padStart(2, '0')
  const birthdays = clients.filter((c) => c.birthday?.startsWith(mm))

  // social opportunities, derived from real consent + status
  const opps = []
  const wins = clients.filter((c) => c.status === 'green' && (c.consent === 'photo' || c.consent === 'video'))
  if (wins[0]) opps.push({ icon: '🏆', text: `${wins[0].name} hit a milestone — clip-ready (video consent on file)`, tone: 'go' })
  const testi = (state.testimonials || [])[0]
  if (testi) opps.push({ icon: '💬', text: `New testimonial ready to turn into a post`, tone: 'go' })
  const askLater = clients.filter((c) => c.consent === 'internal' || c.consent === 'none')
  if (askLater[0]) opps.push({ icon: '🔒', text: `Ask ${askLater[0].name} for consent before featuring anything`, tone: 'hold' })
  opps.push({ icon: '📅', text: `Seasonal TikTok idea: "Train where you are" series`, tone: 'idea' })
  opps.push({ icon: '🎬', text: `New clip idea from a garage session this week`, tone: 'idea' })

  return (
    <div>
      <Header
        sub="Build Floor"
        title="Today’s floor"
        right={<StatusPill status="green" label={`${todays.length} booked`} pulse />}
      />

      <div className="px-5 space-y-5">
        {/* quick actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            ['Run', 'session', '▶'],
            ['Build', 'programs', '▦'],
            ['Progress', 'progress', '📈'],
            ['Social', 'social', '✦'],
          ].map(([l, r, icon]) => (
            <button key={r} onClick={() => go(r)} className="card py-3 flex flex-col items-center gap-1 active:scale-[0.97] transition-transform">
              <span className="text-[18px]" style={{ color: 'var(--accent)' }}>{icon}</span>
              <span className="text-[11px] font-semibold">{l}</span>
            </button>
          ))}
        </div>
        {/* top stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Sessions today" value={todays.length} accent />
          <StatCard label="Active clients" value={clients.length} />
          <StatCard label="Unpaid" value={`$${unpaidTotal}`} hint={`${unpaidCount} invoice${unpaidCount === 1 ? '' : 's'}`} />
          <StatCard label={v.missedCheckIns} value={missed.length} hint={missed.length ? 'Follow up' : 'All current'} />
        </div>

        {/* on your radar — personal markers + reminders */}
        {((state.personalDates || []).length > 0 || (state.reminders || []).length > 0) && (
          <div className="card p-4">
            <div className="eyebrow mb-3">On your radar</div>
            {(state.personalDates || []).map((d) => (
              <div key={d.id} className="flex items-center justify-between py-1">
                <span className="text-[13px]" style={{ color: 'var(--ink)' }}>{d.label}</span>
                <span className="eyebrow" style={{ color: 'var(--accent)' }}>{d.when}</span>
              </div>
            ))}
            {(state.reminders || []).map((r) => (
              <button key={r.id} onClick={() => {
                update?.((s) => ({ ...s, reminders: (s.reminders || []).map((x) => x.id === r.id ? { ...x, done: !x.done } : x) }))
                toast?.(r.done ? 'Back on the list.' : 'Done. Nice.')
              }} className="w-full flex items-center gap-2 py-1.5 text-left">
                <span className="w-4 h-4 rounded-md grid place-items-center shrink-0 text-[11px]"
                  style={{ border: '1px solid var(--line)', background: r.done ? 'var(--accent)' : 'transparent', color: 'var(--accent-ink)' }}>{r.done ? '✓' : ''}</span>
                <span className="text-[13px]" style={{ color: r.done ? 'var(--ink-faint)' : 'var(--ink)', textDecoration: r.done ? 'line-through' : 'none' }}>{r.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* today's sessions */}
        <div>
          <div className="eyebrow mb-3">{v.todaysSessions}</div>
          {todays.length === 0 ? (
            <div className="card p-5 text-center text-[13px]" style={{ color: 'var(--ink-faint)' }}>
              {v.noSessions}
            </div>
          ) : (
            <div className="space-y-2">
              {todays.map((c) => (
                <button key={c.id} onClick={() => go('client', { id: c.id })}
                  className="card w-full p-4 flex items-center gap-4 active:scale-[0.99] transition-transform text-left">
                  <div className="text-center shrink-0">
                    <div className="stat-num text-[16px]" style={{ color: 'var(--accent)' }}>{fmtTime(c.nextSessionAt)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="display text-[16px] truncate">{c.name}</div>
                    <div className="text-[12px] truncate" style={{ color: 'var(--ink-dim)' }}>{c.nextFocus}</div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: c.status === 'red' ? 'var(--red)' : c.status === 'yellow' ? 'var(--yellow)' : 'var(--green)' }} />
                </button>
              ))}
            </div>
          )}
          <button className="btn btn-ghost w-full mt-3 text-[13px]" onClick={() => go('route')}>View route board →</button>
        </div>

        {/* attention */}
        {needAttention.length > 0 && (
          <div>
            <div className="eyebrow mb-3">{v.needAttention}</div>
            <div className="space-y-2">
              {needAttention.map((c) => (
                <ClientCard key={c.id} client={c} location={locOf(c.locationId)} onClick={() => go('client', { id: c.id })} />
              ))}
            </div>
          </div>
        )}

        {/* wins + birthdays */}
        <div className="grid gap-3">
          <div className="card p-4">
            <div className="eyebrow mb-2">Recent wins</div>
            <ul className="space-y-2 text-[13px]" style={{ color: 'var(--ink)' }}>
              <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>★</span> Maya hit a 50lb goblet squat PR</li>
              <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>★</span> Priya held a 45s plank, new best</li>
              <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>★</span> Sara cleared single-leg bridges</li>
            </ul>
          </div>
          {birthdays.length > 0 && (
            <div className="card p-4">
              <div className="eyebrow mb-2">Birthdays + milestones this month</div>
              {birthdays.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <span className="text-[13px]">{c.name}</span>
                  <span className="stat-num text-[12px]" style={{ color: 'var(--accent)' }}>🎂 {c.birthday}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* social opportunities */}
        <div className="card p-4" style={{ borderColor: 'var(--accent-soft)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>Social opportunities</div>
            <button className="eyebrow" style={{ color: 'var(--accent)' }} onClick={() => go('social')}>Open studio →</button>
          </div>
          <div className="space-y-2">
            {opps.map((o, i) => (
              <div key={i} className="flex items-start gap-3 py-1.5">
                <span className="text-[15px] shrink-0">{o.icon}</span>
                <span className="text-[13px] flex-1" style={{ color: 'var(--ink)' }}>{o.text}</span>
                <span className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                  style={{ background: o.tone === 'go' ? 'var(--green)' : o.tone === 'hold' ? 'var(--red)' : 'var(--yellow)' }} />
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3 pt-3 border-t" style={{ color: 'var(--ink-faint)', borderColor: 'var(--line-soft)' }}>
            Always confirm consent before posting. Default is no sharing.
          </p>
        </div>

        {/* Jean's Rules */}
        <div className="card p-5" style={{ background: 'var(--surface-2)' }}>
          <div className="eyebrow mb-3" style={{ color: 'var(--accent)' }}>Jean’s rules</div>
          <ol className="space-y-2.5">
            {JEAN_RULES.map((rule, i) => (
              <li key={i} className="flex gap-3 items-baseline">
                <span className="stat-num text-[15px] shrink-0" style={{ color: 'var(--accent)' }}>{i + 1}</span>
                <span className="text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>{rule}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] mt-4" style={{ color: 'var(--ink-faint)' }}>{FLOURISHES.meetThem}</p>
        </div>

        {/* roster */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="eyebrow">Full roster · {clients.length}</div>
            <button className="eyebrow" style={{ color: 'var(--accent)' }} onClick={() => go('intake')}>+ New client</button>
          </div>
          <div className="mb-3">
            <Segmented
              options={[{ value: 'all', label: 'All' }, { value: 'green', label: 'Green' }, { value: 'yellow', label: 'Yellow' }, { value: 'red', label: 'Red' }]}
              value={filter} onChange={setFilter} />
          </div>
          <div className="space-y-2">
            {filtered.map((c) => (
              <ClientCard key={c.id} client={c} location={locOf(c.locationId)} onClick={() => go('client', { id: c.id })} />
            ))}
          </div>
        </div>

        {/* end of day */}
        <CloseTheLoop toast={toast} />
      </div>
    </div>
  )
}

// End-of-day checklist. Ephemeral by design — fresh every day.
function CloseTheLoop({ toast }) {
  const [done, setDone] = React.useState(() => CLOSE_THE_LOOP.map(() => false))
  const allDone = done.every(Boolean)
  const toggle = (i) => setDone((d) => d.map((x, idx) => (idx === i ? !x : x)))
  return (
    <div className="card p-5" style={{ borderColor: allDone ? 'var(--accent)' : 'var(--line)' }}>
      <div className="eyebrow mb-3" style={{ color: 'var(--accent)' }}>Close the loop</div>
      <div className="space-y-2.5">
        {CLOSE_THE_LOOP.map((item, i) => (
          <button key={item} onClick={() => toggle(i)} className="w-full flex items-center gap-3 text-left">
            <span className="w-5 h-5 rounded-md grid place-items-center shrink-0 text-[12px] transition-colors"
              style={{ border: '1px solid var(--line)', background: done[i] ? 'var(--accent)' : 'transparent', color: 'var(--accent-ink)' }}>
              {done[i] ? '✓' : ''}
            </span>
            <span className="text-[14px]" style={{ color: done[i] ? 'var(--ink-faint)' : 'var(--ink)', textDecoration: done[i] ? 'line-through' : 'none' }}>{item}</span>
          </button>
        ))}
      </div>
      <button className="btn btn-primary w-full mt-4" disabled={!allDone}
        style={!allDone ? { opacity: 0.5 } : {}}
        onClick={() => toast?.('Day closed. Go recover.')}>
        Call it. Go recover.
      </button>
    </div>
  )
}
