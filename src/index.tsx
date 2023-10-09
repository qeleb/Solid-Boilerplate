import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import { App } from '@/App';

// Extend Solid JSX
declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Props<T> = { [K in keyof T as `prop:${string & K}`]?: T[K] };
    type ElementProps<T> = { [K in keyof T]: Props<T[K]> & HTMLAttributes<T[K]> };
    interface IntrinsicElements extends ElementProps<HTMLElementTagNameMap> {
      img: ImgHTMLAttributes<HTMLImageElement> & { 'prop:src'?: string | undefined };
      input: InputHTMLAttributes<HTMLInputElement> & { 'prop:indeterminate'?: boolean };
    }
  }
}

// Enable Mock Server
if (import.meta.env.DEV && new URLSearchParams(location.search).has('mock'))
  (await import('@/services/mock/mockServer')).createMockServer();

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.querySelector('body')!
);
