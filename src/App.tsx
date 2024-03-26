import type { RouteSectionProps } from '@solidjs/router';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

import '@/globalStyles.scss';

export const App = (props: RouteSectionProps) => (
  <>
    <Navbar />
    {props.children}
    <Footer />
  </>
);
