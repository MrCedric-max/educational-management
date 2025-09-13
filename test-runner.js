// Simple test runner for Educational Management System
// This script can be run in the browser console to test basic functionality

console.log('🧪 Educational Management System - Test Runner');
console.log('==============================================');

// Test 1: Check if all pages are accessible
function testNavigation() {
  console.log('\n📍 Testing Navigation...');
  
  const expectedPages = [
    '/classes',
    '/lesson-planner', 
    '/quiz',
    '/student-progress',
    '/parent-portal',
    '/monthly-reports',
    '/student-roster',
    '/progress-insights',
    '/export-center'
  ];
  
  expectedPages.forEach(page => {
    const link = document.querySelector(`a[href="${page}"]`);
    if (link) {
      console.log(`✅ ${page} - Link found`);
    } else {
      console.log(`❌ ${page} - Link missing`);
    }
  });
}

// Test 2: Check if React components are mounted
function testReactComponents() {
  console.log('\n⚛️ Testing React Components...');
  
  const reactRoot = document.getElementById('root');
  if (reactRoot && reactRoot.children.length > 0) {
    console.log('✅ React app is mounted');
  } else {
    console.log('❌ React app not mounted');
  }
}

// Test 3: Check for console errors
function testConsoleErrors() {
  console.log('\n🚨 Checking for Console Errors...');
  
  // Override console.error to catch errors
  const originalError = console.error;
  let errorCount = 0;
  
  console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    if (errorCount === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log(`❌ ${errorCount} console errors detected`);
    }
    console.error = originalError;
  }, 1000);
}

// Test 4: Check responsive design
function testResponsiveDesign() {
  console.log('\n📱 Testing Responsive Design...');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`Current viewport: ${viewport.width}x${viewport.height}`);
  
  if (viewport.width >= 1024) {
    console.log('✅ Desktop layout detected');
  } else if (viewport.width >= 768) {
    console.log('✅ Tablet layout detected');
  } else {
    console.log('✅ Mobile layout detected');
  }
}

// Test 5: Check for required libraries
function testLibraries() {
  console.log('\n📚 Testing Required Libraries...');
  
  const libraries = [
    { name: 'React', check: () => typeof React !== 'undefined' },
    { name: 'React Router', check: () => typeof window.ReactRouterDOM !== 'undefined' },
    { name: 'Lucide Icons', check: () => typeof window.lucide !== 'undefined' },
    { name: 'Recharts', check: () => typeof window.Recharts !== 'undefined' },
    { name: 'React Hot Toast', check: () => typeof window.reactHotToast !== 'undefined' }
  ];
  
  libraries.forEach(lib => {
    if (lib.check()) {
      console.log(`✅ ${lib.name} - Loaded`);
    } else {
      console.log(`❌ ${lib.name} - Not loaded`);
    }
  });
}

// Test 6: Check form functionality
function testForms() {
  console.log('\n📝 Testing Forms...');
  
  const forms = document.querySelectorAll('form');
  console.log(`Found ${forms.length} forms`);
  
  const inputs = document.querySelectorAll('input, select, textarea');
  console.log(`Found ${inputs.length} form inputs`);
  
  if (inputs.length > 0) {
    console.log('✅ Form elements detected');
  } else {
    console.log('❌ No form elements found');
  }
}

// Test 7: Check for charts
function testCharts() {
  console.log('\n📊 Testing Charts...');
  
  const chartElements = document.querySelectorAll('[class*="recharts"]');
  console.log(`Found ${chartElements.length} chart elements`);
  
  if (chartElements.length > 0) {
    console.log('✅ Charts detected');
  } else {
    console.log('⚠️ No charts visible (may need to navigate to Progress Insights)');
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting comprehensive tests...\n');
  
  testNavigation();
  testReactComponents();
  testConsoleErrors();
  testResponsiveDesign();
  testLibraries();
  testForms();
  testCharts();
  
  console.log('\n✅ Test run completed!');
  console.log('Check the results above for any issues.');
}

// Export for manual testing
window.testEMS = {
  runAllTests,
  testNavigation,
  testReactComponents,
  testConsoleErrors,
  testResponsiveDesign,
  testLibraries,
  testForms,
  testCharts
};

// Auto-run tests if in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  setTimeout(runAllTests, 2000);
}

console.log('\n💡 Manual testing commands available:');
console.log('- testEMS.runAllTests() - Run all tests');
console.log('- testEMS.testNavigation() - Test navigation');
console.log('- testEMS.testForms() - Test forms');
console.log('- testEMS.testCharts() - Test charts');














