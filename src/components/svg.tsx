import { template } from 'solid-js/web';
import iconGithub from '@/assets/github.svg';
import iconLogo from '@/assets/logo.svg';
import iconMenu from '@/assets/menu.svg';

/* SVG Component */
const createSVG =
  (innerHTML: string) =>
  (props?: DeepPartial<SVGElement>): SVGElement =>
    Object.assign(
      Object.assign(document.createElement('template'), { innerHTML }).content.firstChild as SVGElement,
      props
    );

/* Icons */
export const IconGithub = template(iconGithub);
export const IconLogo = createSVG(iconLogo);
export const IconMenu = template(iconMenu);
