# Guide de Déploiement - PadelTracker

Ce guide explique comment déployer PadelTracker sur différentes plateformes.

## 📋 Prérequis

- Compte GitHub (pour pousser votre code)
- Un des comptes suivants pour le déploiement :
  - Vercel (recommandé)
  - Netlify
  - GitHub Pages

## 🚀 Déploiement sur Vercel (Recommandé)

Vercel offre la meilleure expérience pour les applications Vite/React avec PWA.

### 1. Via l'interface Web

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre dépôt GitHub
4. Vercel détecte automatiquement Vite
5. Cliquez sur "Deploy"

### 2. Via la CLI

```bash
# Installation de Vercel CLI
npm install -g vercel

# Connexion
vercel login

# Premier déploiement
vercel

# Production
vercel --prod
```

**Configuration automatique :**
- Build Command : `npm run build`
- Output Directory : `dist`
- Install Command : `npm install`

Le fichier `vercel.json` est déjà configuré avec :
- Redirections SPA
- Headers de sécurité
- Cache du Service Worker

## 🌐 Déploiement sur Netlify

### 1. Via l'interface Web

1. Créez un compte sur [netlify.com](https://netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre dépôt GitHub
4. Configuration :
   - Build command : `npm run build`
   - Publish directory : `dist`
5. Cliquez sur "Deploy site"

### 2. Via la CLI

```bash
# Installation de Netlify CLI
npm install -g netlify-cli

# Connexion
netlify login

# Premier déploiement
netlify init

# Builds suivants
netlify deploy --prod
```

Le fichier `netlify.toml` est déjà configuré.

## 📦 Déploiement sur GitHub Pages

### 1. Configuration

Ajoutez dans `vite.config.ts` :

```typescript
export default defineConfig({
  base: '/padel-tracker/', // Nom de votre repo
  // ... reste de la config
})
```

### 2. Script de déploiement

Ajoutez dans `package.json` :

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### 3. Installation et déploiement

```bash
npm install -D gh-pages
npm run deploy
```

### 4. Configuration GitHub

1. Allez dans Settings → Pages
2. Source : Deploy from a branch
3. Branch : `gh-pages` / `root`
4. Save

## 🔧 Build Local

Pour tester localement avant le déploiement :

```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

Le site sera disponible sur http://localhost:4173

## ✅ Vérifications Post-Déploiement

### 1. Test PWA

1. Ouvrez l'application dans Chrome/Edge
2. Ouvrez DevTools → Application → Manifest
3. Vérifiez que le manifest est chargé
4. Cliquez sur "Service Workers" → Vérifiez qu'il est actif
5. Testez l'installation :
   - Desktop : Icône + dans la barre d'adresse
   - Mobile : Menu → "Ajouter à l'écran d'accueil"

### 2. Test Mode Offline

1. Ouvrez l'application
2. DevTools → Network → Throttling : Offline
3. Rechargez la page
4. L'application doit fonctionner (lecture seule)

### 3. Lighthouse Audit

1. DevTools → Lighthouse
2. Catégories : Performance, PWA, Best practices
3. Generate report
4. Objectif : Score PWA > 90

## 🌍 Configuration Domaine Personnalisé

### Vercel

1. Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

### Netlify

1. Domain settings → Add custom domain
2. Suivez les instructions de configuration DNS

## 📊 Variables d'Environnement

Actuellement, PadelTracker n'utilise que le localStorage local.
Si vous ajoutez un backend à l'avenir :

### Vercel
```bash
vercel env add VITE_API_URL
```

### Netlify
Settings → Environment variables

## 🔒 Sécurité

Les headers de sécurité sont déjà configurés :
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📈 Monitoring

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Ajoutez dans `main.tsx` :
```typescript
import { Analytics } from '@vercel/analytics/react';

// Dans votre App
<Analytics />
```

### Google Analytics

Ajoutez dans `index.html` avant `</head>` :
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🐛 Troubleshooting

### PWA ne s'installe pas
- Vérifiez le manifest.webmanifest dans DevTools
- Vérifiez que le Service Worker est actif
- Testez en HTTPS (requis pour PWA)

### Routes ne fonctionnent pas
- Vérifiez que les redirections SPA sont configurées
- Vercel : `vercel.json` est correctement configuré
- Netlify : `netlify.toml` est correctement configuré

### Build échoue
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Support

Pour les problèmes de déploiement :
- Vercel : https://vercel.com/support
- Netlify : https://answers.netlify.com
- GitHub Pages : https://docs.github.com/pages

---

**Note :** Ce guide est pour PadelTracker v1.0.0. Pour les mises à jour, consultez le README.md principal.
