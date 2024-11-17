import fluid, { extract, screens } from 'fluid-tailwind'

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', extract],
    theme: {
        screens,
        extend: {
            fontFamily: {
                poppins: ['Poppins'],
                babas: ['Bebas'],
            },
            fontSize: {
                xxs: [
                    '0.625rem;',
                    {
                        lineHeight: '0.75rem',
                    },
                ],
            },

            scale: {
                101: '1.01',
                102: '1.02',
            },
            brightness: {
                101: '1.01',
                102: '1.02',
            },
            colors: {
                primary: {
                    DEFAULT: '#E30E50',
                    shade: '#57051f',
                    50: '#FAAFC6',
                    100: '#F99BB8',
                    200: '#F6759D',
                    300: '#F44E82',
                    400: '#F22867',
                    500: '#E30E50',
                    600: '#AE0B3D',
                    700: '#79072B',
                    800: '#440418',
                    900: '#100106',
                    950: '#000000',
                },
                accent: {
                    DEFAULT: '#3584BF',
                    shade: '#09437a',
                    50: '#BED9ED',
                    100: '#AFD0E9',
                    200: '#8FBDE0',
                    300: '#6FAAD7',
                    400: '#4F98CE',
                    500: '#3584BF',
                    600: '#296693',
                    700: '#1D4767',
                    800: '#10293B',
                    900: '#040B0F',
                    950: '#000000',
                },
                twitch: {
                    DEFAULT: '#9146FF',
                    50: '#FEFEFF',
                    100: '#F2E9FF',
                    200: '#DAC0FF',
                    300: '#C298FF',
                    400: '#A96FFF',
                    500: '#9146FF',
                    600: '#700EFF',
                    700: '#5600D5',
                    800: '#40009D',
                    900: '#290065',
                },
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
        fluid
    ],
}
