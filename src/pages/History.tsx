import { useState, useMemo } from 'react';
import { useHistoryStore } from '../stores';
import type { Match } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

type FilterType = 'all' | 'victories' | 'defeats';
type SortType = 'date-desc' | 'date-asc';

export default function History() {
  const matches = useHistoryStore((state) => state.matches);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date-desc');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Filtrer et trier les matchs
  const filteredMatches = useMemo(() => {
    let result = [...matches];

    // Appliquer le filtre
    if (filter === 'victories') {
      result = result.filter((m) => m.winner === 'us');
    } else if (filter === 'defeats') {
      result = result.filter((m) => m.winner === 'them');
    }

    // Appliquer le tri
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [matches, filter, sort]);

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
          <h1 className="text-3xl font-bold text-white mb-2">Historique</h1>
          <p className="text-white/60">Tous vos matchs de padel</p>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface-dark text-white/60 hover:text-white'
            }`}
          >
            Tous ({matches.length})
          </button>
          <button
            onClick={() => setFilter('victories')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'victories'
                ? 'bg-primary text-white'
                : 'bg-surface-dark text-white/60 hover:text-white'
            }`}
          >
            Victoires ({matches.filter((m) => m.winner === 'us').length})
          </button>
          <button
            onClick={() => setFilter('defeats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'defeats'
                ? 'bg-primary text-white'
                : 'bg-surface-dark text-white/60 hover:text-white'
            }`}
          >
            Défaites ({matches.filter((m) => m.winner === 'them').length})
          </button>

          <div className="ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="px-4 py-2 rounded-lg bg-surface-dark text-white border border-white/10 focus:outline-none focus:border-primary"
            >
              <option value="date-desc">Plus récent</option>
              <option value="date-asc">Plus ancien</option>
            </select>
          </div>
        </div>

        {/* Liste des matchs */}
        {filteredMatches.length === 0 ? (
          <Card className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
              history
            </span>
            <h3 className="text-lg font-bold text-white mb-2">
              {filter === 'all'
                ? 'Aucun match joué'
                : filter === 'victories'
                ? 'Aucune victoire'
                : 'Aucune défaite'}
            </h3>
            <p className="text-sm text-white/60">
              {filter === 'all'
                ? 'Jouez votre premier match pour commencer !'
                : 'Filtrez différemment pour voir vos matchs'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((match) => {
              const isVictory = match.winner === 'us';
              const date = new Date(match.createdAt);

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="cursor-pointer"
                >
                  <Card className="hover:bg-surface-dark/80 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isVictory ? (
                          <>
                            <span className="material-symbols-outlined text-primary">
                              emoji_events
                            </span>
                            <span className="text-sm font-bold text-primary">
                              VICTOIRE
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-red-400">
                              sentiment_dissatisfied
                            </span>
                            <span className="text-sm font-bold text-red-400">
                              DÉFAITE
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-sm text-white/60">
                        {date.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">
                          {match.teamUs.playerLeft} & {match.teamUs.playerRight}
                        </p>
                        <p className="text-sm text-white/60">
                          vs {match.teamThem.player1} & {match.teamThem.player2}
                        </p>
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-3xl font-bold text-white mb-1">
                          {match.finalScore.us} - {match.finalScore.them}
                        </div>
                        <div className="text-xs text-white/60">
                          {formatDuration(match.duration)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal détails du match */}
      {selectedMatch && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMatch(null)}
        >
          <div
            className="bg-surface-dark max-w-2xl w-full rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Détails du Match</h2>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Score final */}
            <div className="text-center mb-6">
              <div
                className={`inline-block px-6 py-2 rounded-full mb-4 ${
                  selectedMatch.winner === 'us'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {selectedMatch.winner === 'us' ? '🏆 Victoire' : '😔 Défaite'}
              </div>

              <div className="text-5xl font-bold text-white mb-2">
                {selectedMatch.finalScore.us} - {selectedMatch.finalScore.them}
              </div>

              <div className="text-white/60">
                {new Date(selectedMatch.createdAt).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>

            {/* Équipes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-2">Notre équipe</div>
                  <div className="text-white font-medium">
                    {selectedMatch.teamUs.playerLeft}
                  </div>
                  <div className="text-white font-medium">
                    {selectedMatch.teamUs.playerRight}
                  </div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-2">Adversaires</div>
                  <div className="text-white font-medium">
                    {selectedMatch.teamThem.player1}
                  </div>
                  <div className="text-white font-medium">
                    {selectedMatch.teamThem.player2}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sets */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3">Sets</h3>
              <div className="flex gap-2">
                {selectedMatch.sets
                  .filter((set) => set.status === 'completed')
                  .map((set) => (
                    <Card key={set.setNumber} className="flex-1 text-center">
                      <div className="text-xs text-white/60 mb-1">
                        Set {set.setNumber}
                      </div>
                      <div className="text-xl font-bold text-white">
                        {set.score.us} - {set.score.them}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatDuration(selectedMatch.duration)}
                  </div>
                  <div className="text-sm text-white/60">Durée</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {selectedMatch.sets.filter((s) => s.status === 'completed').length}
                  </div>
                  <div className="text-sm text-white/60">Sets joués</div>
                </div>
              </Card>
            </div>

            <Button
              onClick={() => setSelectedMatch(null)}
              variant="ghost"
              className="w-full mt-6"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
