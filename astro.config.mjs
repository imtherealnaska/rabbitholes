import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  // change this to your own domain
  site: "https://rabbitholes.in/",

  integrations: [tailwind(), sitemap()],
  output: "hybrid",
  adapter: cloudflare()
});