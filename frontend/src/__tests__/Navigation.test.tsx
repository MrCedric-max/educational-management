import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../components/Navigation';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '3', fullName: 'John Doe', role: 'teacher' },
    hasPermission: () => true,
    language: 'en',
    logout: jest.fn()
  })
}));

jest.mock('../contexts/RealtimeContext', () => ({
  useRealtime: () => ({
    getUnreadCount: () => 0,
    notifications: []
  })
}));

jest.mock('../contexts/ErrorContext', () => ({
  useError: () => ({
    errors: [],
    addError: jest.fn(),
    clearErrors: jest.fn(),
    getErrorStats: () => ({ total: 0, byType: {}, byCategory: {} }),
    getUnresolvedErrors: () => []
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {component}
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  test('renders navigation links for teacher', () => {
    renderWithRouter(<Navigation />);
    
    expect(screen.getAllByText('Lesson Planner')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Quiz Tool')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Student Progress')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Monthly Reports')[0]).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    renderWithRouter(<Navigation />);
    
    expect(screen.getAllByRole('link', { name: /lesson planner/i })[0]).toHaveAttribute('href', '/lesson-planner');
    expect(screen.getAllByRole('link', { name: /quiz tool/i })[0]).toHaveAttribute('href', '/quiz');
    expect(screen.getAllByRole('link', { name: /student progress/i })[0]).toHaveAttribute('href', '/student-progress');
    expect(screen.getAllByRole('link', { name: /monthly reports/i })[0]).toHaveAttribute('href', '/monthly-reports');
  });

  test('renders logo and branding', () => {
    renderWithRouter(<Navigation />);
    
    const logo = screen.getByText(/educational management system/i);
    expect(logo).toBeInTheDocument();
  });
});
