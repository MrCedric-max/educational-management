const http = require('http');

async function request(url, method = 'GET', data = null) {
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
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
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
  const testCases = [
    { name: 'Direct Backend Health Check', url: 'http://127.0.0.1:3001/health', method: 'GET' },
    { name: 'Proxy Health Check (Port 3000)', url: 'http://127.0.0.1:3000/health', method: 'GET' },
    { name: 'API Diagnostics (Port 3000)', url: 'http://127.0.0.1:3000/api/test', method: 'GET' },
    { name: 'Get Users List', url: 'http://127.0.0.1:3000/api/users', method: 'GET' },
    { name: 'Get Schools Directory', url: 'http://127.0.0.1:3000/api/schools', method: 'GET' },
    { name: 'Get Attendance Records', url: 'http://127.0.0.1:3000/api/attendance', method: 'GET' },
    {
      name: 'Post Attendance Entry',
      url: 'http://127.0.0.1:3000/api/attendance',
      method: 'POST',
      data: { records: [{ studentId: 'std_demo', studentName: 'Test Student', status: 'present' }] }
    },
    { name: 'Get Gradebook Records', url: 'http://127.0.0.1:3000/api/grades', method: 'GET' },
    {
      name: 'Post Gradebook Assessment',
      url: 'http://127.0.0.1:3000/api/grades',
      method: 'POST',
      data: { grades: [{ studentId: 'std_demo', score: 18, subject: 'Mathematics' }] }
    },
    { name: 'Get Timetable Slots', url: 'http://127.0.0.1:3000/api/timetables', method: 'GET' },
    {
      name: 'Post Timetable Slot',
      url: 'http://127.0.0.1:3000/api/timetables',
      method: 'POST',
      data: { className: 'Form 3A', subjectName: 'Chemistry', dayOfWeek: 2, periodNumber: 4 }
    },
    {
      name: 'Auth Login (Admin)',
      url: 'http://127.0.0.1:3000/api/auth/login',
      method: 'POST',
      data: { email: 'admin@example.com', password: 'password123' }
    },
    {
      name: 'Auth Login (Test User)',
      url: 'http://127.0.0.1:3000/api/auth/login',
      method: 'POST',
      data: { email: 'test@example.com', password: 'password123' }
    },
    {
      name: 'Auth Register',
      url: 'http://127.0.0.1:3000/api/auth/register',
      method: 'POST',
      data: { name: 'Dr. Jean Mbarga', email: 'jean.mbarga@school.cm', password: 'password123', role: 'teacher' }
    }
  ];

  console.log('================================================================================');
  console.log(' Educational Management System - Full API Verification Suite');
  console.log('================================================================================');

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    try {
      const res = await request(tc.url, tc.method, tc.data);
      const isSuccess = res.status >= 200 && res.status < 300;
      if (isSuccess) {
        passed++;
        console.log(` ✅ PASS [${res.status}] ${tc.method.padEnd(5)} ${tc.name} (${tc.url})`);
      } else {
        failed++;
        console.log(` ❌ FAIL [${res.status}] ${tc.method.padEnd(5)} ${tc.name} (${tc.url})`);
      }
    } catch (err) {
      failed++;
      console.log(` ❌ FAIL [ERR] ${tc.method.padEnd(5)} ${tc.name} -> ${err.message}`);
    }
  }

  console.log('================================================================================');
  console.log(` Summary: ${passed} passed, ${failed} failed (Total: ${testCases.length})`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run();
