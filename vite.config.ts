import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';
import { createHtmlPlugin } from 'vite-plugin-html';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import sassDts from 'vite-plugin-sass-dts';
import { configDefaults } from 'vitest/config';

export default ({ mode }: { mode: 'production' | 'development' | 'test' }) => {
  const ENV = { ...process.env, ...loadEnv(mode, 'env', '') };

  return defineConfig({
    build: {
      rollupOptions: { output: { entryFileNames: '[hash:6].js', chunkFileNames: '[hash:6].js', assetFileNames: '[hash:6][extname]' } }, //prettier-ignore
      target: 'es2020',
      minify: mode === 'production' ? 'terser' : false,
      terserOptions:
        mode === 'production'
          ? {
              compress: { arguments: true, ecma: 2020, hoist_funs: true, passes: 3, pure_getters: true, unsafe: true, unsafe_arrows: true, unsafe_comps: true, unsafe_symbols:true }, //prettier-ignore
              format: { comments: false, ecma: 2020, wrap_func_args: false },
            }
          : undefined,
      modulePreload: { polyfill: false }, // Delete this line if outputting more than 1 chunk
    },
    plugins: [
      react(),
      checker({ typescript: true, overlay: false, enableBuild: true }),
      createHtmlPlugin({
        entry: '/src/index.tsx', // resolve(__dirname, './src/index.tsx'),
        minify: {
          collapseBooleanAttributes: true, collapseWhitespace: true, decodeEntities: true, minifyCSS: true,
          minifyJS: true, minifyURLs: true, removeComments: true, removeEmptyAttributes: true,
          removeOptionalTags: true, removeRedundantAttributes: true, removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true, sortAttributes: true, useShortDoctype: true,
        }, //prettier-ignore
      }),
      optimizeCssModules(),
      sassDts({ enabledMode: ['development', 'production'] }),
      ENV.ANALYZE === 'true' && visualizer({ template: 'treemap', open: true, gzipSize: true, brotliSize: true, filename: resolve(__dirname, 'dist/analyze.html') }), //prettier-ignore
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        react: 'preact/compat',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
      conditions: ['browser', 'development'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      transformMode: { web: [/\.[jt]sx?$/] },
      setupFiles: [resolve(__dirname, './src/__test__/setupTests.ts')],
      include: ['./src/**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
      alias: {
        react: 'react',
        'react-dom': 'react-dom',
        'react/jsx-runtime': 'react/jsx-runtime',
      },
      coverage: {
        reporter: ['text', 'lcov'],
        exclude: configDefaults.coverage.exclude!.concat(['src/__test__/setupTests.ts']),
      },
    },
  });
};
