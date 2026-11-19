import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { site } from "../data/site";

export async function GET(context: APIContext) {
	const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
	return rss({
		title: `${site.name} - Blog`,
		description: site.tagline,
		site: context.site ?? site.url,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			link: `/blog/${post.id}/`,
		})),
	});
}
