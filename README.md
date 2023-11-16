# ![app icon](https://raw.githubusercontent.com/gotson/komga/master/.github/readme-images/app-icon.png) Komga

Komga is a free and open source comics/mangas server.

A drop-in replacement of the original Web UI created with Nuxt 3.

## Features

- ⬆️ Rewritten everything using Vue 3 Composition API
- 🍍 Use modern Pinia for State Management
- 🚀 Blazing fast build with Vite
- ⚙️ Additional features added that is taken from my own [fork](https://github.com/noaione/komga/tree/naoX/komga-webui)

## Requirements

- Node.js 18.x+
- NPM

## Deployment

**On PaaS (Vercel/Cloudflare/etc)**

TODO

**Replacing Bundled Web UI**

1. Clone this repository
2. Clone Komga repository
3. Build this repository with: `npm run build:komga`
4. Copy the build `dist` folder contents into `komga/src/main/resources/public`
5. Run gradle: `./gradlew assemble`
