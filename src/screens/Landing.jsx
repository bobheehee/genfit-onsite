import React from 'react'
import { TRAINER, packages, SAFETY_LINE, SOCIAL_LINKS, TIKTOK } from '../data/seed.js'

const SOCIALS = [
  ['TikTok', SOCIAL_LINKS.tiktok, '♪'],
  ['Instagram', SOCIAL_LINKS.instagram, '◎'],
  ['Facebook', SOCIAL_LINKS.facebook, 'f'],
  ['YouTube', SOCIAL_LINKS.youtube, '▶'],
]

const CLIPS = [
  ['One dumbbell, one hallway', '3 moves you can do in 6 feet of space', '12.4k'],
  ['The couch is equipment', 'Stop waiting for the perfect gym', '8.1k'],
  ['Garage session, real wins', 'What in-home training actually looks like', '21.7k'],
]

function Section({ children, className = '' }) {
  return <section className={`px-5 py-8 ${className}`}>{children}</section>
}

export default function Landing({ go }) {
  return (
    <div className="animate-in">
      {/* top bar */}
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="display text-[16px] tracking-tight">GENFIT<span style={{ color: 'var(--accent)' }}>.</span>FIELDHOUSE</span>
        <button className="btn btn-line py-2 px-3 text-[12px]" onClick={() => go('dashboard')}>Trainer login</button>
      </div>

      {/* HERO — the thesis */}
      <Section className="pt-10 pb-6">
        <div className="eyebrow mb-4">In-home personal training</div>
        <h1 className="display text-[44px] leading-[0.92]">
          Training<br />where life<br />
          <span style={{ color: 'var(--accent)' }}>actually</span><br />happens.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
          No gym? No problem. Jean brings the plan, the pressure, and the progress to your
          house, garage, apartment gym, office, or wherever you’re ready to work.
        </p>
        <button className="btn btn-primary w-full mt-6 text-[16px]" onClick={() => go('intake')}>
          Apply to train →
        </button>
        <div className="flex gap-2 mt-4">
          {['Your space', 'Your schedule', 'Real progress'].map((t) => (
            <span key={t} className="chip" data-on="false">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-5">
          <span className="eyebrow" style={{ color: 'var(--ink-faint)' }}>Follow</span>
          {SOCIALS.map(([name, url, icon]) => (
            <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[14px]"
              style={{ border: '1px solid var(--line)', color: 'var(--ink)' }}>{icon}</a>
          ))}
        </div>
      </Section>

      {/* Watch Jean Work — mock vertical clips */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display text-[24px]">Watch Jean work</h2>
          <a href={TIKTOK.url} target="_blank" rel="noreferrer" className="eyebrow" style={{ color: 'var(--accent)' }}>{TIKTOK.handle}</a>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CLIPS.map(([title, sub, views]) => (
            <div key={title} className="rounded-xl overflow-hidden relative" style={{ aspectRatio: '9/16', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
              <div className="absolute inset-0 flex items-center justify-center text-[26px]" style={{ color: 'var(--accent)' }}>▶</div>
              <div className="absolute top-2 left-2 eyebrow" style={{ color: 'var(--ink-faint)' }}>♪ {views}</div>
              <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                <div className="text-[11px] font-semibold leading-tight" style={{ color: '#fff' }}>{title}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] mt-3 text-center" style={{ color: 'var(--ink-faint)' }}>
          Mock clips for the demo. Real TikTok feed lands in the backend phase.
        </p>
      </Section>

      {/* Who it's for */}
      <Section>
        <h2 className="display text-[24px] mb-4">Who it’s for</h2>
        <div className="grid gap-3">
          {[
            ['Busy professionals', 'You don’t have an hour to commute to a gym. The gym comes to you.'],
            ['Home-gym owners', 'You bought the dumbbells. Now use them with a real plan.'],
            ['Comeback clients', 'Injury, time off, or starting fresh — we meet you where you are.'],
            ['50+ and strong', 'Joint-smart strength so you keep doing what you love.'],
          ].map(([t, d]) => (
            <div key={t} className="card p-4">
              <h3 className="display text-[16px]">{t}</h3>
              <p className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Packages */}
      <Section>
        <h2 className="display text-[24px] mb-4">Service packages</h2>
        <div className="grid gap-3">
          {packages.map((p, i) => (
            <div key={p.id} className="card p-5 relative overflow-hidden"
              style={i === 1 ? { borderColor: 'var(--accent)' } : {}}>
              {i === 1 && <span className="absolute top-4 right-4 eyebrow" style={{ color: 'var(--accent)' }}>Most picked</span>}
              <h3 className="display text-[20px]">{p.name}</h3>
              <div className="stat-num text-[30px] mt-2">${p.price}
                <span className="text-[13px]" style={{ color: 'var(--ink-faint)' }}> / {p.sessions} sessions</span>
              </div>
              <div className="eyebrow mt-1">${p.per} per session</div>
              <p className="text-[13px] mt-3" style={{ color: 'var(--ink-dim)' }}>{p.blurb}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <h2 className="display text-[24px] mb-4">How it works</h2>
        <div className="space-y-3">
          {[
            ['Apply', 'Tell Jean your goals, space, and schedule.'],
            ['Onboard', 'Quick screening + a plan built for your setup.'],
            ['Train', 'Jean shows up. You work. Every session tracked.'],
            ['Progress', 'Strength, consistency, and wins, all logged.'],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-4">
              <div className="stat-num text-[20px] shrink-0 w-8" style={{ color: 'var(--accent)' }}>0{i + 1}</div>
              <div className="pb-3 border-b" style={{ borderColor: 'var(--line-soft)' }}>
                <div className="display text-[16px]">{t}</div>
                <div className="text-[13px] mt-1" style={{ color: 'var(--ink-dim)' }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Benefits + what Jean tracks */}
      <Section>
        <div className="grid gap-3">
          <div className="card p-5">
            <h2 className="display text-[20px] mb-3">In-home training benefits</h2>
            <ul className="space-y-2 text-[13px]" style={{ color: 'var(--ink-dim)' }}>
              {['Zero commute, zero gym anxiety', 'Built around your real equipment', 'Flexible around your week', 'Privacy to actually focus', 'Accountability that shows up at your door'].map((b) => (
                <li key={b} className="flex gap-2"><span style={{ color: 'var(--accent)' }}>—</span>{b}</li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="display text-[20px] mb-3">What Jean tracks</h2>
            <div className="flex flex-wrap gap-2">
              {['Sessions', 'Consistency', 'Strength PRs', 'Mobility', 'Energy', 'Sleep', 'Mood', 'Wins'].map((t) => (
                <span key={t} className="chip" data-on="false">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="card p-6 text-center" style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}>
          <h2 className="display text-[26px]" style={{ color: 'var(--accent-ink)' }}>Ready to work?</h2>
          <p className="text-[13px] mt-2" style={{ color: 'rgba(11,11,12,0.7)' }}>Spots are limited to keep the schedule real.</p>
          <button className="btn w-full mt-4" style={{ background: 'var(--bg)', color: 'var(--ink)' }} onClick={() => go('intake')}>
            Apply to train
          </button>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <h2 className="display text-[24px] mb-4">FAQ</h2>
        <div className="space-y-2">
          {[
            ['Do I need equipment?', 'No. Jean can run a full session with nothing but your bodyweight and the space you’ve got.'],
            ['What areas do you serve?', `${TRAINER.service_area}. Ask if you’re just outside it.`],
            ['Can we train at my office or a park?', 'Yes. Living rooms, garages, driveways, apartment gyms, offices, and parks all work.'],
            ['What if I’m injured?', 'We screen for it and program around it. We don’t replace your doctor.'],
          ].map(([q, a]) => <Faq key={q} q={q} a={a} />)}
        </div>
      </Section>

      {/* Disclaimer */}
      <Section className="pb-12">
        <div className="rounded-xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
          <div className="eyebrow mb-2">Fitness coaching, not medical care</div>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--ink-faint)' }}>{SAFETY_LINE}</p>
        </div>
        <p className="text-center text-[11px] mt-6" style={{ color: 'var(--ink-faint)' }}>
          {TRAINER.brand} · {TRAINER.phone}
        </p>
      </Section>
    </div>
  )
}

function Faq({ q, a }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="font-semibold text-[14px]">{q}</span>
        <span style={{ color: 'var(--ink-faint)' }}>{open ? '–' : '+'}</span>
      </button>
      {open && <p className="px-4 pb-4 text-[13px]" style={{ color: 'var(--ink-dim)' }}>{a}</p>}
    </div>
  )
}
