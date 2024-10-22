import adapter from "@sveltejs/adapter-static"
import {vitePreprocess} from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: "index.html",
    }),
    alias: {
      "@src": "src",
      "@app": "src/app",
      "@lib": "src/lib",
      "@assets": "src/assets",
    },
    csp: {
      directives: {
        'script-src': ['self', 'plausible.io'],
        'worker-src': ['self', 'blob:'],
        'style-src': ['self', 'unsafe-inline'],
        'frame-src': ['open.spotify.com', 'embed.tidal.com'],
        'child-src': ['none'],
        'form-action': ['none'],
      },
    },
  },
}
