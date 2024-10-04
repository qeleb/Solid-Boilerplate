import { type RouteDefinition, Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import { App } from '@/App';
import { About } from '@/pages/About';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

/* Extend Solid JSX */
declare module 'solid-js' {
  namespace JSX /* eslint-disable-line @typescript-eslint/no-namespace */ {
    type OnEvents<T> = { [K in keyof T as `on${string & K}`]: string };
    type OnCustomEvents<T> = { [K in keyof T]: HTMLElement[keyof HTMLElement & K] };
    interface ExplicitAttributes extends OnEvents<GlobalEventHandlersEventMap> {}
    interface CustomEvents extends OnCustomEvents<GlobalEventHandlersEventMap> {}
    type Props<T> = { [K in keyof T as `prop:${string & K}`]?: T[K] };
    type ElementProps<T> = { [K in keyof T]: Props<T[K]> & HTMLAttributes<T[K]> };
    interface IntrinsicElements extends ElementProps<HTMLElementTagNameMap> {
      button: ButtonHTMLAttributes<HTMLButtonElement> | Props<HTMLButtonElement>;
      div: HTMLAttributes<HTMLDivElement> | Props<HTMLDivElement>;
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

/* Routes */
const routes: RouteDefinition[] = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '*', component: NotFound },
];

/* Render */
render(() => <Router root={App} children={routes as any} />, document.body);
