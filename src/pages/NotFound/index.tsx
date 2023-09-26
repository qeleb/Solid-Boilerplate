import { A } from '@solidjs/router';
import { Card } from '@/components/Card';
import styles from '@/pages/NotFound/NotFound.module.scss';

export const NotFound = () => (
  <div class={styles.NotFound}>
    <Card color="black">
      <h1>404 Page not found</h1>
      🫤 Go to the <A href="/">home page</A>?
    </Card>
  </div>
);
