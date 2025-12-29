# 🧪 Guide de Test - PadelTracker v0.1 (MVP)

## 🚀 Lancer l'Application

```bash
cd padel-tracker
npm run dev
```

Ouvrir http://localhost:5173

---

## ✅ Version Fonctionnelle Minimale

Cette version permet de :
- ✅ Créer un match rapidement
- ✅ Tracker les touches en temps réel
- ✅ Calculer automatiquement le score (points, jeux, sets, match)
- ✅ Gérer les règles complètes du padel (égalité, tie-break)
- ✅ Annuler le dernier point
- ✅ Mettre en pause et reprendre

---

## 📱 Scénario de Test Complet

### 1. Page d'Accueil

**Ce que vous voyez :**
- Logo PadelTracker (icône tennis violet)
- Bouton "Démarrer un Match"
- État de la version (Phase 4)

**Action :**
- Cliquez sur "Démarrer un Match"

**Résultat attendu :**
- Match créé automatiquement avec:
  - Joueurs : Alex (Gauche) & Sarah (Droite)
  - Adversaires : Tom & Maria
  - Configuration : Meilleur des 3 sets, Tie-break activé
- Redirection vers l'écran de tracking

---

### 2. Écran de Tracking - Vue Initiale

**Ce que vous voyez :**

**Header (haut) :**
- Bouton ← (retour/pause)
- "Set 1" + "MATCH PLAY"
- Bouton "Terminer"

**Score (centre haut) :**
- Chronomètre : 00:00:00 (démarre automatiquement)
- Score géant : 0 - 0
- Labels : NOUS vs EUX
- Mini scoreboard : SET 1 : 0-0

**Zones tactiles (milieu - 2 grandes cartes) :**
- GAUCHE (violet) : Alex - 00 Touches
- DROITE (cyan) : Sarah - 00 Touches

**Boutons points (bas) :**
- POINT NOUS
- POINT EUX

**Bouton flottant (centre bas) :**
- Icône ↺ (undo)

---

### 3. Test 1 : Jouer un Point Simple

**Actions :**
1. Tapez 2 fois sur la zone GAUCHE (Alex)
   - Compteur Alex : 00 → 01 → 02
2. Tapez 1 fois sur la zone DROITE (Sarah)
   - Compteur Sarah : 00 → 01
3. Cliquez sur "POINT NOUS"

**Résultats attendus :**
- ✅ Score passe à : 15 - 0
- ✅ Compteurs remis à zéro (00 / 00)
- ✅ Chronomètre continue
- ✅ Console log : "Point sauvegardé avec 2 touches (Alex) + 1 touche (Sarah)"

---

### 4. Test 2 : Continuer le Jeu

**Actions :**
1. Tapez quelques touches (au hasard)
2. Cliquez "POINT EUX"
3. Répétez jusqu'à avoir un score intéressant (ex: 30-15)

**Résultats attendus :**
- Score se met à jour : 15-0 → 15-15 → 30-15
- Compteurs reset après chaque point

---

### 5. Test 3 : Égalité (40-40)

**Actions :**
Continuez à marquer des points jusqu'à atteindre 40-40 :
- NOUS: 30-15 → 40-15 → 40-30 → 40-40

**Résultats attendus :**
- Score affiche : "40 - 40"
- C'est l'égalité (Deuce)

**Continuez :**
- Marquez "POINT NOUS"
  - Score → "40 - A" (Avantage pour nous)
- Marquez "POINT EUX"
  - Score → "40 - 40" (Retour égalité)
- Marquez "POINT EUX" puis "POINT EUX"
  - Jeu gagné par EUX !
  - Console log : "🎾 Jeu gagné!"

**Après le jeu :**
- Score reset à : 0 - 0
- Score jeux (mini scoreboard) : SET 1 : 0-1

---

### 6. Test 4 : Bouton UNDO

**Actions :**
1. Marquez quelques touches
2. Cliquez "POINT NOUS" (score passe à 15-0)
3. Cliquez sur le bouton ↺ (undo)

**Résultats attendus :**
- Score revient à 0-0
- Console log : "↩️ Point annulé"
- Les touches précédentes sont perdues (limitation v1)

---

### 7. Test 5 : Gagner un Set

**Actions :**
Jouez rapidement en marquant 4 points d'affilée pour gagner des jeux :
- Répétez : 4x "POINT NOUS" (= 1 jeu gagné)
- Faites ça 6 fois pour gagner le set 6-0

