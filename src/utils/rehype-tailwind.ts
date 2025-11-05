import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

/**
 * HTML要素にTailwind CSSクラスを追加するカスタムrehypeプラグイン
 */
export function rehypeTailwind() {
	return (tree: Root) => {
		visit<Root, 'element'>(tree, 'element', (node) => {
			const classNames = getClassNamesForElement(node);

			if (classNames.length > 0) {
				applyClassNames(node, classNames);
			}
		});
	};
}

/**
 * 要素に応じたクラス名を取得
 */
function getClassNamesForElement(node: Element): string[] {
	const tagClassMap: Record<string, string[]> = {
		h1: ['text-3xl', 'font-bold', 'mt-8', 'mb-4'],
		h2: ['text-2xl', 'font-semibold', 'mt-8', 'mb-4'],
		h3: ['text-xl', 'font-semibold', 'mt-8', 'mb-4'],
		h4: ['text-lg', 'font-medium', 'mt-8', 'mb-4'],
		h5: ['text-base', 'font-medium', 'mt-8', 'mb-4'],
		h6: ['text-sm', 'font-medium', 'mt-8', 'mb-4'],
		p: ['mb-4', 'leading-7'],
		pre: ['rounded-lg', 'overflow-x-auto', 'my-4'],
		ul: ['list-disc', 'ml-6', 'mb-4', 'space-y-2'],
		ol: ['list-decimal', 'ml-6', 'mb-4', 'space-y-2'],
		blockquote: ['border-l-4', 'border-gray-300', 'pl-4', 'italic', 'my-4', 'text-gray-700'],
		a: ['text-blue-600', 'hover:underline'],
		table: ['w-full', 'border-collapse', 'my-4'],
		th: ['border', 'border-gray-300', 'px-4', 'py-2', 'bg-gray-100', 'font-semibold', 'text-left'],
		td: ['border', 'border-gray-300', 'px-4', 'py-2'],
	};

	// 特別な処理が必要な要素
	if (node.tagName === 'img') {
		node.properties = node.properties || {};
		node.properties.loading = 'lazy';
		return ['max-w-full', 'h-auto', 'rounded-lg', 'my-6', 'mx-auto', 'block'];
	}

	if (node.tagName === 'code') {
		return getCodeClassNames(node);
	}

	return tagClassMap[node.tagName] || [];
}

/**
 * code要素用のクラス名を取得（インラインコードのみスタイリング）
 */
function getCodeClassNames(node: Element): string[] {
	const hasLanguageClass =
		node.properties?.className &&
		Array.isArray(node.properties.className) &&
		(node.properties.className as string[]).some((c: string) => c.startsWith('language-'));

	// Shikiがコードブロックを処理するため、インラインコードのみスタイリング
	return hasLanguageClass ? [] : ['px-2', 'py-1', 'rounded', 'text-sm'];
}

/**
 * ノードにクラス名を適用（重複を除去）
 */
function applyClassNames(node: Element, newClassNames: string[]): void {
	node.properties = node.properties || {};

	const existingClasses = normalizeClassName(node.properties.className);
	const allClasses = [...existingClasses, ...newClassNames];

	// 重複を除去
	node.properties.className = [...new Set(allClasses)];
}

/**
 * className プロパティを配列に正規化
 */
function normalizeClassName(className: unknown): string[] {
	if (!className) return [];
	if (Array.isArray(className)) return className as string[];
	if (typeof className === 'string') return [className];
	return [];
}