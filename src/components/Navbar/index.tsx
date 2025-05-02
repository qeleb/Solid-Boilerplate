import { A, useBeforeLeave } from '@solidjs/router';
import { createSignal } from 'solid-js';
import styles from '@/components/Navbar/Navbar.module.scss';
import { IconLogo, IconMenu } from '@/components/svg';

export const NavbarItems = () => (
  <>
    <A href="/" end>
      Home
    </A>
    <A href="/about">About</A>
  </>
);

export const Navbar = () => {
  const [showMenu, setShowMenu] = createSignal(false);

  useBeforeLeave(() => setShowMenu(false));

  return (
    <nav class={`${styles.Navbar} ${showMenu() ? styles.show : ''}`}>
      <div class={styles.navMain}>
        <A href="/" end>
          <IconLogo ariaLabel="Solid Boilerplate" />
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
      <div class={styles.navExtension}>
        <NavbarItems />
      </div>
    </nav>
  );
};
