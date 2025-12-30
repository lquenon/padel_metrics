import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, useSettingsStore, useHistoryStore, useMatchStore } from '../stores';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import {
  exportToJSON,
  exportMatchesToCSV,
  getStorageSize,
  formatBytes,
  importFromJSON,
} from '../services/exportService';
import type { ExportData } from '../services/exportService';

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stores
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const resetSettings = useSettingsStore((state) => state.resetSettings);

  const matches = useHistoryStore((state) => state.matches);
  const clearMatches = useHistoryStore((state) => state.clearMatches);
  const replaceMatches = useHistoryStore((state) => state.replaceMatches);

  const currentMatch = useMatchStore((state) => state.currentMatch);
  const clearMatch = useMatchStore((state) => state.clearMatch);

  // Local state
  const [userName, setUserName] = useState(user?.name || '');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);

  // Statistiques de stockage
  const storageStats = useMemo(() => getStorageSize(), []);

  // ============================================
  // HANDLERS - PROFIL UTILISATEUR
  // ============================================

  const handleSaveUserName = () => {
    if (userName.trim()) {
      updateUser({ name: userName.trim() });
    }
  };

  // ============================================
  // HANDLERS - PARAMÈTRES APP
  // ============================================

  const handleSetsToWinChange = (value: string) => {
    updateSettings({ defaultSetsToWin: parseInt(value) as 2 | 3 });
  };

  const handleTiebreakToggle = () => {
    updateSettings({ tiebreakInFinalSet: !settings.tiebreakInFinalSet });
  };

  // ============================================
  // HANDLERS - EXPORT / IMPORT
  // ============================================

  const handleExportJSON = () => {
    exportToJSON(user, matches, settings);
  };

  const handleExportCSV = () => {
    exportMatchesToCSV(matches);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importFromJSON(
      file,
      (data: ExportData) => {
        // Importer les données
        if (data.user) {
          updateUser(data.user);
          setUserName(data.user.name);
        }
        if (data.matches) {
          replaceMatches(data.matches);
        }
        if (data.settings) {
          updateSettings(data.settings);
        }

        setShowImportSuccess(true);
        setTimeout(() => setShowImportSuccess(false), 3000);
      },
      (error: string) => {
        alert(`Erreur d'importation: ${error}`);
      }
    );

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================
  // HANDLERS - SUPPRESSION
  // ============================================

  const handleClearAllData = () => {
    clearMatches();
    clearMatch();
    clearUser();
    resetSettings();
    setUserName('');
    setShowClearConfirm(false);
  };

  const handleResetSettings = () => {
    resetSettings();
  };

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
          <p className="text-white/60">Configuration de l'application</p>
        </div>

        <div className="space-y-6">
          {/* SECTION: Profil Utilisateur */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Profil</h2>
            <Card>
              <div className="space-y-4">
                <Input
                  label="Nom d'utilisateur"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Votre nom"
                />
                <Button onClick={handleSaveUserName} size="sm" variant="secondary">
                  Enregistrer
                </Button>

                {user && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm text-white/60">
                      Compte créé le{' '}
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* SECTION: Paramètres de l'Application */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Paramètres de Match</h2>
            <Card>
              <div className="space-y-4">
                <Select
                  label="Nombre de sets par défaut"
                  value={settings.defaultSetsToWin}
                  onChange={(e) => handleSetsToWinChange(e.target.value)}
                  options={[
                    { value: 2, label: 'Meilleur des 3 sets' },
                    { value: 3, label: 'Meilleur des 5 sets' },
                  ]}
                />

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-white font-medium">Tie-break au set final</div>
                    <div className="text-sm text-white/60">
                      Activer le tie-break dans le dernier set
                    </div>
                  </div>
                  <button
                    onClick={handleTiebreakToggle}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      settings.tiebreakInFinalSet ? 'bg-primary' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        settings.tiebreakInFinalSet ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button onClick={handleResetSettings} size="sm" variant="ghost">
                    Réinitialiser les paramètres
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* SECTION: Gestion des Données */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Gestion des Données</h2>
            <Card>
              <div className="space-y-4">
                {/* Statistiques de stockage */}
                <div className="bg-surface-dark rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary">
                      storage
                    </span>
                    <span className="text-white font-medium">Stockage utilisé</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white/60">Matchs</div>
                      <div className="text-white font-medium">
                        {matches.length} ({formatBytes(storageStats.matchesSize)})
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60">Total</div>
                      <div className="text-white font-medium">
                        {formatBytes(storageStats.totalSize)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export */}
                <div className="space-y-2">
                  <div className="text-sm text-white/60 mb-2">Export</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleExportJSON}
                      size="sm"
                      variant="secondary"
                      disabled={matches.length === 0}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          download
                        </span>
                        <span>JSON</span>
                      </span>
                    </Button>
                    <Button
                      onClick={handleExportCSV}
                      size="sm"
                      variant="secondary"
                      disabled={matches.length === 0}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          table_chart
                        </span>
                        <span>CSV</span>
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Import */}
                <div className="space-y-2">
                  <div className="text-sm text-white/60 mb-2">Import</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                  <Button onClick={handleImportClick} size="sm" variant="secondary">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        upload
                      </span>
                      <span>Importer JSON</span>
                    </span>
                  </Button>

                  {showImportSuccess && (
                    <div className="text-sm text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        check_circle
                      </span>
                      <span>Données importées avec succès</span>
                    </div>
                  )}
                </div>

                {/* Suppression */}
                <div className="pt-4 border-t border-white/10">
                  {!showClearConfirm ? (
                    <Button
                      onClick={() => setShowClearConfirm(true)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          delete_forever
                        </span>
                        <span>Supprimer toutes les données</span>
                      </span>
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm text-red-400">
                        ⚠️ Cette action est irréversible. Toutes vos données seront
                        supprimées.
                        {currentMatch && currentMatch.status !== 'completed' && (
                          <div className="mt-1">
                            <strong>Attention :</strong> Un match est en cours et sera
                            perdu.
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleClearAllData}
                          size="sm"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Confirmer la suppression
                        </Button>
                        <Button
                          onClick={() => setShowClearConfirm(false)}
                          size="sm"
                          variant="ghost"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* SECTION: À propos */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">À propos</h2>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 p-3">
                    <span className="material-symbols-outlined text-3xl">
                      sports_tennis
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">PadelTracker</div>
                    <div className="text-sm text-white/60">Version 1.0.0</div>
                  </div>
                </div>

                <div className="text-sm text-white/60 leading-relaxed">
                  Application de suivi de performance pour le padel en double (2v2).
                  Trackez vos matchs, analysez vos statistiques et suivez votre
                  progression.
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm text-white/60">
                    Développé avec{' '}
                    <span className="text-primary">Claude Code</span> par Laurent Quenon
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://github.com/anthropics/claude-code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-lg">code</span>
                    <span>GitHub</span>
                  </a>
                  <button
                    onClick={() => navigate('/')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-lg">home</span>
                    <span>Accueil</span>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
