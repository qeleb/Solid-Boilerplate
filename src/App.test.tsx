import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('app', () => {
  it('renders navbar with Home link', () => {
    render(<App />);
    expect(screen.getByText(/Home/)).toBeInTheDocument();
  });
});
