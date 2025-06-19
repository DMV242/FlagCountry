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
const mockModel = {
  state: {
    countries: [],
    FilterCountries: [],
    CountrySearch: [],
  },
  fecthCountries: async function () {
    // Simulate fetching 50 countries
    mockModel.state.countries = Array.from({ length: 50 }, (_, i) => ({
      name: `Country ${i + 1}`,
      alpha3Code: `C${i + 1}`,
      population: (i + 1) * 1000,
      region: i % 5 === 0 ? 'Africa' : 'Asia', // Alternate regions
      capital: `Capital ${i + 1}`,
    }));
  },
  getCountriesByPage: function (page = 1) {
    const start = (page - 1) * 20;
    const end = page * 20;
    return mockModel.state.countries.slice(start, end);
  },
  // Mock other model functions if they interfere or are called by controller
  fecthCountriesByRegion: async function(region) {
    if (!region) return;
    mockModel.state.FilterCountries = mockModel.state.countries.filter(c => c.region === region);
  },
  fecthCountriesBySearch: async function(name) {
    if (!name) return;
    mockModel.state.CountrySearch = mockModel.state.countries.filter(c => c.name.includes(name));
  }
};

let renderedData = []; // To store the actual data part of the render
const mockCardsView = {
  _currentPage: 0,
  _totalPages: 0,
  _lastGeneratedMarkup: "", // To store the generated HTML string for pagination controls

  renderSpinner: function () { /* console.log('Spinner rendered'); */ },

  // Mocked _generateMarkup (simplified for testing pagination controls)
  _generateMockMarkup: function() {
    let paginationMarkup = "";
    // Only show pagination controls if there's more than one page
    if (this._totalPages > 1) {
      paginationMarkup = `
        <div class="pagination-controls">
          <button class="btn btn--prev" ${this._currentPage === 1 ? "disabled" : ""}>Previous</button>
          <span>Page ${this._currentPage} of ${this._totalPages}</span>
          <button class="btn btn--next" ${this._currentPage === this._totalPages ? "disabled" : ""}>Next</button>
        </div>
      `;
    }
    // In real view, this would be combined with countriesMarkup
    // For tests, we only care about pagination part for some assertions.
    this._lastGeneratedMarkup = paginationMarkup;
  },

  render: function (data, currentPage, totalPages) {
    renderedData = data; // Store the data part
    this._currentPage = currentPage;
    this._totalPages = totalPages;
    this._generateMockMarkup(); // Generate the markup based on new state
    // console.log(`Rendered ${data.length} countries. Page ${currentPage} of ${totalPages}`);
    // console.log(`Markup: ${this._lastGeneratedMarkup}`);
  },
  renderError: function (message) { console.error(`RenderError: ${message}`); },
  handleNextPage: function(handler) { /* Not testing event setup here */ },
  handlePreviousPage: function(handler) { /* Not testing event setup here */ },
};

const mockSelectView = { handleRegionField: () => {} }; // Not testing view interactions
const mockSearchView = { handleSearch: () => {} };     // Not testing view interactions

// --- Controller Logic (adapted from actual controller.js for testing) ---
let controllerCurrentPage = 1; // Renamed to avoid conflict with mockCardsView._currentPage if used globally
const CONTROLLER_ITEMS_PER_PAGE = 20;

const renderPaginatedView = function (page) {
  controllerCurrentPage = page;
  const totalCountries = mockModel.state.countries.length;
  if (totalCountries === 0) {
    mockCardsView.render([], 0, 0);
    return;
  }
  const totalPages = Math.ceil(totalCountries / CONTROLLER_ITEMS_PER_PAGE);
  if (page > totalPages && totalPages > 0) controllerCurrentPage = totalPages;
  if (page < 1 && totalPages > 0) controllerCurrentPage = 1;

  mockCardsView.render(mockModel.getCountriesByPage(controllerCurrentPage), controllerCurrentPage, totalPages);
};

const controlAllCountriesInitial = async function () {
  mockCardsView.renderSpinner();
  if (mockModel.state.countries.length === 0) {
    await mockModel.fecthCountries();
  }
  renderPaginatedView(1);
};

const controlNextPage = function () {
  const totalCountries = mockModel.state.countries.length;
  const totalPages = Math.ceil(totalCountries / CONTROLLER_ITEMS_PER_PAGE);
  if (controllerCurrentPage < totalPages) {
    renderPaginatedView(controllerCurrentPage + 1);
  }
};

const controlPreviousPage = function () {
  if (controllerCurrentPage > 1) {
    renderPaginatedView(controllerCurrentPage - 1);
  }
};

const controlCountriesByRegion = async function (region) {
  if (!region) {
    await controlAllCountriesInitial();
    return;
  }
  mockCardsView.renderSpinner();
  await mockModel.fecthCountriesByRegion(region);
  mockCardsView.render(mockModel.state.FilterCountries, 0, 0); // No pagination for filtered
};

