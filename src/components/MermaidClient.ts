type MermaidApi = {
	initialize: (config: { startOnLoad: boolean; theme: string }) => void;
	init: (config?: unknown, nodes?: string) => void;
};

type WindowWithMermaid = Window & { mermaid?: MermaidApi };
const mermaid = (window as WindowWithMermaid).mermaid;

if (mermaid) {
	mermaid.initialize({
		startOnLoad: true,
		theme: "dark",
	});

	// Astroがhydrateした後に描画
	window.addEventListener("astro:after-swap", () => {
		mermaid.init(undefined, ".mermaid");
	});
}
