import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getFirestore } from 'firebase-admin/firestore';
import { app } from '../firebase/server';

export const GET: APIRoute = async (context) => {
  try {
    const db = getFirestore(app);

    const snapshot = await db.collection('blog_contents')
      .where('publish', '==', true)
      .orderBy('created_date', 'desc')
      .limit(50) // 最新50件に制限
      .get();

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdDate = data.created_date?.toDate?.() || new Date(data.created_date);
      const updateDate = data.update_date?.toDate?.() || new Date(data.update_date);

      return {
        title: data.title || 'Untitled',
        description: data.description || '',
        link: `/blog/${data.slug || doc.id}/`,
        pubDate: createdDate,
        // カスタムデータとして更新日とタグを含める
        customData: [
          `<updated>${updateDate.toISOString()}</updated>`,
          data.tag ? `<category>${data.tag}</category>` : '',
        ].filter(Boolean).join('\n'),
      };
    });

    return rss({
      title: 'muzigen.net - Blog',
      description: 'tech life hobby and other things',
      site: context.site || 'https://muzigen.net',
      items,
      customData: '<language>ja</language>',
      stylesheet: '/rss-styles.xsl', // オプション: スタイルシート
    });
  } catch (err) {
    console.error('Failed to generate RSS feed:', err);
    // エラーの場合は空のフィードを返す
    return rss({
      title: 'muzigen.net - Blog',
      description: 'tech life hobby and other things',
      site: context.site || 'https://muzigen.net',
      items: [],
      customData: '<language>ja</language>',
    });
  }
};
