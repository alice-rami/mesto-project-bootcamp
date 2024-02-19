export const loadingText = 'Сохранение...';

export const profileElement = document.querySelector('.profile');

// Селекторы форм с валидацией
export const selectors = {
  profileForm: 'profile-form',
  avatarForm: 'avatar-form',
  addCardForm: 'place-form',
};
export const formNames = ['profileForm', 'avatarForm', 'addCardForm'];

export const popupConfirmationConfig = {
  selector: '.popup_type_confirm-deletion-form',
  form: document.forms['confirm-deletion-form'],
};

export const popupViewImageConfig = {
  selector: '.popup_type_view-image',
  titleSelector: '.view-template__title',
  imageSelector: '.view-template__image',
};

export const validationConfig = {
  formSelector: '.form-validate',
  inputSelector: '.form__input',
  inputInvalidClass: 'form__input_invalid',
  submitButtonSelector: '.form__submit-button',
};

export const apiRequestConfig = {
  baseUrl: 'https://nomoreparties.co/v1/wbf-cohort-9',
  headers: {
    authorization: 'c1d6c920-f67e-42f9-9dd3-963993549d9b',
    'Content-Type': 'application/json',
  },
};

export const profileSelectors = {
  nameSelector: '.profile__name',
  aboutSelector: '.profile__about',
  avatarSelector: '.profile__avatar',
};
