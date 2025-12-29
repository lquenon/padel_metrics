# Guide de Configuration GitHub

Ce guide vous aide à pousser votre projet PadelTracker sur GitHub.

## 📋 Prérequis

- Compte GitHub : [github.com](https://github.com)
- Git installé localement
- Projet déjà initialisé (✅ fait)

## 🚀 Étapes de Configuration

### 1. Créer le Repository sur GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Remplissez les informations :
   - **Repository name** : `padel-tracker` (ou le nom de votre choix)
   - **Description** : `Progressive Web App de suivi de performance pour le padel en double (2v2)`
   - **Public** ou **Private** : À votre choix
   - ⚠️ **NE PAS** cocher "Add a README file"
   - ⚠️ **NE PAS** cocher "Add .gitignore"
   - ⚠️ **NE PAS** choisir une licence (déjà MIT dans le projet)
3. Cliquez sur **"Create repository"**

### 2. Ajouter le Remote et Pousser

Une fois le repository créé, GitHub vous affichera des instructions.

**Option A : Si c'est votre premier push**

```bash
cd padel-tracker

# Ajouter le remote (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/padel-tracker.git

# Vérifier le remote
git remote -v

# Renommer la branche en main (optionnel, recommandé)
git branch -M main

# Pousser le code
git push -u origin main
```

**Option B : Si vous avez déjà un remote**

```bash
cd padel-tracker

# Voir les remotes existants
git remote -v

# Supprimer l'ancien remote (si nécessaire)
git remote remove origin

# Ajouter le nouveau remote
git remote add origin https://github.com/USERNAME/padel-tracker.git

# Pousser
git branch -M main
git push -u origin main
```

### 3. Vérifier sur GitHub

1. Rafraîchissez la page de votre repository
2. Vous devriez voir tous vos fichiers
3. Le README.md s'affichera automatiquement

## 🔐 Authentification GitHub

### Méthode 1 : HTTPS avec Personal Access Token (Recommandé)

Si GitHub vous demande un mot de passe lors du push :

1. Allez sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez "Generate new token (classic)"
3. Nom : `PadelTracker Deploy`
4. Scopes : Cochez **`repo`** (accès complet aux repositories)
5. Générez et **COPIEZ** le token (vous ne le reverrez plus !)
6. Lors du push, utilisez :
   - Username : Votre nom d'utilisateur GitHub
   - Password : Le token (pas votre mot de passe GitHub)

### Méthode 2 : SSH (Pour les utilisateurs avancés)

```bash
# Générer une clé SSH (si vous n'en avez pas)
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Copier la clé publique
cat ~/.ssh/id_ed25519.pub

# Ajouter la clé sur GitHub : Settings → SSH keys → New SSH key
```

Puis utilisez l'URL SSH :
```bash
git remote set-url origin git@github.com:USERNAME/padel-tracker.git
git push -u origin main
```

## 📝 Après le Premier Push

### Ajouter une Description et des Topics

1. Sur la page de votre repo, cliquez sur ⚙️ (à côté de "About")
2. Ajoutez une description
3. Ajoutez des topics : `pwa`, `padel`, `react`, `typescript`, `vite`, `sports-tracker`
4. Save changes

### Activer GitHub Pages (Optionnel)

Si vous voulez héberger sur GitHub Pages :

1. Settings → Pages
2. Source : GitHub Actions
3. Créez un workflow `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

⚠️ **Important** : Ajoutez `base: '/padel-tracker/'` dans `vite.config.ts` si le repo ne s'appelle pas exactement comme votre domaine.

### Protéger la Branche Main

1. Settings → Branches → Add branch protection rule
2. Branch name pattern : `main`
3. Cochez :
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
4. Save changes

## 🔄 Workflow de Développement

### Commits Futurs

```bash
# Vérifier les changements
git status

# Ajouter les fichiers modifiés
git add .

# Créer un commit
git commit -m "Description des changements"

# Pousser vers GitHub
git push
```

### Créer une Branche pour une Feature

```bash
# Créer et basculer sur une nouvelle branche
git checkout -b feature/nom-de-la-feature

# Faire vos modifications...
git add .
git commit -m "Ajoute nouvelle feature"

# Pousser la branche
git push -u origin feature/nom-de-la-feature

# Sur GitHub : Créer une Pull Request
```

## 🏷️ Releases et Tags

Pour créer une version officielle :

```bash
# Créer un tag
git tag -a v1.0.0 -m "Release 1.0.0 - Application complète"

# Pousser le tag
git push origin v1.0.0

# Ou pousser tous les tags
git push --tags
```

Sur GitHub : Releases → Create a new release → Sélectionnez le tag → Publiez

## 📊 Activer les Workflows CI/CD

Créez `.github/workflows/ci.yml` :

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## 🐛 Troubleshooting

### "Repository not found"
- Vérifiez l'URL du remote : `git remote -v`
- Vérifiez vos permissions sur le repo

### "Authentication failed"
- Utilisez un Personal Access Token, pas votre mot de passe
- Vérifiez que le token a les bonnes permissions

### "Updates were rejected"
```bash
# Si vous avez modifié l'historique
git pull --rebase origin main
git push

# Ou en dernier recours (DANGER !)
git push --force-with-lease
```

### Fichiers trop gros (> 100 MB)
```bash
# Voir les gros fichiers
git ls-files | xargs ls -lh | sort -k5 -h

# Les retirer du tracking si nécessaire
git rm --cached fichier-trop-gros
echo "fichier-trop-gros" >> .gitignore
```

## 🎉 C'est Fait !

Votre projet PadelTracker est maintenant sur GitHub !

URL : `https://github.com/USERNAME/padel-tracker`

**Prochaines étapes :**
1. ⭐ Star votre propre projet
2. 📝 Créer des Issues pour les futures features
3. 🚀 Déployer sur Vercel/Netlify (voir DEPLOYMENT.md)
4. 📱 Partager avec vos amis joueurs de padel !

---

**Besoin d'aide ?**
- Documentation Git : https://git-scm.com/doc
- Documentation GitHub : https://docs.github.com
