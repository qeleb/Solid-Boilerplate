import { A, Route, Routes } from '@solidjs/router';
import styles from '@/App.module.scss';
import { Navbar } from '@/components/Navbar';
import { About } from '@/pages/About';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

export const App = () => (
  <div class={styles.App}>
    {/* Navbar */}
    <Navbar>
      <A href="/" end>
        Home
      </A>
      <A href="/about" end>
        About
      </A>
    </Navbar>

    {/* Pages */}
    <Routes>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="*" component={NotFound} />
    </Routes>
  </div>
);
