export default class FormValidator {
    constructor({inputSelector, inputInvalidClass, submitButtonSelector }, form) {
      this._form = form;
      this._inputList = this._form.querySelectorAll(inputSelector); 
      this._inputInvalidClass = inputInvalidClass;
      console.log(this._inputInvalidClass);
      this._submitButton = this._form.querySelector(submitButtonSelector);
    }

    _showError(input, errorMessage) {
        const errorElement = document.querySelector(`#error-${input.id}`);
        errorElement.textContent = errorMessage;
        input.classList.add(this._inputInvalidClass);
    }

    _hideError(input) {
        const errorElement = document.querySelector(`#error-${input.id}`);
        errorElement.textContent = '';
        input.classList.remove(this._inputInvalidClass);
    }

    _checkInputValidity(input) {
        input.validity.valid ? this._hideError(input) : this._showError(input, input.validationMessage);
    }

    _setButtonState() {
        const isValid = this._form.checkValidity();
        this._submitButton.disabled = !isValid;
    }

    _setEventListeners = () => {
        this._setButtonState();
        this._form.addEventListener('reset', () => {
            this._submitButton.disabled = true;
            this._inputList.forEach((input) => {
                this._hideError(input)
            });
            });
        this._inputList.forEach(inputField => {
            inputField.addEventListener('input', () => {
                this._checkInputValidity(inputField);
                this._setButtonState();
            });
        });
    }

    enableValidation() {
        console.log('enable');
        this._setEventListeners();
    }
}

