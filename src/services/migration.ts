// Data migration service for the educational management system
import databaseService from './database';
import { User, School, Class, Student, Subject, SystemSettings } from '../types/database';

// Migration interface
interface Migration {
  version: string;
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

// Migration service class
class MigrationService {
  private migrations: Migration[] = [];
  private currentVersion: string = '0.0.0';

  constructor() {
    this.initializeMigrations();
  }

  private initializeMigrations() {
    // Migration 1: Initial data setup
    this.migrations.push({
      version: '1.0.0',
      name: 'Initial Data Setup',
      up: async () => {
        await this.createInitialSchools();
        await this.createInitialUsers();
        await this.createInitialSubjects();
        await this.createInitialClasses();
        await this.createInitialStudents();
        await this.createSystemSettings();
      },
      down: async () => {
        await this.clearAllData();
      }
    });

    // Migration 2: Add French translations
    this.migrations.push({
      version: '1.1.0',
      name: 'Add French Translations',
      up: async () => {
        await this.addFrenchTranslations();
      },
      down: async () => {
        await this.removeFrenchTranslations();
      }
    });

    // Migration 3: Add sample content
    this.migrations.push({
      version: '1.2.0',
      name: 'Add Sample Content',
      up: async () => {
        await this.addSampleContent();
      },
      down: async () => {
        await this.removeSampleContent();
      }
    });
  }

