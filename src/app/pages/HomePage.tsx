import { Trophy, Users, Gamepad2, Calendar, Award } from 'lucide-react';
import { useTournament } from '../contexts/TournamentContext';
import { Link } from 'react-router';

export function HomePage() {
  const { players, matches } = useTournament();

  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const liveMatches = matches.filter(m => m.status === 'live').length;
  const totalMatches = matches.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Trophy className="w-24 h-24 text-emerald-400" />
            <div className="absolute inset-0 blur-2xl bg-emerald-500/30" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          TOUR ARCADE FC 26
        </h1>
        <p className="text-xl text-slate-400 mb-2">Single Elimination Tournament</p>
        <p className="text-slate-500">FIFA/EA FC Tournament • 22 Players • 2 Consoles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-3xl font-bold text-white">{players.length}</p>
              <p className="text-sm text-slate-400">Players</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <Gamepad2 className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-3xl font-bold text-white">{totalMatches}</p>
              <p className="text-sm text-slate-400">Total Matches</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <div>
              <p className="text-3xl font-bold text-white">{liveMatches}</p>
              <p className="text-sm text-slate-400">Live Now</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-3xl font-bold text-white">{completedMatches}/{totalMatches}</p>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Tournament Format</h2>
          <div className="space-y-4 text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
              <div>
                <p className="font-semibold text-white">Qualification Round</p>
                <p className="text-sm text-slate-400">12 players compete in 6 matches</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2" />
              <div>
                <p className="font-semibold text-white">Round of 16</p>
                <p className="text-sm text-slate-400">6 winners + 10 bye players</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-semibold text-white">Knockout Stage</p>
                <p className="text-sm text-slate-400">Quarterfinals → Semifinals → Final</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
              <div>
                <p className="font-semibold text-white">Third Place Match</p>
                <p className="text-sm text-slate-400">Semifinal losers compete</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Prize Pool</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg border border-amber-500/30">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-amber-400" />
                <span className="font-semibold text-white">1st Place</span>
              </div>
              <span className="text-2xl font-bold text-amber-400">₦50,000</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-slate-300" />
                <span className="font-semibold text-white">2nd Place</span>
              </div>
              <span className="text-2xl font-bold text-slate-300">₦15,000</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-orange-400" />
                <span className="font-semibold text-white">3rd Place</span>
              </div>
              <span className="text-2xl font-bold text-orange-400">₦10,000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          to="/bracket"
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
        >
          View Bracket
        </Link>
        <Link
          to="/live"
          className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all border border-slate-600"
        >
          Live Matches
        </Link>
      </div>
    </div>
  );
}
