"use strict";

const cardContainer = document.querySelector(".cards");
const selectFiedl = document.querySelector(".select");
const fecthCountry = async function () {
	const res = await fetch("https://restcountries.com/v2/all");
	if (!res.ok) return;
	const dataJson = await res.json();
	const markup = dataJson
		.map((data) => {
			return `
    				<a href="card.html/#${data.alpha3Code}" class="card">
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

	cardContainer.insertAdjacentHTML("afterbegin", markup);
};

selectFiedl.addEventListener("change", async function (e) {
	e.preventDefault();
	const region = e.target.value;
	if (!region) {
		fecthCountry();
		return;
	}
	const res = await fetch(`https://restcountries.com/v2/region/${region}`);
	if (!res.ok) return;
	const dataJson = await res.json();
	const markup = dataJson
		.map((data) => {
			return `
    				<a href="card.html/#${data.alpha3Code}" class="card">
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

	cardContainer.innerHTML = markup;
});

// fecthCountry();
