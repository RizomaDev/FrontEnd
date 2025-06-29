import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Buttons from '../../src/components/Buttons/Buttons';

test('renders button with text', () => {
  render(<Buttons>Click me</Buttons>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Buttons onClick={handleClick}>Click me</Buttons>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('renders as a Link when "to" prop is provided', () => {
  render(
    <Buttons to="/test-route">Go to test</Buttons>,
    { wrapper: MemoryRouter }
  );
  const link = screen.getByText('Go to test');
  expect(link.tagName).toBe('A');
  expect(link).toHaveAttribute('href', '/test-route');
});