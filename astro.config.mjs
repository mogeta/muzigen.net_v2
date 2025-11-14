// @ts-check
import {defineConfig} from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import partytown from '@astrojs/partytown';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
    output: 'static',
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

    integrations: [partytown({
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