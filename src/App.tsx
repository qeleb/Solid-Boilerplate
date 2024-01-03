import { A } from '@solidjs/router';
import type { ParentProps } from 'solid-js';
import styles from '@/App.module.scss';
import { Navbar } from '@/components/Navbar';

export const App = (props: ParentProps) => (
  <div class={styles.App}>
    <Navbar>
      <A href="/" end>
        Home
      </A>
      <A href="/about" end>
        About
      </A>
    </Navbar>
    {props.children}
  </div>
);
