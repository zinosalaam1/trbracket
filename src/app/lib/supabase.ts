// ─── Supabase client ───────────────────────────────────────────────────────
// Replace these with your actual values from supabase.com → Settings → API
export const SUPABASE_URL = 'https://mouhgrpkcgkftysrowru.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdWhncnBrY2drZnR5c3Jvd3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzkyOTIsImV4cCI6MjA5NDc1NTI5Mn0.XqwWbNWY7hH9SC3cCLxuq5jSYhkhaYKmAFhFqJvbtys';

async function sb(path: string, opts: RequestInit & { prefer?: string } = {}): Promise<any> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: opts.prefer ?? 'return=representation',
    },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  getPlayers: () => sb('players?order=created_at'),
  addPlayer: (name: string) => sb('players', { method: 'POST', body: JSON.stringify({ name }) }),
  removePlayer: (id: string) => sb(`players?id=eq.${id}`, { method: 'DELETE', prefer: '' }),
  getMatches: () => sb('matches?order=sort_order'),
  upsertMatch: (match: object) =>
    sb('matches', {
      method: 'POST',
      prefer: 'return=representation,resolution=merge-duplicates',
      body: JSON.stringify(match),
    }),
  updateMatch: (id: string, updates: object) =>
    sb(`matches?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deleteAllMatches: () => sb('matches', { method: 'DELETE', prefer: '' }),
};

/*
─── SQL schema — run once in your Supabase SQL editor ────────────────────────

create table if not exists players (
  id   text primary key default gen_random_uuid()::text,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists matches (
  id         text primary key,
  player1    text not null default 'TBD',
  player2    text not null default 'TBD',
  score1     int  not null default 0,
  score2     int  not null default 0,
  winner     text not null default '',
  round      text not null,
  console    int,
  status     text not null default 'pending',
  forfeit    boolean default false,
  sort_order int  not null default 0
);

alter table players enable row level security;
alter table matches  enable row level security;

create policy "public_players" on players for all using (true);
create policy "public_matches" on matches  for all using (true);
*/
