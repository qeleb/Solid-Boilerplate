import type { ParentProps } from 'solid-js';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

import '@/globalStyles.scss';

export const App = (props: ParentProps) => (
  <>
    <Navbar />
    {props.children}
    <Footer />
  </>
);
