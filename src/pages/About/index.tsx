import { Card } from '@/components/Card';
import styles from '@/pages/About/About.module.scss';

export const About = () => (
  <div className={styles.About}>
    <h1>About Page</h1>
    <p>Cards List</p>
    <div className={styles['cards-list']}>
      <Card color="black">Card #1</Card>
      <Card color="darkgray">Card #2</Card>
      <Card color="brown">Card #3</Card>
      <Card color="red">Card #4</Card>
      <Card color="crimson">Card #5</Card>
    </div>
  </div>
);
