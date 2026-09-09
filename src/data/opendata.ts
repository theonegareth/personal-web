const HF_USER = "theonegareth";
const KAGGLE_USER = "garethharrison";

export type Repo = {
	name: string;
	kind: string;
	url: string;
	updated: Date;
	downloads: number | null;
	downloadsRecent: number | null;
	votes: number;
	views: number | null;
};

type HfRaw = {
	id: string;
	likes: number;
	lastModified: string;
	downloads?: number;
	downloadsAllTime?: number;
	pipeline_tag?: string;
	sdk?: string;
};

type KaggleRaw = {
	ref: string;
	title: string;
	lastUpdated: string;
	downloadCount: number;
	viewCount: number;
	voteCount: number;
};

const HF_KINDS = [
	{ label: "Model", path: "models", prefix: "", expand: ["likes", "lastModified", "downloads", "downloadsAllTime", "pipeline_tag"] },
	{ label: "Dataset", path: "datasets", prefix: "datasets/", expand: ["likes", "lastModified", "downloads", "downloadsAllTime"] },
	{ label: "Space", path: "spaces", prefix: "spaces/", expand: ["likes", "lastModified", "sdk"] },
] as const;

async function json<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url} returned ${res.status}`);
	return res.json() as Promise<T>;
}

async function huggingFaceRepos({ label, path, prefix, expand }: (typeof HF_KINDS)[number]): Promise<Repo[]> {
	const params = new URLSearchParams({ author: HF_USER });
	for (const field of expand) params.append("expand[]", field);
	const raw = await json<HfRaw[]>(`https://huggingface.co/api/${path}?${params}`);

	return raw.map((repo) => ({
		name: repo.id.split("/").pop() ?? repo.id,
		kind: [label, repo.pipeline_tag?.replace(/-/g, " ") ?? repo.sdk].filter(Boolean).join(" · "),
		url: `https://huggingface.co/${prefix}${repo.id}`,
		updated: new Date(repo.lastModified),
		downloads: repo.downloadsAllTime ?? null,
		downloadsRecent: repo.downloads ?? null,
		votes: repo.likes,
		views: null,
	}));
}

async function kaggleRepos(): Promise<Repo[]> {
	const raw = await json<KaggleRaw[]>(`https://www.kaggle.com/api/v1/datasets/list?user=${KAGGLE_USER}`);

	return raw.map((dataset) => ({
		name: dataset.title,
		kind: "Dataset",
		url: `https://www.kaggle.com/datasets/${dataset.ref}`,
		updated: new Date(dataset.lastUpdated),
		downloads: dataset.downloadCount,
		downloadsRecent: null,
		votes: dataset.voteCount,
		views: dataset.viewCount,
	}));
}

function sum(repos: Repo[], key: "downloads" | "downloadsRecent" | "votes" | "views") {
	return repos.reduce((total, repo) => total + (repo[key] ?? 0), 0);
}

const byDownloads = (a: Repo, b: Repo) => (b.downloads ?? 0) - (a.downloads ?? 0) || b.votes - a.votes;

async function load() {
	const [hfLists, kaggle] = await Promise.all([Promise.all(HF_KINDS.map(huggingFaceRepos)), kaggleRepos()]);
	const hf = hfLists.flat().sort(byDownloads);
	kaggle.sort(byDownloads);

	return {
		platforms: [
			{ name: "Hugging Face", url: `https://huggingface.co/${HF_USER}`, repos: hf },
			{ name: "Kaggle", url: `https://www.kaggle.com/${KAGGLE_USER}`, repos: kaggle },
		],
		downloads: sum(hf, "downloads") + sum(kaggle, "downloads"),
		downloadsHf: sum(hf, "downloads"),
		downloadsKaggle: sum(kaggle, "downloads"),
		downloadsRecent: sum(hf, "downloadsRecent"),
		views: sum(kaggle, "views"),
		votes: sum(hf, "votes") + sum(kaggle, "votes"),
		fetched: new Date(),
	};
}

export const openData = await load().catch((error: Error) => {
	console.warn(`[opendata] stats unavailable, section hidden: ${error.message}`);
	return null;
});
