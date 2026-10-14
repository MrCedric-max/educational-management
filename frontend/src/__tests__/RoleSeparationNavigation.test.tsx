import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SidebarNavigation from '../components/SidebarNavigation';
import * as AuthContextModule from '../contexts/AuthContext';

// Mock RealtimeContext
jest.mock('../contexts/RealtimeContext', () => ({
  useRealtime: () => ({
    getUnreadCount: () => 3,
    notifications: []
  })
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {ui}
    </BrowserRouter>
  );
};

describe('Strict Role Separation & Accordion Navigation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Teacher view displays only teaching and classroom items', () => {
    jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: '3',
        fullName: 'John Doe',
        email: 'john.doe@stmarys.edu',
        role: 'teacher',
        isActive: true,
        createdAt: new Date()
      },
      school: {
        id: 'sch_1',
        name: 'GBHS Yaoundé',
        system: 'anglophone',
        adminEmail: 'admin@stmarys.edu',
        adminId: '2',
        createdAt: new Date(),
        isActive: true,
        totalTeachers: 12,
        totalStudents: 240,
        totalClasses: 12
      },
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
      hasPermission: () => true,
      switchRole: jest.fn(),
      language: 'en',
      setLanguage: jest.fn()
    });

    renderWithRouter(<SidebarNavigation />);

    // Verify Teacher Sections & Items exist
    expect(screen.getByText(/Teaching & Pedagogy/i)).toBeInTheDocument();
    expect(screen.getByText(/Lesson Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Quiz & Exam Builder/i)).toBeInTheDocument();
    expect(screen.getByText(/Classroom & Grading/i)).toBeInTheDocument();
    expect(screen.getByText(/Attendance Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Séquences & APC/i)).toBeInTheDocument();

    // Verify Super Admin / School Admin exclusive items DO NOT leak to Teacher
    expect(screen.queryByText(/Feature Flags/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Bulk Operations/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Network Governance/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Principal Overview/i)).not.toBeInTheDocument();
  });

  test('School Admin view displays administrative items and no teacher planner leakage', () => {
    jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: '2',
        fullName: 'School Administrator',
        email: 'admin@stmarys.edu',
        role: 'school_admin',
        isActive: true,
        createdAt: new Date()
      },
      school: {
        id: 'sch_1',
        name: 'GBHS Yaoundé',
        system: 'anglophone',
        adminEmail: 'admin@stmarys.edu',
        adminId: '2',
        createdAt: new Date(),
        isActive: true,
        totalTeachers: 12,
        totalStudents: 240,
        totalClasses: 12
      },
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
      hasPermission: () => true,
      switchRole: jest.fn(),
      language: 'en',
      setLanguage: jest.fn()
    });

    renderWithRouter(<SidebarNavigation />);

    // School Admin Sections
    expect(screen.getByText(/School Administration/i)).toBeInTheDocument();
    expect(screen.getByText(/Principal Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Staff & Users/i)).toBeInTheDocument();
    expect(screen.getByText(/MINESEC Report Cards/i)).toBeInTheDocument();
    expect(screen.getByText(/School Analytics/i)).toBeInTheDocument();

    // No Super Admin server operations
    expect(screen.queryByText(/Feature Flags/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Performance Monitor/i)).not.toBeInTheDocument();
  });

  test('Super Admin view displays system governance and technical infrastructure', () => {
    jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: '1',
        fullName: 'Super Administrator',
        email: 'superadmin@system.com',
        role: 'super_admin',
        isActive: true,
        createdAt: new Date()
      },
      school: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
      hasPermission: () => true,
      switchRole: jest.fn(),
      language: 'en',
      setLanguage: jest.fn()
    });

    renderWithRouter(<SidebarNavigation />);

    expect(screen.getByText(/Network Governance/i)).toBeInTheDocument();
    expect(screen.getByText(/Curriculum & Resources/i)).toBeInTheDocument();
    expect(screen.getByText(/System & Infrastructure/i)).toBeInTheDocument();
    expect(screen.getByText(/Feature Flags/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance Monitor/i)).toBeInTheDocument();
    expect(screen.getByText(/Bulk Operations/i)).toBeInTheDocument();

    // Verify parent/teacher views do not appear
    expect(screen.queryByText(/Home Practice Quizzes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Child Dashboard/i)).not.toBeInTheDocument();
  });

  test('Parent view displays only child monitoring tools', () => {
    jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: '5',
        fullName: 'Parent User',
        email: 'parent@example.com',
        role: 'parent',
        isActive: true,
        createdAt: new Date()
      },
      school: {
        id: 'sch_1',
        name: 'GBHS Yaoundé',
        system: 'anglophone',
        adminEmail: 'admin@stmarys.edu',
        adminId: '2',
        createdAt: new Date(),
        isActive: true,
        totalTeachers: 12,
        totalStudents: 240,
        totalClasses: 12
      },
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
      hasPermission: () => true,
      switchRole: jest.fn(),
      language: 'en',
      setLanguage: jest.fn()
    });

    renderWithRouter(<SidebarNavigation />);

    expect(screen.getByText(/Child Academic Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Child Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Official Report Cards/i)).toBeInTheDocument();
    expect(screen.getByText(/Home Practice Quizzes/i)).toBeInTheDocument();

    // Strict isolation: parent cannot see teacher/admin tools
    expect(screen.queryByText(/Staff & Users/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Lesson Planner/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Feature Flags/i)).not.toBeInTheDocument();
  });

  test('Accordion headers toggle collapse and expand smoothly', () => {
    jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: '3',
        fullName: 'John Doe',
        email: 'john.doe@stmarys.edu',
        role: 'teacher',
        isActive: true,
        createdAt: new Date()
      },
      school: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
      hasPermission: () => true,
      switchRole: jest.fn(),
      language: 'en',
      setLanguage: jest.fn()
    });

    renderWithRouter(<SidebarNavigation />);

    // Lesson Planner is initially visible
    expect(screen.getByText(/Lesson Planner/i)).toBeInTheDocument();

    // Click section accordion header to collapse
    const sectionHeader = screen.getByRole('button', { name: /Teaching & Pedagogy/i });
    fireEvent.click(sectionHeader);

    // Lesson Planner is now collapsed
    expect(screen.queryByText(/Lesson Planner/i)).not.toBeInTheDocument();

    // Click again to expand
    fireEvent.click(sectionHeader);
    expect(screen.getByText(/Lesson Planner/i)).toBeInTheDocument();
  });

  test('Student profile is completely removed from available roles', () => {
    jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: '1',
        fullName: 'Super Administrator',
        email: 'superadmin@system.com',
        role: 'super_admin',
        isActive: true,
        createdAt: new Date()
      },
      school: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
      hasPermission: () => true,
      switchRole: jest.fn(),
      language: 'en',
      setLanguage: jest.fn()
    });

    renderWithRouter(<SidebarNavigation />);

    // Open role switcher popover
    const switcherButton = screen.getByRole('button', { name: /Switch Profile/i });
    fireEvent.click(switcherButton);

    // Verify student profile option does NOT exist
    expect(screen.queryByRole('button', { name: /^student$/i })).not.toBeInTheDocument();
    
    // Verify only the 4 allowed roles exist in demo switcher
    expect(screen.getByRole('button', { name: /super admin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /school admin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /teacher/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /parent/i })).toBeInTheDocument();
  });
});
