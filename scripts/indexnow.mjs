// Tell Bing (and the other IndexNow engines) about every URL in the live sitemap.
// Run after a deploy that adds or changes pages: npm run indexnow
const host = "theonegareth.com";
const key = "c14efc32af373588a65ddf4448b252d0";
const xml = await (await fetch(`https://${host}/sitemap-0.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("no URLs in the sitemap");
const res = await fetch("https://api.indexnow.org/indexnow", {
	method: "POST",
	headers: { "Content-Type": "application/json; charset=utf-8" },
	body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs, HTTP ${res.status} ${await res.text()}`);
if (res.status !== 200 && res.status !== 202) process.exit(1);
