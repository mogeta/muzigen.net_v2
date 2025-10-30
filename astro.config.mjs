// @ts-check
import {defineConfig} from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import partytown from '@astrojs/partytown';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    output: 'static',

    vite: {
        plugins: [tailwindcss()]
    },
    site: 'https://muzigen.net',
    integrations: [partytown({
        config: {
            // Google AnalyticsのためにdataLayer.pushを転送
            forward: ["dataLayer.push"],
        },

    }), sitemap()]
});