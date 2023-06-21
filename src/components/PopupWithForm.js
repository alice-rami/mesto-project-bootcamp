import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
    constructor(selector, formSelector, handleFormSubmit) {
        super(selector);
        this._handleFormSubmit = handleFormSubmit;
        this._form = document.forms[formSelector];
    }

    _getInputValues() {
        this._inputList = this._form.querySelectorAll('.form__input');
        this._formValues = {};
        this._inputList.forEach(input => {
            this._formValues[input.name] = input.value;
        })
        return this._formValues;
    }

    setEventListeners() {
        this._form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this._getInputValues();
            console.log(this._formValues);
            this._handleFormSubmit(evt, this._formValues);
            this._form.reset();
        })
    }

    close() {
        super.close();
        this._form.reset();
    }
}