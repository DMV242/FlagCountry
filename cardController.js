const countryContainer = document.querySelector(".country");

const loadCounrty = async function () {
	try {
		const hash = this.window.location.hash.slice(1);
		const res = await fetch(`https://restcountries.com/v2/alpha/${hash}`);

		if (!res.ok) throw new Error("Failed to fetch");
		const data = await res.json();
		const markup = `
    			<div class="country__preview grid-2--cols">
				<img
					src="${data.flag}"
					alt="${data.name}"
				/>
				<div>
					<h2>${data.name}</h2>
					<div class="country__informations">
						<div class="history">
							<ul>
								<li>Native name : ${data.nativeName}</li>
								<li>Population : ${data.population}</li>
								<li>Region : ${data.region}</li>
								<li>Sub region: ${data.subregion ? data.subregion : "Nothing"}</li>
								<li>Capital : ${data.capital}</li>
							</ul>
						</div>
						<div class="culture">
							<ul>
								<li>Top Level Domain : ${data.topLevelDomain.join(", ")}</li>
								<li>Currencies : ${data.currencies
									.map((cur) => {
										return cur.name;
									})
									.join(", ")}</li>
								<li>Languages: ${data.languages
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
													data.borders
														? data.borders
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

		countryContainer.innerHTML = markup;
	} catch (err) {
		console.log(err.message);
	}
};
loadCounrty();
["hashchange", "load"].forEach((ev) =>
	window.addEventListener(ev, loadCounrty)
);