**Résultats attendus après le 6e jeu :**
- Console log : "🏆 Set gagné!"
- Nouveau set commence automatiquement
- Header affiche : "Set 2"
- Mini scoreboard : SET 1 : 6-0 | SET 2 : 0-0
- Score reset à 0-0

---

### 8. Test 6 : Tie-Break (Optionnel)

Pour tester le tie-break, il faut amener le score à 6-6 :

**Actions simplifiées (simulation rapide) :**
1. Ouvrir la console navigateur (F12)
2. Exécuter :
```javascript
// Simuler 6 jeux chacun
const store = window.useMatchStore?.getState?.();
if (store) {
  // Code pour forcer 6-6 (à documenter si besoin)
}
```

**Ou jouer normalement** en alternant victoires jusqu'à 6-6.

**Résultats tie-break :**
- Comptage devient : 1, 2, 3... (pas de 15-30-40)
- Premier à 7 avec écart de 2
- Si 7-6 → continue...

---

### 9. Test 7 : Pause / Reprise

**Actions :**
1. Pendant un match, cliquez sur ← (header gauche)
2. Confirmez la pause (si demandé)

**Résultats attendus :**
- Retour à la page d'accueil
- Message : "Match en cours avec Alex & Sarah"
- Bouton "Reprendre le Match"

**Reprise :**
1. Cliquez "Reprendre le Match"

**Résultats :**
- Retour à l'écran tracking
- État exact sauvegardé (score, touches, temps)
- Chronomètre reprend

---

### 10. Test 8 : Terminer le Match

**Actions :**
1. Cliquez "Terminer" (header droite)
2. Confirmez

**Résultats attendus :**
- Match terminé
- Redirection vers résumé (page placeholder pour l'instant)
- Match supprimé du current

---

## 🐛 Tests Techniques (Console)

### Tester le Moteur de Score

```javascript
// Dans la console navigateur
window.testMatchEngine.runAllTests()
```

**5 tests devraient passer :**
- ✅ Jeu simple 4-0
- ✅ Égalité 40-40 avec avantage
- ✅ Set complet 6-4
- ✅ Tie-break 7-5
- ✅ Undo point

### Inspecter l'État du Match

```javascript
// Voir le match actuel
const match = window.useMatchStore?.getState?.().currentMatch
console.log(match)

// Voir les touches actuelles
const touches = window.useMatchStore?.getState?.().currentTouches
console.log('Touches:', touches)
```

---

## ✅ Checklist de Validation

### Fonctionnalités Essentielles
- [ ] Match créé depuis home
- [ ] Chronomètre démarre
- [ ] Touches incrémentent correctement
- [ ] Score calculé automatiquement (0-15-30-40)
- [ ] Égalité (40-40) gérée
- [ ] Jeu gagné détecté
- [ ] Set gagné détecté
- [ ] Nouveau set démarre
- [ ] Undo fonctionne
- [ ] Pause/Reprise sauvegarde l'état
- [ ] Terminer match fonctionne

### Interface
- [ ] Zones tactiles réactives
- [ ] Couleurs correctes (violet/cyan)
- [ ] Score lisible
- [ ] Chronomètre visible
- [ ] Boutons cliquables
- [ ] Animations fluides (scale au clic)

### Stockage
- [ ] Match sauvegardé dans localStorage
- [ ] Rechargement page garde l'état
- [ ] localStorage visible dans DevTools

---

## 🎯 Prochaines Fonctionnalités

**Non disponibles dans cette version :**
- ❌ Configuration match custom (noms personnalisés)
- ❌ Résumé détaillé avec stats
- ❌ Historique des matchs
- ❌ Statistiques globales
- ❌ Export / Partage

**Prévu dans les phases suivantes :**
- Phase 2 : Formulaire configuration
- Phase 5 : Résumé stats détaillées
- Phase 6 : Dashboard complet
- Phase 7 : Historique + Stats globales

---

## 🆘 Problèmes Connus

### Si le chronomètre ne démarre pas
- Rafraîchir la page (F5)
- Vérifier la console pour erreurs

### Si le score ne se met pas à jour
- Vérifier la console
- S'assurer que le match est bien créé

### Si localStorage est plein
- Ouvrir DevTools → Application → Storage → Clear Site Data

---

## 📞 Support

En cas de bug :
1. Ouvrir la console navigateur (F12)
2. Noter l'erreur
3. Vérifier l'état du store :
```javascript
console.log(window.useMatchStore.getState())
```

Bon test ! 🎾
