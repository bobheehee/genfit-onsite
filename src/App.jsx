import React from 'react'
import { useStore } from './lib/store.js'
import { AppShell, MobileNav, useToast as useToastUI } from './components/ui.jsx'

import Landing from './screens/Landing.jsx'
import Dashboard from './screens/Dashboard.jsx'
import ClientPortal from './screens/ClientPortal.jsx'
import Intake from './screens/Intake.jsx'
import SessionRunner from './screens/SessionRunner.jsx'
import ProgramBuilder from './screens/ProgramBuilder.jsx'
import ProgressTracker from './screens/ProgressTracker.jsx'
import RouteBoard from './screens/RouteBoard.jsx'
import ClientDetail from './screens/ClientDetail.jsx'
import SocialStudio from './screens/SocialStudio.jsx'
import ContentCalendarScreen from './screens/ContentCalendarScreen.jsx'
import Settings from './screens/Settings.jsx'

// routes that live inside the trainer app shell (show bottom nav)
const APP_ROUTES = ['dashboard', 'route', 'session', 'programs', 'settings', 'client', 'progress', 'portal', 'social', 'calendar']
// map any sub-route to its highlighted nav tab
const NAV_FOR = { client: 'dashboard', progress: 'social', portal: 'dashboard', programs: 'dashboard', calendar: 'social' }

export default function App() {
  const [state, update, reset] = useStore()
  const [route, setRoute] = React.useState('landing')
  const [params, setParams] = React.useState({})
  const [toastNode, toast] = useToastUI()

  // apply saved theme to <html> on load + whenever it changes
  React.useEffect(() => {
    const theme = state.settings?.theme || 'volt'
    document.documentElement.setAttribute('data-theme', theme)
  }, [state.settings?.theme])

  const go = React.useCallback((r, p = {}) => {
    if (r === '_noop') { toast('Placeholder — wired up in the backend phase.'); return }
    setParams(p)
    setRoute(r)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [toast])

  const shared = { state, update, reset, go, params, toast }

  let screen
  switch (route) {
    case 'landing': screen = <Landing {...shared} />; break
    case 'intake': screen = <Intake {...shared} />; break
    case 'portal': screen = <ClientPortal {...shared} />; break
    case 'dashboard': screen = <Dashboard {...shared} />; break
    case 'route': screen = <RouteBoard {...shared} />; break
    case 'session': screen = <SessionRunner {...shared} />; break
    case 'programs': screen = <ProgramBuilder {...shared} />; break
    case 'progress': screen = <ProgressTracker {...shared} />; break
    case 'client': screen = <ClientDetail {...shared} />; break
    case 'social': screen = <SocialStudio {...shared} />; break
    case 'calendar': screen = <ContentCalendarScreen {...shared} />; break
    case 'settings': screen = <Settings {...shared} />; break
    default: screen = <Dashboard {...shared} />
  }

  const showNav = APP_ROUTES.includes(route)
  const nav = showNav ? <MobileNav route={NAV_FOR[route] || route} go={go} /> : null

  // Landing + intake are full-bleed (no shell padding for nav)
  if (route === 'landing' || route === 'intake') {
    return (
      <div className="flex justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-full" style={{ maxWidth: 'var(--shell-max)', minHeight: '100vh' }}>
          {screen}
          {toastNode}
        </div>
      </div>
    )
  }

  return (
    <AppShell nav={nav}>
      {screen}
      {toastNode}
    </AppShell>
  )
}
