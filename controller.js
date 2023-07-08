import * as model from "./model.js";
import CardsView from "./view/CardsView.js";
import SearchView from "./view/SearchView.js";
import SelectView from "./view/SelectView.js";

const ControlCards = async function () {
  try {
    CardsView.renderSpinner();
    await model.fecthCountries();
    CardsView.render(model.state.countries);
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const controlCountriesByRegion = async function (region) {
  try {
    if (!region) {
      CardsView.render(model.state.countries);
      return;
    }
    await model.fecthCountriesByRegion(region);
    CardsView.render(model.state.FilterCountries);
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const ControlCountriesBySearch = async function (name) {
  try {
    if (!name) {
      CardsView.render(model.state.countries);
      return;
    }
    CardsView.renderSpinner();
    await model.fecthCountriesBySearch(name);
    CardsView.render(model.state.CountrySearch);
  } catch (err) {
    CardsView.renderError(err.message);
  }
};

const init = function () {
  SelectView.handleRegionField(controlCountriesByRegion);
  SearchView.handleSearch(ControlCountriesBySearch);
};

init();
ControlCards();
