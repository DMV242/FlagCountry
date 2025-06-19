import * as model from "./model.js";
import CardsView from "./view/CardsView.js";
import SearchView from "./view/SearchView.js";
import SelectView from "./view/SelectView.js";

let currentPage = 1;
const ITEMS_PER_PAGE = 20; // Defined in model.getCountriesByPage

const controlCountries = async function () {
  try {
    CardsView.renderSpinner();
    // Fetch all countries once
    if (model.state.countries.length === 0) {
      await model.fecthCountries();
    }
    // Render the current page
    CardsView.render(model.getCountriesByPage(currentPage));
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const controlNextPage = function () {
  const totalCountries = model.state.countries.length;
  const totalPages = Math.ceil(totalCountries / ITEMS_PER_PAGE);

  if (currentPage < totalPages) {
    currentPage++;
    CardsView.render(model.getCountriesByPage(currentPage));
  }
};

const controlPreviousPage = function () {
  if (currentPage > 1) {
    currentPage--;
    CardsView.render(model.getCountriesByPage(currentPage));
  }
  // Optionally, disable/hide "Previous" button in view if currentPage is 1
};

const controlCountriesByRegion = async function (region) {
  try {
    if (!region) {
      // Reset to page 1 when region is cleared
      currentPage = 1;
      CardsView.render(model.getCountriesByPage(currentPage));
      return;
    }
    // When a region is selected, we assume it's a new list, so reset to page 1
    currentPage = 1;
    await model.fecthCountriesByRegion(region);
    // Region filtering does not use the main pagination.
    // It displays all countries from the filtered list.
    CardsView.render(model.state.FilterCountries);
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const ControlCountriesBySearch = async function (name) {
  try {
    if (!name) {
      // Reset to page 1 when search is cleared
      currentPage = 1;
      CardsView.render(model.getCountriesByPage(currentPage));
      return;
    }
    // When a new search is performed, reset to page 1
    currentPage = 1;
    CardsView.renderSpinner();
    await model.fecthCountriesBySearch(name);
    // Search results do not use the main pagination.
    // It displays all countries from the search result.
    CardsView.render(model.state.CountrySearch);
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const init = function () {
  SelectView.handleRegionField(controlCountriesByRegion);
  SearchView.handleSearch(ControlCountriesBySearch);
  CardsView.handleNextPage(controlNextPage);
  CardsView.handlePreviousPage(controlPreviousPage);
};

init();
controlCountries(); // Initial load
