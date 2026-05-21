import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/supabase';

export type MatchStatus = 'pending' | 'live' | 'completed';

export interface Match {
  id: string;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  winner: string;
  round: string;
  console: number | null;
  status: MatchStatus;
  forfeit?: boolean;
  sort_order?: number;
}

export interface Player {
  id: string;
  name: string;
}

interface TournamentContextType {
  players: Player[];
  matches: Match[];
  loading: boolean;
  error: string | null;
  addPlayer: (name: string) => Promise<void>;
  removePlayer: (id: string) => Promise<void>;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  setMatchWinner: (matchId: string, winner: string, score1: number, score2: number) => Promise<void>;
  assignConsole: (matchId: string, consoleNum: number) => Promise<void>;
  startMatch: (matchId: string) => Promise<void>;
  completeMatch: (matchId: string) => Promise<void>;
  generateBracket: () => Promise<void>;
  resetTournament: () => Promise<void>;
  reload: () => Promise<void>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) throw new Error('useTournament must be used within TournamentProvider');
  return context;
}

// ─── 22 registered players in seeding order ───────────────────────────────
// Players 1–12  → play Qualification Round
// Players 13–18 → get byes into Round of 16 (each faces a qual winner)
// Players 19–22 → get byes into Round of 16 (play each other)
const SEEDED_PLAYERS = [
  // Qualification (1-12)
  'Tobi',                        // #1
  'Xhabi',                       // #2
  'Awele',                       // #3
  'Awelewa Oluwaseun',            // #4
  'Oghosa',                      // #5
  'Agbabiaka Emmanuel',           // #6
  'Jags',                        // #7
  'Emmanuel Bassey',              // #8
  'Jeremiah Oluwakoya',           // #9
  'Odejimi Oluwaferanmi',         // #10
  'Lord Seventh',                 // #11
  'Yorokobi',                     // #12
  // Byes into R16 vs qual winners (13-18)
  'Avoseh',                       // #13
  'Olamide',                      // #14
  'Prime',                        // #15
  'Akwaba',                       // #16
  'Joseph inioluwa',              // #17
  'Obanla oluwadamilare wisdom',  // #18
  // Byes into R16 vs each other (19-22)
  'Omo papi',                     // #19
  'Abdulrasaq Jamiu Olamide',     // #20
  'Big Bally',                    // #21
  'Zinoln',                       // #22
];

function buildMatch(
  id: string, player1: string, player2: string,
  round: string, sortOrder: number
): Match {
  return {
    id, player1, player2,
    score1: 0, score2: 0,
    winner: '', round,
    console: null,
    status: 'pending',
    sort_order: sortOrder,
  };
}

