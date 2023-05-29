import { settings } from './index.js';

const showError = (input, errorMessage) => {
    const errorElement = document.querySelector(`#error-${input.id}`);
    errorElement.textContent = errorMessage;
}

const hideError = (input) => {
    const errorElement = document.querySelector(`#error-${input.id}`);
    errorElement.textContent = '';
}

const enableButton = (submitButton) => {
    submitButton.disabled = false;
}

export const disableButton = (submitButton) => {
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
