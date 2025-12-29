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

### 🔄 Phases Suivantes

- [ ] Phase 2 : Configuration de Match
- [ ] Phase 4 : Écran Tracking (CŒUR)
- [ ] Phase 5 : Écran Résumé
- [ ] Phase 6 : Dashboard & Navigation
- [ ] Phase 7 : Historique & Stats Globales
- [ ] Phase 8 : Paramètres & Export
- [ ] Phase 9 : PWA & Déploiement
- [ ] Phase 10 : Polish & Tests

## 📄 Licence

MIT

## 👤 Auteur

Développé avec Claude Code
