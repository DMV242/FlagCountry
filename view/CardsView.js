import { View } from "./View.js";

class CardsView extends View {
  _parentElement = document.querySelector(".cards");
  _currentPage;
  _totalPages;

  render(data, currentPage, totalPages) {
    this._currentPage = currentPage;
    this._totalPages = totalPages;
    super.render(data); // Calls View.render which then calls _generateMarkup
  }

  _generateMarkup() {
    // card markup
    if (!this._data || this._data.length === 0) {
      // If there's no data (e.g. initial state for filtered search before results)
      // or if data is explicitly empty array from controller for non-paginated empty result
      if (this._currentPage === 0 && this._totalPages === 0) { // Non-paginated view asked to render no data
         // Potentially render a "No results found" message for filtered/searched views.
         // For now, returning empty string means this view won't show anything, which is fine.
         // Or, if _data is empty but it *was* a paginated view (e.g. model.state.countries is empty)
         // then the controller should have rendered an error or specific message.
         // This view assumes if _data is empty, it's intentional for this render cycle.
      }
      // If _data is empty but it's supposed to be a paginated view (totalPages > 0 implies this)
      // this case should ideally be handled by the controller (e.g. show error or "no countries loaded")
      // For now, if _data is empty, countriesMarkup will be empty.
    }

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

    let paginationMarkup = "";
    if (this._totalPages > 0) { // Only show pagination if totalPages is determined (i.e., for paginated views)
      paginationMarkup = `
        <div class="pagination-controls">
          <button class="btn btn--prev" ${this._currentPage === 1 ? "disabled" : ""}>Previous</button>
          <span>Page ${this._currentPage} of ${this._totalPages}</span>
          <button class="btn btn--next" ${this._currentPage === this._totalPages ? "disabled" : ""}>Next</button>
        </div>
      `;
    }

    // If countriesMarkup is empty and it's a paginated view (e.g. no countries loaded yet, but pagination is expected)
    // we might want to show a message or just the (disabled) pagination controls.
    // For now, if countriesMarkup is empty, only pagination (if applicable) will show.
    // If it's a non-paginated view (totalPages === 0) and countriesMarkup is empty, nothing shows.

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
