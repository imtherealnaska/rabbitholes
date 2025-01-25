import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // change this to your own domain
  site: "https://rabbitholes.in/",
  integrations: [tailwind(), sitemap()],
});
