import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';
export type SchoolSystem = 'anglophone' | 'francophone';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  schoolId?: string;
  classId?: string;
  isActive: boolean;
  createdAt: Date;
  temporaryPassword?: string;
}

export interface School {
  id: string;
  name: string;
  system: SchoolSystem;
  adminEmail: string;
  adminId: string;
  createdAt: Date;
  isActive: boolean;
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
}

interface AuthContextType {
  user: User | null;
  school: School | null;
  login: (email: string, password: string, selectedLanguage?: 'en' | 'fr') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  switchRole: (role: UserRole) => void;
  language: 'en' | 'fr';
  setLanguage: (language: 'en' | 'fr') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration - Updated to match Login component
const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@system.com',
    fullName: 'Super Administrator',
    role: 'super_admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    temporaryPassword: 'demo123'
  },
  {
    id: '2',
    email: 'admin@stmarys.edu',
    fullName: 'School Administrator',
    role: 'school_admin',
    schoolId: 'sch_1',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    temporaryPassword: 'demo123'
  },
  {
    id: '3',
    email: 'john.doe@stmarys.edu',
    fullName: 'John Doe',
    role: 'teacher',
    schoolId: 'sch_1',
    classId: 'class_1',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    temporaryPassword: 'demo123'
  },
  {
    id: '5',
    email: 'parent@example.com',
    fullName: 'Parent User',
    role: 'parent',
    schoolId: 'sch_1',
    isActive: true,
    createdAt: new Date('2024-01-25'),
    temporaryPassword: 'demo123'
  },
  {
    id: '6',
    email: 'marie.martin@epyaounde.edu',
    fullName: 'Marie Martin',
    role: 'teacher',
    schoolId: 'sch_2',
    classId: 'class_2',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    temporaryPassword: 'demo123'
  },
  {
    id: '7',
    email: 'admin@epyaounde.edu',
    fullName: 'Administrateur École',
    role: 'school_admin',
    schoolId: 'sch_2',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    temporaryPassword: 'demo123'
  }
];

const mockSchools: School[] = [
  {
    id: 'sch_1',
    name: 'St. Mary\'s Primary School',
    system: 'anglophone',
    adminEmail: 'admin@stmarys.edu',
    adminId: '2',
    createdAt: new Date('2024-01-15'),
    isActive: true,
    totalTeachers: 12,
    totalStudents: 240,
    totalClasses: 12
  },
  {
    id: 'sch_2',
    name: 'École Primaire de Yaoundé',
    system: 'francophone',
    adminEmail: 'admin@epyaounde.edu',
    adminId: '4',
    createdAt: new Date('2024-01-20'),
    isActive: true,
    totalTeachers: 15,
    totalStudents: 300,
    totalClasses: 15
  }
];

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 5,
  school_admin: 4,
  teacher: 3,
  student: 2,
  parent: 1
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedSchool = localStorage.getItem('school');
    const savedLanguage = localStorage.getItem('language') as 'en' | 'fr';
    
    if (savedUser && savedSchool) {
      try {
        setUser(JSON.parse(savedUser));
        setSchool(JSON.parse(savedSchool));
      } catch (error) {
        console.error('Error parsing saved user/school data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('school');
      }
    }
    
    // Set language preference
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, selectedLanguage?: 'en' | 'fr'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && (foundUser.temporaryPassword === password || password === 'demo123')) {
      setUser(foundUser);
      
      // Set language preference
      if (selectedLanguage) {
        setLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
      }
      
      // For non-super admin users, assign school system based on language selection
      if (foundUser.role !== 'super_admin') {
        let assignedSchool: School | null = null;
        
        if (selectedLanguage === 'fr') {
          // Assign francophone system
          assignedSchool = {
            id: 'dynamic_fr_school',
            name: 'École Primaire Dynamique',
            system: 'francophone',
            adminEmail: foundUser.email,
            adminId: foundUser.id,
            createdAt: new Date(),
            isActive: true,
            totalTeachers: 15,
            totalStudents: 300,
            totalClasses: 15
          };
        } else {
          // Assign anglophone system (default)
          assignedSchool = {
            id: 'dynamic_en_school',
            name: 'Dynamic Primary School',
            system: 'anglophone',
            adminEmail: foundUser.email,
            adminId: foundUser.id,
            createdAt: new Date(),
            isActive: true,
            totalTeachers: 12,
            totalStudents: 240,
            totalClasses: 12
          };
        }
        
        setSchool(assignedSchool);
        localStorage.setItem('school', JSON.stringify(assignedSchool));
      } else {
        // Super admin users keep their original school assignment or no school
        if (foundUser.schoolId) {
          const foundSchool = mockSchools.find(s => s.id === foundUser.schoolId);
          if (foundSchool) {
            setSchool(foundSchool);
            localStorage.setItem('school', JSON.stringify(foundSchool));
          }
        }
      }
      
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setSchool(null);
    localStorage.removeItem('user');
    localStorage.removeItem('school');
    // Keep language preference on logout
  };

  const handleLanguageChange = (newLanguage: 'en' | 'fr') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[role]);
    }
    
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    
    // Find a user with the requested role (for demo purposes)
    const roleUser = mockUsers.find(u => u.role === role && u.schoolId === user.schoolId);
    if (roleUser) {
      setUser(roleUser);
      localStorage.setItem('user', JSON.stringify(roleUser));
    }
  };

  const value: AuthContextType = {
    user,
    school,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    hasPermission,
    switchRole,
    language,
    setLanguage: handleLanguageChange
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

