import type { ParentProps } from 'solid-js';
import styles from '@/components/Card/Card.module.scss';

export const Card = (props: ParentProps<{ color: string }>) => (
  <div class={styles.Card} style={{ 'background-color': props.color }}>
    {props.children}
  </div>
);
