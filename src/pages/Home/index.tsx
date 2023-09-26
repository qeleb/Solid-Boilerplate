import { useCounter, useMouse, usePreferredDark, usePreferredLanguages } from 'solidjs-use';
import logo from '@/assets/logo.svg';
import styles from '@/pages/Home/Home.module.scss';

export const Home = () => {
  const languages = usePreferredLanguages();
  const isDark = usePreferredDark();
  const { x, y } = useMouse();
  const { count, inc, dec } = useCounter();

  return (
    <div class={styles.Home}>
      <img src={logo} alt="logo" />
      <h1 style={{ margin: 0 }}>Solid + Vite + TypeScript</h1>
      <div>Languages: {languages().join(', ')}</div>
      {isDark() ? (
        <span style={{ color: 'black' }}>dark mode</span>
      ) : (
        <span style={{ color: 'white' }}>light mode</span>
      )}
      <h3>
        Mouse: {x()} x {y()}
      </h3>
      <h3>
        Counter: {count()}
        <button onClick={() => inc()} style={{ margin: '0.25rem', 'margin-right': '0.25rem' }}>
          +
        </button>
        <button onClick={() => dec()} style={{ margin: '0.25rem' }}>
          -
        </button>
      </h3>
      <br />
      <br />
      made by qeleb
    </div>
  );
};
