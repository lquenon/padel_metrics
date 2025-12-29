import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore, useSettingsStore, useHistoryStore, useMatchStore } from './stores';

// Import des tests (disponibles via window.testMatchEngine)
import './services/matchEngine.test';

// Components
import NavBar from './components/layout/NavBar';

// Pages
import Home from './pages/Home';
import MatchSetup from './pages/MatchSetup';
import MatchTracking from './pages/MatchTracking';
import MatchSummary from './pages/MatchSummary';
import History from './pages/History';
import Stats from './pages/Stats';
import Settings from './pages/Settings';

function App() {
  const loadUser = useUserStore((state) => state.loadUser);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const loadMatches = useHistoryStore((state) => state.loadMatches);
  const loadCurrentMatch = useMatchStore((state) => state.loadCurrentMatch);

  // Chargement initial des données
  useEffect(() => {
    loadUser();
    loadSettings();
    loadMatches();
    loadCurrentMatch();
  }, [loadUser, loadSettings, loadMatches, loadCurrentMatch]);

  return (
    <BrowserRouter>
      <div className="dark min-h-screen bg-background-dark pb-20">
        <Routes>
          {/* Home / Dashboard */}
          <Route path="/" element={<Home />} />

          {/* Match Flow */}
          <Route path="/setup" element={<MatchSetup />} />
          <Route path="/tracking" element={<MatchTracking />} />
          <Route path="/summary" element={<MatchSummary />} />

          {/* Navigation */}
          <Route path="/history" element={<History />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Bottom Navigation */}
        <NavBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
