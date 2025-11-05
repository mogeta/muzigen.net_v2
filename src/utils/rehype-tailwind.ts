import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

/**
 * Custom rehype plugin to add Tailwind CSS classes to HTML elements
 */
export function rehypeTailwind() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const props = node.properties || {};
      let className = (props.className as string[]) || [];

      // Ensure className is an array
      if (typeof className === 'string') {
        className = [className];
      }

      switch (node.tagName) {
        case 'h1':
          className.push('text-3xl', 'font-bold', 'mt-8', 'mb-4');
          break;
        case 'h2':
          className.push('text-2xl', 'font-semibold', 'mt-8', 'mb-4');
          break;
        case 'h3':
          className.push('text-xl', 'font-semibold', 'mt-8', 'mb-4');
          break;
        case 'h4':
          className.push('text-lg', 'font-medium', 'mt-8', 'mb-4');
          break;
        case 'h5':
          className.push('text-base', 'font-medium', 'mt-8', 'mb-4');
          break;
        case 'h6':
          className.push('text-sm', 'font-medium', 'mt-8', 'mb-4');
          break;
        case 'p':
          className.push('mb-4', 'leading-7');
          break;
        case 'img':
          className.push('max-w-full', 'h-auto', 'rounded-lg', 'my-6', 'mx-auto', 'block');
          props.loading = 'lazy';
          break;
        case 'pre':
          className.push('bg-gray-100', 'p-4', 'rounded-lg', 'overflow-x-auto', 'my-4');
          break;
        case 'code':
          // Check if this code is inside a pre element (code block)
          // If not, it's an inline code span
          const isInline = !node.properties?.className ||
                          !(node.properties.className as string[]).some((c: string) => c.startsWith('language-'));

          if (isInline) {
            className.push('bg-gray-100', 'px-2', 'py-1', 'rounded', 'text-sm');
          } else {
            className.push('text-sm');
          }
          break;
        case 'ul':
          className.push('list-disc', 'ml-6', 'mb-4', 'space-y-2');
          break;
        case 'ol':
          className.push('list-decimal', 'ml-6', 'mb-4', 'space-y-2');
          break;
        case 'blockquote':
          className.push('border-l-4', 'border-gray-300', 'pl-4', 'italic', 'my-4', 'text-gray-700');
          break;
        case 'a':
          className.push('text-blue-600', 'hover:underline');
          break;
        case 'table':
          className.push('w-full', 'border-collapse', 'my-4');
          break;
        case 'th':
          className.push('border', 'border-gray-300', 'px-4', 'py-2', 'bg-gray-100', 'font-semibold', 'text-left');
          break;
        case 'td':
          className.push('border', 'border-gray-300', 'px-4', 'py-2');
          break;
      }

      if (className.length > 0) {
        node.properties = {
          ...props,
          className: className.filter((c, i, arr) => arr.indexOf(c) === i), // Remove duplicates
        };
      }
    });
  };
}
