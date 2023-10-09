import { createSignal } from 'solid-js';
import { useCounter, useMouse } from 'solidjs-use';
import logo from '@/assets/logo.svg';
import styles from '@/pages/Home/Home.module.scss';
import { fetchUser, type UserFetchResponse } from '@/services/userService';

export const Home = () => {
  const { x, y } = useMouse();
  const { count, inc, dec } = useCounter();
  const [userData, setUserData] = createSignal<UserFetchResponse | undefined>();

  fetchUser().then(setUserData);

  return (
    <div class={styles.Home}>
      <img prop:src={logo} alt="logo" />
      <h1 style={{ margin: 0 }}>Solid + Vite + TypeScript</h1>
      <h3>Hello, {userData()?.name ?? 'guest'}!</h3>
      <h3>
        Mouse: {x()} x {y()}
      </h3>
      <h3>
        Counter: {count()}
        <button onClick={() => inc()} style={{ margin: '0.25rem' }}>
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
