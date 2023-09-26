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

/* Utilities */
type SolidChangeEvent<T> = Event & { currentTarget: T; target: T };
type SolidMouseEvent<T> = MouseEvent & { currentTarget: T; target: Element };
type SolidKeyboardEvent<T> = KeyboardEvent & { currentTarget: T; target: Element };
type SolidClipboardEvent<T> = ClipboardEvent & { currentTarget: T; target: Element };
