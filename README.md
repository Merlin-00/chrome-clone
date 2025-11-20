# Chrome Landing Page — Clone Technique & Expérimental

> Précision > Spectacle — un clone pensé pour apprendre et durer.

## 🔗 Live Demo

👉 [Voir le site en ligne sur Vercel](https://chrome-clone-seven.vercel.app/)

---

## Présentation

Ce projet est une réimplémentation technique de la page d'accueil de **Google Chrome**, conçue comme un laboratoire pour comprendre les mécaniques d'animation, de layout et de performance. L'objectif n'est pas de cloner, mais d'apprendre, d'analyser et de reproduire avec rigueur.

Le rendu est construit sous **Angular 20+**, avec **GSAP + ScrollTrigger** pour les animations, et une architecture **standalone** propre, modulaire et prête à faire évoluer.

> Ce projet n’a **aucun lien avec Google**. Il sert à la démonstration et à l'apprentissage.

---

## 🧩 Stack Technique

- **Framework :** Angular 20+ (Standalone Components)
- **Animations :** GSAP + ScrollTrigger
- **UI :** Angular Material (Material 3)
- **Styles :** SCSS avec variables CSS
- **Langage :** TypeScript

---

## 📂 Structure du projet

```
src/app/
├── components/
│   ├── hero/
│   ├── header/
│   ├── footer/
│   ├── features/
│   │   ├── updates/
│   │   ├── yours/
│   │   ├── safe/
│   │   ├── fast/
│   │   └── by-google/
├── services/
│   └── sidenav.ts
├── app.ts
├── app.html
└── styles.scss
```

Chaque section (hero, features, etc.) est un **composant standalone** isolé, clair et testable.

---

## ⚙️ Fonctionnalités principales

### 🌀 Hero section

- Scroll-driven animation contrôlée via GSAP.
- Timelines synchronisées : zoom, alignement, translation horizontale.
- Responsive adaptatif : animation complète sur desktop, fallback simplifié sur mobile.

### 🧭 Features section

- Navigation sticky avec **IntersectionObserver** pour détecter la section active.
- Sous-composants pour chaque ancre : updates, yours, safe, fast, by-google.

### 🧱 Architecture Angular

- Signals pour la réactivité locale.
- Mode `OnPush` activé pour performance maximale.
- `runOutsideAngular()` pour exécuter GSAP sans polluer la détection de changements.

---

## 🖼️ Placeholders & mentions légales

- Les images utilisées sont **des placeholders** servant uniquement à représenter la mise en page.
- Aucun logo officiel, image ou ressource Google n'est inclus.
- Si tu souhaites publier le projet, **remplace les placeholders** par des visuels libres ou tes propres créations.
- Ce projet n’a **aucune affiliation avec Google**.

---

## ▶️ Lancer le projet localement

1. Installe les dépendances :

```bash
npm install
```

2. Lance le serveur de développement :

```bash
ng serve --open
```

3. Build pour production :

```bash
ng build --configuration production
```

---

## 🧰 Commandes utiles

| Commande        | Description                    |
| --------------- | ------------------------------ |
| `ng serve`      | Lance le projet localement     |
| `npm run build` | Build optimisé pour production |

---

## ⚙️ Notes techniques

- Les animations ScrollTrigger se synchronisent avec la hauteur du `spacer` (modifiable en SCSS).
- Breakpoints : mobile ≤ 600px, tablette ≤ 1024px, desktop > 1024px.
- Accessibilité : balises ARIA, structure sémantique, smooth scroll natif.

---

## 📦 Déploiement sur Vercel

1. Build ton projet :

```bash
ng build --configuration production
```

2. Pousse le dossier `/dist` sur ton repo GitHub.
3. Connecte ton repo à **Vercel** et déploie.

> Le lien Vercel de démo est placé en haut du README. Tu pourras le remplacer une fois ton projet live.

---

## 🪶 Licence

Projet libre pour apprentissage et démonstration.
Tu peux y ajouter une licence MIT si tu veux l'ouvrir publiquement.

---

> _Un projet sobre. Sans bruit. Juste du code qui respire la maîtrise._
