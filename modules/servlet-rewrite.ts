import { JSDOM } from "jsdom";
import { join } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { defineNuxtModule, useLogger } from "nuxt/kit";

const KEY = "KOMGA_BUILD_MODE";
const TARGET = "servlet";

function modifyHTML(htmlPath: string) {
  const htmlContents = readFileSync(htmlPath, "utf8");

  const dom = new JSDOM(htmlContents);

  // get head
  const head = dom.window.document.querySelector("head")!;
  // modify all head to add th: inline for thymeleaf

  // get all meta tags
  const metaTags = head.querySelectorAll("meta");

  // add th:inline="none" to all meta tags
  for (const meta of metaTags) {
    // get content
    const content = meta.getAttribute("content");

    if (content && content.startsWith("/")) {
      meta.setAttribute("th:content", `@{${content}}`);
    }
  }

  // get all link tags
  const linkTags = head.querySelectorAll("link");

  // add th:href to all link tags
  for (const link of linkTags) {
    // get href
    const href = link.getAttribute("href");

    if (href && href.startsWith("/")) {
      link.setAttribute("th:href", `@{${href}}`);
    }
  }

  // get all script tags
  const scriptTags = head.querySelectorAll("script");

  // add th:src to all script tags
  for (const script of scriptTags) {
    // get src
    const src = script.getAttribute("src");

    if (src && src.startsWith("/")) {
      script.setAttribute("th:src", `@{${src}}`);
    }
  }

  // Modify __NUXT__.config.app.baseURL and __NUXT__.config.app.buildAssetsDir to include window.resourceBaseUrl
  const body = dom.window.document.querySelector("body")!;
  const scriptTagsWithContents = body.querySelectorAll("script");

  for (const script of scriptTagsWithContents) {
    // check if it's the one we want
    if (!script.innerHTML.includes("window.__NUXT__")) {
      continue;
    }

    // get the script contents
    let scriptContents = script.innerHTML;

    // modify directly with regex
    console.log("Modifying script contents");
    scriptContents = scriptContents.replaceAll(/baseURL: ?"([\w/]+)?"/g, (match, p1) => {
      if (!p1) {
        p1 = "";
      }

      if (p1 && p1.startsWith("/")) {
        p1 = p1.slice(1);
      }

      return `baseURL: window.resourceBaseUrl + "${p1}"`;
    });
    scriptContents = scriptContents.replaceAll(/buildAssetsDir: ?"([\w/]+)?"/g, (match, p1) => {
      if (!p1) {
        p1 = "";
      }

      if (p1 && p1.startsWith("/")) {
        p1 = p1.slice(1);
      }

      return `buildAssetsDir: window.resourceBaseUrl + "${p1}"`;
    });

    // set the script contents
    script.innerHTML = scriptContents;
  }

  // write the modified html
  writeFileSync(htmlPath, dom.serialize(), "utf8");
}

export default defineNuxtModule({
  meta: {
    name: "servlet-rewrite",
  },
  setup(options, nuxt) {
    const logger = useLogger("servlet-rewrite");

    nuxt.hook("nitro:build:before", (nitro) => {
      if (process.env[KEY] === TARGET && nitro.options._c12.config?.runtimeConfig?.public) {
        logger.info("Setting base URL to None");
        nitro.options._c12.config.runtimeConfig.public.baseHost = "";
      }
    });
    nuxt.hook("prerender:routes", (ctx) => {
      if (process.env[KEY] === TARGET) {
        logger.info("Nuking prerendered routes (only allowing index!)");
        ctx.routes.clear();
        ctx.routes.add("/");
      }
    });
    nuxt.hook("nitro:build:public-assets", (nitro) => {
      if (process.env[KEY] === TARGET) {
        logger.start("Rewriting public assets URL");

        const pages = ["index.html", "404.html", "200.html"];

        for (const page of pages) {
          const pagePath = join(nitro.options.output.publicDir, page);

          modifyHTML(pagePath);

          logger.info(` Rewrote ${pagePath}`);
        }

        logger.success("Rewrote public assets URL");
      }
    });
  },
});
