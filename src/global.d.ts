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
type SolidEvent<C, T = Element> = Event & { currentTarget: C; target: T };
type SolidClipboardEvent<C, T = Element> = ClipboardEvent & { currentTarget: C; target: T };
type SolidFocusEvent<C, T = Element> = FocusEvent & { currentTarget: C; target: T };
type SolidKeyboardEvent<C, T = Element> = KeyboardEvent & { currentTarget: C; target: T };
type SolidMouseEvent<C, T = Element> = MouseEvent & { currentTarget: C; target: T };
