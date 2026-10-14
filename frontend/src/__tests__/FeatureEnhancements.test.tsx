import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AttendanceManager from '../components/AttendanceManager';
import GradebookManager from '../components/GradebookManager';
import TimetableManager from '../components/TimetableManager';

// Mock contexts
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '3', fullName: 'John Doe', role: 'teacher' },
    school: { id: 'sch_1', name: 'St. Mary High School', system: 'anglophone' },
    language: 'en',
    setLanguage: jest.fn(),
    hasPermission: () => true,
    logout: jest.fn()
  })
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children, to }: { children?: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}));

describe('Feature Enhancements Suite', () => {
  test('AttendanceManager renders correctly with student list and stats', () => {
    render(<AttendanceManager />);
    expect(screen.getByText(/Student Attendance Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Attendance Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Emma Johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/Mark All Present/i)).toBeInTheDocument();
  });

  test('GradebookManager renders subject gradebook and student entries', () => {
    render(<GradebookManager />);
    expect(screen.getByText(/Gradebook & Assessment System/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subject Gradebook/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Class Broadsheet & Ranking/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Official Term Report Card/i })).toBeInTheDocument();
    expect(screen.getByText(/Emma Johnson/i)).toBeInTheDocument();
  });

  test('GradebookManager displays MINESEC official report card and anti-fraud QR features', () => {
    render(<GradebookManager />);
    
    // Switch to Report Card Tab
    const reportCardTab = screen.getByRole('button', { name: /Official Term Report Card/i });
    fireEvent.click(reportCardTab);

    // Check MINESEC Bilingual Headers & Subject Groupings
    expect(screen.getByText(/RÉPUBLIQUE DU CAMEROUN/i)).toBeInTheDocument();
    expect(screen.getByText(/REPUBLIC OF CAMEROON/i)).toBeInTheDocument();
    expect(screen.getByText(/MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES/i)).toBeInTheDocument();
    expect(screen.getByText(/GROUPE 1 : SCIENCES ET TECHNOLOGIES/i)).toBeInTheDocument();
    expect(screen.getByText(/GROUPE 2 : LANGUES ET LITTÉRATURE/i)).toBeInTheDocument();
    expect(screen.getByText(/GROUPE 3 : SCIENCES HUMAINES, ARTS ET SPORT/i)).toBeInTheDocument();

    // Check Anti-fraud Verification button
    expect(screen.getByText(/Vérifier QR Code Anti-Fraude/i)).toBeInTheDocument();
  });

  test('TimetableManager renders weekly timetable grid and periods', () => {
    render(<TimetableManager />);
    expect(screen.getByText(/Class Timetable & Scheduling/i)).toBeInTheDocument();
    expect(screen.getByText(/Schedule View Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Monday/i)).toBeInTheDocument();
    expect(screen.getByText(/Friday/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export to Google Calendar/i })).toBeInTheDocument();
  });
});
