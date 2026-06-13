// ---------------------------------------------------------------
// Jean Mode — the personality layer.
// One toggle in Settings flips interface copy from neutral to Jean's
// direct, no-BS voice. Same keys both ways, so a component just reads
// voice(jeanMode).someKey and never branches on its own.
// Jean is intense, funny, sharp, practical, and human — not crude,
// not corporate, not a wellness influencer.
// ---------------------------------------------------------------

const GENERIC = {
  todaysSessions: 'Today’s sessions',
  needAttention: 'Clients needing attention',
  missedCheckIns: 'Missed check-ins',
  missedCheckIn: 'Missed check-in',
  contentIdeas: 'Content ideas',
  restDay: 'Rest day',
  noSessions: 'No sessions today. Block out a build day.',
  sessionLogged: 'Session logged. Credit used.',
  sessionLoggedDraft: 'Session logged. Draft saved to Social Studio.',
}

const JEAN = {
  todaysSessions: 'Today’s people to move',
  needAttention: 'People trying to slip through the cracks',
  missedCheckIns: 'They went quiet',
  missedCheckIn: 'They went quiet',
  contentIdeas: 'Stuff worth posting',
  restDay: 'Recover like you mean it',
  noSessions: 'Nobody booked. Build a day worth showing up for.',
  sessionLogged: 'Handled. Log the win.',
  sessionLoggedDraft: 'Handled. Draft saved to Social Studio.',
}

export function voice(jeanMode) {
  return jeanMode ? JEAN : GENERIC
}

// Jean's Rules — the dashboard card. Order matters.
export const JEAN_RULES = [
  'Show up.',
  'Tell the truth.',
  'Modify, don’t quit.',
  'Do the boring thing long enough to get dangerous.',
  'Leave people stronger than you found them.',
]

// "Close the Loop" — end-of-day checklist. Keep "Home reset" subtle.
export const CLOSE_THE_LOOP = [
  'Sessions done',
  'Notes finished',
  'Tomorrow prepped',
  'People nudged',
  'Money checked',
  'Home reset unlocked',
]

// Small copy flourishes used as quiet one-liners around the app.
export const FLOURISHES = {
  meetThem: 'Meet them where they are. Then move them.',
  stillCounts: 'No gym? Still counts.',
  houseIsGym: 'The house is the gym now.',
  excusesLogged: 'Excuses logged. Plan adjusted.',
  perfectLighting: 'Progress does not need perfect lighting.',
  inconvenient: 'Strong is allowed to be inconvenient.',
  fitTheLife: 'Make the session fit the life, not the fantasy.',
}
