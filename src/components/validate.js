import { settings } from './constants.js';

const showError = (input, errorMessage) => {
    const errorElement = document.querySelector(`#error-${input.id}`);
    errorElement.textContent = errorMessage;
    input.classList.add(settings.inputInvalidSelector);
}

const hideError = (input) => {
    const errorElement = document.querySelector(`#error-${input.id}`);
    errorElement.textContent = '';
    input.classList.remove(settings.inputInvalidSelector);
}

const enableButton = (submitButton) => {
    submitButton.disabled = false;
}

const disableButton = (submitButton) => {
    submitButton.disabled = true;
}

const checkInputValidity = (input) => {
    if (input.validity.valid) {
        hideError(input);
    } else {
        showError(input, input.validationMessage);
    } 
}
    
const checkFormValidity = (form, submitButton) => {
    if (form.checkValidity()) {
        enableButton(submitButton);
    } else {
        disableButton(submitButton);
    }
}
    
const setEventListeners = (form, settings) => {
    const inputsList = form.querySelectorAll(settings.inputSelector);
    const submitButtonElement = form.querySelector(settings.submitButtonSelector);
    checkFormValidity(form, submitButtonElement);
    form.addEventListener('reset', () => {
        disableButton(submitButtonElement);
        inputsList.forEach(hideError);
        });
    inputsList.forEach(inputField => {
        inputField.addEventListener('input', () => {
            checkInputValidity(inputField, settings);
            checkFormValidity(form, submitButtonElement);
        });
    }); 
}

export const enableValidation = (settings) => {
    const formsList = document.querySelectorAll(settings.formSelector);
    formsList.forEach(formElement => {
        setEventListeners(formElement, settings);
    });
}

export { hideError, disableButton, checkInputValidity, checkFormValidity };