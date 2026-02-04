// @ts-check
import {defineConfig} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import sentry from '@sentry/astro';
import embeds from 'astro-embed/integration';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    build: {
        // CSSを自動インライン化（小さいCSSはHTMLに埋め込み、レンダリングブロックを軽減）
        inlineStylesheets: 'auto',
    },
    markdown: {
        syntaxHighlight: {
            type: 'shiki',
            excludeLangs: ['mermaid'],
        },
    },
    vite: {
        plugins: [tailwindcss()]
    },
    site: 'https://muzigen.net',

    integrations: [
        embeds(),
        partytown({
        config: {
            // Google AnalyticsのためにdataLayer.pushを転送
            forward: ["dataLayer.push"],
        },

    }),sentry({
        project: "muzigen-net",
        org: "muzigen",
        authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
        sitemap(), react()]
});