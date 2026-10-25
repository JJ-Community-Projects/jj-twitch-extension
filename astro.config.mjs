// @ts-check
import {defineConfig} from 'astro/config';

import tailwind from '@astrojs/tailwind';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
    vite: {
        build: {
            assetsInlineLimit: 0,
        },
        optimizeDeps: {
            // tmi.js is only reached from the overlay; pre-bundle it so Vite
            // doesn't re-optimize mid-session ("504 Outdated Optimize Dep").
            include: ['tmi.js'],
        },
    },
    integrations: [tailwind(), solidJs()],
    build: {
        format: 'file',
        assets: 'assets',
    }
});
