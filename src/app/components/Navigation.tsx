import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Trophy, List, Radio, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const publicLinks = [
    { path: '/', label: 'Home', icon: Trophy },
    { path: '/bracket', label: 'Bracket', icon: List },
    { path: '/live', label: 'Live', icon: Radio },
    { path: '/rules', label: 'Rules', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
    setMenuOpen(false);
  };

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
      location.pathname === path
        ? 'bg-emerald-500/20 text-emerald-400'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
    }`;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
            <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              TOUR ARCADE FC 26
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {publicLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} className={linkClass(path)}>
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}
            {isAdmin ? (
              <>
                <Link to="/admin" className={linkClass('/admin')}>
                  <Settings className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/admin/login" className={linkClass('/admin/login')}>
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 text-slate-400 hover:text-white transition-colors">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm px-4 py-3 space-y-1">
          {publicLinks.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === path
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
          {isAdmin ? (
            <>
              <Link to="/admin" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/admin' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}>
                <Settings className="w-4 h-4" /> Admin
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all">
              <Settings className="w-4 h-4" /> Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
