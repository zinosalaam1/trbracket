import { Shield, Clock, Gamepad2, Trophy, AlertTriangle, Users } from 'lucide-react';

export function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Tournament Rules</h1>
        <p className="text-slate-400">Official regulations for Tour Arcade FC 26</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Tournament Format</h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Total Players:</strong> 22 participants</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Format:</strong> Single Elimination with Qualification Round</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Qualification:</strong> 12 players compete in 6 matches, 10 players receive byes</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Progression:</strong> Round of 16 → Quarterfinals → Semifinals → Final</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Match Rules</h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Match Length:</strong> 6 minutes per half (12 minutes total)</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Difficulty:</strong> World Class or Legendary (tournament admin decision)</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Extra Time:</strong> Enabled if match is tied at full time</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Penalties:</strong> Enabled if tied after extra time</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Teams:</strong> No custom squads allowed - official teams only</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Pauses:</strong> Maximum 3 pauses per player per match</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Controller Switching:</strong> Not allowed during active match</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Time & Attendance</h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Check-in:</strong> Players must report immediately when called for their match</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Lateness:</strong> 5-minute grace period, after which automatic forfeit occurs</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Console Assignment:</strong> Matches assigned to available consoles on first-come basis</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Prize Pool</h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">1st Place:</strong> ₦50,000</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">2nd Place:</strong> ₦15,000</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">3rd Place:</strong> ₦10,000</p>
            </div>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Violations & Disputes</h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Toxic Behavior:</strong> Zero tolerance policy - immediate disqualification</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Cheating:</strong> Any form of cheating results in automatic disqualification</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Technical Issues:</strong> Must be reported immediately to tournament admin</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Disputes:</strong> Tournament admin has final say in all disputes and rule interpretations</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Consoles</h2>
          </div>
          <div className="space-y-3 text-slate-300">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Available Consoles:</strong> 2 gaming stations</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Assignment:</strong> Admin assigns consoles based on availability</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <p><strong className="text-white">Rotation:</strong> Next pending match enters free console automatically after completion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
