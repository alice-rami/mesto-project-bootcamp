export default class FormValidator {
    constructor({inputSelector, inputInvalidClass, submitButtonSelector }, form) {
      this._form = form;
      this._inputList = this._form.querySelectorAll(inputSelector); 
      this._inputInvalidClass = inputInvalidClass;
      this._submitButton = this._form.querySelector(submitButtonSelector);
    }

    _toggleError(input, isValid = input.validity.valid) {
        const errorElement = document.querySelector(`#error-${input.id}`);
        errorElement.textContent = isValid ? '' : input.validationMessage;
        input.classList.toggle(this._inputInvalidClass, !isValid);
    }

    _setButtonState() {
        const isValid = this._form.checkValidity();
        this._submitButton.disabled = !isValid;
    }

    resetFormValidator() {
        this._submitButton.disabled = true;
        this._inputList.forEach((input) => {
            this._toggleError(input, true)
        });
    }

    _setEventListeners = () => {
        this._inputList.forEach(inputField => {
            inputField.addEventListener('input', () => {
                this._toggleError(inputField);
                this._setButtonState();
            });
        });
    }

    enableValidation() {
        this._setEventListeners();
    }
}

