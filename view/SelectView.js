import { View } from "./View.js";

class SelectView extends View {
  _parentElement;

  handleRegionField(handler) {
    this._parentElement = document.querySelector(".select");
    this._parentElement.addEventListener("change", async function (e) {
      e.preventDefault();
      const region = e.target.value;
      handler(region);
    });
  }
}

export default new SelectView();
