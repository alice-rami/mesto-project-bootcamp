import { loadingText, validationConfig } from './constants';
import FormValidator from '../components/FormValidator';
import PopupWithForm from '../components/PopupWithForm';
import { formConfigBuilder } from './formConfigBuilder';

export const handleSubmit = (request, popupInstance) => {
  popupInstance.toggleButtonText(true, loadingText);
  request()
    .then(() => {
      popupInstance.close();
    })
    .catch(console.error)
    .finally(() => {
      popupInstance.toggleButtonText(false);
    });
};

export const enableFormValidation = (formName) => {
  const instance = new FormValidator(
    validationConfig,
    formConfigBuilder[formName].formElement
  );
  instance.enableValidation();
  formConfigBuilder.addValidatorInstance(formName, instance);
};

export const createPopupInstance = (formName) => {
  const { popupSelector, handleSubmit } = formConfigBuilder[formName];
  const instance = new PopupWithForm(popupSelector, handleSubmit);
  formConfigBuilder.addPopupInstance(formName, instance);
  instance.setEventListeners();
};

export const addButtonListeners = (formName) => {
  const { openButton, popupInstance, validatorInstance } =
    formConfigBuilder[formName];
  openButton.addEventListener('click', () => {
    validatorInstance.resetFormValidator();
    popupInstance.open();
  });
};
