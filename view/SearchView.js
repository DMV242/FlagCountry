import { View } from "./View.js";

class SearchView extends View {
  _parentElement;

  handleSearch(handler) {
    this._parentElement = document.querySelector(".option__search-form");
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchField = document.querySelector(".search").value;
      handler(searchField);
    });
  }
}

export default new SearchView();
