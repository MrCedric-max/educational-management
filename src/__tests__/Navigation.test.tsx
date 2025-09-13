import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../components/Navigation';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  test('renders all navigation links', () => {
    renderWithRouter(<Navigation />);
    
    // Check for main navigation links
    expect(screen.getByText('Classes')).toBeInTheDocument();
    expect(screen.getByText('Lesson Planner')).toBeInTheDocument();
    expect(screen.getByText('Quiz Tool')).toBeInTheDocument();
    expect(screen.getByText('Student Progress')).toBeInTheDocument();
    expect(screen.getByText('Parent Portal')).toBeInTheDocument();
    expect(screen.getByText('Monthly Reports')).toBeInTheDocument();
    expect(screen.getByText('Student Roster')).toBeInTheDocument();
    expect(screen.getByText('Progress Insights')).toBeInTheDocument();
    expect(screen.getByText('Export Center')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    renderWithRouter(<Navigation />);
    
    expect(screen.getByRole('link', { name: /classes/i })).toHaveAttribute('href', '/classes');
    expect(screen.getByRole('link', { name: /lesson planner/i })).toHaveAttribute('href', '/lesson-planner');
    expect(screen.getByRole('link', { name: /quiz tool/i })).toHaveAttribute('href', '/quiz');
    expect(screen.getByRole('link', { name: /student progress/i })).toHaveAttribute('href', '/student-progress');
    expect(screen.getByRole('link', { name: /parent portal/i })).toHaveAttribute('href', '/parent-portal');
    expect(screen.getByRole('link', { name: /monthly reports/i })).toHaveAttribute('href', '/monthly-reports');
    expect(screen.getByRole('link', { name: /student roster/i })).toHaveAttribute('href', '/student-roster');
    expect(screen.getByRole('link', { name: /progress insights/i })).toHaveAttribute('href', '/progress-insights');
    expect(screen.getByRole('link', { name: /export center/i })).toHaveAttribute('href', '/export-center');
  });

  test('renders logo and branding', () => {
    renderWithRouter(<Navigation />);
    
    // Check for logo or branding elements
    const logo = screen.getByText(/educational management/i) || screen.getByText(/ems/i);
    expect(logo).toBeInTheDocument();
  });
});
