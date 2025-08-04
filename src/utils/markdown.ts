import { marked } from 'marked';

// Configure marked with enhanced options
marked.setOptions({
  breaks: true,        // Convert \n to <br>
  gfm: true,          // GitHub Flavored Markdown
});

// Configure custom renderer
marked.use({
  renderer: {
    heading(token: any) {
      const text = this.parser.parseInline(token.tokens);
      const sizes = {
        1: 'text-3xl font-bold',
        2: 'text-2xl font-semibold', 
        3: 'text-xl font-semibold',
        4: 'text-lg font-medium',
        5: 'text-base font-medium',
        6: 'text-sm font-medium'
      };
      
      return `<h${token.depth} class="${sizes[token.depth as keyof typeof sizes] || 'text-base font-medium'} mt-8 mb-4">${text}</h${token.depth}>`;
    },

    paragraph(token: any) {
      const text = this.parser.parseInline(token.tokens);
      return `<p class="mb-4 leading-7">${text}</p>`;
    },

    image(token: any) {
      const titleAttr = token.title ? ` title="${token.title}"` : '';
      const altText = token.text || '';
      return `<img src="${token.href}" alt="${altText}"${titleAttr} class="max-w-full h-auto rounded-lg my-6 mx-auto block" loading="lazy" />`;
    },

    code(token: any) {
      const language = token.lang ? ` language-${token.lang}` : '';
      return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm${language}">${token.text}</code></pre>`;
    },

    codespan(token: any) {
      return `<code class="bg-gray-100 px-2 py-1 rounded text-sm">${token.text}</code>`;
    },

    list(token: any) {
      const tag = token.ordered ? 'ol' : 'ul';
      const classes = token.ordered ? 'list-decimal' : 'list-disc';
      const body = token.items.map((item: any) => this.listitem(item)).join('');
      return `<${tag} class="${classes} ml-6 mb-4 space-y-2">${body}</${tag}>`;
    },

    blockquote(token: any) {
      const text = this.parser.parse(token.tokens);
      return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">${text}</blockquote>`;
    }
  }
});

export function renderMarkdown(content: string): string {
  try {
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    return marked(content) as string;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return `<p class="text-red-600">Markdown レンダリングエラー: ${error}</p>`;
  }
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization (you might want to use a more robust library like DOMPurify)
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}