#!/usr/bin/env node

/**
 * Educational Management System - Database Migration Runner
 * Supports automatic SQL migration execution, verification, and database state reporting.
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const MIGRATIONS_DIR = path.resolve(__dirname, '../backend/migrations');
const DEFAULT_DB_DIR = path.resolve(__dirname, '../backend/database');
const DEFAULT_DB_PATH = path.join(DEFAULT_DB_DIR, 'educational_management.sqlite');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function runMigrations(dbPath = DEFAULT_DB_PATH) {
  console.log('================================================================================');
  console.log(' Educational Management System - Database Migrations');
  console.log('================================================================================');
  console.log(`📁 Database target: ${dbPath}`);

  ensureDirectoryExists(path.dirname(dbPath));
  const db = new DatabaseSync(dbPath);

  // 1. Create migration tracker table
  db.exec(`
    CREATE TABLE IF NOT EXISTS _schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Discover migration files
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error(`❌ Migrations directory not found at: ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`🔎 Found ${files.length} migration file(s) in backend/migrations/\n`);

  let appliedCount = 0;

  for (const file of files) {
    const isApplied = db.prepare('SELECT id FROM _schema_migrations WHERE filename = ?').get(file);

    if (isApplied) {
      console.log(` ⏩ Skipping already applied migration: ${file}`);
      continue;
    }

    const filePath = path.join(MIGRATIONS_DIR, file);
    const sqlContent = fs.readFileSync(filePath, 'utf8');

    process.stdout.write(` 🚀 Applying migration: ${file}... `);
    const startTime = Date.now();

    try {
      db.exec(sqlContent);
      db.prepare('INSERT INTO _schema_migrations (filename) VALUES (?)').run(file);
      const duration = Date.now() - startTime;
      console.log(`✅ Success (${duration}ms)`);
      appliedCount++;
    } catch (err) {
      console.log(`❌ Failed`);
      console.error(`\nError in migration ${file}:`, err.message);
      process.exit(1);
    }
  }

  // 3. Inspect and Print Database State
  console.log('\n================================================================================');
  console.log(' Database Modeling & Tables Summary');
  console.log('================================================================================');

  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name != '_schema_migrations'
    ORDER BY name
  `).all();

  console.log(`\nActive Schema Tables (${tables.length}):`);
  console.log('--------------------------------------------------------------------------------');
  console.log('| Table Name           | Records | Description / Domain Model                  |');
  console.log('--------------------------------------------------------------------------------');

  const descriptions = {
    schools: 'Schools, subsystems, bilingual institutions & contact info',
    users: 'Admins, teachers, students, parents, staff credentials',
    classes: 'Classrooms, streams, academic levels & cycles',
    students: 'Student profiles, matricules, guardians, classes',
    subjects: 'Academic subjects, departments, course coefficients',
    timetable_slots: 'Weekly schedules, periods, room & conflict checking',
    attendance: 'Daily student attendance, tardiness, parental notices',
    grades: 'Continuous assessments (CA1, CA2, Exam) & scores',
    report_cards: 'Official term reports, averages, ranking & remarks',
    lesson_plans: 'Cameroon/Anglophone structured lesson plans',
    quizzes: 'Online/offline assessments & evaluation specs',
    quiz_questions: 'Assessment item bank (MCQ, short answer)',
    quiz_submissions: 'Student evaluation responses and scored results',
    notifications: 'Realtime announcements and system alerts'
  };

  for (const t of tables) {
    const countRow = db.prepare(`SELECT count(*) as total FROM "${t.name}"`).get();
    const desc = descriptions[t.name] || 'Domain entity model';
    console.log(`| ${t.name.padEnd(20)} | ${String(countRow.total).padStart(7)} | ${desc.padEnd(43)} |`);
  }
  console.log('--------------------------------------------------------------------------------');

  console.log(`\n🎉 Migrations run complete. Applied: ${appliedCount}, Total Tables: ${tables.length}`);
  console.log('================================================================================\n');

  return { appliedCount, totalTables: tables.length };
}

if (require.main === module) {
  const target = process.argv[2] || DEFAULT_DB_PATH;
  runMigrations(target);
}

module.exports = { runMigrations };
