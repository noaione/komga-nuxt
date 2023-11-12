# ![app icon](https://raw.githubusercontent.com/gotson/komga/master/.github/readme-images/app-icon.png) Komga

Komga is a free and open source comics/mangas server.

This version of the Web UI is a "fork" of the current Web UI written with Nuxt 3.

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
3. Build this repository with: `npm run generate`
4. Copy the `dist` folder to your `komga-webui` folder
5. Open `komga/build.gradle.kts`, modify `prepareThymeLeaf` task:
   ```kt
  register<Copy>("prepareThymeLeaf") {
    group = "web"
    # dependsOn("copyWebDist") <-- comment this
    from("$webui/dist/index.html")
    from("$webui/dist/404.html") # <-- add this
    from("$webui/dist/200.html") # <-- add this
    into("$projectDir/src/main/resources/public/")
    filter { line ->
      line.replace("((?:src|content|href)=\")([\\w]*/.*?)(\")".toRegex()) {
        it.groups[0]?.value + " th:" + it.groups[1]?.value + "@{" + it.groups[2]?.value?.prefixIfNot("/") + "}" + it.groups[3]?.value
      }
    }
  }
   ```
6. Run gradle: `./gradlew prepareThymeLeaf assemble`
