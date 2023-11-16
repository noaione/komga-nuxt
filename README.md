# ![app icon](https://raw.githubusercontent.com/gotson/komga/master/.github/readme-images/app-icon.png) Komga

**Status**: In Development

Komga is a free and open source comics/mangas server.

A drop-in replacement of the original Web UI created with Nuxt 3.

> [!WARNING]
> This Web UI is still in development and not feature-parity yet with upstream UI.

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

The `build:komga` script is special since it will automatically run a Nitro hooks that will modify the build
process of the project to make it fully SPA and support Spring Boot base URL by utilizing `window.resourceBaseHost`.

You can see how it modify stuff by looking at: [`modules/servlet-rewrite.ts`](https://github.com/noaione/komga-nuxt/blob/master/modules/servlet-rewrite.ts)

## Development

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev` to start the development server.
4. Start developing! The server will be deployed to `localhost:8081`

If you use VSCode, you can install my recommended extensions.

In the `.env` file, you can add `BASE_HOST` to change where your Komga host is located.
