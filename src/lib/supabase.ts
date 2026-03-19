import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'http://localhost'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Player = {
  id: string
  name: string
  points: number
  games_played: number
  games_won: number
  current_streak: number
  created_at: string
}

export type BoardState = (string | null)[]

export type Match = {
  id: string
  player1_name: string
  player2_name: string
  winner_name: string | null
  status: 'in_progress' | 'completed'
  board_state: BoardState
  current_turn: string
  played_at: string
}
