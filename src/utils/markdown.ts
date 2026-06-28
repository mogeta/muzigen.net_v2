import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype';
import { rehypeTailwind } from './rehype-tailwind';
import { rehypeMermaidPre } from './rehype-mermaid-pre';

/**
 * Renders markdown content to HTML with Tailwind CSS styling and Shiki syntax highlighting
 * Uses unified/remark/rehype ecosystem (based on micromark)
 */
export async function renderMarkdown(content: string): Promise<string> {
  try {
    if (!content || typeof content !== 'string') {
      return '';
    }

    // Configure sanitization schema to allow necessary attributes including Shiki's inline styles
    const sanitizeSchema = {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        '*': ['className', 'class'],
        img: ['src', 'alt', 'title', 'className', 'class', 'loading'],
        a: ['href', 'title', 'className', 'class'],
        code: ['className', 'class'],
        pre: ['className', 'class', 'style', 'tabIndex'],
        span: ['style', 'className', 'class'],
      },
      tagNames: [
        ...(defaultSchema.tagNames || []),
        'span',
      ],
    };

    const result = await unified()
      .use(remarkParse) // Parse markdown to AST
      .use(remarkGfm) // Support GitHub Flavored Markdown
      .use(remarkRehype) // Convert markdown AST to HTML AST
      .use(rehypeMermaidPre) // Render Mermaid diagrams in the browser, not during build
      .use(rehypeShiki, {
		  theme: "one-dark-pro",
		  keepBackground: true,
      }) // Add Shiki syntax highlighting
      .use(rehypeSanitize, sanitizeSchema) // Sanitize HTML (after Shiki to preserve styles)
      .use(rehypeTailwind) // Add Tailwind CSS classes
      .use(rehypeStringify) // Convert HTML AST to string
      .process(content);

    return String(result);
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return `<p class="text-red-600">Markdown レンダリングエラー: ${error}</p>`;
  }
}

/**
 * Synchronous version of renderMarkdown for backward compatibility
 * Note: This uses the async version internally and may not work in all contexts
 */
export function renderMarkdownSync(content: string): string {
  let result = '';
  renderMarkdown(content).then((html) => {
    result = html;
  });
  return result;
}

/**
 * Basic HTML sanitization
 * Note: rehype-sanitize is now used in the markdown pipeline,
 * so this function is mainly for additional sanitization if needed
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