// Build all 21 matches from a player list
function buildAllMatches(ps: string[]): Match[] {
  const m: Match[] = [];
  let s = 0;

  // Qualification — 6 matches: P1vP2, P3vP4, P5vP6, P7vP8, P9vP10, P11vP12
  for (let i = 0; i < 6; i++) {
    m.push(buildMatch(`q${i + 1}`, ps[i * 2], ps[i * 2 + 1], 'Qualification', s++));
  }

  // Round of 16 — 8 matches
  // r16-1..6: bye player (P13-P18) vs winner of qual match 1-6
  for (let i = 0; i < 6; i++) {
    m.push(buildMatch(`r16-${i + 1}`, ps[12 + i], 'TBD', 'Round of 16', s++));
  }
  // r16-7: P19 vs P20   r16-8: P21 vs P22
  m.push(buildMatch('r16-7', ps[18], ps[19], 'Round of 16', s++));
  m.push(buildMatch('r16-8', ps[20], ps[21], 'Round of 16', s++));

  // Quarterfinals — 4 matches (all TBD, filled by R16 winners)
  for (let i = 0; i < 4; i++) m.push(buildMatch(`qf${i + 1}`, 'TBD', 'TBD', 'Quarterfinals', s++));

  // Semifinals — 2 matches
  for (let i = 0; i < 2; i++) m.push(buildMatch(`sf${i + 1}`, 'TBD', 'TBD', 'Semifinals', s++));

  // Third place + Final
  m.push(buildMatch('third', 'TBD', 'TBD', 'Third Place', s++));
  m.push(buildMatch('final',  'TBD', 'TBD', 'Final',       s++));

  return m;
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers]   = useState<Player[]>([]);
  const [matches, setMatches]   = useState<Match[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState<string | null>(null);

  // ── Reload from Supabase ───────────────────────────────────────────────
  const reload = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([api.getPlayers(), api.getMatches()]);
      setPlayers(p ?? []);
      setMatches(m ?? []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── First-run: seed players + auto-generate bracket ────────────────────
  // Runs once on mount. If the DB is empty it inserts all 22 players and
  // immediately generates the full bracket — zero manual steps needed.
  const initIfEmpty = useCallback(async () => {
    try {
      const [existingPlayers, existingMatches] = await Promise.all([
        api.getPlayers(),
        api.getMatches(),
      ]);

      let playerNames: string[] = existingPlayers?.map((p: Player) => p.name) ?? [];

      // Seed players if none exist
      if (!existingPlayers || existingPlayers.length === 0) {
        for (const name of SEEDED_PLAYERS) {
          await api.addPlayer(name);
        }
        playerNames = SEEDED_PLAYERS;
      }

      // Generate bracket if none exists
      if (!existingMatches || existingMatches.length === 0) {
        const allMatches = buildAllMatches(playerNames);
        for (const match of allMatches) await api.upsertMatch(match);
      }

      await reload();
    } catch {
      // silently skip — Supabase URL/key not set yet
    }
  }, [reload]);

  useEffect(() => {
    initIfEmpty();
  }, [initIfEmpty]);

  // Poll every 5 s to keep all viewers in sync
  useEffect(() => {
    const t = setInterval(reload, 5000);
    return () => clearInterval(t);
  }, [reload]);

  // ── Bracket generation (manual re-generate from Admin) ─────────────────
  const generateBracket = async () => {
    await api.deleteAllMatches();
    const names = players.map(p => p.name);
    const allMatches = buildAllMatches(names);
    for (const m of allMatches) await api.upsertMatch(m);
    setMatches(allMatches);
  };

  // ── Advance winner through the bracket tree ────────────────────────────
  const advanceWinner = async (matchId: string, winner: string, snapshot: Match[]) => {

    if (matchId.startsWith('qf')) {
      // QF winner → SF  (qf1&2 → sf1, qf3&4 → sf2)
      const n     = parseInt(matchId.substring(2));
      const sfNum = Math.ceil(n / 2);
      const pos   = n % 2 === 1 ? 'player1' : 'player2';
      await api.updateMatch(`sf${sfNum}`, { [pos]: winner });

    } else if (matchId.startsWith('sf')) {
      // SF winner → Final; SF loser → Third Place
      const n   = parseInt(matchId.substring(2));
      const pos = n === 1 ? 'player1' : 'player2';
      const match = snapshot.find(m => m.id === matchId);
      const loser = match
        ? (match.player1 === winner ? match.player2 : match.player1)
        : 'TBD';
      await api.updateMatch('final', { [pos]: winner });
      await api.updateMatch('third', { [pos]: loser });

    } else if (matchId.startsWith('r16-')) {
      // R16 winner → QF  (r16-1&2 → qf1, r16-3&4 → qf2, r16-5&6 → qf3, r16-7&8 → qf4)
      const n     = parseInt(matchId.split('-')[1]);
      const qfNum = Math.ceil(n / 2);
      const pos   = n % 2 === 1 ? 'player1' : 'player2';
      await api.updateMatch(`qf${qfNum}`, { [pos]: winner });

    } else if (matchId.startsWith('q')) {
      // Qual winner → player2 slot of matching r16
      const n = parseInt(matchId.substring(1));
      await api.updateMatch(`r16-${n}`, { player2: winner });
    }
  };

  // ── Public actions ─────────────────────────────────────────────────────
  const addPlayer = async (name: string) => {
    const [p] = await api.addPlayer(name);
    setPlayers(prev => [...prev, p]);
  };

  const removePlayer = async (id: string) => {
    await api.removePlayer(id);
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updateMatch = (id: string, updates: Partial<Match>) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const setMatchWinner = async (
    matchId: string, winner: string, score1: number, score2: number
  ) => {
    await api.updateMatch(matchId, { winner, score1, score2, status: 'completed', console: null });
    const updated = matches.map(m =>
      m.id === matchId
        ? { ...m, winner, score1, score2, status: 'completed' as MatchStatus, console: null }
        : m
    );
    setMatches(updated);
    await advanceWinner(matchId, winner, updated);
    await reload();
  };

  const assignConsole = async (matchId: string, consoleNum: number) => {
    await api.updateMatch(matchId, { console: consoleNum });
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, console: consoleNum } : m));
  };

  const startMatch = async (matchId: string) => {
    await api.updateMatch(matchId, { status: 'live' });
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'live' } : m));
  };

  const completeMatch = async (matchId: string) => {
    await api.updateMatch(matchId, { status: 'completed', console: null });
    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, status: 'completed', console: null } : m
    ));
  };

  const resetTournament = async () => {
    await generateBracket();
  };

  return (
    <TournamentContext.Provider value={{
      players, matches, loading, error,
      addPlayer, removePlayer, updateMatch,
      setMatchWinner, assignConsole, startMatch, completeMatch,
      generateBracket, resetTournament, reload,
    }}>
      {children}
    </TournamentContext.Provider>
  );
}
