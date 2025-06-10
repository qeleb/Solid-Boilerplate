import { Route, Router } from '@solidjs/router';
import { render, screen } from '@solidjs/testing-library';
import { About } from '@/pages/About';

describe('about page', () => {
  it('displays about page title', () => {
    render(() => (
      <Router>
        <Route component={About} />
      </Router>
    ));
    screen.getByText('About');
  });
});