  // Run all pending migrations
  async migrate(): Promise<void> {
    try {
      console.log('Starting database migration...');
      
      const pendingMigrations = this.getPendingMigrations();
      
      if (pendingMigrations.length === 0) {
        console.log('No pending migrations');
        return;
      }

      for (const migration of pendingMigrations) {
        console.log(`Running migration ${migration.version}: ${migration.name}`);
        await migration.up();
        this.currentVersion = migration.version;
        console.log(`Migration ${migration.version} completed`);
      }

      console.log('All migrations completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  // Rollback to specific version
  async rollback(version: string): Promise<void> {
    try {
      console.log(`Rolling back to version ${version}...`);
      
      const migrationsToRollback = this.getMigrationsToRollback(version);
      
      for (const migration of migrationsToRollback) {
        console.log(`Rolling back migration ${migration.version}: ${migration.name}`);
        await migration.down();
        console.log(`Migration ${migration.version} rolled back`);
      }

      this.currentVersion = version;
      console.log(`Rollback to version ${version} completed`);
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }

  // Get current migration status
  getStatus(): { currentVersion: string; pendingMigrations: string[] } {
    const pendingMigrations = this.getPendingMigrations().map(m => m.version);
    return {
      currentVersion: this.currentVersion,
      pendingMigrations
    };
  }

  // Private helper methods
  private getPendingMigrations(): Migration[] {
    return this.migrations.filter(migration => 
      this.compareVersions(migration.version, this.currentVersion) > 0
    );
  }

  private getMigrationsToRollback(targetVersion: string): Migration[] {
    return this.migrations
      .filter(migration => 
        this.compareVersions(migration.version, this.currentVersion) <= 0 &&
        this.compareVersions(migration.version, targetVersion) > 0
      )
      .reverse(); // Rollback in reverse order
  }

  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  // Migration implementations
  private async createInitialSchools(): Promise<void> {
    const schools = [
      {
        name: 'Central High School',
        nameFr: 'Lycée Central',
        address: '123 Education Street, Yaoundé, Cameroon',
        phoneNumber: '+237 6XX XXX XXX',
        email: 'info@centralhigh.edu.cm',
        principalName: 'Dr. John Smith',
        principalNameFr: 'Dr. Jean Smith',
        system: 'both' as const,
        isActive: true,
        settings: {
          allowParentRegistration: true,
          allowTeacherRegistration: true,
          requireEmailVerification: true,
          defaultLanguage: 'en' as const,
          timezone: 'Africa/Douala',
          academicYear: '2024-2025',
          terms: [
            {
              id: 'term-1',
              name: 'First Term',
              nameFr: 'Premier Trimestre',
              startDate: new Date('2024-09-01'),
              endDate: new Date('2024-12-15'),
              isActive: true
            },
            {
              id: 'term-2',
              name: 'Second Term',
              nameFr: 'Deuxième Trimestre',
              startDate: new Date('2025-01-06'),
              endDate: new Date('2025-04-15'),
              isActive: false
            },
            {
              id: 'term-3',
              name: 'Third Term',
              nameFr: 'Troisième Trimestre',
              startDate: new Date('2025-04-28'),
              endDate: new Date('2025-07-15'),
              isActive: false
            }
          ]
        }
      }
    ];

    for (const schoolData of schools) {
      await databaseService.create('schools', schoolData);
    }
  }

  private async createInitialUsers(): Promise<void> {
    const users = [
      {
        email: 'admin@centralhigh.edu.cm',
        fullName: 'System Administrator',
        role: 'super_admin' as const,
        schoolId: 'school-1',
        isActive: true,
        language: 'en' as const,
        phoneNumber: '+237 6XX XXX XXX',
        address: '123 Admin Street, Yaoundé, Cameroon'
      },
      {
        email: 'principal@centralhigh.edu.cm',
        fullName: 'Dr. John Smith',
        role: 'school_admin' as const,
        schoolId: 'school-1',
        isActive: true,
        language: 'en' as const,
        phoneNumber: '+237 6XX XXX XXX'
      },
      {
        email: 'teacher1@centralhigh.edu.cm',
        fullName: 'Mrs. Sarah Johnson',
        role: 'teacher' as const,
        schoolId: 'school-1',
        isActive: true,
        language: 'en' as const,
        phoneNumber: '+237 6XX XXX XXX'
      },
      {
        email: 'parent1@centralhigh.edu.cm',
        fullName: 'Mr. Michael Brown',
        role: 'parent' as const,
        schoolId: 'school-1',
        isActive: true,
        language: 'en' as const,
        phoneNumber: '+237 6XX XXX XXX'
      }
    ];

    for (const userData of users) {
      await databaseService.create('users', userData);
    }
  }

  private async createInitialSubjects(): Promise<void> {
    const subjects = [
      // Anglophone subjects
      { name: 'Mathematics', nameFr: 'Mathématiques', code: 'MATH', system: 'anglophone' as const, schoolId: 'school-1', isActive: true },
      { name: 'English Language', nameFr: 'Langue Anglaise', code: 'ENG', system: 'anglophone' as const, schoolId: 'school-1', isActive: true },
      { name: 'Science', nameFr: 'Sciences', code: 'SCI', system: 'anglophone' as const, schoolId: 'school-1', isActive: true },
      { name: 'Social Studies', nameFr: 'Études Sociales', code: 'SOC', system: 'anglophone' as const, schoolId: 'school-1', isActive: true },
      { name: 'Physical Education', nameFr: 'Éducation Physique', code: 'PE', system: 'anglophone' as const, schoolId: 'school-1', isActive: true },
      
      // Francophone subjects
      { name: 'Mathématiques', nameFr: 'Mathématiques', code: 'MATH-FR', system: 'francophone' as const, schoolId: 'school-1', isActive: true },
      { name: 'Français', nameFr: 'Français', code: 'FR', system: 'francophone' as const, schoolId: 'school-1', isActive: true },
      { name: 'Sciences Physiques', nameFr: 'Sciences Physiques', code: 'SP', system: 'francophone' as const, schoolId: 'school-1', isActive: true },
      { name: 'Histoire-Géographie', nameFr: 'Histoire-Géographie', code: 'HG', system: 'francophone' as const, schoolId: 'school-1', isActive: true },
      { name: 'Éducation Physique et Sportive', nameFr: 'Éducation Physique et Sportive', code: 'EPS', system: 'francophone' as const, schoolId: 'school-1', isActive: true }
    ];

    for (const subjectData of subjects) {
      await databaseService.create('subjects', subjectData);
    }
  }

  private async createInitialClasses(): Promise<void> {
    const classes = [
      // Anglophone classes
      { name: 'Class 1A', nameFr: 'Classe 1A', code: '1A', schoolId: 'school-1', teacherId: 'teacher-1', level: '1', system: 'anglophone' as const, academicYear: '2024-2025', isActive: true, studentCount: 25 },
      { name: 'Class 1B', nameFr: 'Classe 1B', code: '1B', schoolId: 'school-1', teacherId: 'teacher-1', level: '1', system: 'anglophone' as const, academicYear: '2024-2025', isActive: true, studentCount: 23 },
      { name: 'Class 2A', nameFr: 'Classe 2A', code: '2A', schoolId: 'school-1', teacherId: 'teacher-1', level: '2', system: 'anglophone' as const, academicYear: '2024-2025', isActive: true, studentCount: 28 },
      
      // Francophone classes
      { name: 'Classe 6ème A', nameFr: 'Classe 6ème A', code: '6A', schoolId: 'school-1', teacherId: 'teacher-1', level: '6', system: 'francophone' as const, academicYear: '2024-2025', isActive: true, studentCount: 30 },
      { name: 'Classe 5ème A', nameFr: 'Classe 5ème A', code: '5A', schoolId: 'school-1', teacherId: 'teacher-1', level: '5', system: 'francophone' as const, academicYear: '2024-2025', isActive: true, studentCount: 27 },
      { name: 'Classe 4ème A', nameFr: 'Classe 4ème A', code: '4A', schoolId: 'school-1', teacherId: 'teacher-1', level: '4', system: 'francophone' as const, academicYear: '2024-2025', isActive: true, studentCount: 26 }
    ];

    for (const classData of classes) {
      await databaseService.create('classes', classData);
    }
  }

  private async createInitialStudents(): Promise<void> {
    const students = [
      // Anglophone students
      { fullName: 'Emma Johnson', studentNumber: 'ST001', classId: 'class-1', schoolId: 'school-1', parentId: 'parent-1', dateOfBirth: new Date('2010-05-15'), gender: 'female' as const, isActive: true },
      { fullName: 'James Wilson', studentNumber: 'ST002', classId: 'class-1', schoolId: 'school-1', parentId: 'parent-2', dateOfBirth: new Date('2010-08-22'), gender: 'male' as const, isActive: true },
      { fullName: 'Sarah Davis', studentNumber: 'ST003', classId: 'class-2', schoolId: 'school-1', parentId: 'parent-3', dateOfBirth: new Date('2009-12-10'), gender: 'female' as const, isActive: true },
      
      // Francophone students
      { fullName: 'Marie Dubois', studentNumber: 'ST004', classId: 'class-4', schoolId: 'school-1', parentId: 'parent-4', dateOfBirth: new Date('2012-03-18'), gender: 'female' as const, isActive: true },
      { fullName: 'Pierre Martin', studentNumber: 'ST005', classId: 'class-4', schoolId: 'school-1', parentId: 'parent-5', dateOfBirth: new Date('2012-07-25'), gender: 'male' as const, isActive: true },
      { fullName: 'Sophie Laurent', studentNumber: 'ST006', classId: 'class-5', schoolId: 'school-1', parentId: 'parent-6', dateOfBirth: new Date('2011-11-08'), gender: 'female' as const, isActive: true }
    ];

    for (const studentData of students) {
      await databaseService.create('students', studentData);
    }
  }

  private async createSystemSettings(): Promise<void> {
    const settings = [
      { key: 'app_name', value: 'Educational Management System', description: 'Application name', category: 'general' as const, isPublic: true, updatedBy: 'system' },
      { key: 'app_version', value: '1.0.0', description: 'Application version', category: 'general' as const, isPublic: true, updatedBy: 'system' },
      { key: 'max_file_size', value: '10485760', description: 'Maximum file upload size in bytes (10MB)', category: 'general' as const, isPublic: false, updatedBy: 'system' },
      { key: 'allowed_file_types', value: 'pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,gif,mp4,mp3', description: 'Allowed file types for upload', category: 'general' as const, isPublic: false, updatedBy: 'system' },
      { key: 'session_timeout', value: '1800', description: 'Session timeout in seconds (30 minutes)', category: 'security' as const, isPublic: false, updatedBy: 'system' },
      { key: 'enable_notifications', value: 'true', description: 'Enable real-time notifications', category: 'features' as const, isPublic: false, updatedBy: 'system' },
      { key: 'enable_analytics', value: 'true', description: 'Enable analytics tracking', category: 'features' as const, isPublic: false, updatedBy: 'system' }
    ];

    for (const settingData of settings) {
      await databaseService.create('systemSettings', settingData);
    }
  }

  private async addFrenchTranslations(): Promise<void> {
    // This migration would add French translations to existing data
    console.log('Adding French translations...');
    // Implementation would depend on specific data structure
  }

  private async removeFrenchTranslations(): Promise<void> {
    // This migration would remove French translations
    console.log('Removing French translations...');
    // Implementation would depend on specific data structure
  }

  private async addSampleContent(): Promise<void> {
    // This migration would add sample content like lesson plans, quizzes, etc.
    console.log('Adding sample content...');
    // Implementation would add sample data
  }

  private async removeSampleContent(): Promise<void> {
    // This migration would remove sample content
    console.log('Removing sample content...');
    // Implementation would remove sample data
  }

  private async clearAllData(): Promise<void> {
    // This migration would clear all data (for rollback)
    console.log('Clearing all data...');
    // Implementation would clear all tables
  }
}

// Create singleton instance
export const migrationService = new MigrationService();

// Export the service
export default migrationService;




