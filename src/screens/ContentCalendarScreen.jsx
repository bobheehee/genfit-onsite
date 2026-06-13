import React from 'react'
import { Header, Segmented } from '../components/ui.jsx'
import { ContentCalendar } from '../components/social.jsx'
import { WEEK_THEMES } from '../data/seed.js'
import { uid } from '../lib/store.js'

const STATUS_CYCLE = ['idea', 'scheduled', 'posted', 'archived']

export default function ContentCalendarScreen({ state, update, go, toast }) {
  const [view, setView] = React.useState('week')
  const [draft, setDraft] = React.useState({ day: '', title: '' })

  const ideasByDay = React.useMemo(() => {
    const map = {}
    state.contentIdeas.forEach((i) => { if (i.day) (map[i.day] ||= []).push(i) })
    return map
  }, [state.contentIdeas])

  const cycle = (idea) => {
    const ni = (STATUS_CYCLE.indexOf(idea.status) + 1) % STATUS_CYCLE.length
    update((s) => ({ ...s, contentIdeas: s.contentIdeas.map((x) => x.id === idea.id ? { ...x, status: STATUS_CYCLE[ni] } : x) }))
    toast?.(`${idea.title.slice(0, 18)}… → ${STATUS_CYCLE[ni]}`)
  }
  const addSlot = (day) => setDraft({ day, title: '' })
  const saveSlot = () => {
    if (!draft.title.trim()) return
    const idea = { id: uid('idea'), title: draft.title.trim(), tone: 'educational', day: draft.day, status: 'idea', hook: '', createdAt: new Date().toISOString() }
    update((s) => ({ ...s, contentIdeas: [idea, ...s.contentIdeas] }))
    setDraft({ day: '', title: '' }); toast?.(`Added to ${draft.day}`)
  }

  const posted = state.contentIdeas.filter((i) => i.status === 'posted').length
  const scheduled = state.contentIdeas.filter((i) => i.status === 'scheduled').length

  return (
    <div>
      <Header sub="Content calendar" title="Calendar" onBack={() => go('social')} />
      <div className="px-5 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[['Ideas', state.contentIdeas.length], ['Scheduled', scheduled], ['Posted', posted]].map(([l, v]) => (
            <div key={l} className="card p-3 text-center">
              <div className="stat-num text-[20px]" style={{ color: 'var(--accent)' }}>{v}</div>
              <div className="eyebrow">{l}</div>
            </div>
          ))}
        </div>

        <Segmented options={[{ value: 'week', label: 'Weekly rhythm' }, { value: 'month', label: 'Month grid' }]} value={view} onChange={setView} />

        {view === 'week' ? (
          <>
            <p className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>Tap an idea to cycle idea → scheduled → posted → archived.</p>
            <ContentCalendar themes={WEEK_THEMES} ideasByDay={ideasByDay} onAdd={addSlot} onTapIdea={cycle} />
          </>
        ) : (
          <MonthGrid ideas={state.contentIdeas} />
        )}

        {draft.day && (
          <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setDraft({ day: '', title: '' })}>
            <div className="w-full p-5 rounded-t-2xl animate-in" style={{ maxWidth: 'var(--shell-max)', background: 'var(--surface)', border: '1px solid var(--line)' }} onClick={(e) => e.stopPropagation()}>
              <div className="eyebrow mb-1">{draft.day}</div>
              <div className="display text-[18px] mb-3">New content slot</div>
              <input className="input" autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder={WEEK_THEMES[draft.day]} />
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="btn btn-line" onClick={() => setDraft({ day: '', title: '' })}>Cancel</button>
                <button className="btn btn-primary" onClick={saveSlot}>Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MonthGrid({ ideas }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1)
  const byDay = {}
  ideas.forEach((idea, i) => { const d = (i * 5) % 28 + 1; (byDay[d] ||= []).push(idea) })
  const color = { idea: 'var(--ink-faint)', scheduled: 'var(--accent)', posted: 'var(--green)', archived: 'var(--line)' }
  return (
    <div className="card p-3">
      <div className="grid grid-cols-7 gap-1.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="eyebrow text-center">{d}</div>)}
        {days.map((d) => (
          <div key={d} className="rounded-lg aspect-square p-1.5 flex flex-col" style={{ background: 'var(--surface-2)' }}>
            <span className="text-[10px]" style={{ color: 'var(--ink-faint)' }}>{d}</span>
            <div className="flex flex-wrap gap-0.5 mt-auto">
              {(byDay[d] || []).slice(0, 3).map((idea) => <span key={idea.id} className="w-1.5 h-1.5 rounded-full" style={{ background: color[idea.status] }} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-3 text-[10px]" style={{ color: 'var(--ink-faint)' }}>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} /> scheduled</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} /> posted</span>
      </div>
    </div>
  )
}
