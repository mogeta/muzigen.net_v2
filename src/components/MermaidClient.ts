import mermaid from "mermaid";

let initialized = false;

async function renderMermaid() {
	const nodes = document.querySelectorAll<HTMLElement>(".mermaid");
	if (!nodes.length) {
		return;
	}

	if (!initialized) {
		initialized = true;
		mermaid.initialize({
			startOnLoad: false,
			theme: "dark",
		});
	}

	await mermaid.run({
		nodes,
		suppressErrors: true,
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		void renderMermaid();
	});
} else {
	void renderMermaid();
}

document.addEventListener("astro:after-swap", () => {
	void renderMermaid();
});
