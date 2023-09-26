import type { ParentProps } from 'solid-js';
import styles from '@/components/Navbar/Navbar.module.scss';

export const Navbar = (props: ParentProps) => (
  <>
    <style>{`
    .active {
      color: #000;
    }

    .inactive {
      color: #333;
      text-decoration: none;
    }
  `}</style>
    <div class={styles.Navbar}>{props.children}</div>
  </>
);
