# PadelTracker - PWA de Suivi de Performance Padel

Progressive Web App pour tracker vos matchs de padel en double (2v2) avec statistiques détaillées.

## 🚀 Développement

### Prérequis

- Node.js 18+
- npm 10+

### Installation

```bash
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

### Build de production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Preview du build de production

```bash
npm run preview
```

## 📱 PWA (Progressive Web App)

PadelTracker est une PWA complète qui peut être installée sur mobile et desktop.

### Fonctionnalités PWA

- ✅ Installation sur l'écran d'accueil (mobile/desktop)
- ✅ Mode offline fonctionnel
- ✅ Icônes adaptatives pour tous les appareils
- ✅ Raccourcis vers Nouveau Match et Stats
- ✅ Thème personnalisé (#a640f5)
- ✅ Cache intelligent des assets
- ✅ Mises à jour automatiques

### Tester la PWA en local

```bash
# Build de production
npm run build

# Preview avec HTTPS (requis pour PWA)
npm run preview

# Ouvrir dans le navigateur
# http://localhost:4173
```

**Installation :**
- **Desktop** : Icône + dans la barre d'adresse de Chrome/Edge
- **Mobile** : Menu → "Ajouter à l'écran d'accueil"

**Vérifier le Service Worker :**
1. Ouvrir DevTools (F12)
2. Application → Service Workers
3. Vérifier que le SW est actif

**Test mode offline :**
1. Ouvrir l'application
2. DevTools → Network → Throttling : Offline
3. Recharger la page → L'app fonctionne !

### Générer les icônes PWA

Si vous modifiez `public/icon.svg` :

```bash
npm run generate-icons
```

## 🚀 Déploiement

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour un guide complet de déploiement sur :
- Vercel (recommandé)
- Netlify
- GitHub Pages

**Quick deploy sur Vercel :**

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   ├── layout/         # Layout components
│   ├── match/          # Composants match
│   ├── stats/          # Composants stats
│   └── history/        # Composants historique
├── pages/              # Pages (screens)
├── stores/             # Zustand stores (state management)
├── services/           # Logique métier
├── hooks/              # Custom React hooks
├── types/              # Types TypeScript
├── utils/              # Utilitaires
└── assets/             # Images, fonts, etc.
```

## 🛠️ Stack Technique

- **React 18** - UI Framework
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **date-fns** - Gestion des dates
- **localStorage** - Persistance des données

## 📋 Phases de Développement

### ✅ Phase 1 : Setup & Infrastructure (COMPLÉTÉ)

- [x] Initialisation projet Vite + React + TypeScript
- [x] Installation dépendances
- [x] Configuration Tailwind CSS
- [x] Structure des dossiers
- [x] Types TypeScript
- [x] Service storage (localStorage)
- [x] Zustand stores
- [x] React Router

### ✅ Phase 3 : Moteur de Score Padel (COMPLÉTÉ)

- [x] Service matchEngine.ts (400+ lignes)
- [x] Calcul des points (0-15-30-40-Avantage-Jeu)
- [x] Gestion égalité (40-40 / Deuce)
- [x] Calcul des jeux (premier à 6 avec écart 2)
- [x] Tie-break (7 points, écart 2)
- [x] Calcul des sets et fin de match
- [x] Intégration dans useMatchStore
- [x] Fonction undo (annulation dernier point)
- [x] Tests unitaires (5 scénarios)

**Tests disponibles :**
- Ouvrir la console navigateur
- Exécuter : `window.testMatchEngine.runAllTests()`

### ✅ Phase 4 : Écran Tracking - CŒUR (COMPLÉTÉ)

- [x] Composants UI de base (Button, Card)
- [x] Hook useTimer (chronomètre fonctionnel)
- [x] Composant Timer (affichage temps)
- [x] Composant ScoreDisplay (score géant)
- [x] Composant SetScoreboard (mini tableau sets)
- [x] Composant TouchCounter (zones tactiles géantes 2 couleurs)
- [x] Composant PointButton (boutons marquer points)
- [x] Page MatchTracking complète et fonctionnelle
- [x] Intégration complète avec le moteur de score
- [x] Gestion pause/reprise/fin de match
- [x] Bouton undo flottant
- [x] Page Home temporaire pour tester

