-- ==============================================================================
-- Educational Management System - Seed Data Migration (002)
-- Realistic bilingual Cameroonian educational ecosystem data
-- ==============================================================================

-- 1. Insert Demo Schools
INSERT INTO schools (id, name, system, school_code, admin_email, address, city, region, phone)
VALUES 
('sch_gbhs_yde', 'GBHS Yaoundé (Government Bilingual High School)', 'BILINGUAL', 'GBHS-YDE-001', 'admin@gbhs-yaounde.cm', 'Essos, BP 124', 'Yaoundé', 'Centre', '+237 222 21 00 11'),
('sch_lycee_leclerc', 'Lycée Général Leclerc', 'FRANCOPHONE', 'LGL-YDE-002', 'admin@leclerc.cm', 'Ngoa-Ekélé', 'Yaoundé', 'Centre', '+237 222 22 33 44')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Users (Admin, Teachers, Students, Parents)
INSERT INTO users (id, school_id, email, full_name, role, password_hash, phone, preferred_language)
VALUES 
('usr_admin', 'sch_gbhs_yde', 'admin@example.com', 'Admin User', 'SCHOOL_ADMIN', '$2a$10$WkGf1kK88...', '+237 670 00 00 01', 'en'),
('usr_test', 'sch_gbhs_yde', 'test@example.com', 'Test Educator', 'TEACHER', '$2a$10$WkGf1kK88...', '+237 670 00 00 02', 'en'),
('usr_cedric', 'sch_gbhs_yde', 'c.mbida@school.cm', 'Mr. Cedric Mbida', 'TEACHER', '$2a$10$WkGf1kK88...', '+237 671 23 45 67', 'fr'),
('usr_clara', 'sch_gbhs_yde', 'c.fon@school.cm', 'Ms. Clara Fon', 'TEACHER', '$2a$10$WkGf1kK88...', '+237 677 89 01 23', 'en'),
('usr_parent_johnson', 'sch_gbhs_yde', 'p.johnson@example.cm', 'Mr. Robert Johnson', 'PARENT', '$2a$10$WkGf1kK88...', '+237 699 11 22 33', 'en')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Subjects
INSERT INTO subjects (id, school_id, name, code, system, coefficient, department)
VALUES 
('sub_math', 'sch_gbhs_yde', 'Mathematics', 'MATH-01', 'ANGLOPHONE', 4, 'Sciences'),
('sub_eng', 'sch_gbhs_yde', 'English Language', 'ENG-01', 'ANGLOPHONE', 3, 'Languages'),
('sub_fre', 'sch_gbhs_yde', 'French / Français', 'FRE-01', 'BILINGUAL', 3, 'Languages'),
('sub_phy', 'sch_gbhs_yde', 'Physics', 'PHY-01', 'ANGLOPHONE', 3, 'Sciences'),
('sub_chem', 'sch_gbhs_yde', 'Chemistry', 'CHEM-01', 'ANGLOPHONE', 3, 'Sciences'),
('sub_bio', 'sch_gbhs_yde', 'Biology', 'BIO-01', 'ANGLOPHONE', 2, 'Sciences')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Classes
INSERT INTO classes (id, school_id, name, level, system, academic_year, main_teacher_id, room)
VALUES 
('class_form3a', 'sch_gbhs_yde', 'Form 3A', 'Secondary (Cycle 1)', 'ANGLOPHONE', '2026-2027', 'usr_cedric', 'Room 101'),
('class_form5sci', 'sch_gbhs_yde', 'Form 5 Science', 'Secondary (Cycle 2)', 'ANGLOPHONE', '2026-2027', 'usr_clara', 'Science Lab 2'),
('class_1', 'sch_gbhs_yde', 'Form 3A (Demo)', 'Secondary (Cycle 1)', 'ANGLOPHONE', '2026-2027', 'usr_cedric', 'Room 101')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Students
INSERT INTO students (id, school_id, class_id, parent_id, matricule, full_name, gender, emergency_contact)
VALUES 
('std_1', 'sch_gbhs_yde', 'class_form3a', 'usr_parent_johnson', 'GBHS-2026-001', 'Emma Johnson', 'female', '+237 699 11 22 33'),
('std_2', 'sch_gbhs_yde', 'class_form3a', NULL, 'GBHS-2026-002', 'Michael Brown', 'male', '+237 670 12 34 56'),
('std_3', 'sch_gbhs_yde', 'class_form3a', NULL, 'GBHS-2026-003', 'Sophia Davis', 'female', '+237 675 98 76 54'),
('std_4', 'sch_gbhs_yde', 'class_form3a', NULL, 'GBHS-2026-004', 'James Wilson', 'male', '+237 690 45 67 89'),
('std_5', 'sch_gbhs_yde', 'class_form3a', NULL, 'GBHS-2026-005', 'Lucas Talla', 'male', '+237 679 12 12 12'),
('s1', 'sch_gbhs_yde', 'class_1', 'usr_parent_johnson', 'GBHS-ALIAS-001', 'Emma Johnson', 'female', '+237 699 11 22 33'),
('s2', 'sch_gbhs_yde', 'class_1', NULL, 'GBHS-ALIAS-002', 'Michael Brown', 'male', '+237 670 12 34 56'),
('s3', 'sch_gbhs_yde', 'class_1', NULL, 'GBHS-ALIAS-003', 'Sophia Davis', 'female', '+237 675 98 76 54'),
('s4', 'sch_gbhs_yde', 'class_1', NULL, 'GBHS-ALIAS-004', 'James Wilson', 'male', '+237 690 45 67 89'),
('s5', 'sch_gbhs_yde', 'class_1', NULL, 'GBHS-ALIAS-005', 'Lucas Talla', 'male', '+237 679 12 12 12')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Timetable Schedule
INSERT INTO timetable_slots (id, class_id, subject_id, teacher_id, class_name, subject_name, teacher_name, day_of_week, period_number, start_time, end_time, room)
VALUES 
('slot_1', 'class_form3a', 'sub_math', 'usr_cedric', 'Form 3A', 'Mathematics', 'Mr. Cedric Mbida', 1, 1, '07:30', '08:25', 'Room 101'),
('slot_2', 'class_form3a', 'sub_math', 'usr_cedric', 'Form 3A', 'Mathematics', 'Mr. Cedric Mbida', 1, 2, '08:25', '09:20', 'Room 101'),
('slot_3', 'class_form3a', 'sub_eng', 'usr_clara', 'Form 3A', 'English Language', 'Ms. Clara Fon', 1, 3, '09:20', '10:15', 'Room 101'),
('slot_4', 'class_form3a', 'sub_phy', 'usr_cedric', 'Form 3A', 'Physics', 'Mr. Cedric Mbida', 2, 1, '07:30', '08:25', 'Room 101'),
('slot_5', 'class_form3a', 'sub_chem', 'usr_clara', 'Form 3A', 'Chemistry', 'Ms. Clara Fon', 2, 2, '08:25', '09:20', 'Science Lab 2')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Attendance Records
INSERT INTO attendance (id, student_id, class_id, date, status, time_in, reason, parent_notified, marked_by)
VALUES 
('att_seed_1', 'std_1', 'class_form3a', '2026-10-14', 'present', '07:25', NULL, FALSE, 'usr_cedric'),
('att_seed_2', 'std_2', 'class_form3a', '2026-10-14', 'present', '07:28', NULL, FALSE, 'usr_cedric'),
('att_seed_3', 'std_3', 'class_form3a', '2026-10-14', 'late', '08:15', 'Heavy rain traffic along Rond-Point Express', TRUE, 'usr_cedric'),
('att_seed_4', 'std_4', 'class_form3a', '2026-10-14', 'absent', NULL, 'Medical leave (Malaria reported by guardian)', TRUE, 'usr_cedric'),
('att_seed_5', 'std_5', 'class_form3a', '2026-10-14', 'present', '07:20', NULL, FALSE, 'usr_cedric')
ON CONFLICT (student_id, class_id, date) DO NOTHING;

