import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchStore } from '../stores';
import { useHistoryStore } from '../stores';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatCard from '../components/stats/StatCard';
import SetStats from '../components/stats/SetStats';

export default function MatchSummary() {
  const navigate = useNavigate();
  const currentMatch = useMatchStore((state) => state.currentMatch);
  const clearMatch = useMatchStore((state) => state.clearMatch);
  const addMatch = useHistoryStore((state) => state.addMatch);

  useEffect(() => {
    // Si pas de match ou match non terminé, rediriger vers home
    if (!currentMatch || currentMatch.status !== 'completed') {
      navigate('/');
      return;
    }

    // Sauvegarder le match dans l'historique
    addMatch(currentMatch);
  }, [currentMatch, navigate, addMatch]);

  // Calculer les statistiques globales
  const globalStats = useMemo(() => {
    if (!currentMatch) return null;

    let totalTouchesLeft = 0;
    let totalTouchesRight = 0;
    let totalPoints = 0;

    currentMatch.sets.forEach((set) => {
      if (set.status === 'completed') {
        totalTouchesLeft += set.stats.touchesLeft;
        totalTouchesRight += set.stats.touchesRight;
        totalPoints += set.stats.totalPoints;
      }
    });

    const totalTouches = totalTouchesLeft + totalTouchesRight;
    const touchesLeftPercent = totalTouches > 0
      ? Math.round((totalTouchesLeft / totalTouches) * 100)
      : 50;
    const touchesRightPercent = totalTouches > 0
      ? Math.round((totalTouchesRight / totalTouches) * 100)
      : 50;
    const avgTouchesPerPoint = totalPoints > 0
      ? (totalTouches / totalPoints)
      : 0;

    return {
      totalTouchesLeft,
      totalTouchesRight,
      totalTouches,
      totalPoints,
      touchesLeftPercent,
      touchesRightPercent,
      avgTouchesPerPoint,
    };
  }, [currentMatch]);

  // Formater la durée
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  if (!currentMatch || !globalStats) {
    return null;
  }

  const isVictory = currentMatch.winner === 'us';
  const completedSets = currentMatch.sets.filter((set) => set.status === 'completed');

  const handleNewMatch = () => {
    clearMatch();
    navigate('/setup');
  };

  const handleHome = () => {
    clearMatch();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-dark p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-block px-6 py-2 rounded-full mb-4 ${
            isVictory
              ? 'bg-primary/20 text-primary'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {isVictory ? '🏆 Victoire !' : '😔 Défaite'}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Résumé du Match
          </h1>

          {/* Score final */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-sm text-white/60 mb-1">Notre équipe</div>
              <div className="text-lg font-medium text-white">
                {currentMatch.teamUs.playerLeft} & {currentMatch.teamUs.playerRight}
              </div>
            </div>
            <div className="text-5xl font-bold text-primary">
              {currentMatch.finalScore.us} - {currentMatch.finalScore.them}
            </div>
            <div className="text-center">
              <div className="text-sm text-white/60 mb-1">Adversaires</div>
              <div className="text-lg font-medium text-white">
                {currentMatch.teamThem.player1} & {currentMatch.teamThem.player2}
              </div>
            </div>
          </div>

          {/* Détail des sets */}
          <div className="flex items-center justify-center gap-4">
            {completedSets.map((set) => (
              <div
                key={set.setNumber}
                className="px-4 py-2 bg-surface-dark rounded-lg border border-white/10"
              >
                <div className="text-xs text-white/60 mb-1">Set {set.setNumber}</div>
                <div className="font-bold text-white">
                  {set.score.us} - {set.score.them}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Durée"
            value={formatDuration(currentMatch.duration)}
            icon={<span className="material-symbols-outlined">schedule</span>}
          />
          <StatCard
            title="Sets joués"
            value={completedSets.length}
            icon={<span className="material-symbols-outlined">sports_tennis</span>}
          />
          <StatCard
            title="Points joués"
            value={globalStats.totalPoints}
            icon={<span className="material-symbols-outlined">counter_1</span>}
          />
          <StatCard
            title="Total touches"
            value={globalStats.totalTouches}
            icon={<span className="material-symbols-outlined">touch_app</span>}
          />
        </div>

        {/* Répartition des touches globale */}
        <Card className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Répartition des Touches
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm font-medium text-white/80 mb-1">
                {currentMatch.teamUs.playerLeft}
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {globalStats.totalTouchesLeft}
              </div>
              <div className="text-sm text-white/50">
                {globalStats.touchesLeftPercent}% des touches
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-white/80 mb-1">
                {currentMatch.teamUs.playerRight}
              </div>
              <div className="text-3xl font-bold text-secondary-neon mb-1">
                {globalStats.totalTouchesRight}
              </div>
              <div className="text-sm text-white/50">
                {globalStats.touchesRightPercent}% des touches
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="flex h-4 rounded-full overflow-hidden bg-surface-dark mb-4">
            <div
              className="bg-primary flex items-center justify-center text-xs font-bold"
              style={{ width: `${globalStats.touchesLeftPercent}%` }}
            >
              {globalStats.touchesLeftPercent > 15 && `${globalStats.touchesLeftPercent}%`}
            </div>
            <div
              className="bg-secondary-neon flex items-center justify-center text-xs font-bold"
              style={{ width: `${globalStats.touchesRightPercent}%` }}
            >
              {globalStats.touchesRightPercent > 15 && `${globalStats.touchesRightPercent}%`}
            </div>
          </div>

          <div className="text-center text-sm text-white/60">
            Moyenne : {globalStats.avgTouchesPerPoint.toFixed(1)} touches par point
          </div>
        </Card>

        {/* Détails par set */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Détails par Set
          </h2>
          <div className="space-y-4">
            {completedSets.map((set) => (
              <SetStats
                key={set.setNumber}
                set={set}
                teamUsNames={currentMatch.teamUs}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleHome}
          >
            Accueil
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleNewMatch}
          >
            Nouveau Match
          </Button>
        </div>
      </div>
    </div>
  );
}
