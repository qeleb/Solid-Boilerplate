import * as React from 'react';
import styles from '@/components/Navbar/Navbar.module.scss';

export const Navbar = (props: React.PropsWithChildren) => <div className={styles.Navbar}>{props.children}</div>;
