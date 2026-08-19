import { createSignal } from 'solid-js';
import { IconLogo } from '@/components/svg';
import { useMouse } from '@/hooks/useMouse';
import styles from '@/pages/Home/Home.module.scss';
import { type UserFetchResponse, fetchUser } from '@/services/userService';

export const Home = () => {
  const [mouseX, mouseY] = useMouse();
  const [counter, setCounter] = createSignal(0);
  const [userData, setUserData] = createSignal<UserFetchResponse | undefined>();

  fetchUser().then(setUserData);

  return (
    <div class={styles.Home}>
      <IconLogo ariaLabel="Solid Logo" />
      <h1>Solid + Vite + TypeScript</h1>
      <h3>Hello, {userData()?.name ?? 'guest'}!</h3>
      <p>
        Mouse: {mouseX()} x {mouseY()}
      </p>
      <h3>
        Counter: {counter()}
        <button onClick={() => setCounter(p => p - 1)}>-</button>
        <button onClick={() => setCounter(p => p + 1)}>+</button>
      </h3>
    </div>
  );
};
