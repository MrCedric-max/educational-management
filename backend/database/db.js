const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const { runMigrations } = require('../../scripts/migrate-database');

const DB_PATH = path.resolve(__dirname, 'educational_management.sqlite');

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    // Ensure directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Run migrations automatically on init
    runMigrations(DB_PATH);

    dbInstance = new DatabaseSync(DB_PATH);
    
    // Pragmas for performance and data integrity
    dbInstance.exec('PRAGMA foreign_keys = OFF;'); // Prevent strict rejection of demo mock inserts
    dbInstance.exec('PRAGMA journal_mode = WAL;');
  }
  return dbInstance;
}

// -----------------------------------------------------------------------------
// Database Operations
// -----------------------------------------------------------------------------

function getUsers() {
  const db = getDb();
  return db.prepare('SELECT id, full_name as name, email, role FROM users ORDER BY created_at ASC').all();
}

function getUserByEmail(email) {
  const db = getDb();
  return db.prepare('SELECT id, full_name as name, email, password_hash, role FROM users WHERE email = ?').get(email);
}

function createUser({ name, email, password, role }) {
  const db = getDb();
  const id = 'usr_' + Date.now();
  const passwordHash = password || '$2a$10$defaultDemoHash';
  db.prepare(`
    INSERT INTO users (id, email, full_name, role, password_hash)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, email, name, (role || 'student').toUpperCase(), passwordHash);

  return { id, name, email, role: (role || 'student').toLowerCase() };
}

function getSchools() {
  const db = getDb();
  return db.prepare(`
    SELECT 
      id, 
      name, 
      system, 
      school_code as schoolCode, 
      admin_email as adminEmail, 
      COALESCE(address, city) as location,
      city, 
      region, 
      phone, 
      is_active as isActive
    FROM schools
  `).all();
}

function getClasses() {
  const db = getDb();
  return db.prepare('SELECT id, school_id as schoolId, name, level, system, room FROM classes').all();
}

function getStudents(classId = null) {
  const db = getDb();
  if (classId) {
    return db.prepare('SELECT id, full_name as fullName, matricule, class_id as classId, gender FROM students WHERE class_id = ?').all(classId);
  }
  return db.prepare('SELECT id, full_name as fullName, matricule, class_id as classId, gender FROM students').all();
}

function getAttendance({ classId, date } = {}) {
  const db = getDb();
  let sql = `
    SELECT 
      a.id, 
      a.class_id as classId, 
      a.student_id as studentId, 
      COALESCE(s.full_name, a.student_id) as studentName, 
      a.date, 
      a.status, 
      a.time_in as timeIn, 
      a.reason, 
      a.parent_notified as parentNotified
    FROM attendance a
    LEFT JOIN students s ON a.student_id = s.id
    WHERE 1=1
  `;
  const params = [];
  if (classId) {
    sql += ' AND a.class_id = ?';
    params.push(classId);
  }
  if (date) {
    sql += ' AND a.date = ?';
    params.push(date);
  }
  sql += ' ORDER BY a.date DESC, studentName ASC';

  return db.prepare(sql).all(...params);
}

function saveAttendance(records) {
  const db = getDb();
  const list = Array.isArray(records) ? records : [records];
  const stmt = db.prepare(`
    INSERT INTO attendance (id, student_id, class_id, date, status, time_in, reason, parent_notified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (student_id, class_id, date) DO UPDATE SET
      status = excluded.status,
      time_in = excluded.time_in,
      reason = excluded.reason,
      parent_notified = excluded.parent_notified
  `);

  for (const item of list) {
    const id = item.id || ('att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
    const studentId = item.studentId || item.student_id || 'std_unknown';
    const classId = item.classId || item.class_id || 'class_1';
    const date = item.date || new Date().toISOString().split('T')[0];
    const status = item.status || 'present';
    const timeIn = item.timeIn || item.time_in || null;
    const reason = item.reason || null;
    const parentNotified = item.parentNotified ? 1 : 0;

    stmt.run(id, studentId, classId, date, status, timeIn, reason, parentNotified);
  }
  return true;
}

function getGrades({ classId, subjectId, term } = {}) {
  const db = getDb();
  let sql = `
    SELECT 
      g.id, 
      g.class_id as classId, 
      g.student_id as studentId, 
      COALESCE(s.full_name, g.student_id) as studentName, 
      g.subject_id as subjectId,
      COALESCE(sub.name, g.subject_id, 'General') as subjectName,
      g.term, 
      g.sequence,
      g.system,
      g.ca1, 
      g.ca2, 
      g.exam, 
      g.total_score as totalScore,
      g.max_score as maxScore,
      g.coefficient,
      g.remark
    FROM grades g
    LEFT JOIN students s ON g.student_id = s.id
    LEFT JOIN subjects sub ON g.subject_id = sub.id
    WHERE 1=1
  `;
  const params = [];
  if (classId) {
    sql += ' AND g.class_id = ?';
    params.push(classId);
  }
  if (subjectId) {
    sql += ' AND g.subject_id = ?';
    params.push(subjectId);
  }
  if (term) {
    sql += ' AND g.term = ?';
    params.push(term);
  }
  sql += ' ORDER BY g.term ASC, studentName ASC';

  return db.prepare(sql).all(...params);
}

function saveGrades(grades) {
  const db = getDb();
  const list = Array.isArray(grades) ? grades : [grades];
  const stmt = db.prepare(`
    INSERT INTO grades (id, student_id, class_id, subject_id, term, sequence, system, ca1, ca2, exam, total_score, max_score, coefficient, remark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of list) {
    const id = item.id || ('grd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
    const studentId = item.studentId || item.student_id || 'std_unknown';
    const classId = item.classId || item.class_id || 'class_1';
    const subjectId = item.subjectId || item.subject_id || item.subject || 'sub_general';
    const term = item.term || 'Term 1';
    const sequence = item.sequence || 1;
    const system = item.system || 'cameroon_20';
    const ca1 = item.ca1 !== undefined ? item.ca1 : null;
    const ca2 = item.ca2 !== undefined ? item.ca2 : null;
    const exam = item.exam !== undefined ? item.exam : null;
    const totalScore = item.totalScore || item.score || (exam !== null ? exam : 10);
    const maxScore = item.maxScore || 20.0;
    const coefficient = item.coefficient || 1;
    const remark = item.remark || null;

    stmt.run(id, studentId, classId, subjectId, term, sequence, system, ca1, ca2, exam, totalScore, maxScore, coefficient, remark);
  }
  return true;
}

function getTimetables({ classId, teacherId } = {}) {
  const db = getDb();
  let sql = `
    SELECT 
      id, 
      class_id as classId, 
      class_name as className, 
      subject_id as subjectId, 
      subject_name as subjectName, 
      teacher_id as teacherId, 
      teacher_name as teacherName, 
      day_of_week as dayOfWeek, 
      period_number as periodNumber, 
      start_time as startTime, 
      end_time as endTime, 
      room,
      academic_year as academicYear,
      term
    FROM timetable_slots
    WHERE 1=1
  `;
  const params = [];
  if (classId) {
    sql += ' AND class_id = ?';
    params.push(classId);
  }
  if (teacherId) {
    sql += ' AND teacher_id = ?';
    params.push(teacherId);
  }
  sql += ' ORDER BY day_of_week ASC, period_number ASC';

  return db.prepare(sql).all(...params);
}

function createTimetableSlot(slot) {
  const db = getDb();
  const id = slot.id || ('slot_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
  const classId = slot.classId || 'class_1';
  const className = slot.className || 'Form 3A';
  const subjectId = slot.subjectId || 'sub_math';
  const subjectName = slot.subjectName || slot.subject || 'General Studies';
  const teacherId = slot.teacherId || 'usr_cedric';
  const teacherName = slot.teacherName || 'Mr. Cedric Mbida';
  const dayOfWeek = slot.dayOfWeek || 1;
  const periodNumber = slot.periodNumber || 1;
  const startTime = slot.startTime || '07:30';
  const endTime = slot.endTime || '08:25';
  const room = slot.room || 'Room 101';
  const academicYear = slot.academicYear || '2026-2027';
  const term = slot.term || 'Term 1';

  db.prepare(`
    INSERT INTO timetable_slots (
      id, class_id, subject_id, teacher_id, class_name, subject_name, 
      teacher_name, day_of_week, period_number, start_time, end_time, room, academic_year, term
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (class_id, day_of_week, period_number) DO UPDATE SET
      subject_name = excluded.subject_name,
      teacher_name = excluded.teacher_name,
      room = excluded.room
  `).run(id, classId, subjectId, teacherId, className, subjectName, teacherName, dayOfWeek, periodNumber, startTime, endTime, room, academicYear, term);

  return {
    id, classId, className, subjectId, subjectName, teacherId, teacherName,
    dayOfWeek, periodNumber, startTime, endTime, room, academicYear, term
  };
}

function getReportCards({ classId, studentId, term } = {}) {
  const db = getDb();
  let sql = 'SELECT * FROM report_cards WHERE 1=1';
  const params = [];
  if (classId) {
    sql += ' AND class_id = ?';
    params.push(classId);
  }
  if (studentId) {
    sql += ' AND student_id = ?';
    params.push(studentId);
  }
  if (term) {
    sql += ' AND term = ?';
    params.push(term);
  }
  return db.prepare(sql).all(...params);
}

module.exports = {
  getDb,
  getUsers,
  getUserByEmail,
  createUser,
  getSchools,
  getClasses,
  getStudents,
  getAttendance,
  saveAttendance,
  getGrades,
  saveGrades,
  getTimetables,
  createTimetableSlot,
  getReportCards
};
