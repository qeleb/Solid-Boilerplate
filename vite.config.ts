/* eslint-disable regexp/no-super-linear-backtracking */

import { readFileSync as read, readdirSync as readDir } from 'node:fs';
import { writeFile as write } from 'node:fs/promises';
import { resolve } from 'node:path';
import { minifySync } from '@swc/core';
import { minifySync as minifyHTML } from '@swc/html';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import postcss from 'postcss';
import postcssSortMediaQueries from 'postcss-sort-media-queries';
import { visualizer } from 'rollup-plugin-visualizer';
import { type Plugin, defineConfig, loadEnv } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import { checker } from 'vite-plugin-checker';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import solid from 'vite-plugin-solid';
import svg from 'vite-plugin-svgo';
import { configDefaults } from 'vitest/config';
import { version } from './package.json';

export default ({ mode }: { mode: 'production' | 'development' | 'test' }) => {
  const ENV = { ...process.env, ...loadEnv(mode, 'env') };

  return defineConfig({
    envDir: 'env',
    build: {
      target: browserslistToEsbuild(),
      rollupOptions: {
        output: { entryFileNames: '[hash:6].js', chunkFileNames: '[hash:6].js', assetFileNames: '[hash:6][extname]' },
        treeshake: { propertyReadSideEffects: false, tryCatchDeoptimization: false },
      },
      minify: 'terser',
      cssMinify: 'lightningcss',
      terserOptions: {
        ecma: 2020,
        compress: { arguments: true, hoist_funs: true, keep_fargs: false, passes: 3, unsafe: true, unsafe_arrows: true, unsafe_comps: true, unsafe_proto: true, unsafe_regexp: true, unsafe_symbols: true }, //prettier-ignore
        format: { comments: false },
        mangle: { properties: { regex: /^(?:observers|observerSlots|comparator|updatedAt|owned|route|score|sourceSlots|fn|cleanups|owner|pure|suspense|inFallback|isRouting|beforeLeave|Provider|preloadRoute|outlet|utils|explicitLinks|actionBase|resolvePath|branches|routerState|parsePath|renderPath|originalPath|tState|disposed|sensitivity|navigatorFactory|keyed|intent)$/ } }, //prettier-ignore
      },
      modulePreload: { polyfill: false },
    },
    css: { modules: { exportGlobals: true }, devSourcemap: true },
    plugins: [
      patchCssModules({ exportMode: 'default', generateSourceTypes: true }),
      {
        name: 'vite-plugin-optimize-solid-css-modules',
        enforce: 'pre',
        transform: {
          handler: code => ({
            code: code.replace(/class=\{([a-zA-Z "'`[\].-]+|`(?:\$\{[a-zA-Z "'`[\].-]+\}\s*)+`)\}/g, 'class={/*@once*/$1}') /*TODO: Use classes statically & support classList*/, //prettier-ignore
            map: null,
          }),
          filter: { id: /\.[mc]?[jt]sx$/ },
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
      optimizeCssModules({ dictionary: 'etairon-lspdx0vc1bghufmw2ky45836z79jYHOZBEFGCNAKDLXqIJMPQRSTUVW_' }),
      ENV.ANALYZE === 'true' && visualizer({ open: true, gzipSize: true, brotliSize: true, filename: resolve(import.meta.dirname, 'dist/analyze.html') }), //prettier-ignore
      {
        name: 'vite-plugin-remove-junk',
        enforce: 'post',
        generateBundle(_options, bundle) {
          Object.values(bundle)
            .filter(x => x.type === 'chunk' && 'code' in x)
            .forEach(o => {
              o.code = o.code
                // Globals
                .replace(/\bglobalThis\b/g, 'window') // globalThis -> window
                .replace(/\bwindow\.(CustomStateSet|ElementInternals|addEventListener|clearInterval|clearTimeout|crypto|document|fetch|getComputedStyle|location|removeEventListener|requestAnimationFrame|setInterval|setTimeout)/g, '$1')
                .replace(/\bclearInterval\b/g, 'clearTimeout') // clearInterval -> clearTimeout
                .replaceAll('"undefined"!=typeof window', 'true') // Window is defined
                .replace(/([\w$]+)\[\1\.length(-\d+)\]/g, '$1.at($2)') // Array.at, String.at
                .replaceAll('(new Date).getTime', 'Date.now') // Date.now
                // Unused catch binding
                // .replace(/catch\(([\w$])+\)(\{(?:(?!\b\1\b)[^}{])*\})/g, "catch$2") // Fails on unmatched }
                // Optional chaining
                .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|\|\||[\w$ ]=)([_a-zA-Z$][\w$]*)&&\1\??\.([_a-zA-Z$][\w$]*)/g, '$1?.$2') // a&&a.b ==> a?.b
                .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)&&\1\??\.?([[(])/g, '$1?.$2') // a&&a(b) ==> a?.(b)
                .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)\[([\w$]+)\]&&\1\[\2\]\??\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1[$2]?.$3') // a[b]&&a[b].c ==> a[b]?.c
                .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)(\??)\.([_a-zA-Z$][\w$]*)&&\1\??\.\3\??\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1$2.$3?.$4') // a.b&&a.b.c ==> a?.b?.c
                .replace(/(?<=[;:{}(),[\]]|return[ !]|throw[ !]|=>|&&|[\w$ ]=)([_a-zA-Z$][\w$]*)(\??)\.([_a-zA-Z$][\w$]*)(\??)\.?([_a-zA-Z$][\w$]*)&&\1\2\.\3\.\5\.?([_a-zA-Z$][\w$]*|\(|\[)/g, '$1$2.$3$4.$5?.$6') // a.b.c&&a.b.c.d ==> a?.b?.c?.d
                // Arrows
                // .replace(/function ([\w$]+)\(([\w$=, ]*)\)\{return((?:(?!this)[^,}{])*(?:\{(?:(?!this)[^}{])*\}(?:(?!this)[^}{])*)*)\}/g, 'let $1=($2)=>$3;')
                // Remove closing tag </svg> from SVG
                .replace(/><\/svg>(["']\))/g, '>$1')
                // Solid
                .replace(/(?:const|let) ([\w$]+)=\(([\w$]+)=>\2 instanceof Error\?\2:Error\("string"==typeof \2\?\2:"Unknown error",\{cause:\2\}\)\)\(\2\);throw \1/, '')
                .replace(/[\w$]+\.[\w$]+\?([\w$]+\(\)):\(\)=>\{if\([\w$]+\([\w$]+\)\(\)\?\.\[0\]!==[\w$]+\)throw"Stale read from <Match>\.";return \1\}/, '$1') // Remove Keyed Match
                .replace(/\{if\(![\w$]+\([\w$]+\)\)throw"Stale read from <Show>\.";return ([\w$]+(?:\.[\w$]+|\(\)))\}/, '$1') // Remove Keyed Show
                // .replace(/if\(([\w$]+)\.tOwned\)\{for\(([\w$]+)=\1\.tOwned\.length-1;\2>=0;\2--\)[\w$]+\(\1\.tOwned\[\2\]\);delete \1\.tOwned\}/, '') // v1.8.23
                // .replace(/else if\((["'])oncapture:\1===([\w$]+)\.slice\(0,10\)\)\{(?:const|let) ([\w$]+)=\2\.slice\(10\);([\w$]+)&&([\w$]+)\.removeEventListener\(\3,\4,!0\),([\w$]+)&&\5\.addEventListener\(\3,\6,!0\)\}/, '') // Remove runtime on:capture
                // Solid router
                .replace(/if\("POST"!==\w+\.target\.method\.toUpperCase\(\)\)throw Error\("Only POST forms are supported for Actions"\);/, "")
                .replace(/\(([\w$]+)=>\{if\(null==\1\)throw Error\("Make sure your app is wrapped in a <Router \/>"\);return \1\}\)\(([\w$]+\([\w$]+\))\)/, "$2")
                .replace(/\(\(([\w$]+),[\w$]+\)=>\{if\(null==\1\)throw Error\("Make sure your app is wrapped in a <Router \/>"\);return \1\}\)\(([\w$]+\([\w$]+\))\)/, "$2")
                .replace(/\(\(([\w$]+),[\w$]+\)=>\{if\(null==\1\)throw Error\("<A> and 'use' router primitives can be only used inside a Route\."\);return \1\}\)\(([\w$]+\([\w$]+\))\)/, "$2")
                .replace(/if\(void 0===([\w$]+)\)throw Error\(\1\+" is not a valid base path"\);/, "")
                .replace(/if\(void 0===[\w$]+\)throw Error\(`Path '\$\{[\w$]+\}' is not a routable path`\);if\([\w$]+\.length>=100\)throw Error\("Too many redirects"\);/, ""); //prettier-ignore

              // Remove Solid junk
              if ((o.code.match(/\bform[Nn]o[Vv]alidate\b/g)?.length ?? 0) < 5) o.code = o.code.replace(/,formnovalidate:\{\$:"formNoValidate",[\w$]+:1,INPUT:1\}/g, ''); //prettier-ignore
              if ((o.code.match(/\bno[Vv]alidate\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',novalidate:{$:"noValidate",FORM:1}', ''); //prettier-ignore
              if ((o.code.match(/\bis[Mm]ap\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',ismap:{$:"isMap",IMG:1}', ''); //prettier-ignore
              if ((o.code.match(/\bno[Mm]odule\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',nomodule:{$:"noModule",SCRIPT:1}', ''); //prettier-ignore
              if ((o.code.match(/\bplays[Ii]nline\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',playsinline:{$:"playsInline",VIDEO:1}', ''); //prettier-ignore
              if ((o.code.match(/\bread[Oo]nly\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',readonly:{$:"readOnly",INPUT:1,TEXTAREA:1}', ''); //prettier-ignore
              if ((o.code.match(/\bad[Aa]uction[Hh]eaders\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',adauctionheaders:{$:"adAuctionHeaders",IFRAME:1}', ''); //prettier-ignore
              if ((o.code.match(/\ballow[Ff]ullscreen\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',allowfullscreen:{$:"allowFullscreen",IFRAME:1}', ''); //prettier-ignore
              if ((o.code.match(/\bbrowsing[Tt]opics\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',browsingtopics:{$:"browsingTopics",IMG:1}', ''); //prettier-ignore
              if ((o.code.match(/\bdefault[Cc]hecked\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',defaultchecked:{$:"defaultChecked",INPUT:1}', ''); //prettier-ignore
              if ((o.code.match(/\bdefault[Mm]uted\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',defaultmuted:{$:"defaultMuted",AUDIO:1,VIDEO:1}', ''); //prettier-ignore
              if ((o.code.match(/\bdefault[Ss]elected\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',defaultselected:{$:"defaultSelected",OPTION:1}', ''); //prettier-ignore
              if ((o.code.match(/\bdisable[Pp]icture[Ii]n[Pp]icture\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',disablepictureinpicture:{$:"disablePictureInPicture",VIDEO:1}', ''); //prettier-ignore
              if ((o.code.match(/\bdisable[Rr]emote[Pp]layback\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',disableremoteplayback:{$:"disableRemotePlayback",AUDIO:1,VIDEO:1}', ''); //prettier-ignore
              if ((o.code.match(/\bpreserves[Pp]itch\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',preservespitch:{$:"preservesPitch",AUDIO:1,VIDEO:1}', ''); //prettier-ignore
              if ((o.code.match(/\bshadow[Rr]oot[Cc]lonable\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',shadowrootclonable:{$:"shadowRootClonable",TEMPLATE:1}', ''); //prettier-ignore
              if ((o.code.match(/\bshadow[Rr]oot[Dd]elegates[Ff]ocus\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',shadowrootdelegatesfocus:{$:"shadowRootDelegatesFocus",TEMPLATE:1}', ''); //prettier-ignore
              if ((o.code.match(/\bshadow[Rr]oot[Ss]erializable\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',shadowrootserializable:{$:"shadowRootSerializable",TEMPLATE:1}', ''); //prettier-ignore
              if ((o.code.match(/\bshared[Ss]torage[Ww]ritable\b/g)?.length ?? 0) < 5) o.code = o.code.replace(',sharedstoragewritable:{$:"sharedStorageWritable",IFRAME:1,IMG:1}', ''); //prettier-ignore
              (o.code as string).match(/(?<==new Set\(\[)(?:"[a-z]{2}[a-zA-Z]{2,}",?)+\]\)/g)?.forEach(set =>
                set.match(/"[a-z]{2}[a-zA-Z]{2,}"/g)?.forEach(prop => {
                  if (o.code.split(prop.replace(/["']/g, '')).length < 3)
                    o.code = o.code.replace(`${prop},`, '').replace(`,${prop}`, '');
                })
              );

              o.code = minifySync(o.code, { module: true, ecma: 2020, compress: { passes: 0, unsafe_methods: true }, format: { preamble: `//${version}\n` }, mangle: false }).code; //prettier-ignore
            });

          Object.values(bundle)
            .filter(x => x.fileName?.includes('.css') && 'source' in x)
            .forEach((css: any) => postcss([postcssSortMediaQueries()]).process(css.source).then(result => (css.source = result.css.trim()))); //prettier-ignore
        },
        writeBundle: ({ dir }) =>
          void Promise.all(
            readDir(dir!).map(f =>
              f.endsWith('.html')
                ? write(`${dir}/${f}`, minifyHTML(read(`${dir}/${f}`), { collapseWhitespaces: 'smart', minifyCss: f === 'index.html' }).code, 'utf8') //prettier-ignore
                : f.endsWith('.json')
                  ? write(`${dir}/${f}`, JSON.stringify(JSON.parse(read(`${dir}/${f}`, 'utf8'))), 'utf8')
                  : undefined
            )
          ),
      } as Plugin,
    ].filter(Boolean),
    resolve: { alias: { '@': resolve(import.meta.dirname, 'src') } },
    test: {
      globals: true,
      include: ['src/**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
      setupFiles: [resolve(import.meta.dirname, 'src/__test__/setupTests.ts')],
      clearMocks: true,
      unstubEnvs: true,
      unstubGlobals: true,
      coverage: {
        reporter: ['text', 'lcov'],
        include: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
        exclude: [...configDefaults.coverage.exclude!, '**/__test__/', 'src/index.tsx', 'src/services/mock'],
        clean: false,
      },
      pool: 'vmThreads',
    },
  });
};
