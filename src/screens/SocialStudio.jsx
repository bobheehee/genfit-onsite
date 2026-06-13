import React from 'react'
import { Header, Segmented } from '../components/ui.jsx'
import { TikTokProfileCard, VideoCard, SocialPostCard, CaptionBuilder, ShotListBuilder, ConsentBadge } from '../components/social.jsx'
import { generateIdeas, buildCaption, buildShotList, buildStory } from '../lib/social.js'
import { TIKTOK, TONES, consentAllows, CONSENT_LABEL } from '../data/seed.js'
import { uid } from '../lib/store.js'

const TABS = ['Profile', 'Ideas', 'Captions', 'Stories', 'Shots', 'Library', 'Roadmap']

export default function SocialStudio({ state, update, go, toast }) {
  const [tab, setTab] = React.useState('Profile')
  return (
    <div>
      <Header sub="Social studio" title="Social studio" right={<a className="eyebrow" style={{ color: 'var(--accent)' }} href={TIKTOK.url} target="_blank" rel="noreferrer">{TIKTOK.handle}</a>} />
      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto no-bar pb-1 -mx-1 px-1">
          {TABS.map((t) => <button key={t} className="chip py-2.5 shrink-0" data-on={tab === t} onClick={() => setTab(t)}>{t}</button>)}
        </div>
      </div>
      <div className="px-5 mt-4 space-y-4 animate-in" key={tab}>
        {tab === 'Profile' && <ProfileTab state={state} go={go} toast={toast} />}
        {tab === 'Ideas' && <IdeasTab state={state} update={update} toast={toast} go={go} />}
        {tab === 'Captions' && <CaptionsTab state={state} toast={toast} />}
        {tab === 'Stories' && <StoriesTab state={state} toast={toast} go={go} />}
        {tab === 'Shots' && <ShotsTab state={state} update={update} toast={toast} />}
        {tab === 'Library' && <LibraryTab state={state} update={update} go={go} toast={toast} />}
        {tab === 'Roadmap' && <RoadmapTab />}
      </div>
    </div>
  )
}

