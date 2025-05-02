import { createSignal } from 'solid-js';
import { useCounter, useMouse } from 'solidjs-use';
import { IconLogo } from '@/components/svg';
import styles from '@/pages/Home/Home.module.scss';
import { type UserFetchResponse, fetchUser } from '@/services/userService';

export const Home = () => {
  const { x, y } = useMouse();
  const { count, inc, dec } = useCounter();
  const [userData, setUserData] = createSignal<UserFetchResponse | undefined>();

  fetchUser().then(setUserData);

  return (
    <div class={styles.Home}>
      <IconLogo ariaLabel="Solid Logo" />
      <h1>Solid + Vite + TypeScript</h1>
      <h3>Hello, {userData()?.name ?? 'guest'}!</h3>
      <p>
        Mouse: {x()} x {y()}
      </p>
      <h3>
        Counter: {count()}
        <button onClick={() => dec()}>-</button>
        <button onClick={() => inc()}>+</button>
      </h3>
    </div>
  );
};
