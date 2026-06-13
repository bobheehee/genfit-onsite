import React from 'react'
import { CONSENT_LABEL, CONSENT_RANK } from '../data/seed.js'

// ---------- Consent badge ----------
const CONSENT_STYLE = {
  none: { bg: 'rgba(255,92,92,0.12)', fg: 'var(--red)' },
  internal: { bg: 'var(--surface-3)', fg: 'var(--ink-dim)' },
  testimonial: { bg: 'rgba(255,194,61,0.14)', fg: 'var(--yellow)' },
  photo: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
  video: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
}
export function ConsentBadge({ level = 'none', size = 'md' }) {
  const s = CONSENT_STYLE[level] || CONSENT_STYLE.none
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-bold ${pad}`} style={{ background: s.bg, color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg }} />
      {CONSENT_LABEL[level]}
    </span>
  )
}

// ---------- TikTok profile card ----------
export function TikTokProfileCard({ handle, url, onToast }) {
  const copy = () => {
    navigator.clipboard?.writeText(url).then(() => onToast?.('Profile link copied'))
  }
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl grid place-items-center shrink-0" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
          <span className="display text-[20px]">J</span>
        </div>
        <div className="min-w-0">
          <div className="display text-[18px] truncate">{handle}</div>
          <div className="text-[12px] truncate" style={{ color: 'var(--ink-faint)' }}>{url.replace('https://www.', '')}</div>
        </div>
      </div>
      {/* embed placeholder */}
      <div className="mt-4 rounded-xl grid place-items-center text-center" style={{ aspectRatio: '9 / 12', background: 'var(--surface-2)', border: '1px dashed var(--line)' }}>
        <div>
          <div className="display text-[15px]" style={{ color: 'var(--ink-faint)' }}>TikTok embed</div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--ink-faint)' }}>Live feed in API phase</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <a className="btn btn-primary text-[13px]" href={url} target="_blank" rel="noreferrer">Open profile</a>
        <button className="btn btn-line text-[13px]" onClick={copy}>Copy link</button>
      </div>
    </div>
  )
}

// ---------- Mock vertical video card ----------
export function VideoCard({ title, views = '—', tag }) {
  return (
    <div className="rounded-xl overflow-hidden shrink-0" style={{ width: 132, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
      <div className="relative grid place-items-center" style={{ aspectRatio: '9 / 14', background: 'linear-gradient(160deg, var(--surface-3), var(--surface))' }}>
        <span className="display text-[34px]" style={{ color: 'var(--accent)' }}>▶</span>
        {tag && <span className="absolute top-2 left-2 eyebrow" style={{ color: 'var(--ink-dim)' }}>{tag}</span>}
        <span className="absolute bottom-2 left-2 text-[10px] font-bold" style={{ color: 'var(--ink-dim)' }}>♥ {views}</span>
      </div>
      <div className="p-2 text-[11px] leading-tight" style={{ color: 'var(--ink-dim)' }}>{title}</div>
    </div>
  )
}

// ---------- Social post card ----------
const STATUS_FG = { idea: 'var(--ink-faint)', draft: 'var(--yellow)', scheduled: 'var(--accent)', posted: 'var(--green)', archived: 'var(--ink-faint)' }
export function SocialPostCard({ post, clientName, onAdvance, onConsentClick, blocked }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="eyebrow" style={{ color: STATUS_FG[post.status] }}>{post.kind} · {post.status}</span>
          <h3 className="display text-[16px] mt-1 leading-tight">{post.title}</h3>
        </div>
        {blocked ? (
          <button onClick={onConsentClick} className="text-[10px] font-bold px-2 py-1 rounded-md shrink-0" style={{ background: 'rgba(255,92,92,0.12)', color: 'var(--red)' }}>NO CONSENT</button>
        ) : (
          <span className="text-[10px] font-bold px-2 py-1 rounded-md shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>OK TO POST</span>
        )}
      </div>
      {clientName && <div className="text-[12px] mt-1" style={{ color: 'var(--ink-faint)' }}>Featuring {clientName}</div>}
      <p className="text-[13px] mt-2" style={{ color: 'var(--ink-dim)' }}>{post.body}</p>
      {onAdvance && (
        <button className="btn btn-ghost w-full mt-3 text-[12px]" onClick={onAdvance}>
          {post.status === 'posted' ? 'Archive' : `Mark ${nextStatus(post.status)}`}
        </button>
      )}
    </div>
  )
}
function nextStatus(s) {
  const order = ['idea', 'draft', 'scheduled', 'posted', 'archived']
  return order[Math.min(order.indexOf(s) + 1, order.length - 1)]
}

// ---------- Caption builder display ----------
export function CaptionBuilder({ cap, onCopy }) {
  if (!cap) return null
  const Row = ({ label, children }) => (
    <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)' }}>
      <div className="eyebrow mb-1">{label}</div>
      {children}
    </div>
  )
  return (
    <div className="space-y-2">
      <Row label="Hook"><p className="text-[14px] font-semibold">{cap.hook}</p></Row>
      <Row label="Caption">
        <p className="text-[13px] whitespace-pre-line" style={{ color: 'var(--ink-dim)' }}>{cap.caption}</p>
        <button className="btn btn-line w-full mt-2 text-[12px]" onClick={() => onCopy?.(cap.caption)}>Copy caption</button>
      </Row>
      <Row label="Hashtags">
        <div className="flex flex-wrap gap-1.5">
          {cap.hashtags.map((h) => <span key={h} className="text-[11px] px-2 py-1 rounded-md" style={{ background: 'var(--surface-3)', color: 'var(--accent)' }}>{h}</span>)}
        </div>
      </Row>
      <Row label="On-screen text">
        <ul className="text-[13px] space-y-1" style={{ color: 'var(--ink-dim)' }}>
          {cap.onScreen.map((t, i) => <li key={i}>· {t}</li>)}
        </ul>
      </Row>
      <Row label="CTA"><p className="text-[13px]" style={{ color: 'var(--ink)' }}>{cap.cta}</p></Row>
      <div className="rounded-xl p-3" style={{ background: 'rgba(255,194,61,0.08)', border: '1px solid rgba(255,194,61,0.3)' }}>
        <div className="eyebrow mb-1" style={{ color: 'var(--yellow)' }}>Consent reminder</div>
        <p className="text-[12px]" style={{ color: 'var(--ink-dim)' }}>{cap.consentReminder}</p>
      </div>
      <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)' }}>
        <div className="eyebrow mb-1">Safety note</div>
        <p className="text-[12px]" style={{ color: 'var(--ink-faint)' }}>{cap.safety}</p>
      </div>
    </div>
  )
}

// ---------- Shot list builder ----------
export function ShotListBuilder({ list, onEdit }) {
  if (!list) return null
  return (
    <div className="space-y-2">
      {list.shots.map((s, i) => (
        <div key={s.id} className="card p-3">
          <div className="flex items-center gap-2">
            <span className="stat-num text-[12px] w-5 text-center" style={{ color: 'var(--accent)' }}>{i + 1}</span>
            <span className="eyebrow">{s.type}</span>
          </div>
          {onEdit ? (
            <textarea className="input mt-2" rows="2" value={s.text} onChange={(e) => onEdit(s.id, e.target.value)} />
          ) : (
            <p className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>{s.text}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// ---------- Weekly content calendar ----------
export function ContentCalendar({ themes, ideasByDay, onAdd, onTapIdea }) {
  const days = Object.keys(themes)
  return (
    <div className="space-y-2">
      {days.map((day) => {
        const ideas = ideasByDay[day] || []
        return (
          <div key={day} className="card p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="display text-[14px]">{day}</div>
                <div className="eyebrow">{themes[day]}</div>
              </div>
              <button className="eyebrow" style={{ color: 'var(--accent)' }} onClick={() => onAdd?.(day)}>+ Slot</button>
            </div>
            {ideas.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {ideas.map((idea) => (
                  <button key={idea.id} onClick={() => onTapIdea?.(idea)}
                    className="w-full text-left rounded-lg px-3 py-2 flex items-center justify-between gap-2"
                    style={{ background: 'var(--surface-2)' }}>
                    <span className="text-[12px] truncate" style={{ color: 'var(--ink-dim)' }}>{idea.title}</span>
                    <span className="eyebrow shrink-0" style={{ color: idea.status === 'posted' ? 'var(--green)' : idea.status === 'scheduled' ? 'var(--accent)' : 'var(--ink-faint)' }}>{idea.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
