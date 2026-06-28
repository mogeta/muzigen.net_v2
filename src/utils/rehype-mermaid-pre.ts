import type { Element, Parents, Root } from 'hast';
import { SKIP, visit } from 'unist-util-visit';

/**
 * Convert Mermaid fenced code blocks into <pre class="mermaid"> nodes.
 *
 * This intentionally avoids server-side Mermaid rendering so builds do not
 * need Playwright or a headless browser.
 */
export function rehypeMermaidPre() {
	return (tree: Root) => {
		visit<Root, 'element'>(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'code' || !hasClassName(node, 'language-mermaid')) {
				return;
			}

			const mermaidPre: Element = {
				type: 'element',
				tagName: 'pre',
				properties: {
					className: ['mermaid'],
				},
				children: [{ type: 'text', value: getTextContent(node).trim() }],
			};

			if (isElement(parent) && parent.tagName === 'pre') {
				parent.properties = mermaidPre.properties;
				parent.children = mermaidPre.children;
				return SKIP;
			}

			if (typeof index === 'number' && parent) {
				parent.children[index] = mermaidPre;
			}

			return SKIP;
		});
	};
}

function hasClassName(node: Element, className: string): boolean {
	const value = node.properties?.className;

	if (Array.isArray(value)) {
		return value.includes(className);
	}

	return typeof value === 'string' && value.split(/\s+/).includes(className);
}

function getTextContent(node: Element): string {
	return node.children
		.map((child) => {
			if (child.type === 'text') {
				return child.value;
			}

			if (child.type === 'element') {
				return getTextContent(child);
			}

			return '';
		})
		.join('');
}

function isElement(node: Parents | undefined): node is Element {
	return node?.type === 'element';
}
