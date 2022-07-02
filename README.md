# Ford Universe V2 (Front)

Ce dépôt contient la partie front du blog Ford Universe.  
L'objectif de cette refonte est de rendre le code plus maintenable et de le rendre Open Source.

## Badges

[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC_BY--NC--ND_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

## Installation

Cloner le dépôt avec git

```bash
  git clone https://github.com/VictorSpitale/ford-blog-client-v2.git
```

Ou Github CLI

```bash
  gh repo clone VictorSpitale/ford-blog-client-v2
```

## Configuration

Configurer les variables d'environnement .env

| Nom                       | exemple                 | Instructions                    |
|---------------------------|-------------------------|---------------------------------|
| ***NEXT_PUBLIC_API_URL*** | http://lien_vers_api.fr | Url vers l'api de ford universe |
| ***NEXT_PUBLIC_ENV***     | production, development | Environnement                   |

## Lancer le projet

Installer les dépendances

```bash
  npm install
```

Lancer le serveur

```bash
  npm run dev
```

## Stack technique

**Client:** NextJS, React, TailwindCSS, ReduxToolkit, Axios, ReactSelect, ReactSlick

**Server:** Node, NestJS, Redis, Nodemailer, Google OAuth, Google Cloud Storage

**CI/CD:** Google Cloud Run, Vercel

## Auteur

- [@VictorSpitale](https://www.github.com/VictorSpitale)

![Logo](https://storage.googleapis.com/fordblog.appspot.com/email/forduniverse.png)

