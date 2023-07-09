export const state = {
  countries: [],
  FilterCountries: [],
  CountrySearch: [],
  CurrentCardCountry: {},
};

export const fecthCountries = async function () {
  try {
    const res = await fetch("https://restcountries.com/v2/all");
    if (!res.ok) throw new Error("Something went wrong !! 😭😭😭");
    const dataJson = await res.json();
    state.countries = dataJson;
  } catch (err) {
    throw err;
  }
};

export const fecthCountriesByRegion = async function (region) {
  try {
    const res = await fetch(`https://restcountries.com/v2/region/${region}`);
    if (!res.ok) throw new Error("Something wrong reset again please!! 😭😭😭");
    const dataJson = await res.json();
    state.FilterCountries = dataJson;
  } catch (err) {
    throw err;
  }
};

export const fecthCountriesBySearch = async function (name) {
  try {
    const res = await fetch(`https://restcountries.com/v2/name/${name}`);
    if (!res.ok)
      throw new Error(
        "Country Not Found !! Search for another country sir 😊😊!"
      );
    const dataJson = await res.json();
    state.CountrySearch = dataJson;
  } catch (err) {
    throw err;
  }
};

export const fecthCountry = async function (hash) {
  try {
    const res = await fetch(`https://restcountries.com/v2/alpha/${hash}`);
    if (!res.ok)
      throw new Error(
        "Country Not Found !! Search for another country sir 😊😊!"
      );
    const dataJson = await res.json();
    state.CurrentCardCountry = dataJson;
  } catch (err) {
    throw err;
  }
};
