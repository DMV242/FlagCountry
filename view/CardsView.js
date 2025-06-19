import { View } from "./View.js";

class CardsView extends View {
  _parentElement = document.querySelector(".cards");

  _generateMarkup() {
    // card markup
    const countriesMarkup = this._data
      .map((data) => {
        return `
    				<a href="card.html#${data.alpha3Code}" class="card">
					<div class="card__flag">
						<img
							src="${data.flag}"
							alt="${data.name}"
						/>
					</div>
					<div class="card__description">
						<h2>${data.name}</h2>
						<ul>
							<li>Population: ${data.population}</li>
							<li>Region: ${data.region}</li>
							<li>Capital: ${data.capital} </li>
						</ul>
					</div>
				</a>
    `;
      })
      .join("");

    // Pagination buttons markup
    // For now, always show. Controller logic handles page limits.
    // A more advanced implementation could hide buttons if not applicable.
    const paginationMarkup = `
      <div class="pagination-controls">
        <button class="btn btn--prev">Previous</button>
        <button class="btn btn--next">Next</button>
      </div>
    `;

    // Prepend pagination buttons before the cards, or append, or place somewhere specific.
    // Let's place them after the cards for now.
    return countriesMarkup + paginationMarkup;
  }

  handleNextPage(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--next");
      if (!btn) return;
      handler();
    });
  }

  handlePreviousPage(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--prev");
      if (!btn) return;
      handler();
    });
  }
}

export default new CardsView();
