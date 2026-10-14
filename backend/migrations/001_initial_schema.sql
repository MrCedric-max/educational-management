-- ==============================================================================
-- Educational Management System - Initial Database Schema Migration (001)
-- Supports both Cameroonian (National/Francophone) and Anglophone subsystems
-- ==============================================================================

-- 1. Schools Table
CREATE TABLE IF NOT EXISTS schools (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    system VARCHAR(20) NOT NULL CHECK (system IN ('ANGLOPHONE', 'FRANCOPHONE', 'BILINGUAL')),
    school_code VARCHAR(50) UNIQUE NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Yaounde',
    region VARCHAR(100) DEFAULT 'Centre',
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    school_id VARCHAR(36) REFERENCES schools(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF')),
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(36) PRIMARY KEY,
    school_id VARCHAR(36) REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL,
    system VARCHAR(20) NOT NULL DEFAULT 'ANGLOPHONE',
    coefficient INT DEFAULT 1,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (school_id, code)
);

-- 4. Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(36) PRIMARY KEY,
    school_id VARCHAR(36) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    system VARCHAR(20) NOT NULL DEFAULT 'ANGLOPHONE',
    academic_year VARCHAR(20) DEFAULT '2026-2027',
    main_teacher_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    room VARCHAR(50) DEFAULT 'Room 101',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Students Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    school_id VARCHAR(36) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    parent_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    matricule VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    emergency_contact VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    time_in VARCHAR(10),
    reason TEXT,
    parent_notified BOOLEAN DEFAULT FALSE,
    marked_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, class_id, date)
);

-- 7. Timetable Slots Table
CREATE TABLE IF NOT EXISTS timetable_slots (
    id VARCHAR(36) PRIMARY KEY,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id VARCHAR(36) REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_name VARCHAR(100) NOT NULL,
    subject_name VARCHAR(150) NOT NULL,
    teacher_name VARCHAR(255) NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 6),
    period_number INT NOT NULL CHECK (period_number BETWEEN 1 AND 10),
    start_time VARCHAR(5) NOT NULL,
    end_time VARCHAR(5) NOT NULL,
    room VARCHAR(50) DEFAULT 'Room 101',
    academic_year VARCHAR(20) DEFAULT '2026-2027',
    term VARCHAR(20) DEFAULT 'Term 1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (class_id, day_of_week, period_number),
    UNIQUE (teacher_id, day_of_week, period_number)
);

-- 8. Grades Table
CREATE TABLE IF NOT EXISTS grades (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id VARCHAR(36) REFERENCES subjects(id) ON DELETE SET NULL,
    term VARCHAR(50) NOT NULL,
    sequence INT,
    system VARCHAR(30) DEFAULT 'cameroon_20',
    ca1 DECIMAL(5, 2),
    ca2 DECIMAL(5, 2),
    exam DECIMAL(5, 2),
    total_score DECIMAL(5, 2) NOT NULL,
    max_score DECIMAL(5, 2) DEFAULT 20.00,
    coefficient INT DEFAULT 1,
    remark VARCHAR(100),
    graded_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Report Cards Table
CREATE TABLE IF NOT EXISTS report_cards (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) DEFAULT '2026-2027',
    term VARCHAR(50) NOT NULL,
    system VARCHAR(30) NOT NULL,
    total_points DECIMAL(7, 2) NOT NULL,
    total_max_points DECIMAL(7, 2) NOT NULL,
    average DECIMAL(5, 2) NOT NULL,
    rank INT,
    class_size INT DEFAULT 1,
    conduct VARCHAR(50) DEFAULT 'Good',
    absences INT DEFAULT 0,
    teacher_remarks TEXT,
    principal_remarks TEXT,
    subject_grades JSON,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, term, academic_year)
);

-- 10. Lesson Plans Table
CREATE TABLE IF NOT EXISTS lesson_plans (
    id VARCHAR(36) PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id VARCHAR(36) REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    subsystem VARCHAR(20) NOT NULL CHECK (subsystem IN ('anglophone', 'francophone')),
    week_number INT,
    objectives TEXT,
    competencies TEXT,
    materials TEXT,
    activities TEXT,
    evaluation TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Quizzes & Submissions
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(36) PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id VARCHAR(36) REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit_minutes INT DEFAULT 30,
    passing_score INT DEFAULT 50,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(36) PRIMARY KEY,
    quiz_id VARCHAR(36) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('mcq', 'short_answer', 'true_false')),
    points DECIMAL(5, 2) DEFAULT 1.0,
    options JSON,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_submissions (
    id VARCHAR(36) PRIMARY KEY,
    quiz_id VARCHAR(36) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    score DECIMAL(5, 2) NOT NULL,
    max_score DECIMAL(5, 2) NOT NULL,
    answers JSON,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. System Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_class_term ON grades(class_id, term);
CREATE INDEX IF NOT EXISTS idx_timetable_class ON timetable_slots(class_id);
CREATE INDEX IF NOT EXISTS idx_timetable_teacher ON timetable_slots(teacher_id);
CREATE INDEX IF NOT EXISTS idx_report_cards_student ON report_cards(student_id);
