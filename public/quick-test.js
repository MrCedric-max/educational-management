// Quick Test Script for Educational Management System
// Run this in the browser console for immediate feedback

console.log('🚀 Educational Management System - Quick Test');
console.log('=============================================');

function quickTest() {
  let passed = 0;
  let failed = 0;
  const results = [];

  // Test 1: Check if React app is loaded
  const reactRoot = document.getElementById('root');
  if (reactRoot && reactRoot.children.length > 0) {
    passed++;
    results.push('✅ React app loaded');
  } else {
    failed++;
    results.push('❌ React app not loaded');
  }

  // Test 2: Check for navigation
  const nav = document.querySelector('nav, [role="navigation"]');
  if (nav) {
    passed++;
    results.push('✅ Navigation found');
  } else {
    failed++;
    results.push('❌ Navigation not found');
  }

  // Test 3: Check for main content
  const main = document.querySelector('main, [role="main"]');
  if (main) {
    passed++;
    results.push('✅ Main content area found');
  } else {
    failed++;
    results.push('❌ Main content area not found');
  }

  // Test 4: Check for forms
  const forms = document.querySelectorAll('form');
  if (forms.length > 0) {
    passed++;
    results.push(`✅ ${forms.length} forms found`);
  } else {
    failed++;
    results.push('❌ No forms found');
  }

  // Test 5: Check for buttons
  const buttons = document.querySelectorAll('button, [role="button"]');
  if (buttons.length > 0) {
    passed++;
    results.push(`✅ ${buttons.length} buttons found`);
  } else {
    failed++;
    results.push('❌ No buttons found');
  }

  // Test 6: Check for links
  const links = document.querySelectorAll('a[href]');
  if (links.length > 0) {
    passed++;
    results.push(`✅ ${links.length} navigation links found`);
  } else {
    failed++;
    results.push('❌ No navigation links found');
  }

  // Test 7: Check for console errors
  const originalError = console.error;
  let errorCount = 0;
  
  console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.error = originalError;
    if (errorCount === 0) {
      passed++;
      results.push('✅ No console errors detected');
    } else {
      failed++;
      results.push(`❌ ${errorCount} console errors detected`);
    }
    
    // Display results
    console.log('\n📊 QUICK TEST RESULTS:');
    console.log('======================');
    results.forEach(result => console.log(result));
    console.log(`\nTotal: ${passed + failed} tests`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! The application is working correctly.');
    } else if (failed <= 2) {
      console.log('\n⚠️ Minor issues detected. Check failed tests above.');
    } else {
      console.log('\n🚨 Multiple issues detected. Review the application.');
    }
  }, 1000);
}

// Auto-run if in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development environment detected. Running quick test...');
  quickTest();
} else {
  console.log('💡 Run quickTest() to test the application');
}

// Make function globally available
window.quickTest = quickTest;
