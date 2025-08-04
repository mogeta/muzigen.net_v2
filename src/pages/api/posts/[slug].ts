import type { APIRoute } from 'astro';
import { getFirestore } from 'firebase-admin/firestore';
import { app } from '../../../firebase/server';
import type { BlogArticle } from '../../../types/blog';
import { renderMarkdown, sanitizeHtml } from '../../../utils/markdown';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;
    
    if (!slug) {
      return new Response(JSON.stringify({
        error: 'Article ID is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const db = getFirestore(app);
    
    // Get article by document ID from blog_contents collection
    const articleDoc = await db.collection('blog_contents').doc(slug).get();

    if (!articleDoc.exists) {
      return new Response(JSON.stringify({
        error: 'Article not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const data = articleDoc.data();
    
    // Check if article is published
    if (!data?.publish) {
      return new Response(JSON.stringify({
        error: 'Article not published'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Process elements and convert markdown to HTML
    const processedElements = (data.elements || []).map((element: any) => ({
      source: element.source || '',
      type: element.type || '',
      safeHTML: element.type === 'markdown' && element.source 
        ? sanitizeHtml(renderMarkdown(element.source))
        : sanitizeHtml(element.safeHTML || element.source || ''),
    }));

    const article: BlogArticle = {
      id: articleDoc.id,
      title: data.title || '',
      description: data.description || '',
      ogp_image: data.ogp_image || '',
      content: data.content ? sanitizeHtml(renderMarkdown(data.content)) : '',
      tag: data.tag || '',
      content_url: data.content_url || '',
      markdown_url: data.markdown_url || '',
      update_date: data.update_date?.toDate?.()?.toISOString() || data.update_date || '',
      created_date: data.created_date?.toDate?.()?.toISOString() || data.created_date || '',
      publish: data.publish || false,
      elements: processedElements,
    };

    return new Response(JSON.stringify({ article }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600'
      }
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to fetch post',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};