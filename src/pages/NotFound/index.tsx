import { Link } from 'react-router-dom';
import { Card } from '@/components/Card';
import styles from '@/pages/NotFound/NotFound.module.scss';

export const NotFound = () => (
  <div className={styles.NotFound}>
    <Card color="black">
      <h1>404 Page not found</h1>
      🫤 Go to the <Link to="/">home page</Link>?
    </Card>
  </div>
);
