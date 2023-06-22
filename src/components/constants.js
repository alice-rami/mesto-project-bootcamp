const loadingText = 'Сохранение...';

const confirmForm = document.forms['confirm-deletion-form'];

const cardAddButtonElement = document.querySelector('.profile__add-button');
const profileEditButton = document.querySelector('.profile__edit-button');
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');

const popupOpenButtonsConfig = {
    'profile-form': profileEditButton,
    'avatar-form': avatarEditButton,
    'place-form': cardAddButtonElement
}

const validationConfig = {
    formSelector: '.form',
    inputSelector: '.form__input',
    inputInvalidClass: 'form__input_invalid',
    submitButtonSelector: '.form__submit-button'
}; 

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
    titleElement: document.querySelector('.view-template__title'),
    imageElement: document.querySelector('.view-template__image')
}

export { validationConfig, apiRequestConfig, profileSelectors,confirmForm, loadingText, popupOpenButtonsConfig, popupViewImageConfig };