// 1. Profile + mock clips
function ProfileTab({ state, go, toast }) {
  const clips = ['One dumbbell, whole gym', 'Garage win: 90 days', 'Stop waiting for perfect', 'Office 30-min density', 'Park bench strength']
  const opps = buildOpps(state)
  return (
    <>
      <TikTokProfileCard handle={TIKTOK.handle} url={TIKTOK.url} onToast={toast} />
      <div>
        <div className="eyebrow mb-2">Watch Jean work · mock feed</div>
        <div className="flex gap-3 overflow-x-auto no-bar pb-2">
          {clips.map((t, i) => <VideoCard key={t} title={t} views={`${(i + 3) * 1.4}k`} tag={`0${i + 1}`} />)}
        </div>
      </div>
      <div className="card p-4">
        <div className="eyebrow mb-3">Social opportunities</div>
        <div className="space-y-2">
          {opps.map((o) => (
            <button key={o.id} onClick={() => go(o.go)} className="w-full text-left rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
              <span className="text-[13px]" style={{ color: 'var(--ink-dim)' }}>{o.label}</span>
              <span style={{ color: 'var(--accent)' }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function buildOpps(state) {
  const out = []
  const consenting = state.clients.find((c) => consentAllows(c.consent, 'video'))
  if (consenting) out.push({ id: 'o1', label: `${consenting.name.split(' ')[0]} can be filmed — new clip idea`, go: 'social' })
  const t = state.testimonials.find((x) => x.status === 'approved')
  if (t) out.push({ id: 'o2', label: 'Approved testimonial ready to post', go: 'social' })
  out.push({ id: 'o3', label: 'Seasonal TikTok idea: in-home reset', go: 'social' })
  out.push({ id: 'o4', label: 'Reminder: confirm consent before posting', go: 'dashboard' })
  return out
}

// 2. Content Idea Generator
function IdeasTab({ state, update, toast, go }) {
  const [cfg, setCfg] = React.useState({ space: 'living room', equip: 'one dumbbell', goal: 'Fat loss', tone: 'educational' })
  const [results, setResults] = React.useState([])
  const set = (k, v) => setCfg((p) => ({ ...p, [k]: v }))
  const gen = () => { setResults(generateIdeas({ ...cfg, count: 4 })); toast?.('4 ideas generated') }
  const save = (idea) => {
    update((s) => ({ ...s, contentIdeas: [{ ...idea }, ...s.contentIdeas] }))
    toast?.('Saved to library')
  }
  return (
    <>
      <div className="card p-4 space-y-3">
        <Picker label="Space" value={cfg.space} opts={['living room', 'garage', 'driveway', 'apartment gym', 'office', 'park']} on={(v) => set('space', v)} />
        <Picker label="Equipment" value={cfg.equip} opts={['one dumbbell', 'bands', 'kettlebell', 'bodyweight', 'a bench']} on={(v) => set('equip', v)} />
        <Picker label="Goal" value={cfg.goal} opts={['Fat loss', 'Build strength', 'Move better', 'Athletic']} on={(v) => set('goal', v)} />
        <div>
          <div className="eyebrow mb-2">Tone</div>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => <button key={t} className="chip py-2" data-on={cfg.tone === t} onClick={() => set('tone', t)}>{t}</button>)}
          </div>
        </div>
        <button className="btn btn-primary w-full" onClick={gen}>⚡ Generate ideas</button>
      </div>
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((idea) => (
            <div key={idea.id} className="card p-4">
              <span className="eyebrow" style={{ color: 'var(--accent)' }}>{idea.tone}</span>
              <h3 className="display text-[16px] mt-1 leading-tight">{idea.title}</h3>
              <p className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>Hook: {idea.hook}</p>
              <button className="btn btn-ghost w-full mt-3 text-[12px]" onClick={() => save(idea)}>+ Save to library</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-[12px] text-center" style={{ color: 'var(--ink-faint)' }}>Generated from local presets. No API in this build.</p>
    </>
  )
}

// 3. Caption Builder
function CaptionsTab({ state, toast }) {
  const [ideaId, setIdeaId] = React.useState(state.contentIdeas[0]?.id)
  const idea = state.contentIdeas.find((i) => i.id === ideaId) || state.contentIdeas[0]
  const [cap, setCap] = React.useState(null)
  const copy = (t) => navigator.clipboard?.writeText(t).then(() => toast?.('Copied'))
  return (
    <>
      <div className="card p-2">
        <select value={ideaId} onChange={(e) => { setIdeaId(e.target.value); setCap(null) }} className="w-full bg-transparent text-[14px] px-2 py-2 font-semibold" style={{ color: 'var(--ink)' }}>
          {state.contentIdeas.map((i) => <option key={i.id} value={i.id} style={{ color: '#000' }}>{i.title}</option>)}
        </select>
      </div>
      <button className="btn btn-primary w-full" onClick={() => { setCap(buildCaption(idea)); toast?.('Caption built') }}>Build caption pack</button>
      {cap && <CaptionBuilder cap={cap} onCopy={copy} />}
    </>
  )
}

// 4. Client Story Builder
function StoriesTab({ state, toast, go }) {
  const eligible = state.clients.filter((c) => consentAllows(c.consent, 'testimonial'))
  const [cid, setCid] = React.useState(eligible[0]?.id)
  const c = state.clients.find((x) => x.id === cid)
  const [milestone, setMilestone] = React.useState('')
  const story = c ? buildStory(c, milestone) : null
  const copy = (t) => navigator.clipboard?.writeText(t).then(() => toast?.('Caption copied'))

  if (eligible.length === 0) return <EmptyConsent go={go} />
  return (
    <>
      <div className="card p-2">
        <select value={cid} onChange={(e) => setCid(e.target.value)} className="w-full bg-transparent text-[14px] px-2 py-2 font-semibold" style={{ color: 'var(--ink)' }}>
          {eligible.map((x) => <option key={x.id} value={x.id} style={{ color: '#000' }}>{x.name} · {CONSENT_LABEL[x.consent]}</option>)}
        </select>
      </div>
      <div className="card p-4">
        <div className="eyebrow mb-2">The milestone</div>
        <input className="input" value={milestone} onChange={(e) => setMilestone(e.target.value)} placeholder="e.g. hit a 50lb goblet squat PR" />
        <div className="mt-2"><ConsentBadge level={c.consent} /></div>
      </div>
      {story && (
        <div className="space-y-2">
          {[story.anonymous, story.firstName, story.full].map((v, i) => {
            const allowed = i === 0 || consentAllows(c.consent, i === 2 ? 'testimonial' : 'testimonial')
            return (
              <div key={v.label} className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="eyebrow" style={{ color: 'var(--accent)' }}>{v.label}</span>
                  {i === 2 && c.consent === 'internal' && <span className="eyebrow" style={{ color: 'var(--red)' }}>Needs consent</span>}
                </div>
                <p className="text-[13px] mt-2" style={{ color: 'var(--ink-dim)' }}>{v.text}</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button className="btn btn-line text-[12px]" onClick={() => copy(v.text)}>Copy caption</button>
                  <button className="btn btn-ghost text-[12px]" onClick={() => { go('client', { id: c.id }); toast?.('Confirm consent on profile') }}>Ask for consent</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

// 5. Shot List Builder
function ShotsTab({ state, update, toast }) {
  const [activeId, setActiveId] = React.useState(state.videoShotLists[0]?.id)
  const list = state.videoShotLists.find((l) => l.id === activeId)
  const create = () => {
    const nl = buildShotList('New vertical clip')
    update((s) => ({ ...s, videoShotLists: [nl, ...s.videoShotLists] }))
    setActiveId(nl.id); toast?.('Shot list created')
  }
  const editShot = (shotId, text) => {
    update((s) => ({ ...s, videoShotLists: s.videoShotLists.map((l) => l.id === activeId ? { ...l, shots: l.shots.map((sh) => sh.id === shotId ? { ...sh, text } : sh) } : l) }))
  }
  return (
    <>
      <div className="flex gap-2">
        <select value={activeId} onChange={(e) => setActiveId(e.target.value)} className="card flex-1 bg-transparent text-[14px] px-3 py-2 font-semibold" style={{ color: 'var(--ink)' }}>
          {state.videoShotLists.map((l) => <option key={l.id} value={l.id} style={{ color: '#000' }}>{l.title}</option>)}
        </select>
        <button className="btn btn-primary px-4" onClick={create}>+ New</button>
      </div>
      {list && (
        <>
          <div className="display text-[18px]">{list.title}</div>
          <ShotListBuilder list={list} onEdit={editShot} />
        </>
      )}
    </>
  )
}

// 6. Asset Library
function LibraryTab({ state, update, go, toast }) {
  const nameOf = (id) => state.clients.find((c) => c.id === id)?.name
  const blocked = (p) => p.clientId && !consentAllows(state.clients.find((c) => c.id === p.clientId)?.consent || 'none', p.kind === 'transformation' || p.kind === 'demo' ? 'photo' : 'testimonial')
  const advance = (p) => {
    const order = ['idea', 'draft', 'scheduled', 'posted', 'archived']
    const ni = Math.min(order.indexOf(p.status) + 1, order.length - 1)
    update((s) => ({ ...s, socialPosts: s.socialPosts.map((x) => x.id === p.id ? { ...x, status: order[ni] } : x) }))
    toast?.(`Marked ${order[ni]}`)
  }
  const cats = ['Video ideas', 'Testimonials', 'Progress stories', 'Exercise demos', 'FAQ answers', 'Myths', "Jean's story", 'Transformations']
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {cats.map((t) => <span key={t} className="chip" data-on="false">{t}</span>)}
      </div>
      <div className="eyebrow mt-2">Saved posts</div>
      <div className="space-y-2">
        {state.socialPosts.map((p) => (
          <SocialPostCard key={p.id} post={p} clientName={nameOf(p.clientId)} blocked={blocked(p)}
            onAdvance={() => advance(p)} onConsentClick={() => go('client', { id: p.clientId })} />
        ))}
      </div>
      <div className="eyebrow mt-2">Saved ideas · {state.contentIdeas.length}</div>
      <div className="space-y-2">
        {state.contentIdeas.map((i) => (
          <div key={i.id} className="card p-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate">{i.title}</div>
              <div className="eyebrow">{i.tone} · {i.status}</div>
            </div>
            <button className="eyebrow shrink-0" style={{ color: 'var(--accent)' }} onClick={() => go('calendar')}>Schedule →</button>
          </div>
        ))}
      </div>
    </>
  )
}

// 7. TikTok Integration Roadmap
function RoadmapTab() {
  const locked = [
    ['Real TikTok login', 'OAuth connect to Jean\'s account'],
    ['Pull latest videos', 'Live feed instead of mock cards'],
    ['Direct draft upload', 'Push a clip straight to drafts'],
    ['Analytics dashboard', 'Views, watch time, follower growth'],
    ['Comments / lead capture', 'Turn comments into leads'],
    ['Auto-generate from session notes', 'Session → caption + shot list'],
  ]
  return (
    <>
      <div className="rounded-xl p-4" style={{ background: 'var(--accent-soft)', border: '1px solid var(--line)' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)' }}>Future backend / API phase</div>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>These are not active in this prototype. Planning surface only.</p>
      </div>
      <div className="space-y-2">
        {locked.map(([t, d]) => (
          <div key={t} className="card p-4 flex items-center gap-3" style={{ opacity: 0.85 }}>
            <span className="text-[18px]" style={{ color: 'var(--ink-faint)' }}>🔒</span>
            <div>
              <div className="display text-[15px]">{t}</div>
              <div className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// helpers
function Picker({ label, value, opts, on }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => <button key={o} className="chip py-2" data-on={value === o} onClick={() => on(o)}>{o}</button>)}
      </div>
    </div>
  )
}
function EmptyConsent({ go }) {
  return (
    <div className="card p-6 text-center">
      <p className="text-[13px]" style={{ color: 'var(--ink-dim)' }}>No client has testimonial-level consent yet.</p>
      <button className="btn btn-line mt-3 text-[13px]" onClick={() => go('dashboard')}>Review roster</button>
    </div>
  )
}
