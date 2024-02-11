export default class FormValidator {
  constructor(
    { inputSelector, inputInvalidClass, submitButtonSelector },
    form
  ) {
    this._form = form;
    this._inputList = this._form.querySelectorAll(inputSelector);
    this._inputInvalidClass = inputInvalidClass;
    this._submitButton = this._form.querySelector(submitButtonSelector);
  }

  _checkInputValidity(input) {
    const isValid = input.validity.valid;
    if (isValid) {
      this._hideError(input);
    } else {
      this._showError(input, input.validationMessage);
    }
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

  _setButtonState() {
    this._submitButton.disabled = !this._form.checkValidity();
  }

  resetFormValidator() {
    this._submitButton.disabled = true;
    this._inputList.forEach((input) => {
      this._hideError(input);
    });
  }

  _setEventListeners = () => {
    this._inputList.forEach((inputField) => {
      inputField.addEventListener('input', () => {
        this._checkInputValidity(inputField);
        this._setButtonState();
      });
    });
  };

  enableValidation() {
    this._setEventListeners();
  }
}
