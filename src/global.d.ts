/// <reference types="vitest" />
/// <reference types="vite/client" />

/* Environment Variables */
interface ImportMetaEnv {
  MODE: 'production' | 'development' | 'test';
  TEST: true | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
