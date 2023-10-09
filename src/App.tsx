import { Route, Routes, Link } from 'react-router-dom';
import styles from '@/App.module.scss';
import { Navbar } from '@/components/Navbar';
import { About } from '@/pages/About';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

export const App = () => (
  <div className={styles.App}>
    {/* Navbar */}
    <Navbar>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </Navbar>

    {/* Pages */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);
