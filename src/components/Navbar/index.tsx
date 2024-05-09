import { A, useBeforeLeave } from '@solidjs/router';
import { createSignal } from 'solid-js';
import iconLogo from '@/assets/logo.svg?url';
import styles from '@/components/Navbar/Navbar.module.scss';
import { IconMenu } from '@/components/svg';

export const NavbarItems = () => (
  <>
    <A href="/">Home</A>
    <A href="/about">About</A>
  </>
);

export const Navbar = () => {
  const [showMenu, setShowMenu] = createSignal(false);

  useBeforeLeave(() => setShowMenu(false));

  return (
    <nav class={`${styles.Navbar} ${showMenu() ? styles.show : ''}`}>
      <div class={styles['nav-main']}>
        <A href="/">
          <img prop:src={iconLogo} alt="Solid Boilerplate" />
        </A>

        {/* Mobile Only */}
        <button aria-label="Toggle navigation" onClick={() => setShowMenu(p => !p)}>
          <IconMenu />
        </button>

        {/* Desktop Only */}
        <div>
          <NavbarItems />
        </div>
      </div>
      <div class={styles['nav-extension']}>
        <NavbarItems />
      </div>
    </nav>
  );
};
