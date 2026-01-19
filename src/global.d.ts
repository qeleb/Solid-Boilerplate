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
type Nullable<T> = { [K in keyof T]: T[K] | null };

type DeepKeys<T extends object> = {
  [K in keyof T]: T[K] extends object & { length?: never } ? DeepKeys<T[K]> | never : K;
}[keyof T];

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

type SolidEvent<C, T = Element> = Event & { currentTarget: C; target: T };
type SolidClipboardEvent<C, T = Element> = ClipboardEvent & { currentTarget: C; target: T };
type SolidFocusEvent<C, T = Element> = FocusEvent & { currentTarget: C; target: T };
type SolidKeyboardEvent<C, T = Element> = KeyboardEvent & { currentTarget: C; target: T };
type SolidPointerEvent<C, T = Element> = PointerEvent & { currentTarget: C; target: T };
type SolidMouseEvent<C, T = Element> = MouseEvent & { currentTarget: C; target: T };
