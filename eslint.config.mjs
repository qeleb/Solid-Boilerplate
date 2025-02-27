import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import * as regexp from 'eslint-plugin-regexp';
import solid from 'eslint-plugin-solid';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  {
    ignores: ['dist/*', 'coverage/*', 'public/*.js'],
    plugins: { '@typescript-eslint': tseslint.plugin, prettier, '@vitest': vitest, 'testing-library': testingLibrary },
    extends: [prettierRecommended],
    languageOptions: { globals: globals.browser, parser: tseslint.parser },
    rules: { 'prettier/prettier': 'warn' },
  },
  {
    /* TypeScript/JavaScript */
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    ignores: ['dist/*', 'coverage/*', 'public/*.js'],
    extends: [js.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic, importPlugin.flatConfigs.warnings, regexp.configs['flat/recommended']], //prettier-ignore
    rules: {
      'array-callback-return': 'warn',
      'no-cond-assign': ['warn', 'except-parens'],
      'no-control-regex': 'warn',
      'no-ex-assign': 'warn',
      'no-fallthrough': 'warn',
      'no-self-assign': 'warn',
      'no-self-compare': 'warn',
      'no-sparse-arrays': 'warn',
      'no-unreachable': 'warn',
      'no-unreachable-loop': 'warn',
      'no-unused-private-class-members': 'warn',
      'consistent-return': 'error',
      eqeqeq: ['warn', 'smart'],
      'logical-assignment-operators': ['warn', 'always', { enforceForIfStatements: true }],
      'no-caller': 'warn',
      'no-else-return': ['warn', { allowElseIf: false }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-static-block': 'warn',
      'no-eval': 'warn',
      'no-extend-native': 'warn',
      'no-extra-bind': 'warn',
      'no-extra-boolean-cast': ['warn', { enforceForLogicalOperands: true }],
      'no-extra-label': 'warn',
      'no-global-assign': 'warn',
      'no-iterator': 'warn',
      'no-label-var': 'warn',
      'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
      'no-lone-blocks': 'warn',
      'no-lonely-if': 'warn',
      'no-loop-func': 'warn',
      'no-mixed-operators': [
        'warn',
        {
          groups: [
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof'],
          ],
          allowSamePrecedence: false,
        },
      ],
      'no-new-func': 'warn',
      'no-new-object': 'warn',
      'no-new-wrappers': 'warn',
      'no-octal-escape': 'warn',
      'no-regex-spaces': 'warn',
      'no-restricted-globals': ['error', 'event'],
      'no-restricted-properties': [
        'error',
        { object: 'require', property: 'ensure', message: 'Use import() instead' },
        { object: 'System', property: 'import', message: 'Use import() instead' },
      ],
      'no-restricted-syntax': ['warn', 'WithStatement'],
      'no-script-url': 'warn',
      'no-sequences': 'warn',
      'no-shadow-restricted-names': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-unused-labels': 'warn',
      'no-useless-call': 'warn',
      'no-useless-catch': 'warn',
      'no-useless-computed-key': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-rename': ['warn', { ignoreDestructuring: false, ignoreExport: false }],
      'no-useless-return': 'warn',
      'no-with': 'warn',
      'object-shorthand': 'warn',
      'operator-assignment': 'warn',
      'prefer-exponentiation-operator': 'warn',
      'prefer-numeric-literals': 'warn',
      'prefer-object-spread': 'warn',
      'prefer-spread': 'warn',
      'prefer-template': 'warn',
      'require-yield': 'warn',
      'spaced-comment': ['warn', 'always', { markers: ['/', 'TODO:', 'NOTE:', 'FIXME:'], exceptions: ['prettier-ignore'] }], //prettier-ignore
      strict: ['warn', 'never'],
      'dot-location': ['warn', 'property'],
      'new-parens': 'warn',
      'no-whitespace-before-property': 'warn',
      'rest-spread-spacing': ['warn', 'never'],
      'unicode-bom': ['warn', 'never'],
      '@typescript-eslint/adjacent-overload-signatures': 'warn',
      '@typescript-eslint/consistent-generic-constructors': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'inline-type-imports', disallowTypeAnnotations: false }], //prettier-ignore
      '@typescript-eslint/no-duplicate-enum-values': 'warn',
      '@typescript-eslint/no-extra-non-null-assertion': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-this-alias': ['warn', { allowedNames: ['self'] }],
      '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'warn',
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
      '@typescript-eslint/no-unsafe-declaration-merging': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }], //prettier-ignore
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      'import/no-empty-named-blocks': 'warn',
      'import/no-named-as-default-member': 'off',
      'import/no-useless-path-segments': 'warn',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/order': ['warn', { alphabetize: { order: 'asc' }, named: true, 'newlines-between': 'never' }],
      'regexp/prefer-quantifier': 'warn',
      'regexp/prefer-regexp-test': 'warn',

      /* Exceptions to make TypeScript less strict */
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-confusing-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // Please don't do this though
    },
  },
  {
    /* TypeScript/JavaScript in src/ */
    files: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [solid.configs['flat/typescript']],
    languageOptions: { parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true }, projectService: true, tsconfigRootDir: import.meta.dirname } }, //prettier-ignore
    rules: {
      'dot-notation': 'off',
      'no-implied-eval': 'off',
      'require-await': 'off',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-exports': ['warn', { fixMixedExportsWithInlineTypeSpecifier: true }],
      '@typescript-eslint/dot-notation': 'warn',
      '@typescript-eslint/no-array-delete': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/no-duplicate-type-constituents': 'warn',
      '@typescript-eslint/no-empty-object-type': ['warn', { allowInterfaces: 'with-single-extends', allowObjectTypes: 'always' }], //prettier-ignore
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'warn',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/no-redeclare': 'warn',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
      '@typescript-eslint/no-unnecessary-qualifier': 'warn',
      '@typescript-eslint/no-unnecessary-template-expression': 'warn',
      '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
      '@typescript-eslint/no-unsafe-unary-minus': 'warn',
      '@typescript-eslint/no-use-before-define': ['warn', { functions: false, classes: false, variables: false, typedefs: false }], //prettier-ignore
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-unused-expressions': ['warn', { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }], //prettier-ignore
      '@typescript-eslint/non-nullable-type-assertion-style': 'warn',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/prefer-promise-reject-errors': 'warn',
      '@typescript-eslint/prefer-regexp-exec': 'warn',
      '@typescript-eslint/prefer-string-starts-ends-with': ['warn', { allowSingleElementEquality: 'always' }],
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/return-await': ['warn', 'in-try-catch'],
      // '@typescript-eslint/strict-boolean-expressions': ['warn', { allowNullableBoolean: true, allowNullableString: true, allowNullableNumber: true }], //prettier-ignore
      'solid/reactivity': 'off',
      'solid/no-innerhtml': 'off',
      'solid/style-prop': ['warn', { allowString: true }],
    },
  },
  {
    /* Declaration & Config */
    files: ['**/*.d.ts', '**/*.config.*', '*rc.cjs'],
    languageOptions: { globals: { ...globals.browser, ...globals.commonjs, ...globals.node } },
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
  {
    /* Test */
    files: ['**/*.{test,spec}.*'],
    settings: { vitest: { typecheck: true } },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@vitest/consistent-test-filename': ['warn', { pattern: '\\.test\\.tsx?$' }],
      '@vitest/consistent-test-it': ['warn', { fn: 'it' }],
      '@vitest/expect-expect': 'error',
      '@vitest/max-nested-describe': ['error', { max: 3 }],
      '@vitest/no-alias-methods': 'warn',
      '@vitest/no-conditional-expect': 'warn',
      // '@vitest/no-conditional-tests': 'error', // broken
      '@vitest/no-disabled-tests': 'warn',
      '@vitest/no-duplicate-hooks': 'error',
      '@vitest/no-focused-tests': 'warn',
      '@vitest/no-identical-title': 'error',
      '@vitest/no-standalone-expect': 'warn',
      '@vitest/no-test-return-statement': 'warn',
      '@vitest/padding-around-after-all-blocks': 'warn',
      '@vitest/padding-around-after-each-blocks': 'warn',
      '@vitest/padding-around-before-all-blocks': 'warn',
      '@vitest/padding-around-before-each-blocks': 'warn',
      '@vitest/padding-around-describe-blocks': 'warn',
      '@vitest/padding-around-test-blocks': 'warn',
      '@vitest/prefer-comparison-matcher': 'warn',
      '@vitest/prefer-equality-matcher': 'warn',
      '@vitest/prefer-lowercase-title': 'warn',
      '@vitest/prefer-hooks-in-order': 'warn',
      '@vitest/prefer-hooks-on-top': 'warn',
      '@vitest/prefer-mock-promise-shorthand': 'warn',
      '@vitest/prefer-to-be': 'warn',
      '@vitest/prefer-to-contain': 'warn',
      '@vitest/prefer-to-have-length': 'warn',
      '@vitest/valid-describe-callback': 'error',
      '@vitest/valid-title': 'warn',
      'testing-library/await-async-queries': 'error',
      'testing-library/await-async-utils': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/no-container': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-node-access': 'warn',
      'testing-library/no-promise-in-fire-event': 'error',
      'testing-library/no-render-in-lifecycle': 'warn',
      'testing-library/no-wait-for-multiple-assertions': 'error',
      'testing-library/no-wait-for-side-effects': 'error',
      'testing-library/no-wait-for-snapshot': 'error',
      'testing-library/prefer-find-by': 'error',
      'testing-library/prefer-presence-queries': 'error',
      'testing-library/prefer-query-by-disappearance': 'error',
      'testing-library/prefer-screen-queries': 'error',
      'testing-library/render-result-naming-convention': 'warn',
    },
  },
]);
