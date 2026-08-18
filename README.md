<a id="readme-top"></a>

# personal-web

Personal site for Gareth Aurelius Harrison — portfolio, project catalogue, and blog. Built with Astro, deployed as a static site to Cloudflare Pages at [theonegareth.com][site-url].

<details>
<summary>Table of contents</summary>

- [About the project](#about-the-project)
- [Getting started](#getting-started)
- [Usage](#usage)
- [Content](#content)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

</details>

## About the project

This replaces an earlier single-file portfolio ([theonegareth/portfolio-website][old-repo]) that carried a set of defects: `@apply` rules inside a plain `<style>` tag that the browser discarded, placeholder social links, a profile photo and resume PDF that were referenced but never committed, filter buttons with no handler, and a `sitemap.xml` whose every line was wrapped in escaped quotes. The written content was sound, so it was ported across; the surrounding markup was not.

The site is fully static. Every page is rendered to HTML at build time and served as a file — no server, no database, no client-side JavaScript shipped by default. Theming follows the reader's operating system preference through a single `prefers-color-scheme` media query, so there is no theme toggle to persist and no flash of the wrong colours on load.

Blog posts are Markdown files validated at build time by a Zod schema. A post with `draft: true` in its frontmatter is excluded from the blog index, the home page, and the generated sitemap, and no page is emitted for it. Publishing is a one-word frontmatter change.

### Built with

- [Astro][astro-url] 7.2.2 — static site generation and content collections
- [@astrojs/sitemap][sitemap-url] 3.7.3 — generates `sitemap-index.xml` at build
- [Zod][zod-url] 4.4.3 — frontmatter schema validation
- TypeScript (strict) with `@astrojs/check` for `.astro` diagnostics
- Plain CSS with custom properties — no framework, no build-time CSS pipeline
- System font stack — no webfont requests

<p align="right"><a href="#readme-top">back to top</a></p>

## Getting started

### Prerequisites

- Node.js 22.12.0 or newer (`package.json` sets this in `engines`; developed on 26.5.0)
- npm 11 or newer

```sh
node --version
npm --version
```

### Installation

1. Clone the repository:

	```sh
	git clone https://github.com/theonegareth/personal-web.git
	cd personal-web
	```

2. Install dependencies:

	```sh
	npm install
	```

3. Approve the install scripts npm 11 defers (`esbuild` and `fsevents` are required for the build):

	```sh
	npm approve-scripts esbuild fsevents
	```

There are no environment variables and no configuration files to create.

<p align="right"><a href="#readme-top">back to top</a></p>

## Usage

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload at `http://localhost:4321` |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the contents of `dist/` locally |
| `npx astro check` | Type-check `.astro` files and content schemas |

Run `npx astro check` before committing. It catches frontmatter that violates the blog schema and type errors inside component frontmatter, neither of which `npm run build` reports on its own.

<p align="right"><a href="#readme-top">back to top</a></p>

## Content

Site content lives in two places, both plain data — no code changes needed to update either.

`src/data/site.ts` holds contact details, projects, experience, education, skills, certifications, and interests as typed exports. Pages map over these arrays, so adding a project means adding an object to `projects`.

`src/content/blog/` holds one Markdown file per post. Frontmatter is validated against the schema in `src/content.config.ts`:

| Field | Required | Default | Description |
|---|---|---|---|
| `title` | yes | — | Post title, used in `<title>` and the post heading |
| `description` | yes | — | Meta description and the summary shown in listings |
| `date` | yes | — | Publication date, coerced to a `Date` |
| `draft` | no | `false` | When `true`, the post is not built, listed, or indexed |

The URL slug comes from the filename: `src/content/blog/my-post.md` becomes `/blog/my-post/`.

<p align="right"><a href="#readme-top">back to top</a></p>

## Deployment

Cloudflare Pages, connected to this repository. Pushing to `main` triggers a build.

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 22 or newer |

The canonical hostname is set by `site` in `astro.config.mjs`. It feeds the generated sitemap, the `<link rel="canonical">` tag, and Open Graph URLs — change it there, not in individual pages. `public/robots.txt` points crawlers at `/sitemap-index.xml` and must be updated alongside it if the hostname changes.

<p align="right"><a href="#readme-top">back to top</a></p>

## Contributing

This is a personal site, but corrections are welcome. Fork the repository, branch from `main`, and open a pull request describing the change.

Commits follow this convention:

```
<emoji> <type>(<scope>): <summary of the major change>

- <explanation of a specific change>
- <explanation of another specific change>
```

One commit is one major change. The summary line is lowercase except for formal or technical terms. Types and their emoji: ✨ `feat`, 🐛 `fix`, ♻️ `refactor`, 🎨 `style`, 🔧 `chore`, ✅ `test`, 📝 `docs`, ⚡ `perf`, ⏪ `revert`, 👷 `ci`, 🔒 `security`, 🗃️ `db`. Scope is the affected area, lowercase: `web`, `blog`, `content`, `infra`, `seo`.

Run `npx astro check` and `npm run build` before opening a pull request.

<p align="right"><a href="#readme-top">back to top</a></p>

## License

Distributed under the MIT License. See [LICENSE][license-url].

<p align="right"><a href="#readme-top">back to top</a></p>

## Contact

Gareth Aurelius Harrison — West Jakarta, Indonesia

- Site: [theonegareth.com][site-url]
- GitHub: [@theonegareth][github-url]
- LinkedIn: [in/theonegareth][linkedin-url]

<p align="right"><a href="#readme-top">back to top</a></p>

[site-url]: https://theonegareth.com
[repo-url]: https://github.com/theonegareth/personal-web
[old-repo]: https://github.com/theonegareth/portfolio-website
[github-url]: https://github.com/theonegareth
[linkedin-url]: https://linkedin.com/in/theonegareth
[license-url]: LICENSE
[astro-url]: https://astro.build
[sitemap-url]: https://docs.astro.build/en/guides/integrations-guide/sitemap/
[zod-url]: https://zod.dev
