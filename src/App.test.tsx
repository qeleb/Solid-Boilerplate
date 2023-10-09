import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '@/App';

describe('app', () => {
  it('renders navbar with Home link', () => {
    render(<App />, { wrapper: BrowserRouter });
    expect(screen.getByText(/Home/)).toBeInTheDocument();
  });
});
