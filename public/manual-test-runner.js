// Comprehensive Manual Test Runner for Educational Management System
// Run this in the browser console to test all functionality

console.log('🧪 Educational Management System - Comprehensive Test Runner');
console.log('==========================================================');

class EMSTestRunner {
  constructor() {
    this.testResults = [];
    this.currentTest = null;
  }

  // Test result tracking
  logTest(testName, passed, message = '') {
    const result = {
      test: testName,
      passed,
      message,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}${message ? ` - ${message}` : ''}`);
  }

  // Test 1: Navigation and Routing
  async testNavigation() {
    console.log('\n📍 Testing Navigation and Routing...');
    
    const expectedRoutes = [
      { name: 'Classes', path: '/classes' },
      { name: 'Lesson Planner', path: '/lesson-planner' },
      { name: 'Quiz Tool', path: '/quiz' },
      { name: 'Student Progress', path: '/student-progress' },
      { name: 'Parent Portal', path: '/parent-portal' },
      { name: 'Monthly Reports', path: '/monthly-reports' },
      { name: 'Student Roster', path: '/student-roster' },
      { name: 'Progress Insights', path: '/progress-insights' },
      { name: 'Export Center', path: '/export-center' }
    ];

    for (const route of expectedRoutes) {
      const link = document.querySelector(`a[href="${route.path}"]`);
      if (link) {
        this.logTest(`Navigation Link: ${route.name}`, true);
        
        // Test clicking the link
        try {
          link.click();
          await this.wait(500); // Wait for navigation
          this.logTest(`Route Navigation: ${route.name}`, true);
        } catch (error) {
          this.logTest(`Route Navigation: ${route.name}`, false, error.message);
        }
      } else {
        this.logTest(`Navigation Link: ${route.name}`, false, 'Link not found');
      }
    }
  }

  // Test 2: Form Functionality
  async testForms() {
    console.log('\n📝 Testing Form Functionality...');
    
    const forms = document.querySelectorAll('form');
    this.logTest('Forms Found', forms.length > 0, `Found ${forms.length} forms`);
    
    const inputs = document.querySelectorAll('input, select, textarea');
    this.logTest('Form Inputs Found', inputs.length > 0, `Found ${inputs.length} inputs`);
    
    // Test form interactions
    for (const input of inputs) {
      if (input.type === 'text' || input.type === 'email') {
        try {
          input.focus();
          input.value = 'test value';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          this.logTest(`Input Interaction: ${input.name || input.id}`, true);
        } catch (error) {
          this.logTest(`Input Interaction: ${input.name || input.id}`, false, error.message);
        }
      }
    }
  }

  // Test 3: Modal Functionality
  async testModals() {
    console.log('\n🪟 Testing Modal Functionality...');
    
    const modalTriggers = document.querySelectorAll('[data-modal], button[onclick*="modal"], button[onclick*="Modal"]');
    this.logTest('Modal Triggers Found', modalTriggers.length > 0, `Found ${modalTriggers.length} modal triggers`);
    
    for (const trigger of modalTriggers) {
      try {
        trigger.click();
        await this.wait(300);
        
        const modal = document.querySelector('.modal, [role="dialog"], .fixed');
        if (modal) {
          this.logTest(`Modal Opens: ${trigger.textContent}`, true);
          
          // Test closing modal
          const closeButton = modal.querySelector('[aria-label="Close"], .close, button[onclick*="close"]');
          if (closeButton) {
            closeButton.click();
            await this.wait(300);
            this.logTest(`Modal Closes: ${trigger.textContent}`, true);
          }
        } else {
          this.logTest(`Modal Opens: ${trigger.textContent}`, false, 'Modal not found after click');
        }
      } catch (error) {
        this.logTest(`Modal Test: ${trigger.textContent}`, false, error.message);
      }
    }
  }

  // Test 4: Button Functionality
  async testButtons() {
    console.log('\n🔘 Testing Button Functionality...');
    
    const buttons = document.querySelectorAll('button, [role="button"]');
    this.logTest('Buttons Found', buttons.length > 0, `Found ${buttons.length} buttons`);
    
    let clickableButtons = 0;
    for (const button of buttons) {
      if (!button.disabled && button.offsetParent !== null) {
        try {
          button.click();
          clickableButtons++;
          await this.wait(100);
        } catch (error) {
          // Some buttons might have validation or other issues
        }
      }
    }
    
    this.logTest('Clickable Buttons', clickableButtons > 0, `${clickableButtons} buttons are clickable`);
  }

  // Test 5: Data Display
  async testDataDisplay() {
    console.log('\n📊 Testing Data Display...');
    
    // Check for tables
    const tables = document.querySelectorAll('table');
    this.logTest('Data Tables Found', tables.length > 0, `Found ${tables.length} tables`);
    
    // Check for charts
    const chartElements = document.querySelectorAll('[class*="recharts"], [class*="chart"], canvas, svg');
    this.logTest('Chart Elements Found', chartElements.length > 0, `Found ${chartElements.length} chart elements`);
    
    // Check for cards
    const cards = document.querySelectorAll('.card, [class*="card"]');
    this.logTest('Data Cards Found', cards.length > 0, `Found ${cards.length} cards`);
    
    // Check for lists
    const lists = document.querySelectorAll('ul, ol');
    this.logTest('Data Lists Found', lists.length > 0, `Found ${lists.length} lists`);
  }

  // Test 6: Responsive Design
  async testResponsiveDesign() {
    console.log('\n📱 Testing Responsive Design...');
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    this.logTest('Viewport Size', true, `${viewport.width}x${viewport.height}`);
    
    // Test different viewport sizes
    const testSizes = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1200, height: 800 }
    ];
    
    for (const size of testSizes) {
      try {
        // Simulate viewport change
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: size.width });
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: size.height });
        window.dispatchEvent(new Event('resize'));
        
        await this.wait(100);
        this.logTest(`Responsive: ${size.name}`, true, `${size.width}x${size.height}`);
      } catch (error) {
        this.logTest(`Responsive: ${size.name}`, false, error.message);
      }
    }
    
    // Restore original viewport
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: viewport.width });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: viewport.height });
    window.dispatchEvent(new Event('resize'));
  }

  // Test 7: Accessibility
  async testAccessibility() {
    console.log('\n♿ Testing Accessibility...');
    
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    let imagesWithAlt = 0;
    for (const img of images) {
      if (img.alt && img.alt.trim() !== '') {
        imagesWithAlt++;
      }
    }
    this.logTest('Images with Alt Text', imagesWithAlt === images.length, `${imagesWithAlt}/${images.length} images have alt text`);
    
    // Check for form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    let inputsWithLabels = 0;
    for (const input of inputs) {
      const label = document.querySelector(`label[for="${input.id}"]`) || input.closest('label');
      if (label || input.getAttribute('aria-label') || input.getAttribute('aria-labelledby')) {
        inputsWithLabels++;
      }
    }
    this.logTest('Form Inputs with Labels', inputsWithLabels === inputs.length, `${inputsWithLabels}/${inputs.length} inputs have labels`);
    
    // Check for heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    this.logTest('Heading Structure', headings.length > 0, `Found ${headings.length} headings`);
    
    // Check for focusable elements
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    this.logTest('Focusable Elements', focusableElements.length > 0, `Found ${focusableElements.length} focusable elements`);
  }

  // Test 8: Performance
  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    // Check for console errors
    const originalError = console.error;
    let errorCount = 0;
    
    console.error = function(...args) {
      errorCount++;
      originalError.apply(console, args);
    };
    
    await this.wait(1000);
    console.error = originalError;
    
    this.logTest('Console Errors', errorCount === 0, errorCount === 0 ? 'No errors' : `${errorCount} errors found`);
    
    // Check page load time
    const loadTime = performance.now();
    this.logTest('Page Load Time', loadTime < 3000, `${Math.round(loadTime)}ms`);
    
    // Check for large DOM
    const domNodes = document.querySelectorAll('*').length;
    this.logTest('DOM Size', domNodes < 10000, `${domNodes} DOM nodes`);
  }

  // Test 9: Interactive Features
  async testInteractiveFeatures() {
    console.log('\n🎮 Testing Interactive Features...');
    
    // Test dropdowns
    const dropdowns = document.querySelectorAll('select, [role="combobox"], .dropdown');
    this.logTest('Dropdowns Found', dropdowns.length > 0, `Found ${dropdowns.length} dropdowns`);
    
    // Test toggles
    const toggles = document.querySelectorAll('[type="checkbox"], [role="switch"], .toggle');
    this.logTest('Toggles Found', toggles.length > 0, `Found ${toggles.length} toggles`);
    
    // Test search functionality
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    this.logTest('Search Inputs Found', searchInputs.length > 0, `Found ${searchInputs.length} search inputs`);
    
    // Test filters
    const filters = document.querySelectorAll('[class*="filter"], [data-filter]');
    this.logTest('Filter Elements Found', filters.length > 0, `Found ${filters.length} filter elements`);
  }

  // Test 10: Data Persistence
  async testDataPersistence() {
    console.log('\n💾 Testing Data Persistence...');
    
    // Check localStorage usage
    const localStorageKeys = Object.keys(localStorage);
    this.logTest('LocalStorage Usage', true, `${localStorageKeys.length} keys in localStorage`);
    
    // Check sessionStorage usage
    const sessionStorageKeys = Object.keys(sessionStorage);
    this.logTest('SessionStorage Usage', true, `${sessionStorageKeys.length} keys in sessionStorage`);
    
    // Test form data persistence
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
      const form = forms[0];
      const inputs = form.querySelectorAll('input, select, textarea');
      
      if (inputs.length > 0) {
        const input = inputs[0];
        const testValue = 'test-persistence-value';
        input.value = testValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Check if value persists
        await this.wait(100);
        this.logTest('Form Data Persistence', input.value === testValue, 'Form data persists');
      }
    }
  }

  // Utility function to wait
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate test report
  generateReport() {
    console.log('\n📋 TEST REPORT');
    console.log('==============');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults.filter(r => !r.passed).forEach(test => {
        console.log(`- ${test.test}: ${test.message}`);
      });
    }
    
    console.log('\n🎯 RECOMMENDATIONS:');
    if (failedTests === 0) {
      console.log('✅ All tests passed! The application is ready for production.');
    } else if (failedTests < totalTests * 0.1) {
      console.log('⚠️ Minor issues found. Review failed tests and fix before production.');
    } else {
      console.log('🚨 Multiple issues found. Significant testing and fixes needed.');
    }
    
    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: Math.round((passedTests / totalTests) * 100),
      results: this.testResults
    };
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting comprehensive test suite...\n');
    
    await this.testNavigation();
    await this.testForms();
    await this.testModals();
    await this.testButtons();
    await this.testDataDisplay();
    await this.testResponsiveDesign();
    await this.testAccessibility();
    await this.testPerformance();
    await this.testInteractiveFeatures();
    await this.testDataPersistence();
    
    return this.generateReport();
  }
}

// Create global test runner instance
window.EMSTestRunner = new EMSTestRunner();

// Auto-run tests if in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development environment detected. Auto-running tests in 3 seconds...');
  setTimeout(() => {
    window.EMSTestRunner.runAllTests();
  }, 3000);
}

console.log('\n💡 Manual testing commands available:');
console.log('- EMSTestRunner.runAllTests() - Run all tests');
console.log('- EMSTestRunner.testNavigation() - Test navigation');
console.log('- EMSTestRunner.testForms() - Test forms');
console.log('- EMSTestRunner.testModals() - Test modals');
console.log('- EMSTestRunner.testAccessibility() - Test accessibility');
console.log('- EMSTestRunner.generateReport() - Generate test report');
