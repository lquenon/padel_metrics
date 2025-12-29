import { useNavigate } from 'react-router-dom';
import { useMatchStore } from '../stores';

export default function Home() {
  const navigate = useNavigate();
  const createMatch = useMatchStore((state) => state.createMatch);
  const currentMatch = useMatchStore((state) => state.currentMatch);

  const handleQuickStart = () => {
    // Créer un match de test rapide
    createMatch({
      playerLeft: 'Alex',
      playerRight: 'Sarah',
      adversary1: 'Tom',
      adversary2: 'Maria',
      setsToWin: 2,
      tiebreakInFinalSet: true,
    });

    // Rediriger vers le tracking
    navigate('/match/tracking');
  };

  const handleResume = () => {
    navigate('/match/tracking');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 p-3">
            <span className="material-symbols-outlined text-4xl">sports_tennis</span>
          </div>
          <h1 className="text-4xl font-bold text-primary">PadelTracker</h1>
        </div>

        <p className="text-gray-400 mb-8">
          Application de suivi de performance pour matchs de padel
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {currentMatch && currentMatch.status !== 'completed' ? (
            <>
              <button
                onClick={handleResume}
                className="w-full py-4 bg-neon-gradient text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-neon-primary hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                <span>Reprendre le Match</span>
              </button>

              <p className="text-sm text-gray-500">
                Match en cours avec {currentMatch.teamUs.playerLeft} & {currentMatch.teamUs.playerRight}
              </p>
            </>
          ) : (
            <button
              onClick={handleQuickStart}
              className="w-full py-4 bg-neon-gradient text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-neon-primary hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span>Démarrer un Match</span>
            </button>
          )}

          <div className="mt-8 p-4 bg-surface-dark/50 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-2">Phase 4 - Version Fonctionnelle Minimale</p>
            <ul className="text-xs text-gray-400 space-y-1 text-left">
              <li>✅ Moteur de score complet</li>
              <li>✅ Tracking des touches</li>
              <li>✅ Calcul automatique du score</li>
              <li>✅ Support tie-break</li>
              <li>⏳ Configuration match (Phase 2)</li>
              <li>⏳ Résumé détaillé (Phase 5)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
