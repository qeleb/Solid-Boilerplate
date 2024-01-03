import { Route, Router } from '@solidjs/router';
import { render, screen } from '@solidjs/testing-library';
import { Home } from '@/pages/Home';

describe('home page', () => {
  it('displays Hello', () => {
    render(() => (
      <Router>
        <Route component={Home} />
      </Router>
    ));
    expect(screen.getByText(/Hello, .+/)).toBeInTheDocument();
  });
});
