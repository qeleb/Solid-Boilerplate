import iconGithub from '@/assets/github.svg';
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
export const IconGithub = createSVG(iconGithub);
export const IconMenu = createSVG(iconMenu);
