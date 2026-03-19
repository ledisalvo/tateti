-- Ta-Te-Ti (Tic-Tac-Toe) Database Schema
-- Run this in your Supabase SQL editor to set up the database.

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists players (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  points        float not null default 0,
  games_played  int not null default 0,
  games_won     int not null default 0,
  current_streak int not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists matches (
  id            uuid primary key default gen_random_uuid(),
  player1_name  text not null,
  player2_name  text not null,
  winner_name   text,                          -- null = draw or in_progress
  status        text not null default 'in_progress'
                  check (status in ('in_progress', 'completed')),
  board_state   jsonb not null default '[]',   -- array of 9 cells (null | "X" | "O")
  current_turn  text not null,                 -- "X" or "O"
  played_at     timestamptz not null default now()
);

-- Index for quick lookup of in-progress matches by player names
create index if not exists matches_status_idx on matches (status);
create index if not exists matches_played_at_idx on matches (played_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public read and write (no auth required for now)
-- ============================================================

alter table players enable row level security;
alter table matches enable row level security;

create policy "Public read players"
  on players for select using (true);

create policy "Public insert players"
  on players for insert with check (true);

create policy "Public update players"
  on players for update using (true);

create policy "Public read matches"
  on matches for select using (true);

create policy "Public insert matches"
  on matches for insert with check (true);

create policy "Public update matches"
  on matches for update using (true);
