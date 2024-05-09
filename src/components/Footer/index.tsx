import { A } from '@solidjs/router';
import styles from '@/components/Footer/Footer.module.scss';
import { NavbarItems } from '@/components/Navbar';
import { IconGithub } from '@/components/svg';

export const Footer = () => (
  <footer>
    <div class={styles.main}>
      <div>
        <h6>SOLID BOILERPLATE</h6>
        <NavbarItems />
      </div>
      <div>
        <h6>MORE LINKS</h6>
        <A href="missing-page">NOT FOUND PAGE</A>
        <A href="missing-page2">ANOTHER MISSING PAGE</A>
      </div>
    </div>
    <div class={styles.bottom}>
      designed by qeleb
      <a href="https://github.com/qeleb" aria-label="Developer GitHub">
        <IconGithub />
      </a>
    </div>
  </footer>
);
