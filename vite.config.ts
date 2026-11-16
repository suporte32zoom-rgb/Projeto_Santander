import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
      // Emits compiled index.html, assets/, and .nojekyll directly to repository root
      // for GitHub Pages "Deploy from a branch" (main / root) without GitHub Actions.
      {
        name: 'publish-root-pages',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const builtAppHtml = path.resolve(distDir, 'app.html');
          const distIndexHtml = path.resolve(distDir, 'index.html');
          if (fs.existsSync(builtAppHtml)) {
            fs.renameSync(builtAppHtml, distIndexHtml);
          }

          if (fs.existsSync(distIndexHtml)) {
            let html = fs.readFileSync(distIndexHtml, 'utf-8');
            const cssLinkRegex = /<link\s+rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g;
            html = html.replace(cssLinkRegex, (_match, relCssPath: string) => {
              const fullCssPath = path.resolve(distDir, relCssPath);
              if (fs.existsSync(fullCssPath)) {
                const css = fs.readFileSync(fullCssPath, 'utf-8');
                return `<style>${css}</style>`;
              }
              return _match;
            });
            fs.writeFileSync(distIndexHtml, html, 'utf-8');
            fs.copyFileSync(distIndexHtml, path.resolve(__dirname, 'index.html'));
          }

          const distAssets = path.resolve(distDir, 'assets');
          const rootAssets = path.resolve(__dirname, 'assets');
          if (fs.existsSync(distAssets)) {
            fs.mkdirSync(rootAssets, {recursive: true});
            for (const entry of fs.readdirSync(rootAssets)) {
              if (entry === 'aistudio') continue;
              fs.rmSync(path.join(rootAssets, entry), {recursive: true, force: true});
            }
            fs.cpSync(distAssets, rootAssets, {recursive: true, force: true});
          }

          const distNoJekyll = path.resolve(distDir, '.nojekyll');
          const rootNoJekyll = path.resolve(__dirname, '.nojekyll');
          if (fs.existsSync(distNoJekyll)) {
            fs.copyFileSync(distNoJekyll, rootNoJekyll);
          }
        },
      },
    ],
    build: {
      cssMinify: 'esbuild' as const,
      rollupOptions: {
        input: path.resolve(__dirname, 'app.html'),
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
