import { readFileSync as read, readdirSync, writeFileSync as write } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { checker } from 'vite-plugin-checker';
import { createHtmlPlugin } from 'vite-plugin-html';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import sassDts from 'vite-plugin-sass-dts';
import solid from 'vite-plugin-solid';
import svg from 'vite-plugin-svgo';
import { configDefaults } from 'vitest/config';

export default ({ mode }: { mode: 'production' | 'development' | 'test' }) => {
  const ENV = { ...process.env, ...loadEnv(mode, 'env', '') };

  return defineConfig({
    envDir: 'env',
    build: {
      target: 'es2021',
      rollupOptions: {
        output: { entryFileNames: '[hash:6].js', chunkFileNames: '[hash:6].js', assetFileNames: '[hash:6][extname]' },
        treeshake: { tryCatchDeoptimization: false },
      },
      minify: 'terser',
      cssMinify: 'lightningcss',
      terserOptions: {
        ecma: 2020,
        compress: { arguments: true, hoist_funs: true, passes: 3, unsafe: true, unsafe_arrows: true, unsafe_comps: true, unsafe_symbols: true }, //prettier-ignore
        format: { comments: false, wrap_func_args: false },
        mangle: { properties: { regex: /^(?:observers|observerSlots|comparator|updatedAt|owned|route|score|when|sourceSlots|fn|cleanups|owner|pure|suspense|inFallback|isRouting|beforeLeave|Provider|preloadRoute|outlet|utils|explicitLinks|actionBase|resolvePath|branches|routerState|parsePath|renderPath|originalPath|effects|tState|disposed|sensitivity|navigatorFactory|keyed)$/ } }, //prettier-ignore
      },
      modulePreload: { polyfill: false }, // Delete this line if outputting more than 1 chunk
    },
    css: { devSourcemap: true, modules: { generateScopedName: (n, f) => `${f.replace(/(^.*\/|\..+$)/g, '')}_${n}` } },
    plugins: [
      {
        name: 'vite-plugin-optimize-solid-css-modules',
        enforce: 'pre',
        transform(code, id) {
          if (/\.[jt]sx$/.test(id))
            code = code.replace(
              /class=\{([a-zA-Z '"`[\].-]+|(?:`(?:\$\{[a-zA-Z '"`[\].-]+\}\s*)+)`)\}/g, // eslint-disable-line regexp/no-useless-non-capturing-group
              'class={/*@once*/$1}' //TODO: Tighten regex to avoid store. Allow 1 ./space?
            );
          return { code, map: null };
        },
      } as Plugin,
      solid({
        solid: { omitNestedClosingTags: true },
        babel: { plugins: [['@babel/plugin-transform-typescript', { optimizeConstEnums: true, isTSX: true }]] },
      }),
      svg({
        multipass: true,
        floatPrecision: 2,
        plugins: [
          { name: 'preset-default', params: { overrides: { convertPathData: { noSpaceAfterFlags: true }, removeViewBox: false } } }, //prettier-ignore
          { name: 'removeAttrs', params: { attrs: ['fill', 'fill-rule'] } },
          'removeDimensions',
          'removeXMLNS',
        ],
      }),
      checker({ typescript: true, overlay: false, enableBuild: true }),
      createHtmlPlugin({
        entry: '/src/index.tsx', // resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.tsx'),
        minify: {
          collapseBooleanAttributes: true, collapseWhitespace: true, decodeEntities: true, minifyCSS: true,
          minifyJS: true, minifyURLs: true, removeComments: true, removeEmptyAttributes: true,
          removeOptionalTags: true, removeRedundantAttributes: true, removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true, sortAttributes: true, useShortDoctype: true,
        }, //prettier-ignore
      }),
      optimizeCssModules(),
      sassDts({ enabledMode: ['development', 'production'], prettierFilePath: resolve(fileURLToPath(new URL('.', import.meta.url)), '.prettierrc') }), //prettier-ignore
      ENV.ANALYZE === 'true' &&
        visualizer({
          template: 'treemap',
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist/analyze.html'),
        }),
      {
        name: 'vite-plugin-remove-junk',
        generateBundle: (_options, bundle) => {
          const o: any = Object.values(bundle).find(x => (x as any)?.isEntry && 'code' in x);
          o.code = o.code
            .replace(/const ([$\w]+)=\(([$\w]+)=>\2 instanceof Error\?\2:Error\("string"==typeof \2\?\2:"Unknown error",\{cause:\2\}\)\)\(\2\);throw \1/, 'throw ""')
            .replace(/if\("POST"!==\w+\.target\.method\.toUpperCase\(\)\)throw Error\("Only POST forms are supported for Actions"\);/, "")
            .replace(/\(\(([$\w]+),[$\w]+\)=>\{if\(null==\1\)throw Error\("Make sure your app is wrapped in a <Router \/>"\);return \1\}\)\(([$\w]+\([$\w]+\))\)/, "$2")
            .replace(/\(\(([$\w]+),[$\w]+\)=>\{if\(null==\1\)throw Error\("<A> and 'use' router primitives can be only used inside a Route\."\);return \1\}\)\(([$\w]+\([$\w]+\))\)/, "$2")
            .replace(/if\(void 0===([$\w]+)\)throw Error\(\1\+" is not a valid base path"\);/, "")
            .replace(/if\(void 0===[$\w]+\)throw Error\(`Path '\$\{[$\w]+\}' is not a routable path`\);if\([$\w]+\.length>=100\)throw Error\("Too many redirects"\);/, ""); //prettier-ignore

          if (o.code.split('formnovalidate').length < 4) o.code = o.code.replace(',formnovalidate:{$:"formNoValidate",BUTTON:1,INPUT:1}', ''); //prettier-ignore
          if (o.code.split('ismap').length < 4) o.code = o.code.replace(',ismap:{$:"isMap",IMG:1}', '');
          if (o.code.split('nomodule').length < 4) o.code = o.code.replace(',nomodule:{$:"noModule",SCRIPT:1}', '');
          if (o.code.split('playsinline').length < 4) o.code = o.code.replace(',playsinline:{$:"playsInline",VIDEO:1}', ''); //prettier-ignore
          if (o.code.split('readonly').length < 4) o.code = o.code.replace(',readonly:{$:"readOnly",INPUT:1,TEXTAREA:1}', ''); //prettier-ignore
          (o.code as string).match(/=new Set\(\[["a-zA-Z,]*\]\)/g)?.forEach(set =>
            set.match(/"[a-z]{2}[a-zA-Z]+"/g)?.forEach(prop => {
              if (o.code.split(prop.replace(/["']/g, '')).length < 3)
                o.code = o.code.replace(`${prop},`, '').replace(`,${prop}`, '');
            })
          );
        },
      } as Plugin,
      {
        name: 'vite-plugin-minify-assets',
        enforce: 'post',
        writeBundle: ({ dir }) => void setTimeout(() => {
          const files = readdirSync(dir!);
          files.filter(x => x.endsWith('.json')).forEach(x => write(`${dir}/${x}`, JSON.stringify(JSON.parse(read(`${dir}/${x}`, 'utf-8'))), { encoding: 'utf-8' }))
          files.filter(x => x.endsWith('.css') || x.endsWith('.js')).forEach(x => write(`${dir}/${x}`, read(`${dir}/${x}`, 'utf-8').trim(), { encoding: 'utf-8' }))
        }), //prettier-ignore
      } as Plugin,
    ].filter(Boolean),
    resolve: { alias: { '@': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src') }, dedupe: ['solid-js'] },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
      setupFiles: [resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/__test__/setupTests.ts')],
      deps: { optimizer: { web: { exclude: ['solid-js'] } } },
      coverage: {
        reporter: ['text', 'lcov'],
        include: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
        exclude: configDefaults.coverage.exclude!.concat(['src/__test__', 'src/services/mock', 'src/index.tsx']),
      },
    },
  });
};
