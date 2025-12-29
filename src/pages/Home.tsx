import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchStore, useHistoryStore } from '../stores';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatCard from '../components/stats/StatCard';

export default function Home() {
  const navigate = useNavigate();
  const currentMatch = useMatchStore((state) => state.currentMatch);
  const matches = useHistoryStore((state) => state.matches);

  const handleNewMatch = () => {
    navigate('/setup');
  };

  const handleResume = () => {
    navigate('/tracking');
  };

  // Calculer les statistiques rapides
  const stats = useMemo(() => {
    const totalMatches = matches.length;
    const victories = matches.filter((m) => m.winner === 'us').length;
    const defeats = matches.filter((m) => m.winner === 'them').length;
    const winRate = totalMatches > 0 ? Math.round((victories / totalMatches) * 100) : 0;

    return { totalMatches, victories, defeats, winRate };
  }, [matches]);

  // Derniers matchs (max 3)
  const recentMatches = useMemo(() => {
    return matches
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [matches]);

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <span className="material-symbols-outlined text-3xl">sports_tennis</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PadelTracker</h1>
              <p className="text-sm text-white/60">Suivez vos performances</p>
            </div>
          </div>
        </div>

        {/* Match en cours */}
        {currentMatch && (currentMatch.status === 'in_progress' || currentMatch.status === 'paused') && (
          <Card className="mb-6 bg-primary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">play_circle</span>
                  <span className="text-sm font-medium text-primary">Match en cours</span>
                </div>
                <p className="text-white font-medium">
                  {currentMatch.teamUs.playerLeft} & {currentMatch.teamUs.playerRight}
                </p>
                <p className="text-sm text-white/60">
                  vs {currentMatch.teamThem.player1} & {currentMatch.teamThem.player2}
                </p>
              </div>
              <Button onClick={handleResume} size="md">
                Reprendre
              </Button>
            </div>
          </Card>
        )}

        {/* Action principale */}
        {!currentMatch || currentMatch.status === 'completed' ? (
          <Button
            onClick={handleNewMatch}
            size="xl"
            className="w-full mb-6"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add_circle</span>
              <span>Nouveau Match</span>
            </span>
          </Button>
        ) : null}

        {/* Statistiques rapides */}
        {stats.totalMatches > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Vos Statistiques</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Matchs joués"
                value={stats.totalMatches}
                icon={<span className="material-symbols-outlined">sports_score</span>}
              />
              <StatCard
                title="Victoires"
                value={stats.victories}
                icon={<span className="material-symbols-outlined">emoji_events</span>}
                variant="primary"
              />
              <StatCard
                title="Défaites"
                value={stats.defeats}
                icon={<span className="material-symbols-outlined">sentiment_dissatisfied</span>}
              />
              <StatCard
                title="Taux victoire"
                value={`${stats.winRate}%`}
                icon={<span className="material-symbols-outlined">trending_up</span>}
                variant="secondary"
              />
            </div>
          </div>
        )}

        {/* Derniers matchs */}
        {recentMatches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Derniers Matchs</h2>
              <button
                onClick={() => navigate('/history')}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Voir tout →
              </button>
            </div>
            <div className="space-y-3">
              {recentMatches.map((match) => {
                const isVictory = match.winner === 'us';
                const date = new Date(match.createdAt);

                return (
                  <div
                    key={match.id}
                    onClick={() => navigate('/history')}
                    className="cursor-pointer"
                  >
                    <Card className="hover:bg-surface-dark/80 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {isVictory ? (
                            <span className="text-xs font-bold text-primary">VICTOIRE</span>
                          ) : (
                            <span className="text-xs font-bold text-red-400">DÉFAITE</span>
                          )}
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/60">
                            {date.toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm text-white">
                          {match.teamUs.playerLeft} & {match.teamUs.playerRight}
                        </p>
                        <p className="text-xs text-white/60">
                          vs {match.teamThem.player1} & {match.teamThem.player2}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {match.finalScore.us} - {match.finalScore.them}
                        </div>
                      </div>
                    </div>
                  </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message vide */}
        {stats.totalMatches === 0 && !currentMatch && (
          <Card className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
              sports_tennis
            </span>
            <h3 className="text-lg font-bold text-white mb-2">
              Commencez votre premier match !
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Trackez vos performances et suivez votre progression
            </p>
            <Button onClick={handleNewMatch} size="lg">
              Nouveau Match
            </Button>
          </Card>
        )}

        {/* Liens rapides */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => navigate('/stats')}
            className="p-4 rounded-xl bg-surface-dark border border-white/10 hover:bg-surface-dark/80 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-2xl text-primary mb-2 block">
              analytics
            </span>
            <p className="text-sm font-medium text-white">Statistiques</p>
            <p className="text-xs text-white/60">Analyse détaillée</p>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-4 rounded-xl bg-surface-dark border border-white/10 hover:bg-surface-dark/80 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-2xl text-secondary-neon mb-2 block">
              settings
            </span>
            <p className="text-sm font-medium text-white">Paramètres</p>
            <p className="text-xs text-white/60">Configuration</p>
          </button>
        </div>
      </div>
    </div>
  );
}
