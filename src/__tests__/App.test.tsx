import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the AuthContext
jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { id: '1', name: 'Test User', role: 'teacher' },
    school: { id: '1', name: 'Test School' },
    hasPermission: jest.fn((role: string) => role === 'teacher'),
    switchRole: jest.fn(),
    logout: jest.fn()
  })
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  test('renders navigation when authenticated', () => {
    render(<App />);
    // Check if navigation is present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders main content area', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
