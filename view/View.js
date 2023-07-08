class View {
	_parentElement;
	_ErrorMessage;
	_data;

	_clear() {
		this._parentElement.innerHTML = "";
	}

	render(data) {
		this._data = data;
		this._clear();
		const markup = this._generateMarkup;
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	_generateMarkup() {}

	renderSpinner() {
		this.innerHTML = "<div class='loader'></div>";
	}
}

export default new View();
