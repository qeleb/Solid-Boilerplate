import { Card } from '@/components/Card';
import styles from '@/pages/About/About.module.scss';

export const About = () => (
  <div class={styles.About}>
    <h1>About</h1>
    <p>Cards List</p>
    <div class={styles.cardsList}>
      <Card color="black">Card #1</Card>
      <Card color="darkgray">Card #2</Card>
      <Card color="brown">Card #3</Card>
      <Card color="red">Card #4</Card>
      <Card color="crimson">Card #5</Card>
    </div>
  </div>
);
