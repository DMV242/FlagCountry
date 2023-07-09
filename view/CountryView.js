import { View } from "./View.js";

class CountryView extends View {
  _parentElement = document.querySelector(".country");

  handlerCountry(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, function () {
        const hash = this.window.location.hash.slice(1);
        handler(hash);
      })
    );
  }

  _generateMarkup() {
    const markup = `
    <div class="country__preview grid-2--cols">
    <img
        src="${this._data.flag}"
        alt="${this._data.name}"
    />
    <div>
        <h2>${this._data.name}</h2>
        <div class="country__informations">
            <div class="history">
                <ul>
                    <li><span class="history__property">Native name</span> : ${
                      this._data.nativeName
                    }</li>
                    <li><span class="history__property">Population</span> : ${
                      this._data.population
                    }</li>
                    <li><span class="history__property">Region</span> : ${
                      this._data.region
                    }</li>
                    <li><span class="history__property">Sub region</span>: ${
                      this._data.subregion ? this._data.subregion : "Nothing"
                    }</li>
                    <li><span class="history__property">Capital</span> : ${
                      this._data.capital
                    }</li>
                </ul>
            </div>
            <div class="culture">
                <ul>
                    <li><span class="history__property">Top Level Domain</span> : ${this._data.topLevelDomain.join(
                      ", "
                    )}</li>
                    <li><span class="history__property">Currencies</span> : ${this._data.currencies
                      .map((cur) => {
                        return cur.name;
                      })
                      .join(", ")}</li>
                    <li><span class="history__property">Languages </span> ${this._data.languages
                      .map((lang) => {
                        return lang.name;
                      })
                      .join(", ")}</li>
                </ul>
            </div>
        </div>
        <div class="borders">
            <p>
            borders countries :
            ${
              this._data.borders
                ? this._data.borders
                    .map((border) => {
                      return `<a href="#${border}" class="border">${border}</a>`;
                    })
                    .join("")
                : `<a href="#" class="border">No Borders</a>`
            }
            </p>
        </div>
    </div>
</div>
`;
    return markup;
  }
}

export default new CountryView();
