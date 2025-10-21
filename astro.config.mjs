// @ts-check
import {defineConfig} from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
    output: 'static',

    vite: {
        plugins: [tailwindcss()]
    },

    integrations: [partytown({
        config: {
            // Google AnalyticsのためにdataLayer.pushを転送
            forward: ["dataLayer.push"],
        },
    })]
});