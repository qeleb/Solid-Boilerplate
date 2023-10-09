import * as React from 'react';
import styles from '@/components/Card/Card.module.scss';

export const Card = (props: React.PropsWithChildren<{ color: string }>) => (
  <div className={styles.Card} style={{ backgroundColor: props.color }}>
    {props.children}
  </div>
);
