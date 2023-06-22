import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
    constructor(selector, form, handleFormSubmit) {
        super(selector);
        this._handleFormSubmit = handleFormSubmit;
        this._form = form;
        this._formButtonText = this._form.elements['submit'].textContent;
    }

    getFormButtonText() {
        return this._formButtonText;
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
        super.setEventListeners();
        this._form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this._getInputValues();
            console.log(this._form);
            this._handleFormSubmit(evt, this._formValues);
            // this._form.reset();
        })
    }

    close() {
        super.close();
        this._form.reset();
    }
}