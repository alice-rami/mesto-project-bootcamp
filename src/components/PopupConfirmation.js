import Popup from "./Popup.js";

export default class PopupConfirmation extends Popup {
    constructor({selector, form, handleFormSubmit}) {
        super(selector);
        this._form = form;
        this._handleFormSubmit = handleFormSubmit;
    }

    setEventListeners() {
        super.setEventListeners();
        this._form.addEventListener('submit', (evt) => {
            this._handleFormSubmit(evt);
        })
    }
}