-- 8. Insert Grade Records
INSERT INTO grades (id, student_id, class_id, subject_id, term, sequence, system, ca1, ca2, exam, total_score, max_score, coefficient, remark)
VALUES 
('grd_1', 'std_1', 'class_form3a', 'sub_math', 'Term 1', 1, 'cameroon_20', 16.5, 17.0, 18.0, 17.3, 20.0, 4, 'Excellent mastery of concepts'),
('grd_2', 'std_2', 'class_form3a', 'sub_math', 'Term 1', 1, 'cameroon_20', 12.0, 13.5, 11.0, 11.9, 20.0, 4, 'Satisfactory effort; needs trigonometry review'),
('grd_3', 'std_3', 'class_form3a', 'sub_math', 'Term 1', 1, 'cameroon_20', 14.0, 15.0, 14.5, 14.5, 20.0, 4, 'Good performance and active participation'),
('grd_4', 'std_1', 'class_form3a', 'sub_eng', 'Term 1', 1, 'cameroon_20', 15.0, 16.0, 16.5, 16.0, 20.0, 3, 'Very articulate composition and grammar')
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Report Card
INSERT INTO report_cards (id, student_id, class_id, student_name, class_name, academic_year, term, system, total_points, total_max_points, average, rank, class_size, conduct, absences, teacher_remarks, principal_remarks, is_published)
VALUES 
('rep_std_1', 'std_1', 'class_form3a', 'Emma Johnson', 'Form 3A', '2026-2027', 'Term 1', 'cameroon_20', 117.1, 140.0, 16.73, 1, 5, 'Exemplary', 0, 'Brilliant performance throughout the term. Keep up the high standards!', 'Promoted with highest honors (Tableau d''Honneur).', TRUE)
ON CONFLICT (student_id, term, academic_year) DO NOTHING;
