import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import { App } from '@/App';
import { About } from '@/pages/About';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

/* Extend Solid JSX */
declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Props<T> = { [K in keyof T as `prop:${string & K}`]?: T[K] };
    type ElementProps<T> = { [K in keyof T]: Props<T[K]> & HTMLAttributes<T[K]> };
    interface IntrinsicElements extends ElementProps<HTMLElementTagNameMap> {
      button: ButtonHTMLAttributes<HTMLButtonElement> | Props<HTMLButtonElement>;
      label: LabelHTMLAttributes<HTMLLabelElement> | Props<HTMLLabelElement>;
      img: ImgHTMLAttributes<HTMLImageElement> | Props<HTMLImageElement>;
      input: InputHTMLAttributes<HTMLInputElement> | Props<HTMLInputElement>;
      textarea: TextareaHTMLAttributes<HTMLTextAreaElement> | Props<HTMLTextAreaElement>;
    }
  }
}

/* Enable Mock Server */
if (import.meta.env.DEV && new URLSearchParams(location.search).has('mock'))
  (await import('@/services/mock/mockServer')).createMockServer();

/* Render App & Routes */
render(
  () => (
    <Router root={App}>
      {
        [
          { path: '/', component: Home },
          { path: '/about', component: About },
          { path: '*', component: NotFound },
        ] as any
      }
    </Router>
  ),
  document.body
);
