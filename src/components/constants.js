const loadingText = 'Сохранение...';

const profileElement = document.querySelector('.profile');

// Объект с данными для попапов с формой
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
    const formSelector = formSelectors[item].formSelector;
    formSelectors[item]['popupSelector'] = `.popup_type_${formSelector}`;
    formSelectors[item]['form'] = document.forms[formSelector];
    formSelectors[item]['openButton'] = profileElement.querySelector(`[name=${formSelector}-button]`); // кнопка для навешивания слушателя
}

const popupConfirmationConfig = {
    selector: '.popup_type_confirm-deletion-form',
    form: document.forms['confirm-deletion-form']
}

const popupViewImageConfig = {
    selector: '.popup_type_view-image',
    titleSelector: '.view-template__title',
    imageSelector: '.view-template__image'
}

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

export { validationConfig, apiRequestConfig, profileSelectors, loadingText, popupViewImageConfig, formSelectors, popupConfirmationConfig };