const loadingText = 'Сохранение...';

const confirmForm = document.forms['confirm-deletion-form'];
const profileForm = document.forms['profile-form'];
const avatarForm = document.forms['avatar-form'];
const placeForm = document.forms['place-form'];

const cardAddButton = document.querySelector('.profile__add-button');
const profileEditButton = document.querySelector('.profile__edit-button');
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');

const validationConfig = {
    formSelector: '.form-validate',
    inputSelector: '.form__input',
    inputInvalidClass: 'form__input_invalid',
    submitButtonSelector: '.form__submit-button'
}; 

const formsToValidate = Array.from(document.querySelectorAll(validationConfig.formSelector));

const apiRequestConfig = {
    baseUrl: 'https://nomoreparties.co/v1/wbf-cohort-9',
    headers: {
    authorization: 'c1d6c920-f67e-42f9-9dd3-963993549d9b',
    'Content-Type': 'application/json'
    }
}

const profileSelectors = {
    nameSelector: '.profile__name',
    aboutSelector: '.profile__about',
    avatarSelector: '.profile__avatar'
}

const popupViewImageConfig = {
    selector: '.popup_type_view-image',
    titleSelector: '.view-template__title',
    imageSelector: '.view-template__image'
}

export { validationConfig, apiRequestConfig, profileSelectors,confirmForm, loadingText, popupViewImageConfig, formsToValidate, cardAddButton, profileEditButton, avatarEditButton, profileForm, avatarForm, placeForm };