import { useMemo } from 'react';
import { useHistoryStore } from '../stores';
import Card from '../components/ui/Card';
import StatCard from '../components/stats/StatCard';

export default function Stats() {
  const matches = useHistoryStore((state) => state.matches);

  // Calculer toutes les statistiques
  const stats = useMemo(() => {
    const totalMatches = matches.length;
    const victories = matches.filter((m) => m.winner === 'us').length;
    const defeats = matches.filter((m) => m.winner === 'them').length;
    const winRate = totalMatches > 0 ? (victories / totalMatches) * 100 : 0;

    // Calculer les touches totales
    let totalTouchesLeft = 0;
    let totalTouchesRight = 0;
    let totalPoints = 0;
    let totalDuration = 0;

    matches.forEach((match) => {
      totalDuration += match.duration;
      match.sets.forEach((set) => {
        if (set.status === 'completed') {
          totalTouchesLeft += set.stats.touchesLeft;
          totalTouchesRight += set.stats.touchesRight;
          totalPoints += set.stats.totalPoints;
        }
      });
    });

    const totalTouches = totalTouchesLeft + totalTouchesRight;
    const avgTouchesPerPoint = totalPoints > 0 ? totalTouches / totalPoints : 0;
    const avgDuration = totalMatches > 0 ? totalDuration / totalMatches : 0;

    // Statistiques par joueur (basé sur les noms utilisés)
    const playersStats: Record<
      string,
      { matches: number; touches: number }
    > = {};

    matches.forEach((match) => {
      const leftPlayer = match.teamUs.playerLeft;
      const rightPlayer = match.teamUs.playerRight;

      if (!playersStats[leftPlayer]) {
        playersStats[leftPlayer] = { matches: 0, touches: 0 };
      }
      if (!playersStats[rightPlayer]) {
        playersStats[rightPlayer] = { matches: 0, touches: 0 };
      }

      playersStats[leftPlayer].matches++;
      playersStats[rightPlayer].matches++;

      match.sets.forEach((set) => {
        if (set.status === 'completed') {
          playersStats[leftPlayer].touches += set.stats.touchesLeft;
          playersStats[rightPlayer].touches += set.stats.touchesRight;
        }
      });
    });

    // Série de victoires/défaites
    let currentStreak = 0;
    let longestWinStreak = 0;
    let longestLoseStreak = 0;
    let tempWinStreak = 0;
    let tempLoseStreak = 0;

    const sortedMatches = [...matches].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sortedMatches.forEach((match, index) => {
      const isWin = match.winner === 'us';

      if (isWin) {
        tempWinStreak++;
        tempLoseStreak = 0;
        if (tempWinStreak > longestWinStreak) {
          longestWinStreak = tempWinStreak;
        }
      } else {
        tempLoseStreak++;
        tempWinStreak = 0;
        if (tempLoseStreak > longestLoseStreak) {
          longestLoseStreak = tempLoseStreak;
        }
      }

      // Série actuelle
      if (index === sortedMatches.length - 1) {
        currentStreak = isWin ? tempWinStreak : -tempLoseStreak;
      }
    });

    return {
      totalMatches,
      victories,
      defeats,
      winRate,
      totalTouches,
      totalTouchesLeft,
      totalTouchesRight,
      totalPoints,
      avgTouchesPerPoint,
      avgDuration,
      playersStats,
      currentStreak,
      longestWinStreak,
      longestLoseStreak,
    };
  }, [matches]);

  // Formater la durée
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Statistiques</h1>
          <p className="text-white/60">Analyse de vos performances</p>
        </div>

        {matches.length === 0 ? (
          <Card className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
              analytics
            </span>
            <h3 className="text-lg font-bold text-white mb-2">
              Aucune statistique
            </h3>
            <p className="text-sm text-white/60">
              Jouez des matchs pour voir vos statistiques
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Statistiques globales */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Vue d'ensemble
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  title="Matchs"
                  value={stats.totalMatches}
                  icon={
                    <span className="material-symbols-outlined">
                      sports_score
                    </span>
                  }
                />
                <StatCard
                  title="Victoires"
                  value={stats.victories}
                  subtitle={`${stats.winRate.toFixed(0)}%`}
                  icon={
                    <span className="material-symbols-outlined">
                      emoji_events
                    </span>
                  }
                  variant="primary"
                />
                <StatCard
                  title="Défaites"
                  value={stats.defeats}
                  subtitle={`${(100 - stats.winRate).toFixed(0)}%`}
                  icon={
                    <span className="material-symbols-outlined">
                      sentiment_dissatisfied
                    </span>
                  }
                />
                <StatCard
                  title="Durée moy."
                  value={formatDuration(Math.round(stats.avgDuration))}
                  icon={
                    <span className="material-symbols-outlined">schedule</span>
                  }
                />
              </div>
            </div>

            {/* Série */}
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">Séries</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-1">
                    Série actuelle
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      stats.currentStreak > 0
                        ? 'text-primary'
                        : stats.currentStreak < 0
                        ? 'text-red-400'
                        : 'text-white'
                    }`}
                  >
                    {stats.currentStreak > 0 ? '+' : ''}
                    {stats.currentStreak}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-1">
                    Record victoires
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {stats.longestWinStreak}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-1">
                    Record défaites
                  </div>
                  <div className="text-3xl font-bold text-red-400">
                    {stats.longestLoseStreak}
                  </div>
                </div>
              </div>
            </Card>

            {/* Statistiques de jeu */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Statistiques de jeu
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                  title="Points joués"
                  value={stats.totalPoints}
                  icon={
                    <span className="material-symbols-outlined">
                      counter_1
                    </span>
                  }
                />
                <StatCard
                  title="Touches totales"
                  value={stats.totalTouches}
                  icon={
                    <span className="material-symbols-outlined">
                      touch_app
                    </span>
                  }
                  variant="secondary"
                />
                <StatCard
                  title="Moy. touches/point"
                  value={stats.avgTouchesPerPoint.toFixed(1)}
                  icon={
                    <span className="material-symbols-outlined">
                      calculate
                    </span>
                  }
                />
              </div>
            </div>

            {/* Répartition des touches */}
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">
                Répartition des touches
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stats.totalTouchesLeft}
                  </div>
                  <div className="text-sm text-white/60">Joueur Gauche</div>
                  <div className="text-xs text-white/40">
                    {stats.totalTouches > 0
                      ? Math.round(
                          (stats.totalTouchesLeft / stats.totalTouches) * 100
                        )
                      : 0}
                    % des touches
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-neon mb-1">
                    {stats.totalTouchesRight}
                  </div>
                  <div className="text-sm text-white/60">Joueur Droite</div>
                  <div className="text-xs text-white/40">
                    {stats.totalTouches > 0
                      ? Math.round(
                          (stats.totalTouchesRight / stats.totalTouches) * 100
                        )
                      : 0}
                    % des touches
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="flex h-3 rounded-full overflow-hidden bg-surface-dark">
                <div
                  className="bg-primary"
                  style={{
                    width: `${
                      stats.totalTouches > 0
                        ? (stats.totalTouchesLeft / stats.totalTouches) * 100
                        : 50
                    }%`,
                  }}
                />
                <div
                  className="bg-secondary-neon"
                  style={{
                    width: `${
                      stats.totalTouches > 0
                        ? (stats.totalTouchesRight / stats.totalTouches) * 100
                        : 50
                    }%`,
                  }}
                />
              </div>
            </Card>

            {/* Statistiques par joueur */}
            {Object.keys(stats.playersStats).length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Par joueur
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(stats.playersStats)
                    .sort((a, b) => b[1].matches - a[1].matches)
                    .map(([player, playerStats]) => (
                      <Card key={player}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium mb-1">
                              {player}
                            </div>
                            <div className="text-sm text-white/60">
                              {playerStats.matches} matchs
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {playerStats.touches}
                            </div>
                            <div className="text-xs text-white/60">touches</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
