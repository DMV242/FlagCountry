export class View {
  _parentElement;
  _ErrorMessage;
  _data;
  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderError() {}

  render(data) {
    this._data = data;
    this._clear();
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {}

  renderSpinner() {
    this._parentElement.innerHTML = "<div class='loader'></div>";
  }
}
