export class View {
  _parentElement;
  _ErrorMessage;
  _data;
  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderError(message = "Something went wrong !! 😭😭😭") {
    this._parentElement.innerHTML = `
	<div class="message__error">
	<img
	  src="https://img.icons8.com/color/48/error--v1.png"
	  alt="error--v1"
	/>
	<span class="message">${message}</span>
  </div>
	`;
  }

  render(data) {
    this._data = data;
    this._clear();
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {}

  renderSpinner() {
    this._parentElement.innerHTML = `<div id="wifi-loader">
    <svg class="circle-outer" viewBox="0 0 86 86">
        <circle class="back" cx="43" cy="43" r="40"></circle>
        <circle class="front" cx="43" cy="43" r="40"></circle>
        <circle class="new" cx="43" cy="43" r="40"></circle>
    </svg>
    <svg class="circle-middle" viewBox="0 0 60 60">
        <circle class="back" cx="30" cy="30" r="27"></circle>
        <circle class="front" cx="30" cy="30" r="27"></circle>
    </svg>
    <svg class="circle-inner" viewBox="0 0 34 34">
        <circle class="back" cx="17" cy="17" r="14"></circle>
        <circle class="front" cx="17" cy="17" r="14"></circle>
    </svg>
    <div class="text" data-text="Loading"></div>
</div>;`;
  }
}
