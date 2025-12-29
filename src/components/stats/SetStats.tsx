import type { Set } from '../../types';
import Card from '../ui/Card';

interface SetStatsProps {
  set: Set;
  teamUsNames: { playerLeft: string; playerRight: string };
}

export default function SetStats({ set, teamUsNames }: SetStatsProps) {
  const totalTouches = set.stats.totalTouches;
  const touchesLeftPercent = totalTouches > 0
    ? Math.round((set.stats.touchesLeft / totalTouches) * 100)
    : 50;
  const touchesRightPercent = totalTouches > 0
    ? Math.round((set.stats.touchesRight / totalTouches) * 100)
    : 50;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          Set {set.setNumber}
        </h3>
        <div className="text-2xl font-bold text-primary">
          {set.score.us} - {set.score.them}
        </div>
      </div>

      <div className="space-y-3">
        {/* Score */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xs text-white/60 mb-1">Jeux gagnés</div>
            <div className="text-xl font-bold text-white">{set.score.us}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">Jeux perdus</div>
            <div className="text-xl font-bold text-white/60">{set.score.them}</div>
          </div>
        </div>

        {/* Touches */}
        <div>
          <div className="text-xs text-white/60 mb-2">Répartition des touches</div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="text-center">
              <div className="text-sm font-medium text-white/80">{teamUsNames.playerLeft}</div>
              <div className="text-lg font-bold text-primary">{set.stats.touchesLeft}</div>
              <div className="text-xs text-white/50">{touchesLeftPercent}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-white/80">{teamUsNames.playerRight}</div>
              <div className="text-lg font-bold text-secondary-neon">{set.stats.touchesRight}</div>
              <div className="text-xs text-white/50">{touchesRightPercent}%</div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="flex h-2 rounded-full overflow-hidden bg-surface-dark">
            <div
              className="bg-primary"
              style={{ width: `${touchesLeftPercent}%` }}
            />
            <div
              className="bg-secondary-neon"
              style={{ width: `${touchesRightPercent}%` }}
            />
          </div>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
          <div className="text-center">
            <div className="text-xs text-white/60">Total touches</div>
            <div className="text-sm font-bold text-white">{totalTouches}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/60">Moy./point</div>
            <div className="text-sm font-bold text-white">
              {set.stats.avgTouchesPerPoint.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/60">Taux victoire</div>
            <div className="text-sm font-bold text-white">
              {set.stats.winRate.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
