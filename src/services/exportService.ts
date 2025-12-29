import type { Match, AppSettings, UserProfile } from '../types';

/**
 * Service pour l'export des données de l'application
 */

// ============================================
// EXPORT JSON
// ============================================

export interface ExportData {
  user: UserProfile | null;
  matches: Match[];
  settings: AppSettings;
  exportedAt: string;
  version: string;
}

/**
 * Exporte toutes les données de l'application en JSON
 */
export function exportToJSON(
  user: UserProfile | null,
  matches: Match[],
  settings: AppSettings
): void {
  const data: ExportData = {
    user,
    matches,
    settings,
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `padel-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

// ============================================
// EXPORT CSV
// ============================================

/**
 * Convertit les matchs en CSV
 */
export function exportMatchesToCSV(matches: Match[]): void {
  if (matches.length === 0) {
    alert('Aucun match à exporter');
    return;
  }

  // En-têtes CSV
  const headers = [
    'Date',
    'Joueur Gauche',
    'Joueur Droite',
    'Adversaire 1',
    'Adversaire 2',
    'Score Nous',
    'Score Eux',
    'Résultat',
    'Sets Joués',
    'Durée (min)',
    'Points Total',
    'Touches Gauche',
    'Touches Droite',
    'Touches Total',
  ];

  // Convertir chaque match en ligne CSV
  const rows = matches.map((match) => {
    // Calculer les statistiques totales
    let totalPoints = 0;
    let totalTouchesLeft = 0;
    let totalTouchesRight = 0;

    match.sets.forEach((set) => {
      if (set.status === 'completed') {
        totalPoints += set.stats.totalPoints;
        totalTouchesLeft += set.stats.touchesLeft;
        totalTouchesRight += set.stats.touchesRight;
      }
    });

    const date = new Date(match.createdAt).toLocaleDateString('fr-FR');
    const result = match.winner === 'us' ? 'Victoire' : 'Défaite';
    const setsPlayed = match.sets.filter((s) => s.status === 'completed').length;
    const durationMin = Math.round(match.duration / 60);

    return [
      date,
      match.teamUs.playerLeft,
      match.teamUs.playerRight,
      match.teamThem.player1,
      match.teamThem.player2,
      match.finalScore.us,
      match.finalScore.them,
      result,
      setsPlayed,
      durationMin,
      totalPoints,
      totalTouchesLeft,
      totalTouchesRight,
      totalTouchesLeft + totalTouchesRight,
    ];
  });

  // Créer le contenu CSV
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  // Télécharger le fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `padel-tracker-matches-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}

// ============================================
// IMPORT JSON
// ============================================

/**
 * Importe des données depuis un fichier JSON
 */
export function importFromJSON(
  file: File,
  onSuccess: (data: ExportData) => void,
  onError: (error: string) => void
): void {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const data = JSON.parse(content) as ExportData;

      // Validation basique
      if (!data.matches || !data.settings || !data.exportedAt) {
        throw new Error('Format de fichier invalide');
      }

      onSuccess(data);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la lecture du fichier'
      );
    }
  };

  reader.onerror = () => {
    onError('Erreur lors de la lecture du fichier');
  };

  reader.readAsText(file);
}

// ============================================
// STATISTIQUES DE STOCKAGE
// ============================================

/**
 * Calcule la taille approximative du stockage utilisé
 */
export function getStorageSize(): {
  totalSize: number;
  matchesSize: number;
  settingsSize: number;
  userSize: number;
} {
  const matchesData = localStorage.getItem('padel-tracker-matches') || '';
  const settingsData = localStorage.getItem('padel-tracker-settings') || '';
  const userData = localStorage.getItem('padel-tracker-user') || '';

  // Taille en bytes (approximative)
  const matchesSize = new Blob([matchesData]).size;
  const settingsSize = new Blob([settingsData]).size;
  const userSize = new Blob([userData]).size;
  const totalSize = matchesSize + settingsSize + userSize;

  return {
    totalSize,
    matchesSize,
    settingsSize,
    userSize,
  };
}

/**
 * Formate une taille en bytes en chaîne lisible
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// ============================================
// PARTAGE
// ============================================

/**
 * Partage un match via l'API Web Share (si disponible)
 */
export async function shareMatch(match: Match): Promise<void> {
  if (!navigator.share) {
    throw new Error('Le partage n\'est pas supporté sur ce navigateur');
  }

  const date = new Date(match.createdAt).toLocaleDateString('fr-FR');
  const result = match.winner === 'us' ? '🏆 Victoire' : '😔 Défaite';
  const score = `${match.finalScore.us}-${match.finalScore.them}`;

  const text = `${result} au padel le ${date} !\n` +
    `${match.teamUs.playerLeft} & ${match.teamUs.playerRight}\n` +
    `vs ${match.teamThem.player1} & ${match.teamThem.player2}\n` +
    `Score: ${score}`;

  await navigator.share({
    title: 'Match de Padel',
    text,
  });
}
