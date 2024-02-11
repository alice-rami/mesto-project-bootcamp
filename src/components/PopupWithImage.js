import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
    constructor({selector, titleSelector, imageSelector}) {
        super(selector);
        this._titleElement = this._popup.querySelector(titleSelector);
        this._imageElement = this._popup.querySelector(imageSelector);
    }

    open({name, link}) {
        this._titleElement.textContent = name;
        this._imageElement.alt = name;
        this._imageElement.src = link;
        super.open();
    }
}