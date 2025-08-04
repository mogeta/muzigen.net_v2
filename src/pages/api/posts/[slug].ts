import type { APIRoute } from 'astro';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { app } from '../../../firebase/server';
import type { BlogPost } from './index';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;
    
    if (!slug) {
      return new Response(JSON.stringify({
        error: 'Slug parameter is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const db = getFirestore(app);
    
    // Try to find by slug first
    const slugQuery = query(
      collection(db, 'posts'),
      where('slug', '==', slug)
    );
    
    const slugSnapshot = await getDocs(slugQuery);
    
    let postDoc;
    if (!slugSnapshot.empty) {
      postDoc = slugSnapshot.docs[0];
    } else {
      // Fallback: try to find by document ID
      const idDoc = doc(db, 'posts', slug);
      const idSnapshot = await getDoc(idDoc);
      if (idSnapshot.exists()) {
        postDoc = idSnapshot;
      }
    }

    if (!postDoc) {
      return new Response(JSON.stringify({
        error: 'Post not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const data = postDoc.data();
    const post: BlogPost = {
      id: postDoc.id,
      title: data.title || '',
      content: data.content || '',
      slug: data.slug || postDoc.id,
      publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || '',
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || '',
      published: data.published || false,
      tags: data.tags || [],
      excerpt: data.excerpt || ''
    };

    return new Response(JSON.stringify({ post }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
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