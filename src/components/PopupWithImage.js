import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
    constructor(selector, title, image) {
        super(selector);
        this._titleElement = this._popup.querySelector(title);
        this._imageElement = this._popup.querySelector(image);
    }

    open({name, link}) {
        this._titleElement.textContent = name;
        this._imageElement.alt = name;
        this._imageElement.src = link;
        super.open();
    }
}