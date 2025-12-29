# Phase 3 : Moteur de Score Padel - Documentation

## 📊 Vue d'Ensemble

Le moteur de score (`services/matchEngine.ts`) implémente toute la logique de calcul du score selon les règles officielles du padel.

**Fichier principal :** `src/services/matchEngine.ts` (400+ lignes)

## 🎾 Fonctionnalités Implémentées

### 1. Calcul des Points (0-15-30-40-Jeu)

```typescript
calculatePointScore(game: Game, winner: Team): boolean
```

**Règles gérées :**
- 0 → 15 → 30 → 40 → Jeu gagné
- Cas 40-40 (égalité / deuce)
- Avantage (après égalité)
- Retour à l'égalité si l'équipe sans avantage marque

**Exemple d'utilisation :**
```typescript
const gameWon = calculatePointScore(currentGame, 'us');
if (gameWon) {
  console.log('Jeu gagné!');
}
```

### 2. Calcul des Jeux (Premier à 6 avec écart 2)

```typescript
calculateGameScore(set: Set, winner: Team, useTiebreak: boolean): boolean
```

**Règles gérées :**
- Premier à 6 jeux avec minimum 2 d'écart
- 6-4 → Set gagné
- 6-5 → Continue
- 7-5 → Set gagné
- 6-6 → Tie-break (si activé) ou jeu décisif

**Exemple :**
```typescript
const setWon = calculateGameScore(currentSet, 'us', true);
```

### 3. Tie-Break (7 points, écart 2)

**Règles gérées :**
- Comptage simple: 1, 2, 3... (pas de 15-30-40)
- Premier à 7 points avec minimum 2 d'écart
- Continue si écart < 2 (ex: 7-6 → 8-6 ou 8-7...)

**Détection automatique :**
- Le tie-break démarre automatiquement à 6-6 si configuré
- Flag `game.isTiebreak = true`

### 4. Calcul des Sets

```typescript
calculateSetScore(match: Match, winner: Team): boolean
```

**Règles gérées :**
- Premier à X sets gagnés (config: setsToWin = 2 ou 3)
- Meilleur des 3 sets → 2 sets gagnés
- Meilleur des 5 sets → 3 sets gagnés

### 5. Fonction Principale - Score Point

```typescript
scorePoint(
  match: Match,
  winner: Team,
  touchesLeft: number,
  touchesRight: number
): ScoreUpdate
```

**Cette fonction :**
1. Crée un objet Point avec timestamp et touches
2. Sauvegarde le point dans l'historique
3. Met à jour les stats du jeu
4. Calcule le nouveau score de point
5. Si jeu gagné → Calcule le score de jeux
6. Si set gagné → Calcule le score de sets
7. Si match gagné → Marque le match comme terminé

**Retourne :**
```typescript
{
  pointScored: true,
  gameWon: boolean,
  setWon: boolean,
  matchWon: boolean
}
```

### 6. Annulation (Undo)

```typescript
undoLastPoint(match: Match): boolean
```

**Fonctionnalités :**
- Annule le dernier point marqué
- Restaure les stats (touches, points)
- Restaure le score précédent
- Retourne `true` si succès