**VERSION FONCTIONNELLE MINIMALE ATTEINTE ! 🎉**

### ✅ Phase 2 : Configuration de Match (COMPLÉTÉ)

- [x] Composants Input et Select
- [x] Page MatchSetup avec formulaire complet
- [x] Saisie des noms des joueurs (notre équipe + adversaires)
- [x] Configuration du format (meilleur des 3 ou 5 sets)
- [x] Option tie-break dans le set final
- [x] Validation des champs
- [x] Navigation depuis Home vers MatchSetup puis Tracking

### ✅ Phase 5 : Écran Résumé (COMPLÉTÉ)

- [x] Composant StatCard (cartes statistiques)
- [x] Composant SetStats (statistiques par set)
- [x] Page MatchSummary complète
- [x] Affichage victoire/défaite
- [x] Score final et détail des sets
- [x] Statistiques globales (durée, points, touches)
- [x] Répartition des touches par joueur avec graphiques
- [x] Détails par set avec pourcentages
- [x] Sauvegarde dans l'historique
- [x] Mise à jour automatique de la durée
- [x] Navigation vers nouveau match ou accueil

### ✅ Phase 6 : Dashboard & Navigation (COMPLÉTÉ)

- [x] Composant NavBar (navigation bottom)
- [x] Intégration NavBar dans App.tsx
- [x] Page Home refonte complète (dashboard)
- [x] Statistiques rapides (matchs, victoires, défaites, taux)
- [x] Affichage match en cours
- [x] Liste derniers matchs
- [x] Liens rapides vers Stats et Settings
- [x] État vide avec message d'accueil
- [x] Navigation fluide entre toutes les sections

### ✅ Phase 7 : Historique & Stats Globales (COMPLÉTÉ)

- [x] Page History avec filtres (tous/victoires/défaites)
- [x] Tri par date (ascendant/descendant)
- [x] Modal détails du match
- [x] Page Stats complète
- [x] Statistiques globales (matchs, victoires, défaites, taux victoire)
- [x] Séries de victoires/défaites (actuelle, records)
- [x] Statistiques de jeu (points, touches, moyenne)
- [x] Répartition des touches par joueur avec graphiques
- [x] Statistiques par joueur unique

### ✅ Phase 8 : Paramètres & Export (COMPLÉTÉ)

- [x] Service d'export (exportService.ts)
- [x] Page Settings complète
- [x] Section profil utilisateur (nom, date création)
- [x] Paramètres de match (sets par défaut, tie-break)
- [x] Export données JSON (match + settings + user)
- [x] Export matchs CSV
- [x] Import données JSON
- [x] Statistiques de stockage (taille utilisée)
- [x] Suppression de toutes les données (avec confirmation)
- [x] Réinitialisation des paramètres
- [x] Section À propos (version, crédits)

### ✅ Phase 9 : PWA & Déploiement (COMPLÉTÉ)

- [x] Installation vite-plugin-pwa
- [x] Configuration complète vite.config.ts
- [x] Manifest PWA (nom, icônes, couleurs, shortcuts)
- [x] Génération automatique des icônes (192x192, 512x512, maskable)
- [x] Service Worker avec Workbox (cache, offline)
- [x] Meta tags PWA (Apple, Android, Open Graph, Twitter)
- [x] Configuration déploiement Vercel (vercel.json)
- [x] Configuration déploiement Netlify (netlify.toml)
- [x] Guide de déploiement complet (DEPLOYMENT.md)
- [x] Headers de sécurité (CSP, XSS, MIME)
- [x] Raccourcis PWA (Nouveau match, Stats)
- [x] Mode offline fonctionnel

### 🔄 Phase Suivante

- [ ] Phase 10 : Polish & Tests

## 📄 Licence

MIT

## 👤 Auteur

Développé avec Claude Code par Laurent Quenon
