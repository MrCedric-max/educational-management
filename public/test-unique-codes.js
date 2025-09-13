// Test script for unique code generation functionality
console.log('🧪 Testing Unique Code Generation...');

// Test school code generation
function generateSchoolCode(schoolName) {
  const words = schoolName.split(' ').filter(word => word.length > 0);
  const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${initials}${randomNum}`;
}

// Test user code generation
function generateUserCode(userName, role) {
  const words = userName.split(' ').filter(word => word.length > 0);
  const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
  const rolePrefix = role.charAt(0).toUpperCase();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${rolePrefix}${initials}${randomNum}`;
}

// Test cases
const testSchools = [
  'St. Mary\'s Primary School',
  'École Primaire La Salle',
  'Greenwood Elementary School',
  'Lycée International de Paris',
  'Central High School',
  'Academy of Excellence'
];

const testUsers = [
  { name: 'John Smith', role: 'teacher' },
  { name: 'Marie Dubois', role: 'student' },
  { name: 'Sarah Johnson', role: 'parent' },
  { name: 'Pierre Martin', role: 'school_admin' }
];

console.log('\n📚 School Code Generation Tests:');
testSchools.forEach(school => {
  const code = generateSchoolCode(school);
  console.log(`  ${school} → ${code}`);
});

console.log('\n👥 User Code Generation Tests:');
testUsers.forEach(user => {
  const code = generateUserCode(user.name, user.role);
  console.log(`  ${user.name} (${user.role}) → ${code}`);
});

console.log('\n✅ Unique Code Generation Test Complete!');
console.log('💡 These codes can be used for login and identification purposes.');
