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

let renderedData = [];
const mockCardsView = {
  renderSpinner: function () { /* console.log('Spinner rendered'); */ },
  render: function (data) {
    renderedData = data;
    // console.log(`Rendered ${data.length} countries.`);
  },
  renderError: function (message) { console.error(`RenderError: ${message}`); },
  // Mock event handler attachments, not testing actual clicks here
  handleNextPage: function(handler) { this._nextPageHandler = handler; },
  handlePreviousPage: function(handler) { this._prevPageHandler = handler; },
  _nextPageHandler: null,
  _prevPageHandler: null,
  simulateNextClick: function() { if(this._nextPageHandler) this._nextPageHandler(); },
  simulatePrevClick: function() { if(this._prevPageHandler) this._prevPageHandler(); }
};

const mockSelectView = { handleRegionField: () => {} };
const mockSearchView = { handleSearch: () => {} };

// --- Controller Logic (simplified and adapted for testing) ---
// We'll need to essentially re-construct parts of controller.js or import it if possible.
// For this environment, let's adapt the core logic.

let currentPage = 1;
const ITEMS_PER_PAGE = 20;

async function controlCountries() {
  mockCardsView.renderSpinner();
  if (mockModel.state.countries.length === 0) {
    await mockModel.fecthCountries();
  }
  mockCardsView.render(mockModel.getCountriesByPage(currentPage));
}

function controlNextPage() {
  const totalCountries = mockModel.state.countries.length;
  const totalPages = Math.ceil(totalCountries / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    mockCardsView.render(mockModel.getCountriesByPage(currentPage));
  }
}

function controlPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    mockCardsView.render(mockModel.getCountriesByPage(currentPage));
  }
}

async function controlCountriesByRegion(region) {
    if (!region) {
      currentPage = 1;
      mockCardsView.render(mockModel.getCountriesByPage(currentPage));
      return;
    }
    currentPage = 1; // Reset page for new filter
    await mockModel.fecthCountriesByRegion(region);
    // In real app, this renders model.state.FilterCountries, not paginated
    // For this test, let's assume we want to test reset to main paginated list if filter is then cleared
    // The actual app renders all FilterCountries, this test is slightly different
    mockCardsView.render(mockModel.state.FilterCountries);
}

async function controlCountriesBySearch(name) {
    if (!name) {
      currentPage = 1;
      mockCardsView.render(mockModel.getCountriesByPage(currentPage));
      return;
    }
    currentPage = 1; // Reset page for new search
    await mockModel.fecthCountriesBySearch(name);
    // Similar to region, real app renders all CountrySearch
    mockCardsView.render(mockModel.state.CountrySearch);
}


// --- Tests ---
async function runPaginationTests() {
  // Test 1: Initial Load
  currentPage = 1; // Reset for test
  await controlCountries();
  assert(renderedData.length === 20, 'Initial load should render 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 1', 'Initial load renders first country');

  // Test 2: Next Page
  controlNextPage();
  assert(currentPage === 2, 'Next Page: currentPage should be 2');
  assert(renderedData.length === 20, 'Next Page should render 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 21', 'Next Page renders country 21');

  // Test 3: Next Page Again
  controlNextPage();
  assert(currentPage === 3, 'Next Page Again: currentPage should be 3');
  assert(renderedData.length === 10, 'Next Page Again should render 10 countries (last page)');
  assert(renderedData[0] && renderedData[0].name === 'Country 41', 'Next Page Again renders country 41');

  // Test 4: Page Boundary (Next on Last Page)
  controlNextPage(); // Try to go beyond last page
  assert(currentPage === 3, 'Page Boundary (Next): currentPage should remain 3');
  assert(renderedData.length === 10, 'Page Boundary (Next): should still render 10 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 41', 'Page Boundary (Next): should still render country 41');

  // Test 5: Previous Page
  controlPreviousPage();
  assert(currentPage === 2, 'Previous Page: currentPage should be 2');
  assert(renderedData.length === 20, 'Previous Page should render 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 21', 'Previous Page renders country 21');

  // Test 6: Previous Page Again to First
  controlPreviousPage();
  assert(currentPage === 1, 'Previous Page Again: currentPage should be 1');
  assert(renderedData.length === 20, 'Previous Page Again should render 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 1', 'Previous Page Again renders country 1');

  // Test 7: Page Boundary (Previous on First Page)
  controlPreviousPage(); // Try to go before first page
  assert(currentPage === 1, 'Page Boundary (Prev): currentPage should remain 1');
  assert(renderedData.length === 20, 'Page Boundary (Prev): should still render 20 countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 1', 'Page Boundary (Prev): should still render country 1');

  // Test 8: Search/Filter Reset (Simulate clearing a filter)
  // First, apply a filter (this part of controller logic renders all filtered, not paginated)
  await controlCountriesByRegion('Africa');
  // Now, clear the filter by calling with no region
  await controlCountriesByRegion('');
  assert(currentPage === 1, 'Filter Reset: currentPage should reset to 1');
  assert(renderedData.length === 20, 'Filter Reset: should render first 20 of all countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 1', 'Filter Reset: should render Country 1');

  // Test 9: Search Reset (Simulate clearing a search)
  await controlCountriesBySearch('Country 5');
   // Now, clear the search by calling with no name
  await controlCountriesBySearch('');
  assert(currentPage === 1, 'Search Reset: currentPage should reset to 1');
  assert(renderedData.length === 20, 'Search Reset: should render first 20 of all countries');
  assert(renderedData[0] && renderedData[0].name === 'Country 1', 'Search Reset: should render Country 1');

  // Output results
  console.log("--- Pagination Test Results ---");
  assertions.forEach(a => console.log(a));
  const failedCount = assertions.filter(a => a.startsWith("FAIL")).length;
  console.log(`Tests finished. Passed: ${assertions.length - failedCount}, Failed: ${failedCount}`);
  if (failedCount > 0) process.exit(1); // Exit with error code if tests fail
}

runPaginationTests();
