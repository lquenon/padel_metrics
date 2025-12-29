# GitHub Actions Workflows - Configuration

Ce document explique comment configurer les workflows GitHub Actions pour PadelTracker.

## 📋 Workflows Disponibles

### 1. CI (Continuous Integration) - `ci.yml`
**Déclenché sur :** Push et Pull Requests vers `main`/`master`/`develop`

**Actions :**
- ✅ Installe les dépendances
- ✅ Vérifie le linting (ESLint)
- ✅ Génère les icônes PWA
- ✅ Build de production
- ✅ Rapport de taille du build
- ✅ Upload des artifacts
- 🔦 Audit Lighthouse (sur PR uniquement)

**Aucune configuration requise** - Fonctionne immédiatement après le push !

### 2. Deploy to Vercel - `deploy-vercel.yml`
**Déclenché sur :** Push vers `main`/`master` ou manuellement

**Actions :**
- 🏗️ Build de production
- 🚀 Déploiement automatique sur Vercel
- 📊 Rapport de déploiement

**Configuration requise :** Secrets Vercel (voir ci-dessous)

### 3. Preview PR - `preview-pr.yml`
**Déclenché sur :** Ouverture/mise à jour de Pull Requests

**Actions :**
- 🏗️ Build de preview
- 🔍 Déploiement sur Vercel Preview
- 💬 Commentaire automatique avec URL de preview

**Configuration requise :** Secrets Vercel (voir ci-dessous)

### 4. Security Check - `security.yml`
**Déclenché sur :**
- Tous les lundis à 9h UTC (automatique)
- Push vers `main`/`master`
- Manuellement

**Actions :**
- 🔒 Audit de sécurité npm
- 📊 Rapport de vulnérabilités
- 🔍 Review des dépendances (sur PR)

**Aucune configuration requise**

## 🔑 Configuration des Secrets Vercel

Pour activer les workflows de déploiement Vercel, vous devez configurer 3 secrets GitHub.

### Étape 1 : Obtenir les Tokens Vercel

#### A. Token Vercel

1. Allez sur [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Cliquez "Create Token"
3. Nom : `GitHub Actions - PadelTracker`
4. Scope : Full Account
5. Expiration : No expiration (ou 1 an)
6. **Copiez le token** (vous ne le reverrez plus !)

#### B. Organization ID

Méthode CLI (recommandée) :
```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Lier le projet (depuis le dossier padel-tracker)
vercel link

# Vérifier le fichier .vercel/project.json
cat .vercel/project.json
```

Le fichier `.vercel/project.json` contient :
```json
{
  "orgId": "team_xxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxx"
}
```

Méthode Web :
1. Allez sur [vercel.com](https://vercel.com)
2. Settings → General
3. Copiez "Team ID" ou "Organization ID"

#### C. Project ID

Même méthode que l'Organization ID (voir fichier `.vercel/project.json`)

Ou via le dashboard Vercel → Votre projet → Settings → General → Project ID

### Étape 2 : Ajouter les Secrets sur GitHub

1. Allez sur votre repository GitHub
2. Settings → Secrets and variables → Actions
3. Cliquez "New repository secret" pour chaque :

| Nom du Secret | Valeur |
|---------------|--------|
| `VERCEL_TOKEN` | Le token Vercel créé à l'étape 1A |
| `VERCEL_ORG_ID` | L'Organization ID (team_xxx...) |
| `VERCEL_PROJECT_ID` | Le Project ID (prj_xxx...) |

### Étape 3 : Tester les Workflows

```bash
# Push vers GitHub
git add .
git commit -m "Add GitHub Actions workflows"
git push origin main

# Les workflows se déclencheront automatiquement !
```

Vérifiez sur GitHub → Actions pour voir les workflows en cours.

## 📊 Consulter les Résultats

### Voir l'état des workflows

GitHub → Actions → Sélectionnez un workflow

Chaque workflow affiche :
- ✅ Status (Success/Failure)
- 📊 Summary (résumé détaillé)
- 📁 Artifacts (build, rapports)
- ⏱️ Durée d'exécution

### Badges de Statut (optionnel)

Ajoutez dans votre `README.md` :

```markdown
![CI](https://github.com/USERNAME/padel-tracker/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/USERNAME/padel-tracker/actions/workflows/deploy-vercel.yml/badge.svg)
![Security](https://github.com/USERNAME/padel-tracker/actions/workflows/security.yml/badge.svg)
```

## 🛠️ Personnalisation

### Désactiver un workflow

Renommez le fichier `.yml` en `.yml.disabled` ou supprimez-le.

### Modifier les déclencheurs

Éditez la section `on:` de chaque workflow :

```yaml
on:
  push:
    branches: [main]  # Uniquement sur main
  schedule:
    - cron: '0 0 * * *'  # Tous les jours à minuit
```

### Ajouter des étapes

Ajoutez dans la section `steps:` :

```yaml
- name: Mon étape personnalisée
  run: echo "Hello!"
```

## 🔧 Troubleshooting

### Workflow échoue sur "npm ci"

**Problème :** Dépendances manquantes ou package-lock.json corrompu

**Solution :**
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Fix package-lock.json"
git push
```

### Déploiement Vercel échoue

**Problème :** Secrets incorrects ou manquants

**Solution :**
1. Vérifiez que les 3 secrets sont bien configurés
2. Re-générez le token Vercel si nécessaire
3. Vérifiez que le projet est bien lié (`vercel link`)

### Lighthouse timeout

**Problème :** Le serveur ne démarre pas à temps

**Solution :**
Augmentez le timeout dans `.lighthouserc.json` :
```json
"collect": {
  "startServerReadyTimeout": 60000
}
```

### "Resource not accessible by integration"

**Problème :** Permissions GitHub Actions manquantes

**Solution :**
Settings → Actions → General → Workflow permissions → "Read and write permissions"

## 📈 Bonnes Pratiques

### 1. Branch Protection

Settings → Branches → Add rule :
- Branch name pattern : `main`
- ✅ Require status checks before merging
- ✅ Require branches to be up to date
- Sélectionnez : `build-and-test`

### 2. Cache des dépendances

Déjà configuré avec `cache: 'npm'` dans les workflows.

### 3. Artifacts

Les builds sont conservés 7 jours par défaut. Pour modifier :
```yaml
retention-days: 30
```

### 4. Notifications

GitHub → Settings → Notifications → Actions
Configurez les notifications email/Slack pour les échecs.

## 🎯 Workflow Recommandé de Développement

1. **Créer une branche feature**
   ```bash
   git checkout -b feature/ma-feature
   ```

2. **Développer et tester localement**
   ```bash
   npm run dev
   npm run build
   ```

3. **Push et créer une PR**
   ```bash
   git push origin feature/ma-feature
   # Créez la PR sur GitHub
   ```

4. **Les workflows automatiques s'exécutent :**
   - ✅ CI vérifie le code
   - 🔍 Preview deploy créé
   - 💬 URL de preview commentée dans la PR

5. **Review et merge**
   - Vérifiez le preview
   - Code review
   - Merge vers `main`

6. **Déploiement automatique en production** 🚀
   - Le workflow `deploy-vercel.yml` se déclenche
   - Application déployée sur Vercel production

## 🆘 Support

- GitHub Actions docs : https://docs.github.com/actions
- Vercel deployment : https://vercel.com/docs/deployments/git
- Lighthouse CI : https://github.com/GoogleChrome/lighthouse-ci

---

**Prêt à automatiser !** 🤖 Pushez vers GitHub et les workflows se déclencheront automatiquement.
