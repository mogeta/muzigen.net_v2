import mermaid from "mermaid";

mermaid.initialize({
	startOnLoad: true,
	theme: "dark", // "default" や "forest" なども可
});

// Astroがhydrateした後に描画
window.addEventListener("astro:after-swap", () => {
	mermaid.init(undefined, ".mermaid");
});
