import type { APIRoute } from 'astro';
import { getFirestore } from 'firebase-admin/firestore';
import { app } from '../../../firebase/server';
import type { BlogListItem } from '../../../types/blog';

export const GET: APIRoute = async ({ url }) => {
  try {
    const db = getFirestore(app);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get total count first
    const countQuery = db.collection('blog_contents')
      .where('publish', '==', true);
    const countSnapshot = await countQuery.get();
    const totalArticles = countSnapshot.size;
    const totalPages = Math.ceil(totalArticles / limit);

    // Query blog_contents collection with pagination
    let articlesQuery = db.collection('blog_contents')
      .where('publish', '==', true)
      .orderBy('created_date', 'desc')
      .offset(offset)
      .limit(limit);

    const querySnapshot = await articlesQuery.get();
    const articles: BlogListItem[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      articles.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        ogp_image: data.ogp_image || '',
        tag: data.tag || '',
        update_date: data.update_date?.toDate?.()?.toISOString() || data.update_date || '',
        created_date: data.created_date?.toDate?.()?.toISOString() || data.created_date || '',
      });
    });

    return new Response(JSON.stringify({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Error fetching blog articles:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to fetch articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};