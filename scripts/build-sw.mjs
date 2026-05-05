import { generateSW } from 'workbox-build';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = '/TimeLine_Vue3_ts/';
const distDir = join(__dirname, '..', 'dist');

if (!existsSync(distDir)) {
  console.error('dist/ directory not found. Run vite build first.');
  process.exit(1);
}

const { count, size, warnings } = await generateSW({
  swDest: join(distDir, 'sw.js'),

  globDirectory: distDir,
  globPatterns: [
    '**/*.{html,js,css,woff2}',
    '**/*.{png,svg,jpg,ico}'
  ],
  globIgnores: [
    '**/sw.js',
    '**/workbox-*.js'
  ],

  modifyURLPrefix: {
    '': BASE
  },

  runtimeCaching: [
    {
      urlPattern: /^https:\/\/ytzdcbubgpwukbhydqhk\.supabase\.co\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
        networkTimeoutSeconds: 5
      }
    }
  ],

  skipWaiting: true,
  clientsClaim: true,
  sourcemap: false,
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  cleanupOutdatedCaches: true
});

console.log(`SW generated: ${count} files precached (${(size / 1024).toFixed(1)} KB)`);
if (warnings.length) console.warn('Warnings:', warnings);
