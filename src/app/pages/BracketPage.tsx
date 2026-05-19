import { useTournament } from '../contexts/TournamentContext';
import { MatchCard } from '../components/MatchCard';

export function BracketPage() {
  const { matches } = useTournament();

  const qualificationMatches = matches.filter(m => m.round === 'Qualification');
  const r16Matches = matches.filter(m => m.round === 'Round of 16');
  const quarterfinalsMatches = matches.filter(m => m.round === 'Quarterfinals');
  const semifinalsMatches = matches.filter(m => m.round === 'Semifinals');
  const thirdPlaceMatch = matches.find(m => m.round === 'Third Place');
  const finalMatch = matches.find(m => m.round === 'Final');

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Tournament Bracket</h1>
        <p className="text-slate-400">22 Players • Single Elimination</p>
      </div>

      <div className="space-y-12">
        {qualificationMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-8 bg-purple-500 rounded" />
              Qualification Round
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualificationMatches.map(match => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          </div>
        )}

        {r16Matches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-8 bg-cyan-500 rounded" />
              Round of 16
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {r16Matches.map(match => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          </div>
        )}

        {quarterfinalsMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-8 bg-blue-500 rounded" />
              Quarterfinals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quarterfinalsMatches.map(match => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          </div>
        )}

        {semifinalsMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-8 bg-emerald-500 rounded" />
              Semifinals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {semifinalsMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {thirdPlaceMatch && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-orange-500 rounded" />
                Third Place
              </h2>
              <MatchCard match={thirdPlaceMatch} />
            </div>
          )}

          {finalMatch && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-amber-500 rounded" />
                Final
              </h2>
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20" />
                <div className="relative">
                  <MatchCard match={finalMatch} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