**Limitations v1 :**
- 1 seul niveau d'annulation
- Restauration simplifiée du score (pas d'historique complet)

## 🧪 Tests Disponibles

Fichier : `src/services/matchEngine.test.ts`

### Tests Implémentés

**1. Test Jeu Simple (4-0)**
```typescript
testSimpleGame()
```
Vérifie qu'un jeu se gagne en 4 points sans opposition.

**2. Test Égalité (Deuce)**
```typescript
testDeuce()
```
Scénario : 40-40 → Avantage → Retour égalité → Avantage → Jeu gagné

**3. Test Set Complet (6-4)**
```typescript
testFullSet()
```
Joue un set complet jusqu'à 6-4.

**4. Test Tie-Break (7-5)**
```typescript
testTiebreak()
```
Amène le score à 6-6 puis joue un tie-break jusqu'à 7-5.

**5. Test Undo**
```typescript
testUndo()
```
Marque des points puis annule le dernier.

### Exécution des Tests

**Dans la console navigateur :**
```javascript
// Tous les tests
window.testMatchEngine.runAllTests()

// Tests individuels
window.testMatchEngine.testSimpleGame()
window.testMatchEngine.testDeuce()
window.testMatchEngine.testFullSet()
window.testMatchEngine.testTiebreak()
window.testMatchEngine.testUndo()
```

## 🔄 Intégration avec Zustand

Le moteur est intégré dans `useMatchStore` :

```typescript
// Marquer un point
const { scorePoint } = useMatchStore();
scorePoint('us'); // Point pour nous

// Annuler
const { undoLastPoint } = useMatchStore();
undoLastPoint();
```

**Le store gère automatiquement :**
- Sauvegarde dans localStorage
- Reset des compteurs de touches
- Logs console (🎾 Jeu gagné!, 🏆 Set gagné!, 🥇 MATCH GAGNÉ!)

## 📊 Helpers d'Affichage

### getMatchSummary
```typescript
const summary = matchEngine.getMatchSummary(match);
// → "Set 2 • 3-2 • 30-15"
```

### getSetsScores
```typescript
const sets = matchEngine.getSetsScores(match);
// → [{ setNumber: 1, us: 6, them: 4, completed: true }, ...]
```

### getDisplayScore
```typescript
const score = matchEngine.getDisplayScore(40, 40, true, 'us', false);
// → "40-A" (avantage pour nous)
```

## 🎯 Cas d'Usage

### Scénario Complet

```typescript
import { useMatchStore } from './stores';
import * as matchEngine from './services/matchEngine';

// 1. Créer un match
const { createMatch } = useMatchStore();
createMatch({
  playerLeft: 'Alex',
  playerRight: 'Sarah',
  adversary1: 'Tom',
  adversary2: 'Maria',
  setsToWin: 2,
  tiebreakInFinalSet: true,
});

// 2. Ajouter des touches pendant un échange
const { addTouch } = useMatchStore();
addTouch('left');  // Alex touche
addTouch('right'); // Sarah touche
addTouch('left');  // Alex touche encore

// 3. Marquer le point
const { scorePoint } = useMatchStore();
scorePoint('us'); // On gagne le point

// Résultat: Point sauvegardé avec 2 touches (Alex) + 1 touche (Sarah)
// Score mis à jour: 0-0 → 15-0

// 4. Continuer le match...
addTouch('right');
addTouch('left');
scorePoint('them'); // Ils gagnent: 15-15

// 5. Consulter le score
const match = useMatchStore.getState().currentMatch;
const summary = matchEngine.getMatchSummary(match);
console.log(summary); // → "Set 1 • 0-0 • 15-15"
```

## ⚠️ Limitations Connues (v1)

1. **Undo basique :**
   - 1 seul niveau d'annulation
   - Restauration du score simplifiée

2. **Pas de validation :**
   - Pas de vérification de cohérence du score
   - Pas de protection contre manipulations invalides

3. **Statistiques basiques :**
   - Touches globales uniquement
   - Pas de détails par type de coup (v2)

4. **Pas de persistance avancée :**
   - Pas d'historique complet des scores
   - Pas de replay possible

## 🚀 Améliorations Futures (v2)

- [ ] Historique complet des scores (pour undo multiple)
- [ ] Validation stricte des transitions de score
- [ ] Support changement de serveur (tracking serveur)
- [ ] Stats avancées (winners, erreurs, types de coups)
- [ ] Mode spectateur (score en temps réel)
- [ ] Export match au format standard (JSON, CSV)

## 📝 Notes de Développement

**Design Choices :**
- Mutation directe des objets (performance)
- JSON.parse/stringify pour deep copy dans le store (sécurité)
- Throw errors pour cas impossibles (fail-fast)
- Console.log pour debug (à retirer en prod)

**Performance :**
- Pas d'optimisation prématurée
- Calculs légers (< 1ms par point)
- Pas de problème jusqu'à 1000+ points par match

**Extensibilité :**
- Fonctions modulaires (facile à tester)
- Types stricts (safety)
- Séparation moteur / UI (clean architecture)

---

**Prochaine étape recommandée :** Phase 4 - Écran Tracking (UI pour utiliser ce moteur)
