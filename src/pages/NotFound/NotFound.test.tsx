import { Route, Router } from '@solidjs/router';
import { render, screen } from '@solidjs/testing-library';
import { NotFound } from '@/pages/NotFound';

describe('not found page', () => {
  it('displays 404 error message', () => {
    render(() => (
      <Router>
        <Route component={NotFound} />
      </Router>
    ));
    expect(screen.getByText('404: Page not found')).toBeInTheDocument();
  });
});
