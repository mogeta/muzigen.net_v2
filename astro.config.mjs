// @ts-check
import {defineConfig} from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import partytown from '@astrojs/partytown';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
    output: 'static',

    vite: {
        plugins: [tailwindcss()]
    },

    markdown: {
        syntaxHighlight: {
            // Exclude mermaid from syntax highlighting to allow rehype-mermaid to process it
            excludeLangs: ['mermaid'],
        },
        rehypePlugins: [
            [rehypeMermaid, { strategy: 'inline-svg' }],
        ],
    },

    site: 'https://muzigen.net',
    integrations: [partytown({
        config: {
            // Google AnalyticsのためにdataLayer.pushを転送
            forward: ["dataLayer.push"],
        },

    }), sitemap(), react()]
});