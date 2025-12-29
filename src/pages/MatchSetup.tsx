import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchStore } from '../stores/useMatchStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';

export default function MatchSetup() {
  const navigate = useNavigate();
  const createMatch = useMatchStore((state) => state.createMatch);

  // État du formulaire
  const [formData, setFormData] = useState({
    playerLeft: '',
    playerRight: '',
    opponent1: '',
    opponent2: '',
    setsToWin: 2,
    tiebreakInFinalSet: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Gestion des changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'setsToWin'
          ? parseInt(value)
          : value,
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.playerLeft.trim()) {
      newErrors.playerLeft = 'Nom requis';
    }
    if (!formData.playerRight.trim()) {
      newErrors.playerRight = 'Nom requis';
    }
    if (!formData.opponent1.trim()) {
      newErrors.opponent1 = 'Nom requis';
    }
    if (!formData.opponent2.trim()) {
      newErrors.opponent2 = 'Nom requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Créer le match
    createMatch({
      playerLeft: formData.playerLeft.trim(),
      playerRight: formData.playerRight.trim(),
      adversary1: formData.opponent1.trim(),
      adversary2: formData.opponent2.trim(),
      setsToWin: formData.setsToWin,
      tiebreakInFinalSet: formData.tiebreakInFinalSet,
    });

    // Naviguer vers tracking
    navigate('/tracking');
  };

  return (
    <div className="min-h-screen bg-background-dark p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors mb-4"
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            Configuration du Match
          </h1>
          <p className="text-white/60">
            Saisissez les informations des joueurs et les paramètres du match
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notre équipe */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Notre Équipe</h2>
            <div className="space-y-4">
              <Input
                name="playerLeft"
                label="Joueur Gauche"
                placeholder="Ex: Alex"
                value={formData.playerLeft}
                onChange={handleChange}
                error={errors.playerLeft}
                autoFocus
              />
              <Input
                name="playerRight"
                label="Joueur Droite"
                placeholder="Ex: Sarah"
                value={formData.playerRight}
                onChange={handleChange}
                error={errors.playerRight}
              />
            </div>
          </Card>

          {/* Adversaires */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Adversaires</h2>
            <div className="space-y-4">
              <Input
                name="opponent1"
                label="Adversaire 1"
                placeholder="Ex: Tom"
                value={formData.opponent1}
                onChange={handleChange}
                error={errors.opponent1}
              />
              <Input
                name="opponent2"
                label="Adversaire 2"
                placeholder="Ex: Maria"
                value={formData.opponent2}
                onChange={handleChange}
                error={errors.opponent2}
              />
            </div>
          </Card>

          {/* Configuration */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Paramètres</h2>
            <div className="space-y-4">
              <Select
                name="setsToWin"
                label="Format du match"
                value={formData.setsToWin}
                onChange={handleChange}
                options={[
                  { value: 2, label: 'Meilleur des 3 sets (premier à 2)' },
                  { value: 3, label: 'Meilleur des 5 sets (premier à 3)' },
                ]}
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="tiebreakInFinalSet"
                  name="tiebreakInFinalSet"
                  checked={formData.tiebreakInFinalSet}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/10 bg-surface-dark text-primary focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="tiebreakInFinalSet" className="text-white/80">
                  Tie-break dans le set final
                </label>
              </div>
            </div>
          </Card>

          {/* Bouton */}
          <Button type="submit" size="xl" className="w-full">
            Démarrer le Match
          </Button>
        </form>
      </div>
    </div>
  );
}
