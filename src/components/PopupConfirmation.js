import Popup from "./Popup.js";

export default class PopupConfirmation extends Popup {
    constructor(selector, form, handleFormSubmit) {
        super(selector);
        this._form = form;
        this._handleFormSubmit = handleFormSubmit;
    }

    setEventListeners() {
        super.setEventListeners();
        this._handleFormSubmit = this._handleFormSubmit.bind(this);
        this._form.addEventListener('submit', this._handleFormSubmit)
    }
}