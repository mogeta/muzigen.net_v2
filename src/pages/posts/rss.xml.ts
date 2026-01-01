import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('posts');

  // 下書きを除外し、公開日で降順ソート
  const publishedPosts = posts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const items = publishedPosts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    link: `/posts/${post.slug}/`,
    pubDate: post.data.pubDate,
    author: post.data.author,
    categories: post.data.tags,
  }));

  return rss({
    title: 'muzigen.net - Posts',
    description: 'Astroマークダウンで書かれた記事の一覧です',
    site: context.site || 'https://muzigen.net',
    items,
    customData: '<language>ja</language>',
  });
};
