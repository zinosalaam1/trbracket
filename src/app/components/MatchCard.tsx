import { Match } from '../contexts/TournamentContext';
import { Gamepad2, Clock, CheckCircle2 } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const getStatusColor = () => {
    switch (match.status) {
      case 'pending':
        return 'border-slate-600 bg-slate-800/30';
      case 'live':
        return 'border-emerald-500 bg-emerald-500/10';
      case 'completed':
        return 'border-slate-700 bg-slate-800/50';
      default:
        return 'border-slate-600 bg-slate-800/30';
    }
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            Pending
          </div>
        );
      case 'live':
        return (
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            LIVE
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <CheckCircle2 className="w-3 h-3" />
            Final
          </div>
        );
    }
  };

  const isWinner = (player: string) => {
    return match.status === 'completed' && match.winner === player;
  };

  if (compact) {
    return (
      <div className={`border rounded-lg p-3 ${getStatusColor()}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-slate-400">{match.round}</div>
          {getStatusBadge()}
        </div>
        <div className="space-y-2">
          <div className={`flex items-center justify-between ${isWinner(match.player1) ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}>
            <span className="truncate">{match.player1}</span>
            <span className="ml-2">{match.score1}</span>
          </div>
          <div className={`flex items-center justify-between ${isWinner(match.player2) ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}>
            <span className="truncate">{match.player2}</span>
            <span className="ml-2">{match.score2}</span>
          </div>
        </div>
        {match.console && (
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" />
            Console {match.console}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border rounded-xl p-6 ${getStatusColor()} transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">{match.round}</h3>
          <p className="text-xs text-slate-500">{match.id.toUpperCase()}</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-3 mb-4">
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          isWinner(match.player1)
            ? 'bg-emerald-500/20 border border-emerald-500/30'
            : 'bg-slate-700/30'
        }`}>
          <span className={`font-semibold ${isWinner(match.player1) ? 'text-emerald-400' : 'text-white'}`}>
            {match.player1}
          </span>
          <span className={`text-2xl font-bold ${isWinner(match.player1) ? 'text-emerald-400' : 'text-slate-300'}`}>
            {match.score1}
          </span>
        </div>

        <div className="text-center text-slate-500 text-sm">vs</div>

        <div className={`flex items-center justify-between p-3 rounded-lg ${
          isWinner(match.player2)
            ? 'bg-emerald-500/20 border border-emerald-500/30'
            : 'bg-slate-700/30'
        }`}>
          <span className={`font-semibold ${isWinner(match.player2) ? 'text-emerald-400' : 'text-white'}`}>
            {match.player2}
          </span>
          <span className={`text-2xl font-bold ${isWinner(match.player2) ? 'text-emerald-400' : 'text-slate-300'}`}>
            {match.score2}
          </span>
        </div>
      </div>

      {match.console && (
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-700/30 rounded-lg p-2">
          <Gamepad2 className="w-4 h-4" />
          Console {match.console}
        </div>
      )}
    </div>
  );
}
