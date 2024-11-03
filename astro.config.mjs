// @ts-check
import {defineConfig} from 'astro/config';

import tailwind from '@astrojs/tailwind';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
    vite: {
        build: {
            assetsInlineLimit: 0,
        }
    },
    integrations: [tailwind(), solidJs()],
    build: {
        format: 'file',
        assets: 'assets',
    }
});
