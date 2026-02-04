import { visit } from "unist-util-visit";

type MdastNode = {
	type: string;
	children?: MdastNode[];
	value?: string;
	url?: string;
};

function extractYouTubeId(url: string): string | undefined {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return undefined;
	}

	const host = parsed.hostname.toLowerCase();
	if (host === "youtu.be" || host.endsWith(".youtu.be")) {
		const id = parsed.pathname.split("/").filter(Boolean)[0];
		return id || undefined;
	}

	if (host.endsWith("youtube.com") || host.endsWith(".youtube.com")) {
		const v = parsed.searchParams.get("v");
		if (v) return v;

		const parts = parsed.pathname.split("/").filter(Boolean);
		if (parts.length >= 2 && (parts[0] === "embed" || parts[0] === "shorts")) {
			return parts[1];
		}
	}

	return undefined;
}

function isTweetUrl(url: string): boolean {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}

	const host = parsed.hostname.toLowerCase();
	if (!(host === "twitter.com" || host === "x.com" || host.endsWith(".twitter.com") || host.endsWith(".x.com"))) {
		return false;
	}

	return parsed.pathname.includes("/status/");
}

function renderYouTubeEmbed(id: string): string {
	const src = `https://www.youtube.com/embed/${id}`;
	return [
		'<div class="embed-youtube">',
		`<iframe src="${src}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
		"</div>",
	].join("");
}

function renderTweetEmbed(url: string): string {
	let normalized = url;
	try {
		const parsed = new URL(url);
		if (parsed.hostname.toLowerCase().endsWith("x.com")) {
			parsed.hostname = "twitter.com";
			normalized = parsed.toString();
		}
	} catch {
		// Ignore normalization errors and fall back to original URL.
	}

	return `<blockquote class="twitter-tweet"><a href="${normalized}"></a></blockquote>`;
}

function isGistUrl(url: string): boolean {
	return /^https:\/\/gist\.github\.com\/[^/]+\/[^/]+\/?(?:\?file=.+)?$/.test(url);
}

function renderGistEmbed(url: string): string {
	const [base, query] = url.split("?");
	const scriptUrl = `${base}.js${query ? `?${query}` : ""}`;
	return `<div class="embed-gist"><script src="${scriptUrl}"></script></div>`;
}

export function remarkAutoEmbed() {
	return async (tree: MdastNode) => {
		const targets: Array<{
			node: MdastNode;
			index: number;
			parent: MdastNode;
			url: string;
		}> = [];

		visit(tree, "paragraph", (node: MdastNode, index, parent) => {
			if (!parent || typeof index !== "number") return;
			if (!node.children || node.children.length !== 1) return;

			let url: string | undefined;
			const onlyChild = node.children[0];

			if (
				onlyChild?.type === "link" &&
				onlyChild.url &&
				onlyChild.children?.length === 1 &&
				onlyChild.children[0]?.type === "text" &&
				onlyChild.children[0]?.value === onlyChild.url
			) {
				url = onlyChild.url;
			} else if (onlyChild?.type === "text" && onlyChild.value) {
				const trimmed = onlyChild.value.trim();
				if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
					url = trimmed;
				}
			}

			if (!url) return;
			targets.push({ node, index, parent: parent as MdastNode, url });
		});

		for (const target of targets) {
			const { parent, index, url } = target;

			const youtubeId = extractYouTubeId(url);
			if (youtubeId) {
				parent.children?.splice(index, 1, {
					type: "html",
					value: renderYouTubeEmbed(youtubeId),
				});
				continue;
			}

			if (isTweetUrl(url)) {
				parent.children?.splice(index, 1, {
					type: "html",
					value: renderTweetEmbed(url),
				});
				continue;
			}

			if (isGistUrl(url)) {
				parent.children?.splice(index, 1, {
					type: "html",
					value: renderGistEmbed(url),
				});
				continue;
			}
		}
	};
}
