import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useTournament } from '../contexts/TournamentContext';
import { MatchCard } from '../components/MatchCard';
import {
  Settings, Play, StopCircle, Gamepad2, Trophy,
  RotateCcw, ChevronDown, ChevronUp, Plus, Trash2, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const {
    players, matches, error,
    addPlayer, removePlayer,
    setMatchWinner, assignConsole, startMatch,
    resetTournament, generateBracket, reload,
  } = useTournament();

  useEffect(() => { if (!isAdmin) navigate('/admin/login'); }, [isAdmin, navigate]);

  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { score1: number; score2: number; winner: string }>>({});
  const [newPlayerName, setNewPlayerName] = useState('');

  if (!isAdmin) return null;

  const pendingMatches  = matches.filter(m => m.status === 'pending');
  const liveMatches     = matches.filter(m => m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const availableConsoles = [1, 2].filter(n => !liveMatches.some(m => m.console === n));

  // ── Player management ─────────────────────────────────────────────────
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newPlayerName.trim();
    if (!name) return;
    try { await addPlayer(name); setNewPlayerName(''); toast.success(`${name} added!`); }
    catch { toast.error('Failed to add player'); }
  };

  const handleRemovePlayer = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    try { await removePlayer(id); toast.success(`${name} removed`); }
    catch { toast.error('Failed to remove player'); }
  };

  // ── Match controls ────────────────────────────────────────────────────
  const handleStartMatch = async (matchId: string, consoleNum: number) => {
    try { await assignConsole(matchId, consoleNum); await startMatch(matchId); toast.success('Match started!'); }
    catch { toast.error('Error starting match'); }
  };

  const handleCompleteMatch = async (matchId: string) => {
    const s = scores[matchId];
    if (!s?.winner) { toast.error('Set scores and winner first'); return; }
    try {
      await setMatchWinner(matchId, s.winner, s.score1 ?? 0, s.score2 ?? 0);
      setExpandedMatch(null);
      setScores(prev => { const n = { ...prev }; delete n[matchId]; return n; });
      toast.success('Match completed!');
    } catch { toast.error('Error completing match'); }
  };

  const handleForfeit = async (matchId: string, winner: string) => {
    try { await setMatchWinner(matchId, winner, 0, 0); toast.success(`${winner} wins by forfeit`); }
    catch { toast.error('Error recording forfeit'); }
  };

  const handleGenerateBracket = async () => {
    if (!window.confirm('Generate bracket with current players? Existing matches will be replaced.')) return;
    try { await generateBracket(); toast.success('Bracket generated!'); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleResetTournament = async () => {
    if (!window.confirm('Reset the entire tournament? This cannot be undone.')) return;
    try { await resetTournament(); toast.success('Tournament reset'); }
    catch (e: any) { toast.error(e.message); }
  };

  const setScore = (matchId: string, field: 'score1' | 'score2', val: number) => {
    setScores(prev => ({ ...prev, [matchId]: { ...prev[matchId], score1: prev[matchId]?.score1 ?? 0, score2: prev[matchId]?.score2 ?? 0, winner: prev[matchId]?.winner ?? '', [field]: val } }));
  };
  const setWinner = (matchId: string, winner: string) => {
    setScores(prev => ({ ...prev, [matchId]: { score1: prev[matchId]?.score1 ?? 0, score2: prev[matchId]?.score2 ?? 0, ...prev[matchId], winner } }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 flex items-center gap-3">
            <Settings className="w-8 h-8 text-emerald-400" />
            Admin Panel
          </h1>
          <p className="text-slate-400">Tournament management &amp; control</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reload} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleResetTournament} className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all text-sm">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ Supabase error: {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { n: pendingMatches.length, label: 'Pending', cls: 'border-blue-500/30 bg-blue-500/10', icon: <Trophy className="w-5 h-5 text-blue-400" /> },
          { n: liveMatches.length, label: 'Live', cls: 'border-emerald-500/30 bg-emerald-500/10', icon: <Play className="w-5 h-5 text-emerald-400" /> },
          { n: completedMatches.length, label: 'Completed', cls: 'border-slate-600 bg-slate-700/30', icon: <StopCircle className="w-5 h-5 text-slate-400" /> },
          { n: players.length, label: 'Players', cls: 'border-purple-500/30 bg-purple-500/10', icon: <Gamepad2 className="w-5 h-5 text-purple-400" /> },
        ].map(({ n, label, cls, icon }) => (
          <div key={label} className={`border rounded-xl p-4 ${cls}`}>
            <div className="flex items-center gap-2 mb-1">{icon}</div>
            <p className="text-2xl font-bold text-white">{n}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Player management */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Players ({players.length}/22)</h2>
        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4 flex-wrap">
          <input
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            placeholder="Player name…"
            className="flex-1 min-w-0 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <button type="submit" className="flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {players.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between px-3 py-2 bg-slate-700/40 border border-slate-700 rounded-lg">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-slate-500 font-semibold w-5 shrink-0">#{i + 1}</span>
                <span className="text-sm text-slate-200 truncate">{p.name}</span>
              </div>
              <button onClick={() => handleRemovePlayer(p.id, p.name)} className="shrink-0 ml-2 text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        {players.length > 0 && (
          <div className="mt-4">
            <button onClick={handleGenerateBracket} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm">
              <Trophy className="w-4 h-4" /> Generate Bracket
            </button>
          </div>
        )}
      </div>

      {/* Live matches */}
      {liveMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" /> Live Matches
          </h2>
          <div className="space-y-4">
            {liveMatches.map(match => (
              <div key={match.id} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1"><MatchCard match={match} /></div>
                  <div className="lg:w-64 space-y-3">
                    <button
                      onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm"
                    >
                      <span>Match Controls</span>
                      {expandedMatch === match.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedMatch === match.id && (
                      <div className="space-y-3 bg-slate-800/50 rounded-lg p-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{match.player1} Score</label>
                          <input type="number" min="0" value={scores[match.id]?.score1 ?? 0}
                            onChange={e => setScore(match.id, 'score1', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{match.player2} Score</label>
                          <input type="number" min="0" value={scores[match.id]?.score2 ?? 0}
                            onChange={e => setScore(match.id, 'score2', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Winner</label>
                          <select value={scores[match.id]?.winner ?? ''}
                            onChange={e => setWinner(match.id, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="">Select winner</option>
                            <option value={match.player1}>{match.player1}</option>
                            <option value={match.player2}>{match.player2}</option>
                          </select>
                        </div>
                        <button onClick={() => handleCompleteMatch(match.id)}
                          className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm">
                          Complete Match
                        </button>
                        <div className="border-t border-slate-700 pt-3 space-y-2">
                          <p className="text-xs text-slate-400">Forfeit:</p>
                          <button onClick={() => handleForfeit(match.id, match.player2)}
                            className="w-full px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded border border-red-500/30 transition-all">
                            {match.player1} Forfeits
                          </button>
                          <button onClick={() => handleForfeit(match.id, match.player1)}
                            className="w-full px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded border border-red-500/30 transition-all">
                            {match.player2} Forfeits
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending matches */}
      {pendingMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Pending Matches</h2>
          <div className="space-y-3">
            {pendingMatches.slice(0, 12).map(match => {
              const ready = match.player1 !== 'TBD' && match.player2 !== 'TBD';
              return (
                <div key={match.id} className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 sm:p-6">
                  {ready ? (
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1"><MatchCard match={match} /></div>
                      <div className="lg:w-64 space-y-2">
                        <p className="text-xs text-slate-400 mb-1">Assign to console:</p>
                        {availableConsoles.length > 0 ? availableConsoles.map(n => (
                          <button key={n} onClick={() => handleStartMatch(match.id, n)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm">
                            <Gamepad2 className="w-4 h-4" /> Start on Console {n}
                          </button>
                        )) : (
                          <div className="px-4 py-3 bg-slate-700/50 text-slate-400 text-center rounded-lg text-sm">
                            All consoles in use
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">{match.round} — {match.id.toUpperCase()}</p>
                        <p className="text-xs text-slate-400 mt-1">Waiting for previous matches to complete</p>
                      </div>
                      <span className="px-3 py-1 bg-slate-700 text-slate-400 text-xs rounded">Not Ready</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedMatches.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Recent Completed Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedMatches.slice(-9).reverse().map(match => (
              <MatchCard key={match.id} match={match} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
