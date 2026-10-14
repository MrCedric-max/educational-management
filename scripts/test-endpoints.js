const http = require('http');

async function request(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...headers
      }
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(d) });
        } catch {
          resolve({ status: res.statusCode, raw: d });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('================================================================================');
  console.log(' Educational Management System - Full API & Security Verification Suite');
  console.log('================================================================================');

  let passed = 0;
  let failed = 0;

  async function test(name, method, url, data = null, headers = {}, expectedStatus = null) {
    try {
      const res = await request(url, method, data, headers);
      const isSuccess = expectedStatus ? (res.status === expectedStatus) : (res.status >= 200 && res.status < 300);
      if (isSuccess) {
        passed++;
        console.log(` ✅ PASS [${res.status}] ${method.padEnd(5)} ${name} (${url})`);
        return res;
      } else {
        failed++;
        console.log(` ❌ FAIL [${res.status}] ${method.padEnd(5)} ${name} (${url}) - Expected ${expectedStatus || '2xx'}`);
        return res;
      }
    } catch (err) {
      failed++;
      console.log(` ❌ FAIL [ERR] ${method.padEnd(5)} ${name} -> ${err.message}`);
      return null;
    }
  }

  // 1. Diagnostics & Health
  await test('Direct Backend Health Check', 'GET', 'http://127.0.0.1:3001/health');
  await test('Proxy Health Check (Port 3000)', 'GET', 'http://127.0.0.1:3000/health');
  await test('API Diagnostics (Port 3000)', 'GET', 'http://127.0.0.1:3000/api/test');

  // 2. Public / General Data
  await test('Get Users List', 'GET', 'http://127.0.0.1:3000/api/users');
  await test('Get Schools Directory', 'GET', 'http://127.0.0.1:3000/api/schools');
  await test('Get Classes List', 'GET', 'http://127.0.0.1:3000/api/classes');
  await test('Get Students Directory', 'GET', 'http://127.0.0.1:3000/api/students');

  // 3. Domain CRUD
  await test('Get Attendance Records', 'GET', 'http://127.0.0.1:3000/api/attendance');
  await test('Post Attendance Entry', 'POST', 'http://127.0.0.1:3000/api/attendance', {
    records: [{ studentId: 'std_demo', studentName: 'Test Student', status: 'present' }]
  });
  await test('Get Gradebook Records', 'GET', 'http://127.0.0.1:3000/api/grades');
  await test('Post Gradebook Assessment', 'POST', 'http://127.0.0.1:3000/api/grades', {
    grades: [{ studentId: 'std_demo', score: 18, subject: 'Mathematics' }]
  });
  await test('Get Timetable Slots', 'GET', 'http://127.0.0.1:3000/api/timetables');
  await test('Post Timetable Slot', 'POST', 'http://127.0.0.1:3000/api/timetables', {
    className: 'Form 3A', subjectName: 'Chemistry', dayOfWeek: 2, periodNumber: 4
  });

  // 4. Security & JWT Authentication
  const loginRes = await test('Auth Login (Admin)', 'POST', 'http://127.0.0.1:3000/api/auth/login', {
    email: 'admin@example.com', password: 'password123'
  });
  const adminToken = loginRes?.data?.token;

  await test('Auth Login (Test User)', 'POST', 'http://127.0.0.1:3000/api/auth/login', {
    email: 'test@example.com', password: 'password123'
  });
  await test('Auth Register (New Teacher)', 'POST', 'http://127.0.0.1:3000/api/auth/register', {
    name: 'Dr. Jean Mbarga', email: 'jean.mbarga@school.cm', password: 'password123', role: 'teacher'
  });

  // 5. Guarded Endpoints (JWT Required)
  await test('Auth Me without Token (401 Expected)', 'GET', 'http://127.0.0.1:3000/api/auth/me', null, {}, 401);
  if (adminToken) {
    await test('Auth Me with Valid JWT Bearer Token', 'GET', 'http://127.0.0.1:3000/api/auth/me', null, {
      'Authorization': `Bearer ${adminToken}`
    }, 200);
    await test('RBAC Protected Admin Metrics with Admin Token', 'GET', 'http://127.0.0.1:3000/api/admin/metrics', null, {
      'Authorization': `Bearer ${adminToken}`
    }, 200);
  }
  await test('RBAC Admin Metrics without Token (401 Expected)', 'GET', 'http://127.0.0.1:3000/api/admin/metrics', null, {}, 401);

  console.log('================================================================================');
  console.log(` Summary: ${passed} passed, ${failed} failed (Total: ${passed + failed})`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run();
