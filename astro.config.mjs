// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://theonegareth.com",
	integrations: [
		// ponytail: /blog/ is excluded while every post is a draft — drop this filter
		// (and put Blog back in the nav in src/layouts/Base.astro) on the first publish.
		sitemap({ filter: (page) => !page.endsWith("/blog/") }),
	],
});
