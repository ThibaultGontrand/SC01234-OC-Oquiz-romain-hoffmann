# Gitflow (version moderne)

## Objectif

- Accepter le `ochallenge` le premier jour pour générer son propre dépôt à son nom, et le cloner.
- À partir du deuxième jour, et **jusqu'à la fin du projet**, mettre à jour chaque jour son dépôt à partir du code "formateur" avant d'entamer le challenge.
- Coder chaque challenge sur une **branche dédiée**, afin de créer des Pull Requests et se (faire) relire facilement.

---

## 💡 Principes importants

🚫 Ne JAMAIS coder sur la branche `master`  
💡 `master` = miroir du formateur → on ne travaille jamais dessus  
💡 `branche` = votre espace de travail  

---

## 1. Ouvrir votre dépôt

- Ouvrir **votre dépôt** dans VSCode (pas celui du formateur)
- Ouvrir un terminal

---

## 2. (⚠️ À faire une seule fois) Ajouter le remote du formateur

A faire **une seule fois pour la saison** :

- Récupérer l’URL SSH du dépôt du formateur
- Ajouter le remote :

```bash
git remote add formateur URL_SSH_DEPOT_FORMATEUR
````

👉 Exemple :

```bash
git remote add formateur git@github.com:O-clock-Helsinki/SC01234-OC-Oquiz-romain-hoffmann.git
```

---

## 3. (⚠️ Si besoin) Revenir sur `master`

👉 Objectif : sauvegarder son travail avant de synchroniser avec le formateur

* Vérifier l’état :

```bash
git status
```

* Si tout n’est pas sauvegardé :

```bash
git add .
git commit -m "mon travail"
git push
```

* Revenir sur `master` :

```bash
git switch master
```

---

### ⚠️ Si vous avez travaillé par erreur sur `master`

```bash
git switch -c ma-branche
git push --set-upstream origin ma-branche
git switch master
```

---

## 4. Récupérer les modifications du formateur sur `master`

```bash
git fetch formateur
git status
git reset --hard formateur/master
git push --force origin master
```

⚠️ `reset --hard` écrase votre `master`
⚠️ `push --force` écrase le `remote`

---

## 🔁 Workflow quotidien

```bash
git switch master
git fetch formateur
git reset --hard formateur/master
git push --force origin master
git switch -c SC0XE0X-challenge
```

---

## 5. Créer une nouvelle branche pour un challenge

```bash
git switch -c SC0XE0X-challenge
```

Ensuite :

```bash
git add .
git commit -m "mon challenge"
git push -u origin SC0XE0X-challenge
```

---

## 6. Visuellement

![](../resources/screens/gitflow.png)

---

## 🎯 Raccourcis modernes

* Créer + changer de branche :

```bash
git switch -c featureA
```

* Changer de branche :

```bash
git switch featureA
```

* Restaurer un fichier :

```bash
git restore fichier.txt
```