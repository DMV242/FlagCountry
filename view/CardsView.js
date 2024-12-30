import { View } from "./View.js";

class CardsView extends View {
  _parentElement = document.querySelector(".cards");

  _generateMarkup() {
    const markup = this._data
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

    return markup;
  }
}

export default new CardsView();
