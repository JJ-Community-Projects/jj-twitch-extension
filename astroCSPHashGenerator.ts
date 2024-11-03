import type { AstroIntegration } from 'astro'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import parse from "node-html-parser";

const createCspHash = async (s: string) => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))

  return `'sha256-${hashBase64}'`
}

export const astroCSPHashGenerator: AstroIntegration = {
  name: 'astro-csp-hash-generator',
  hooks: {
    'astro:build:done': async ({ dir, pages, logger }) => {
      let hashes = ''
      for (let i = 0; i < pages.length; i++) {
        const filePath = fileURLToPath(`${dir.href}${pages[i].pathname}.html`)

        try {
          const root = parse(await readFile(filePath, { encoding: 'utf-8' }))
          const scripts = root.querySelectorAll('script')
          console.log('astroCSPHashGenerator', scripts)
          for (let j = 0; j < scripts.length; j++) {
            const hash = await createCspHash(scripts[j].textContent)
            hashes += hash + ' '
          }
        } catch (e) {
          logger.error(`Cannot read file ${filePath}: ${e}`)
        }
      }
      logger.info(hashes)
    },
  },
}
