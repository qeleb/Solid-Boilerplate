import iconGithub from '@/assets/github.svg';
import iconMenu from '@/assets/menu.svg';

/* SVG Component */
const createSVG = (innerHTML: string) => Object.assign(document.createElement('template'), { innerHTML }).content;

/* Icons */
export const IconGithub = () => createSVG(iconGithub);
export const IconMenu = () => createSVG(iconMenu);
