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

// ─── The 22 registered players ─────────────────────────────────────────────
const SEEDED_PLAYERS = [
  'Tobi', 'Xhabi', 'Awele', 'Awelewa Oluwaseun', 'Oghosa',
  'Agbabiaka Emmanuel', 'Jags', 'Emmanuel Bassey', 'Jeremiah Oluwakoya',
  'Odejimi Oluwaferanmi', 'Lord Seventh', 'Yorokobi', 'Avoseh', 'Olamide',
  'Prime', 'Akwaba', 'Joseph inioluwa', 'Obanla oluwadamilare wisdom',
  'Omo papi', 'Abdulrasaq Jamiu Olamide', 'Big Bally', 'Zinoln','Tope',
];

function buildMatch(
  id: string, player1: string, player2: string,
  round: string, sortOrder: number
): Match {
  return { id, player1, player2, score1: 0, score2: 0, winner: '', round, console: null, status: 'pending', sort_order: sortOrder };
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Load from Supabase ──────────────────────────────────────────────────
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

  // Auto-seed the 22 players on first run if the table is empty
  const seedIfEmpty = useCallback(async () => {
    try {
      const existing = await api.getPlayers();
      if (!existing || existing.length === 0) {
        for (const name of SEEDED_PLAYERS) {
          await api.addPlayer(name);
        }
        await reload();
      }
    } catch {
      // silently ignore if Supabase isn't configured yet
    }
  }, [reload]);

  useEffect(() => {
    reload().then(seedIfEmpty);
  }, [reload, seedIfEmpty]);

  // Poll every 5 s so all viewers stay in sync
  useEffect(() => {
    const t = setInterval(reload, 5000);
    return () => clearInterval(t);
  }, [reload]);

  // ── Bracket generation ─────────────────────────────────────────────────
  const generateBracket = async (overridePlayers?: Player[]) => {
    const ps = overridePlayers ?? players;
    await api.deleteAllMatches();
    const newMatches: Match[] = [];
    let sort = 0;

    // Qualification — 6 matches (players 1-12)
    for (let i = 0; i < 6; i++) {
      newMatches.push(buildMatch(`q${i + 1}`, ps[i * 2]?.name ?? 'TBD', ps[i * 2 + 1]?.name ?? 'TBD', 'Qualification', sort++));
    }
    // Round of 16 — first 6: bye players (13-18) vs qual winners
    for (let i = 0; i < 6; i++) {
      newMatches.push(buildMatch(`r16-${i + 1}`, ps[12 + i]?.name ?? 'TBD', 'TBD', 'Round of 16', sort++));
    }
    // Round of 16 — last 2: bye players 19-22
    newMatches.push(buildMatch('r16-7', ps[18]?.name ?? 'TBD', ps[19]?.name ?? 'TBD', 'Round of 16', sort++));
    newMatches.push(buildMatch('r16-8', ps[20]?.name ?? 'TBD', ps[21]?.name ?? 'TBD', 'Round of 16', sort++));
    newMatches.push(buildMatch('r16-9', ps[22]?.name ?? 'TBD', 'TBD', 'Round of 16', sort++));
    // Quarterfinals
    for (let i = 0; i < 4; i++) newMatches.push(buildMatch(`qf${i + 1}`, 'TBD', 'TBD', 'Quarterfinals', sort++));
    // Semifinals
    for (let i = 0; i < 2; i++) newMatches.push(buildMatch(`sf${i + 1}`, 'TBD', 'TBD', 'Semifinals', sort++));
    // Third Place + Final
    newMatches.push(buildMatch('third', 'TBD', 'TBD', 'Third Place', sort++));
    newMatches.push(buildMatch('final', 'TBD', 'TBD', 'Final', sort++));

    for (const m of newMatches) await api.upsertMatch(m);
    setMatches(newMatches);
  };

  // ── Advance winner through bracket ─────────────────────────────────────
  const advanceWinner = async (matchId: string, winner: string, snapshot: Match[]) => {
    const updates: Array<{ id: string; field: string; value: string }> = [];

    if (matchId.startsWith('q')) {
      const n = parseInt(matchId.substring(1));
      updates.push({ id: `r16-${n}`, field: 'player2', value: winner });
    } else if (matchId.startsWith('r16-')) {
      const n = parseInt(matchId.split('-')[1]);
      const qfNum = Math.ceil(n / 2);
      const pos = n % 2 === 1 ? 'player1' : 'player2';
      updates.push({ id: `qf${qfNum}`, field: pos, value: winner });
    } else if (matchId.startsWith('qf')) {
      const n = parseInt(matchId.substring(2));
      const sfNum = Math.ceil(n / 2);
      const pos = n % 2 === 1 ? 'player1' : 'player2';
      updates.push({ id: `sf${sfNum}`, field: pos, value: winner });
    } else if (matchId.startsWith('sf')) {
      const n = parseInt(matchId.substring(2));
      const pos = n === 1 ? 'player1' : 'player2';
      const match = snapshot.find(m => m.id === matchId);
      const loser = match ? (match.player1 === winner ? match.player2 : match.player1) : 'TBD';
      updates.push({ id: 'final', field: pos, value: winner });
      updates.push({ id: 'third', field: pos, value: loser });
    }

    for (const u of updates) await api.updateMatch(u.id, { [u.field]: u.value });
  };

  // ── Public actions ──────────────────────────────────────────────────────
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

  const setMatchWinner = async (matchId: string, winner: string, score1: number, score2: number) => {
    await api.updateMatch(matchId, { winner, score1, score2, status: 'completed', console: null });
    const updated = matches.map(m => m.id === matchId ? { ...m, winner, score1, score2, status: 'completed' as MatchStatus, console: null } : m);
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
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'completed', console: null } : m));
  };

  const resetTournament = async () => {
    await api.deleteAllMatches();
    await api.deleteAllPlayers();
    setMatches([]);
    setPlayers([]);
    await seedIfEmpty();
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
