const loadingText = 'Сохранение...';

const profileElement = document.querySelector('.profile');

const formSelectors = {
    editProfile: {
        formSelector: 'profile-form',
    },
    editAvatar: {
        formSelector: 'avatar-form',
    },
    addCard: {
        formSelector: 'place-form'
    }
}

for (let item in formSelectors) {
    const formSelector = formSelectors[item]['formSelector'];
    formSelectors[item]['popupSelector'] = `.popup_type_${formSelector}`;
    formSelectors[item]['form'] = document.forms[formSelector];
    formSelectors[item]['openButton'] = profileElement.querySelector(`[name=${formSelector}-button]`)
}

const confirmForm = document.forms['confirm-deletion-form'];

const validationConfig = {
    formSelector: '.form-validate',
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
    titleSelector: '.view-template__title',
    imageSelector: '.view-template__image'
}

export { validationConfig, apiRequestConfig, profileSelectors,confirmForm, loadingText, popupViewImageConfig, formSelectors };