// Local store for players and matches (used until Supabase is connected in M3)

export type PlayerStats = {
  name: string
  points: number
  games_played: number
  games_won: number
  current_streak: number
}

export type MatchRecord = {
  id: string
  player1_name: string
  player2_name: string
  winner_name: string | null   // null = draw
  played_at: string
}

const PLAYERS_KEY = 'tateti_players'
const MATCHES_KEY = 'tateti_matches'
const HISTORY_LIMIT = 20

// ── Players ────────────────────────────────────────────────

export function getPlayers(): PlayerStats[] {
  try {
    return JSON.parse(localStorage.getItem(PLAYERS_KEY) ?? '[]') as PlayerStats[]
  } catch {
    return []
  }
}

function savePlayers(players: PlayerStats[]) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

function getOrCreatePlayer(players: PlayerStats[], name: string): PlayerStats {
  const normalized = name.trim().toLowerCase()
  const existing = players.find(p => p.name.trim().toLowerCase() === normalized)
  if (existing) return existing
  const newPlayer: PlayerStats = {
    name,
    points: 0,
    games_played: 0,
    games_won: 0,
    current_streak: 0,
  }
  players.push(newPlayer)
  return newPlayer
}

// ── Matches ────────────────────────────────────────────────

export function getMatches(): MatchRecord[] {
  try {
    return JSON.parse(localStorage.getItem(MATCHES_KEY) ?? '[]') as MatchRecord[]
  } catch {
    return []
  }
}

function saveMatches(matches: MatchRecord[]) {
  // Keep only the last HISTORY_LIMIT matches
  const trimmed = matches.slice(-HISTORY_LIMIT)
  localStorage.setItem(MATCHES_KEY, JSON.stringify(trimmed))
}

// ── Record a completed game ────────────────────────────────

export function recordGame(
  player1Name: string,
  player2Name: string,
  winnerName: string | null,  // null = draw
) {
  const players = getPlayers()
  const p1 = getOrCreatePlayer(players, player1Name)
  const p2 = getOrCreatePlayer(players, player2Name)

  p1.games_played++
  p2.games_played++

  if (winnerName) {
    const winner = winnerName.trim().toLowerCase() === player1Name.trim().toLowerCase() ? p1 : p2
    const loser = winner === p1 ? p2 : p1
    winner.points += 1
    winner.games_won++
    winner.current_streak++
    loser.current_streak = 0
  } else {
    // draw
    p1.points += 0.5
    p2.points += 0.5
    // streak unchanged on draw
  }

  savePlayers(players)

  const matches = getMatches()
  matches.push({
    id: crypto.randomUUID(),
    player1_name: player1Name,
    player2_name: player2Name,
    winner_name: winnerName,
    played_at: new Date().toISOString(),
  })
  saveMatches(matches)
}
