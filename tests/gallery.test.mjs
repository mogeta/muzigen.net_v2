import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { parseGallery, rehypeGallery } from '../src/lib/gallery/gallery.mjs';

const image = { src: 'https://example.com/full.webp', thumbnail: 'https://example.com/thumb.webp', alt: '海 \" onerror=\"alert(1)' };
const block = (images) => '```gallery\n' + JSON.stringify({ version: 1, images }) + '\n```';
const processor = await createMarkdownProcessor({ syntaxHighlight: { type: 'shiki', excludeLangs: ['gallery'] }, rehypePlugins: [rehypeGallery] });

test('renders multiple galleries and preserves surrounding Markdown and ordinary images', async () => {
  const { code } = await processor.render('# 写真\n\n' + block([image, image]) + '\n\n本文\n\n' + block([image]) + '\n\n![普通](https://example.com/normal.jpg)');
  assert.equal((code.match(/data-gallery=""/g) || []).length, 2);
  assert.equal((code.match(/data-gallery-image/g) || []).length, 3);
  assert.match(code, /loading="lazy"/);
  assert.match(code, /href="https:\/\/example.com\/full.webp"/);
  assert.match(code, /src="https:\/\/example.com\/thumb.webp"/);
  assert.match(code, /normal.jpg/);
  assert.match(code, /本文/);
  assert.match(code, /&#x22; onerror=&#x22;alert/);
});

test('rejects invalid blocks and unsafe URLs', async () => {
  for (const value of ['null', '{', '{"version":2,"images":[]}', JSON.stringify({ version: 1, images: [] }), JSON.stringify({ version: 1, images: [{ ...image, src: 'javascript:alert(1)' }] }), JSON.stringify({ version: 1, images: [{ ...image, thumbnail: 'data:text/html,evil' }] }), JSON.stringify({ version: 1, images: Array(201).fill(image) })]) {
    assert.equal(parseGallery(value), null);
    const { code } = await processor.render('```gallery\n' + value + '\n```');
    assert.doesNotMatch(code, /data-gallery-image/);
    assert.match(code, /形式が正しくありません/);
  }
});
