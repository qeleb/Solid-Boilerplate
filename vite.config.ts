/* eslint-disable regexp/no-super-linear-backtracking */

import { readFileSync as read, readdirSync as readDir } from 'node:fs';
import { writeFile as write } from 'node:fs/promises';
import { resolve } from 'node:path';
import swcPlugin from '@rollup/plugin-swc';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { visualizer } from 'rollup-plugin-visualizer';
import { type Plugin, type UserConfig, defineConfig, loadEnv } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import { checker } from 'vite-plugin-checker';
import { createHtmlPlugin } from 'vite-plugin-html';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import solid from 'vite-plugin-solid';
import svg from 'vite-plugin-svgo';
import { type ViteUserConfig, configDefaults } from 'vitest/config';

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
        compress: { arguments: true, hoist_funs: true, keep_fargs: false, passes: 3, unsafe: true, unsafe_arrows: true, unsafe_comps: true, unsafe_proto: true }, //prettier-ignore
        format: { comments: false },
        mangle: { properties: { regex: /^(?:observers|observerSlots|comparator|updatedAt|owned|route|score|when|sourceSlots|fn|cleanups|owner|pure|suspense|inFallback|isRouting|beforeLeave|Provider|preloadRoute|outlet|utils|explicitLinks|actionBase|resolvePath|branches|routerState|parsePath|renderPath|originalPath|effects|tState|disposed|sensitivity|navigatorFactory|keyed|intent)$/ } }, //prettier-ignore
      },
      modulePreload: { polyfill: false },
    },
    css: { modules: { exportGlobals: true }, preprocessorOptions: { scss: { api: 'modern-compiler' } }, devSourcemap: true }, //prettier-ignore
    plugins: [
      patchCssModules({ exportMode: 'default', generateSourceTypes: true }),
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
        entry: '/src/index.tsx', // resolve(import.meta.dirname, 'src/index.tsx'),
        minify: {
          collapseBooleanAttributes: true, collapseWhitespace: true, decodeEntities: true, minifyCSS: true,
          minifyJS: true, minifyURLs: true, removeComments: true, removeEmptyAttributes: true,
          removeOptionalTags: true, removeRedundantAttributes: true, removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true, sortAttributes: true, useShortDoctype: true,
        }, //prettier-ignore
      }),
      optimizeCssModules({ dictionary: 'etionraldfps0gx-1chbum4v6w25k9y873zjHCONADLYqBEFGIJKMPQRSTUVWXZ_' }),
      ENV.ANALYZE === 'true' && visualizer({ open: true, gzipSize: true, brotliSize: true, filename: resolve(import.meta.dirname, 'dist/analyze.html') }), //prettier-ignore
      {
        name: 'vite-plugin-remove-junk',
        enforce: 'post',
        generateBundle(_options, bundle) {
          const o: any = Object.values(bundle).find(x => (x as any)?.isEntry && 'code' in x);
          o.code = o.code
            // Window object
            .replace(/\bwindow\.(addEventListener|alert|clearTimeout|confirm|crypto|customElements|document|fetch|history|innerHeight|innerWidth|location|origin|parent|removeEventListener|screen|screenLeft|screenTop|screenX|screenY|scrollTo|setTimeout)\b/g, '$1')
            // Optional chaining
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)&&\1\??\.([_a-zA-Z$][\w$]*)/g, '$1?.$2') // a&&a.b ==> a?.b
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)&&\1\??\.?([[(])/g, '$1?.$2') // a&&a(b) ==> a?.(b)
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)\[([\w$]+)\]&&\1\[\2\]\??\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1[$2]?.$3') // a[b]&&a[b].c ==> a[b]?.c
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)(\??)\.([_a-zA-Z$][\w$]*)&&\1\??\.\3\??\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1$2.$3?.$4') // a.b&&a.b.c ==> a?.b?.c
            .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)(\??)\.([_a-zA-Z$][\w$]*)(\??)\.?([_a-zA-Z$][\w$]*)&&\1\2\.\3\.\5\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1$2.$3$4.$5?.$6') // a.b.c&&a.b.c.d ==> a?.b?.c?.d
            // Solid
            .replace(/(?:const|let) ([$\w]+)=\(([$\w]+)=>\2 instanceof Error\?\2:Error\("string"==typeof \2\?\2:"Unknown error",\{cause:\2\}\)\)\(\2\);throw \1/, '')
            .replace(/[$\w]+\.[$\w]+\?([$\w]+\(\)):\(\)=>\{if\([$\w]+\([$\w]+\)\(\)\?\.\[0\]!==[$\w]+\)throw"Stale read from <Match>\.";return \1\}/, '$1') // Remove Keyed Match
            .replace(/\{if\(![$\w]+\([$\w]+\)\)throw"Stale read from <Show>\.";return ([$\w]+\.[$\w]+)\}/, '$1') // Remove Keyed Show
            .replace(/,[$\w]+=([$\w]+)=>`Stale read from <\$\{\1\}>\.`/, '')
            .replace(/\{if\(![$\w]+\([$\w]+\)\)throw [$\w]+\("Show"\);return\s+([$\w]+)\.([$\w]+);?\}/, '$1.$2')
            // Solid router
            .replace(/if\("POST"!==\w+\.target\.method\.toUpperCase\(\)\)throw Error\("Only POST forms are supported for Actions"\);/, "")
            .replace(/\(([$\w]+)=>\{if\(null==\1\)throw Error\("Make sure your app is wrapped in a <Router \/>"\);return \1\}\)\(([$\w]+\([$\w]+\))\)/, "$2")
            .replace(/\(\(([$\w]+),[$\w]+\)=>\{if\(null==\1\)throw Error\("Make sure your app is wrapped in a <Router \/>"\);return \1\}\)\(([$\w]+\([$\w]+\))\)/, "$2")
            .replace(/\(\(([$\w]+),[$\w]+\)=>\{if\(null==\1\)throw Error\("<A> and 'use' router primitives can be only used inside a Route\."\);return \1\}\)\(([$\w]+\([$\w]+\))\)/, "$2")
            .replace(/if\(void 0===([$\w]+)\)throw Error\(\1\+" is not a valid base path"\);/, "")
            .replace(/if\(void 0===[$\w]+\)throw Error\(`Path '\$\{[$\w]+\}' is not a routable path`\);if\([$\w]+\.length>=100\)throw Error\("Too many redirects"\);/, "")
            .trim(); //prettier-ignore

          // Remove Solid junk
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

          // Trim whitespace
          (Object.values(bundle).filter(x => x.type === "chunk" && !x.isEntry) as any).forEach( x => (x.code = x.code.trim())); //prettier-ignore
          (Object.values(bundle).filter(x => x.fileName?.includes('.css') && 'source' in x) as any).forEach( x => (x.source = x.source.trim())); //prettier-ignore
        },
        writeBundle: async ({ dir }) => void Promise.all(readDir(dir!).filter(f => f.endsWith('.json')).map(f => write(`${dir}/${f}`, JSON.stringify(JSON.parse(read(`${dir}/${f}`, 'utf-8'))), 'utf-8'))), //prettier-ignore
      } as Plugin,
      swcPlugin({
        include: /\.js$/,
        swc: {
          minify: true,
          jsc: { minify: { compress: { passes: 3, unsafe_methods: true, unsafe_proto: true, unsafe_regexp: true, unsafe_symbols: true } } }, //prettier-ignore
        },
      }),
    ].filter(Boolean),
    resolve: { alias: { '@': resolve(import.meta.dirname, 'src') } },
    test: {
      globals: true,
      include: ['src/**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
      setupFiles: [resolve(import.meta.dirname, 'src/__test__/setupTests.ts')],
      coverage: {
        reporter: ['text', 'lcov'],
        include: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
        exclude: configDefaults.coverage.exclude!.concat(['**/__test__/', 'src/services/mock', 'src/index.tsx']),
        clean: false,
      },
      poolOptions: { threads: { useAtomics: true } },
    },
  } as UserConfig & { test: ViteUserConfig['test'] });
};
