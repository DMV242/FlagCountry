import * as model from "./model.js";
import CardsView from "./view/CardsView.js";
import SearchView from "./view/SearchView.js";
import SelectView from "./view/SelectView.js";

let currentPage = 1;
const ITEMS_PER_PAGE = 20;

// Renders the main paginated view
const renderPaginatedView = function (page) {
  currentPage = page;
  const totalCountries = model.state.countries.length;
  if (totalCountries === 0) { // Should not happen if controlAllCountriesInitial is called first
    CardsView.render([], 0, 0); // Render empty with no pagination
    return;
  }
  const totalPages = Math.ceil(totalCountries / ITEMS_PER_PAGE);

  // Ensure currentPage is within valid bounds (e.g. after a filter changes total items)
  // This check is more relevant if totalCountries could change for the main list
  // For now, model.state.countries is assumed stable after initial load.
  if (page > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  if (page < 1 && totalPages > 0) {
    currentPage = 1;
  }

  CardsView.render(model.getCountriesByPage(currentPage), currentPage, totalPages);
};

// Initial load and when clearing filters/search
const controlAllCountriesInitial = async function () {
  try {
    CardsView.renderSpinner();
    if (model.state.countries.length === 0) {
      await model.fecthCountries();
    }
    renderPaginatedView(1); // Start from page 1
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const controlNextPage = function () {
  const totalCountries = model.state.countries.length;
  const totalPages = Math.ceil(totalCountries / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    renderPaginatedView(currentPage + 1);
  }
};

const controlPreviousPage = function () {
  if (currentPage > 1) {
    renderPaginatedView(currentPage - 1);
  }
};

const controlCountriesByRegion = async function (region) {
  try {
    if (!region) {
      await controlAllCountriesInitial(); // Re-load all countries, paginated from page 1
      return;
    }
    CardsView.renderSpinner();
    await model.fecthCountriesByRegion(region);
    // Render filtered results without pagination controls
    // (currentPage = 0, totalPages = 0 indicates no pagination)
    CardsView.render(model.state.FilterCountries, 0, 0);
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const ControlCountriesBySearch = async function (name) {
  try {
    if (!name) {
      await controlAllCountriesInitial(); // Re-load all countries, paginated from page 1
      return;
    }
    CardsView.renderSpinner();
    await model.fecthCountriesBySearch(name);
    // Render search results without pagination controls
    CardsView.render(model.state.CountrySearch, 0, 0);
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const init = function () {
  SelectView.handleRegionField(controlCountriesByRegion);
  SearchView.handleSearch(ControlCountriesBySearch);
  CardsView.handleNextPage(controlNextPage);
  CardsView.handlePreviousPage(controlPreviousPage);

  controlAllCountriesInitial(); // Initial load of all countries, paginated
};

init();
