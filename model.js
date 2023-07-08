export const state = {
  countries: [],
  FilterCountries: [],
  CountrySearch: [],
};

export const fecthCountries = async function () {
  try {
    const res = await fetch("https://restcountries.com/v2/all");
    if (!res.ok) throw new Error("Something wrong !! 😭😭😭");
    const dataJson = await res.json();
    state.countries = dataJson;
  } catch (err) {
    throw err;
  }
};

export const fecthCountriesByRegion = async function (region) {
  try {
    console.log(region);
    const res = await fetch(`https://restcountries.com/v2/region/${region}`);
    if (!res.ok) throw new Error("Something wrong !! 😭😭😭");
    const dataJson = await res.json();
    state.FilterCountries = dataJson;
  } catch (err) {
    throw err;
  }
};

export const fecthCountriesBySearch = async function (name) {
  try {
    const res = await fetch(`https://restcountries.com/v2/name/${name}`);
    if (!res.ok) throw new Error("Something wrong!! 😭😭😭");
    const dataJson = await res.json();
    state.CountrySearch = dataJson;
  } catch (err) {
    throw err;
  }
};
