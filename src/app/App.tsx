import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { TournamentProvider } from './contexts/TournamentContext';
import { HomePage } from './pages/HomePage';
import { BracketPage } from './pages/BracketPage';
import { LiveMatchesPage } from './pages/LiveMatchesPage';
import { RulesPage } from './pages/RulesPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { Navigation } from './components/Navigation';

export default function App() {
  return (
    <AuthProvider>
      <TournamentProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bracket" element={<BracketPage />} />
              <Route path="/live" element={<LiveMatchesPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" theme="dark" />
          </div>
        </BrowserRouter>
      </TournamentProvider>
    </AuthProvider>
  );
}