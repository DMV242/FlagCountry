// Simple Assertion Function
const assertions = [];
function assert(condition, message) {
  if (!condition) {
    assertions.push(`FAIL: ${message}`);
  } else {
    assertions.push(`PASS: ${message}`);
  }
}

// --- Mocks ---
const mockLocalStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = String(value);
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

const mockDocument = {
  body: {
    classList: {
      _classes: new Set(),
      add: function(className) { this._classes.add(className); },
      remove: function(className) { this._classes.delete(className); },
      contains: function(className) { return this._classes.has(className); },
      toggle: function(className) {
        if (this.contains(className)) this.remove(className);
        else this.add(className);
      }
    }
  },
  _eventListeners: {},
  addEventListener: function(event, callback) {
    if (!this._eventListeners[event]) this._eventListeners[event] = [];
    this._eventListeners[event].push(callback);
  },
  querySelector: function(selector) {
    // Simulate finding the buttons
    if (selector === '.mode__ligth') return {
      selector,
      addEventListener: function(event, cb) { mockDocument.body._lightModeCb = cb; }
    };
    if (selector === '.mode__dark') return {
      selector,
      addEventListener: function(event, cb) { mockDocument.body._darkModeCb = cb; }
    };
    return null;
  },
  // Helper to simulate DOMContentLoaded
  simulateDOMContentLoaded: function() {
    if (this._eventListeners['DOMContentLoaded']) {
      this._eventListeners['DOMContentLoaded'].forEach(cb => cb());
    }
  },
  // Helper to simulate clicks
  simulateModeClick: function(mode) {
    const mockEvent = { preventDefault: () => {} };
    if (mode === 'light' && this.body._lightModeCb) this.body._lightModeCb(mockEvent);
    if (mode === 'dark' && this.body._darkModeCb) this.body._darkModeCb(mockEvent);
  }
};


// --- theme.js code (adapted for testing) ---
// Original theme.js is wrapped in DOMContentLoaded, so we'll call its setup function.
function initializeThemeSwitcher(document, localStorage) {
  const lightModeButton = document.querySelector('.mode__ligth');
  const darkModeButton = document.querySelector('.mode__dark');
  const body = document.body;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  };

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('light');
  }

  lightModeButton.addEventListener('click', (e) => {
    e.preventDefault();
    applyTheme('light');
    localStorage.setItem('theme', 'light');
  });

  darkModeButton.addEventListener('click', (e) => {
    e.preventDefault();
    applyTheme('dark');
    localStorage.setItem('theme', 'dark');
  });
}

// --- Tests ---
function runThemeTests() {
  // Initialize with mocks
  initializeThemeSwitcher(mockDocument, mockLocalStorage);

  // Test 1: Initial state (defaults to light if nothing in localStorage)
  mockLocalStorage.clear(); // Ensure clean storage
  mockDocument.body.classList._classes.clear(); // Clear classes
  initializeThemeSwitcher(mockDocument, mockLocalStorage); // Re-initialize
  assert(!mockDocument.body.classList.contains('dark-mode'), 'Initial: Body should not have dark-mode class');

  // Test 2: Toggle Dark Mode
  mockDocument.simulateModeClick('dark');
  assert(mockDocument.body.classList.contains('dark-mode'), 'Dark Mode: Body should have dark-mode class');
  assert(mockLocalStorage.getItem('theme') === 'dark', 'Dark Mode: localStorage theme should be "dark"');

  // Test 3: Toggle Light Mode
  mockDocument.simulateModeClick('light');
  assert(!mockDocument.body.classList.contains('dark-mode'), 'Light Mode: Body should not have dark-mode class');
  assert(mockLocalStorage.getItem('theme') === 'light', 'Light Mode: localStorage theme should be "light"');

  // Test 4: Persistence - Dark Mode
  mockLocalStorage.clear();
  mockDocument.body.classList._classes.clear();
  mockLocalStorage.setItem('theme', 'dark'); // Pre-set dark theme
  initializeThemeSwitcher(mockDocument, mockLocalStorage); // Re-initialize
  assert(mockDocument.body.classList.contains('dark-mode'), 'Persistence Dark: Body should have dark-mode class from localStorage');

  // Test 5: Persistence - Light Mode
  mockLocalStorage.clear();
  mockDocument.body.classList._classes.clear();
  mockLocalStorage.setItem('theme', 'light'); // Pre-set light theme
  initializeThemeSwitcher(mockDocument, mockLocalStorage); // Re-initialize
  assert(!mockDocument.body.classList.contains('dark-mode'), 'Persistence Light: Body should not have dark-mode class from localStorage');

  // Output results
  console.log("\n--- Theme Test Results ---");
  assertions.forEach(a => console.log(a));
  const failedCount = assertions.filter(a => a.startsWith("FAIL")).length;
  console.log(`Tests finished. Passed: ${assertions.length - failedCount}, Failed: ${failedCount}`);
  if (failedCount > 0) process.exit(1);
}

runThemeTests();
