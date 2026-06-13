import React from 'react'
import { Header, ProgramTemplateCard } from '../components/ui.jsx'

export default function ProgramBuilder({ state, update, toast }) {
  const [openId, setOpenId] = React.useState(null)
  const tpl = state.programs.find((p) => p.id === openId)
  const edited = state.editedPrograms?.[openId]
  const blocks = edited?.blocks || tpl?.blocks || []

  const [assignTo, setAssignTo] = React.useState('')

  function editBlock(i, val) {
    update((s) => {
      const base = s.editedPrograms?.[openId]?.blocks || tpl.blocks
      const nb = base.map((b, idx) => (idx === i ? val : b))
      return { ...s, editedPrograms: { ...s.editedPrograms, [openId]: { ...tpl, blocks: nb } } }
    })
  }
  function addBlock() {
    update((s) => {
      const base = s.editedPrograms?.[openId]?.blocks || tpl.blocks
      return { ...s, editedPrograms: { ...s.editedPrograms, [openId]: { ...tpl, blocks: [...base, 'New movement 3x10'] } } }
    })
  }
  function removeBlock(i) {
    update((s) => {
      const base = s.editedPrograms?.[openId]?.blocks || tpl.blocks
      return { ...s, editedPrograms: { ...s.editedPrograms, [openId]: { ...tpl, blocks: base.filter((_, idx) => idx !== i) } } }
    })
  }
  function assign() {
    if (!assignTo) return
    update((s) => ({ ...s, clients: s.clients.map((c) => (c.id === assignTo ? { ...c, programId: openId } : c)) }))
    const name = state.clients.find((c) => c.id === assignTo)?.name
    toast?.(`${tpl.name} assigned to ${name}.`)
    setAssignTo('')
  }

  if (tpl) {
    return (
      <div>
        <Header sub={tpl.tag} title={tpl.name} onBack={() => setOpenId(null)} />
        <div className="px-5 space-y-4">
          <div className="card p-4">
            <div className="flex justify-between">
              <span className="eyebrow">Focus</span>
              <span className="stat-num text-[12px]" style={{ color: 'var(--ink-faint)' }}>{tpl.weeks}wk · {tpl.days}d/wk</span>
            </div>
            <p className="text-[14px] mt-2">{tpl.focus}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="eyebrow">Blocks · editable</div>
              <button className="eyebrow" style={{ color: 'var(--accent)' }} onClick={addBlock}>+ Add</button>
            </div>
            <div className="space-y-2">
              {blocks.map((b, i) => (
                <div key={i} className="card p-2 flex items-center gap-2">
                  <span className="stat-num text-[12px] w-6 text-center" style={{ color: 'var(--accent)' }}>{i + 1}</span>
                  <input value={b} onChange={(e) => editBlock(i, e.target.value)}
                    className="flex-1 bg-transparent text-[14px] py-2" style={{ color: 'var(--ink)' }} />
                  <button onClick={() => removeBlock(i)} className="px-2 text-[16px]" style={{ color: 'var(--ink-faint)' }}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="eyebrow mb-2">Assign to client</div>
            <div className="flex gap-2">
              <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}
                className="input flex-1" style={{ color: assignTo ? 'var(--ink)' : 'var(--ink-faint)' }}>
                <option value="" style={{ color: '#000' }}>Choose…</option>
                {state.clients.map((c) => <option key={c.id} value={c.id} style={{ color: '#000' }}>{c.name}</option>)}
              </select>
              <button className="btn btn-primary px-5" onClick={assign} disabled={!assignTo} style={!assignTo ? { opacity: 0.4 } : {}}>Assign</button>
            </div>
          </div>
          {edited && <p className="text-[12px] text-center pb-2" style={{ color: 'var(--green)' }}>✓ Edits saved locally</p>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header sub="Program builder" title="Templates" />
      <div className="px-5">
        <p className="text-[13px] mb-4" style={{ color: 'var(--ink-dim)' }}>Pick a starting point, edit the blocks, assign it to a client. Edits persist.</p>
        <div className="grid gap-3">
          {state.programs.map((t) => (
            <ProgramTemplateCard key={t.id} tpl={state.editedPrograms?.[t.id] || t} onClick={() => setOpenId(t.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
