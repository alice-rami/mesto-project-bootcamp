import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
    constructor({selector, form, handleFormSubmit}) {
        super(selector);
        this._form = form;
        this._handleFormSubmit = handleFormSubmit;
        this._inputList = this._form.elements['input'];
        console.log(this._inputList)
        this._formButtonText = this._form.elements['submit'].textContent;
    }

    getFormButtonText() {
        return this._formButtonText;
    }

    _getInputValues() {
        this._formValues = {};
        this._inputList.forEach(input => {
            this._formValues[input.name] = input.value;
        })
        return this._formValues;
    }

    setInputValues(userData) {
        this._inputList.forEach(input => {
            input.value = userData[input.name];
        })
    }

    setEventListeners() {
        super.setEventListeners();
        this._form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this._getInputValues();
            this._handleFormSubmit(evt, this._formValues, this);
        })
    }

    close() {
        super.close();
        this._form.reset();
    }
}