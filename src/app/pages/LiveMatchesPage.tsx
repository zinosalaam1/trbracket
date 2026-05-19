import { useTournament } from '../contexts/TournamentContext';
import { MatchCard } from '../components/MatchCard';
import { Gamepad2, Clock, CheckCircle2 } from 'lucide-react';

export function LiveMatchesPage() {
  const { matches } = useTournament();

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'pending');
  const recentCompleted = matches
    .filter(m => m.status === 'completed')
    .slice(-6);

  const consoleStatus = [1, 2].map(consoleNum => {
    const match = liveMatches.find(m => m.console === consoleNum);
    return { consoleNum, match };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Live Matches</h1>
        <p className="text-slate-400">Real-time tournament updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {consoleStatus.map(({ consoleNum, match }) => (
          <div
            key={consoleNum}
            className={`border rounded-xl p-6 ${
              match
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700 bg-slate-800/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className={match ? 'text-emerald-400' : 'text-slate-400'} />
                <span className="font-semibold text-white">Console {consoleNum}</span>
              </div>
              {match ? (
                <div className="flex items-center gap-1 text-emerald-400 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  LIVE
                </div>
              ) : (
                <div className="text-slate-500 text-sm">Available</div>
              )}
            </div>

            {match ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 mb-2">{match.round}</div>
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-white">{match.player1}</span>
                  <span className="text-xl font-bold text-emerald-400">{match.score1}</span>
                </div>
                <div className="text-center text-slate-500 text-xs">vs</div>
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-white">{match.player2}</span>
                  <span className="text-xl font-bold text-emerald-400">{match.score2}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Waiting for match</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {liveMatches.length === 0 && (
        <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Live Matches</h3>
          <p className="text-slate-400">Check back soon for live tournament action</p>
        </div>
      )}

      {upcomingMatches.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            Upcoming Matches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.slice(0, 9).map(match => (
              <MatchCard key={match.id} match={match} compact />
            ))}
          </div>
        </div>
      )}

      {recentCompleted.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-slate-400" />
            Recent Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCompleted.map(match => (
              <MatchCard key={match.id} match={match} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
