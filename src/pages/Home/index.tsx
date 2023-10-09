import * as React from 'react';
import logo from '@/assets/logo.svg';
import styles from '@/pages/Home/Home.module.scss';
import { fetchUser, type UserFetchResponse } from '@/services/userService';

export const Home = () => {
  const [count, setCount] = React.useState(0);
  const [userData, setUserData] = React.useState<UserFetchResponse | undefined>();

  React.useEffect(() => {
    fetchUser().then(setUserData);
  }, []);

  return (
    <div className={styles.Home}>
      <img src={logo} alt="logo" />
      <h1 style={{ margin: 0 }}>React + Vite + TypeScript</h1>
      <h3>Hello, {userData?.name ?? 'guest'}!</h3>
      <h3>
        Counter: {count}
        <button onClick={() => setCount(x => x + 1)} style={{ margin: '0.25rem' }}>
          +
        </button>
        <button onClick={() => setCount(x => x - 1)} style={{ margin: '0.25rem' }}>
          -
        </button>
      </h3>
      <br />
      <br />
      made by qeleb
    </div>
  );
};
