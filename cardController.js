import * as model from "./model.js";
import CountryView from "./view/CountryView.js";

const ControlCurrentCountry = async function (hash) {
  try {
    CountryView.renderSpinner();
    await model.fecthCountry(hash);
    CountryView.render(model.state.CurrentCardCountry);
  } catch (err) {
    CountryView.renderError(err.message);
  }
};

const cardInit = function () {
  CountryView.handlerCountry(ControlCurrentCountry);
};

cardInit();