const controlCountriesBySearch = async function (name) {
  if (!name) {
    await controlAllCountriesInitial();
    return;
  }
  mockCardsView.renderSpinner();
  await mockModel.fecthCountriesBySearch(name);
  mockCardsView.render(mockModel.state.CountrySearch, 0, 0); // No pagination for search
};

// --- Tests ---
async function runPaginationTests() {
  // Test 1: Initial Load (First Page)
  await controlAllCountriesInitial(); // This sets controllerCurrentPage to 1
  assert(renderedData.length === 20, 'Initial load: renders 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 1', 'Initial load: renders first country');
  assert(mockCardsView._currentPage === 1, 'Initial load: view currentPage is 1');
  assert(mockCardsView._totalPages === 3, 'Initial load: view totalPages is 3 (50 items / 20 per page)');
  assert(mockCardsView._lastGeneratedMarkup.includes('Page 1 of 3'), 'Initial load: markup shows "Page 1 of 3"');
  assert(mockCardsView._lastGeneratedMarkup.includes('<button class="btn btn--prev" disabled>Previous</button>'), 'Initial load: markup "Previous" button is disabled');
  assert(mockCardsView._lastGeneratedMarkup.includes('<button class="btn btn--next" >Next</button>'), 'Initial load: markup "Next" button is enabled');

  // Test 2: Next Page (to Page 2)
  controlNextPage();
  assert(controllerCurrentPage === 2, 'Next Page (to P2): controllerCurrentPage is 2');
  assert(renderedData.length === 20, 'Next Page should render 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 21', 'Next Page renders country 21');

  // Test 3: Next Page Again (to Page 3 - Last Page)
  controlNextPage();
  assert(controllerCurrentPage === 3, 'Next Page (to P3): controllerCurrentPage is 3');
  assert(renderedData.length === 10, 'Next Page (to P3): renders 10 countries (last page)');
  assert(renderedData[0] && renderedData[0].name === 'Country 41', 'Next Page (to P3): renders country 41');
  assert(mockCardsView._currentPage === 3, 'Next Page (to P3): view currentPage is 3');
  assert(mockCardsView._lastGeneratedMarkup.includes('Page 3 of 3'), 'Next Page (to P3): markup shows "Page 3 of 3"');
  assert(mockCardsView._lastGeneratedMarkup.includes('<button class="btn btn--prev" >Previous</button>'), 'Next Page (to P3): markup "Previous" button is enabled');
  assert(mockCardsView._lastGeneratedMarkup.includes('<button class="btn btn--next" disabled>Next</button>'), 'Next Page (to P3): markup "Next" button is disabled');

  // Test 4: Page Boundary (Next on Last Page)
  controlNextPage(); // Try to go beyond last page
  assert(controllerCurrentPage === 3, 'Page Boundary (Next): controllerCurrentPage remains 3');
  assert(renderedData.length === 10, 'Page Boundary (Next): still renders 10 countries'); // Data shouldn't change
  assert(mockCardsView._lastGeneratedMarkup.includes('Page 3 of 3'), 'Page Boundary (Next): markup still "Page 3 of 3"');
  assert(mockCardsView._lastGeneratedMarkup.includes('<button class="btn btn--next" disabled>Next</button>'), 'Page Boundary (Next): markup "Next" button still disabled');

  // Test 5: Previous Page (to Page 2)
  controlPreviousPage();
  assert(controllerCurrentPage === 2, 'Previous Page (to P2): controllerCurrentPage is 2');
  assert(renderedData.length === 20, 'Previous Page should render 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 21', 'Previous Page renders country 21');

  // Test 6: Previous Page Again (to Page 1)
  controlPreviousPage();
  assert(controllerCurrentPage === 1, 'Previous Page (to P1): controllerCurrentPage is 1');
  assert(renderedData.length === 20, 'Previous Page (to P1): renders 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 1', 'Previous Page (to P1): renders country 1');
  assert(mockCardsView._currentPage === 1, 'Previous Page (to P1): view currentPage is 1');
  assert(mockCardsView._lastGeneratedMarkup.includes('Page 1 of 3'), 'Previous Page (to P1): markup shows "Page 1 of 3"');
  assert(mockCardsView._lastGeneratedMarkup.includes('<button class="btn btn--prev" disabled>Previous</button>'), 'Previous Page (to P1): markup "Previous" button disabled');

  // Test 7: Page Boundary (Previous on First Page)
  controlPreviousPage(); // Try to go before first page
  assert(controllerCurrentPage === 1, 'Page Boundary (Prev): controllerCurrentPage remains 1');
  assert(renderedData.length === 20, 'Page Boundary (Prev): still renders 20 countries');
  assert(mockCardsView._lastGeneratedMarkup.includes('<button class="btn btn--prev" disabled>Previous</button>'), 'Page Boundary (Prev): markup "Previous" button still disabled');

  // Test 8: Filtered Results (No Pagination)
  await controlCountriesByRegion('Africa'); // Region 'Africa' has 10 countries in mock data
  assert(renderedData.length === 10, 'Filtered Results: renders 10 Africa countries');
  assert(mockCardsView._currentPage === 0, 'Filtered Results: view currentPage is 0 (no pagination)');
  assert(mockCardsView._totalPages === 0, 'Filtered Results: view totalPages is 0 (no pagination)');
  assert(mockCardsView._lastGeneratedMarkup === "", 'Filtered Results: markup has no pagination controls');

  // Test 9: Clear Filter - Return to Pagination
  await controlCountriesByRegion(''); // Clear filter
  assert(controllerCurrentPage === 1, 'Clear Filter: controllerCurrentPage is 1');
  assert(renderedData.length === 20, 'Clear Filter: renders first 20 of all countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 1', 'Clear Filter: renders Country 1');
  assert(mockCardsView._currentPage === 1, 'Clear Filter: view currentPage is 1');
  assert(mockCardsView._totalPages === 3, 'Clear Filter: view totalPages is 3');
  assert(mockCardsView._lastGeneratedMarkup.includes('Page 1 of 3'), 'Clear Filter: markup shows "Page 1 of 3"');
  assert(mockCardsView._lastGeneratedMarkup.includes('<button class="btn btn--prev" disabled>Previous</button>'), 'Clear Filter: markup "Previous" button disabled');

  // Test 10: Search Results (No Pagination)
  await controlCountriesBySearch('Country 1'); // Will match Country 1, Country 10-19
  const expectedSearchCount = mockModel.state.countries.filter(c => c.name.includes('Country 1')).length;
  assert(renderedData.length === expectedSearchCount, `Search Results: renders ${expectedSearchCount} countries for "Country 1"`);
  assert(mockCardsView._currentPage === 0, 'Search Results: view currentPage is 0 (no pagination)');
  assert(mockCardsView._totalPages === 0, 'Search Results: view totalPages is 0 (no pagination)');
  assert(mockCardsView._lastGeneratedMarkup === "", 'Search Results: markup has no pagination controls');

  // Test 11: Clear Search - Return to Pagination
  await controlCountriesBySearch(''); // Clear search
  assert(controllerCurrentPage === 1, 'Clear Search: controllerCurrentPage is 1');
  assert(renderedData.length === 20, 'Clear Search: renders first 20 of all countries');
  assert(mockCardsView._currentPage === 1, 'Clear Search: view currentPage is 1');
  assert(mockCardsView._totalPages === 3, 'Clear Search: view totalPages is 3');
  assert(mockCardsView._lastGeneratedMarkup.includes('Page 1 of 3'), 'Clear Search: markup shows "Page 1 of 3"');

  // Test 12: No countries (e.g. initial load fails or empty dataset)
  const originalCountriesList = mockModel.state.countries; // Save full list
  const originalFetchCountries = mockModel.fecthCountries; // Save original fetch function

  mockModel.state.countries = []; // Make sure current state is empty
  mockModel.fecthCountries = async function() { // Override fetch to ensure it results in 0 countries
    mockModel.state.countries = [];
  };

  await controlAllCountriesInitial(); // This will call the overridden fecthCountries

  assert(renderedData.length === 0, 'No Countries: renders 0 countries');
  assert(mockCardsView._currentPage === 0, 'No Countries: view currentPage is 0'); // As renderPaginatedView calls ([], 0, 0)
  assert(mockCardsView._totalPages === 0, 'No Countries: view totalPages is 0');
  assert(mockCardsView._lastGeneratedMarkup === "", 'No Countries: markup has no pagination controls');

  mockModel.fecthCountries = originalFetchCountries; // Restore original fetch
  mockModel.state.countries = originalCountriesList; // Restore original country list for subsequent tests

  // Test 13: Single Page of results (e.g. 15 countries total)
  const tempSinglePageCountries = Array.from({ length: 15 }, (_, i) => ({ name: `Country ${i + 1}`}));
  const originalFetchForSinglePage = mockModel.fecthCountries;
  mockModel.fecthCountries = async function() { // Simulate fetching only 15 countries
      mockModel.state.countries = tempSinglePageCountries;
  };
  mockModel.state.countries = []; // Ensure it fetches

  await controlAllCountriesInitial();
  assert(renderedData.length === 15, 'Single Page: Renders 15 countries');
  assert(mockCardsView._currentPage === 1, 'Single Page: view currentPage is 1');
  assert(mockCardsView._totalPages === 1, 'Single Page: view totalPages is 1');
  assert(mockCardsView._lastGeneratedMarkup === "", 'Single Page: markup has no pagination controls because totalPages is 1');

  mockModel.fecthCountries = originalFetchForSinglePage; // Restore fetch
  mockModel.state.countries = originalCountriesList; // Restore countries

  // Output results
  console.log("\n--- Pagination Test Results (Improved) ---");
  assertions.forEach(a => console.log(a));
  const failedCount = assertions.filter(a => a.startsWith("FAIL")).length;
  console.log(`Tests finished. Passed: ${assertions.length - failedCount}, Failed: ${failedCount}`);
  if (failedCount > 0) process.exit(1); // Exit with error code if tests fail
}

runPaginationTests();
