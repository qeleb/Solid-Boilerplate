/* eslint-disable regexp/no-super-linear-backtracking */

import { readFileSync as read, readdirSync, writeFileSync as write } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { visualizer } from 'rollup-plugin-visualizer';
import { type Plugin, defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';
import { createHtmlPlugin } from 'vite-plugin-html';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import sassDts from 'vite-plugin-sass-dts';
import solid from 'vite-plugin-solid';
import svg from 'vite-plugin-svgo';
import { configDefaults } from 'vitest/config';

const path_root = fileURLToPath(new URL('.', import.meta.url));

export default ({ mode }: { mode: 'production' | 'development' | 'test' }) => {
  const ENV = { ...process.env, ...loadEnv(mode, 'env') };

  return defineConfig({
    envDir: 'env',
    build: {
      target: browserslistToEsbuild(),
      rollupOptions: {
        output: { entryFileNames: '[hash:6].js', chunkFileNames: '[hash:6].js', assetFileNames: '[hash:6][extname]' },
        treeshake: { tryCatchDeoptimization: false },
      },
      minify: 'terser',
      cssMinify: 'lightningcss',
      terserOptions: {
        ecma: 2020,
        compress: { arguments: true, hoist_funs: true, passes: 4, unsafe: true, unsafe_arrows: true, unsafe_comps: true, unsafe_proto: true, unsafe_symbols: true }, //prettier-ignore
        format: { comments: false, wrap_func_args: false },
        mangle: { properties: { regex: /^(?:observers|observerSlots|comparator|updatedAt|owned|route|score|when|sourceSlots|fn|cleanups|owner|pure|suspense|inFallback|isRouting|beforeLeave|Provider|preloadRoute|outlet|utils|explicitLinks|actionBase|resolvePath|branches|routerState|parsePath|renderPath|originalPath|effects|tState|disposed|sensitivity|navigatorFactory|keyed|intent)$/ } }, //prettier-ignore
      },
      modulePreload: { polyfill: false }, // Delete this line if outputting more than 1 chunk
    },
    css: { modules: { exportGlobals: true }, preprocessorOptions: { scss: { api: 'modern-compiler' } }, devSourcemap: true }, //prettier-ignore
    plugins: [
      {
        name: 'vite-plugin-optimize-solid-css-modules',
        enforce: 'pre',
        transform(code, id) {
          if (/\.[mc]?[jt]sx$/.test(id))
            code = code.replace(
              /class=\{([a-zA-Z '"`[\].-]+|(?:`(?:\$\{[a-zA-Z '"`[\].-]+\}\s*)+)`)\}/g, // eslint-disable-line regexp/no-useless-non-capturing-group
              'class={/*@once*/$1}' //TODO: Tighten regex to avoid store. Allow 1 ./space?
            );
          return { code, map: null };
        },
      } as Plugin,
      solid({
        solid: { omitNestedClosingTags: true },
        babel: {
          plugins: [
            ['@babel/plugin-transform-typescript', { optimizeConstEnums: true, isTSX: true }],
            mode === 'production' && ['react-remove-properties', { properties: ['data-testid', 'data-test-id'] }],
          ].filter(Boolean) as any,
        },
      }),
      svg({
        multipass: true,
        floatPrecision: 2,
        plugins: [
          { name: 'preset-default', params: { overrides: { convertPathData: { noSpaceAfterFlags: true }, mergePaths: { force: true, noSpaceAfterFlags: true } } } }, //prettier-ignore
          'removeDimensions',
          'removeXMLNS',
        ],
      }),
      checker({ typescript: true, overlay: false, enableBuild: true }),
      createHtmlPlugin({
        entry: '/src/index.tsx', // resolve(path_root, 'src/index.tsx'),
        minify: {
          collapseBooleanAttributes: true, collapseWhitespace: true, decodeEntities: true, minifyCSS: true,
          minifyJS: true, minifyURLs: true, removeComments: true, removeEmptyAttributes: true,
          removeOptionalTags: true, removeRedundantAttributes: true, removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true, sortAttributes: true, useShortDoctype: true,
        }, //prettier-ignore
      }),
      optimizeCssModules({ dictionary: 'etionraldfps0gx-1chbum4v6w25k9y873zjHCONADLYqBEFGIJKMPQRSTUVWXZ_' }),
      sassDts({ enabledMode: ['development', 'production'], esmExport: true, prettierFilePath: resolve(path_root, '.prettierrc') }), //prettier-ignore
      ENV.ANALYZE === 'true' &&
        visualizer({
          template: 'treemap',
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: resolve(path_root, 'dist/analyze.html'),
        }),
      {
        name: 'vite-plugin-remove-junk',
        generateBundle(_options, bundle) {
          const o: any = Object.values(bundle).find(x => (x as any)?.isEntry && 'code' in x);
          o.code = o.code
            // Window object
            .replace(/window\.(addEventListener|alert|clearTimeout|confirm|crypto|customElements|document|fetch|history|innerHeight|innerWidth|location|origin|parent|removeEventListener|screen|screenLeft|screenTop|screenX|screenY|scrollTo|setTimeout)/g, '$1') // eslint-disable-line regexp/no-dupe-disjunctions
            // Optional chaining
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)&&\1\??\.([_a-zA-Z$][\w$]*)/g, '$1?.$2') // a&&b ==> a?.b
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)&&\1\??\.?([[(])/g, '$1?.$2') // a&&a(b) ==> a?.(b)
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)\[([_a-zA-Z$][\w$]*)\]&&\1\[\2\]\??\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1[$2]?.$3') // a[b]&&a[b].c ==> a[b]?.c
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)(\??)\.([_a-zA-Z$][\w$]*)&&\1\??\.\3\??\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1$2.$3?.$4') // a.b&&a.b.c ==> a?.b?.c
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)(\??)\.([_a-zA-Z$][\w$]*)(\??)\.?([_a-zA-Z$][\w$]*)&&\1\2\.\3\.\5\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1$2.$3$4.$5?.$6') // a.b.c&&a.b.c.d ==> a?.b?.c?.d
            // Solid
            .replace(/(?:const|let) ([$\w]+)=\(([$\w]+)=>\2 instanceof Error\?\2:Error\("string"==typeof \2\?\2:"Unknown error",\{cause:\2\}\)\)\(\2\);throw \1/, '')
            .replace(/,[$\w]+=([$\w]+)=>`Stale read from <\$\{\1\}>\.`/, '')
            .replace(/\{if\(![$\w]+\([$\w]+\)\)throw [$\w]+\("Show"\);return\s+([$\w]+)\.([$\w]+);?\}/, '$1.$2')
            // Solid router
            .replace(/if\("POST"!==\w+\.target\.method\.toUpperCase\(\)\)throw Error\("Only POST forms are supported for Actions"\);/, "")
            .replace(/\(([$\w]+)=>\{if\(null==\1\)throw Error\("Make sure your app is wrapped in a <Router \/>"\);return \1\}\)\(([$\w]+\([$\w]+\))\)/, "$2")
            .replace(/\(\(([$\w]+),[$\w]+\)=>\{if\(null==\1\)throw Error\("Make sure your app is wrapped in a <Router \/>"\);return \1\}\)\(([$\w]+\([$\w]+\))\)/, "$2")
            .replace(/\(\(([$\w]+),[$\w]+\)=>\{if\(null==\1\)throw Error\("<A> and 'use' router primitives can be only used inside a Route\."\);return \1\}\)\(([$\w]+\([$\w]+\))\)/, "$2")
            .replace(/if\(void 0===([$\w]+)\)throw Error\(\1\+" is not a valid base path"\);/, "")
            .replace(/if\(void 0===[$\w]+\)throw Error\(`Path '\$\{[$\w]+\}' is not a routable path`\);if\([$\w]+\.length>=100\)throw Error\("Too many redirects"\);/, ""); //prettier-ignore
          if (o.code.split('formnovalidate').length < 4) o.code = o.code.replace(',formnovalidate:{$:"formNoValidate",BUTTON:1,INPUT:1}', ''); //prettier-ignore
          if (o.code.split('ismap').length < 4) o.code = o.code.replace(',ismap:{$:"isMap",IMG:1}', '');
          if (o.code.split('nomodule').length < 4) o.code = o.code.replace(',nomodule:{$:"noModule",SCRIPT:1}', '');
          if (o.code.split('playsinline').length < 4) o.code = o.code.replace(',playsinline:{$:"playsInline",VIDEO:1}', ''); //prettier-ignore
          if (o.code.split('readonly').length < 4) o.code = o.code.replace(',readonly:{$:"readOnly",INPUT:1,TEXTAREA:1}', ''); //prettier-ignore
          (o.code as string).match(/(?<==new Set\(\[)(?:"[a-z]{2}[a-zA-Z]{2,}",?)+\]\)/g)?.forEach(set =>
            set.match(/"[a-z]{2}[a-zA-Z]{2,}"/g)?.forEach(prop => {
              if (o.code.split(prop.replace(/["']/g, '')).length < 3)
                o.code = o.code.replace(`${prop},`, '').replace(`,${prop}`, '');
            })
          );
        },
      } as Plugin,
      {
        name: 'vite-plugin-minify-assets',
        enforce: 'post',
        writeBundle({ dir }) {
          const files = readdirSync(dir!);
          files.filter(x => x.endsWith('.json')).forEach(x => write(`${dir}/${x}`, JSON.stringify(JSON.parse(read(`${dir}/${x}`, 'utf-8'))), 'utf-8'))
          files.filter(x => x.endsWith('.css') || x.endsWith('.js')).forEach(x => write(`${dir}/${x}`, read(`${dir}/${x}`, 'utf-8').trim(), 'utf-8'))
        }, //prettier-ignore
      } as Plugin,
    ].filter(Boolean),
    resolve: { alias: { '@': resolve(path_root, 'src') } },
    test: {
      globals: true,
      include: ['src/**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
      setupFiles: [resolve(path_root, 'src/__test__/setupTests.ts')],
      coverage: {
        reporter: ['text', 'lcov'],
        include: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
        exclude: configDefaults.coverage.exclude!.concat(['**/__test__/', 'src/services/mock', 'src/index.tsx']),
        clean: false,
      },
      poolOptions: { threads: { useAtomics: true } },
    },
  });
};
