import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
    constructor({selector, titleElement, imageElement}) {
        super(selector);
        this._titleElement = titleElement;
        this._imageElement = imageElement;
    }

    open({name, link}) {
        this._titleElement.textContent = name;
        this._imageElement.alt = name;
        this._imageElement.src = link;
        super.open();
    }
}