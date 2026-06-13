import { useState, useEffect, useCallback } from 'react'
import { seed } from '../data/seed.js'

const KEY = 'genfit_onsite_v2'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw)
    return { ...seed(), ...parsed } // merge so new presets always present
  } catch {
    return seed()
  }
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

// Tiny global store via a custom hook + window event so any screen stays in sync.
export function useStore() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const update = useCallback((fn) => {
    setState((prev) => {
      const next = typeof fn === 'function' ? fn(structuredClone(prev)) : fn
      return next
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(KEY)
    setState(seed())
  }, [])

  return [state, update, reset, setState]
}

export function exportJSON(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `genfit-onsite-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try { resolve(JSON.parse(reader.result)) } catch (e) { reject(e) }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// ---- format utils ----
export const fmtTime = (isoStr) =>
  new Date(isoStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

export const fmtDay = (isoStr) =>
  new Date(isoStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })

export const isToday = (isoStr) => {
  const d = new Date(isoStr), n = new Date()
  return d.toDateString() === n.toDateString()
}

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 8)}`
