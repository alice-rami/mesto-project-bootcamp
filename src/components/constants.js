const settings = {
    formSelector: '.form',
    inputSelector: '.form__input',
    inputInvalidSelector: '.form__input_invalid',
    submitButtonSelector: '.form__submit-button'
}; 

const apiRequestConfig = {
    baseUrl: 'https://nomoreparties.co/v1/wbf-cohort-9',
    headers: {
    authorization: 'c1d6c920-f67e-42f9-9dd3-963993549d9b',
    'Content-Type': 'application/json'
    }
}

// Контейнер для создания карточки
const cardsContainer = document.querySelector('.cards__list');

// Кнопка, попап и форма и поля для добавления карточки
const cardAddButtonElement = document.querySelector('.profile__add-button');
const cardAddPopupElement = document.querySelector('.popup_type_place-form');
const cardAddFormElement = document.forms['place-form'];
const cardTitleInput = cardAddFormElement.elements['place-title'];
const cardLinkInput = cardAddFormElement.elements['place-link'];

// Попап и форма для подтверждения удаления карточки
const confirmPopupElement = document.querySelector('.popup_type_confirm-deletion-form');
const confirmForm = document.forms['confirm-deletion-form'];

// Поля профиля и кнопка редактирования профиля
const profileElement = document.querySelector('.profile');
const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');
const profileAvatarElement = profileElement.querySelector('.profile__avatar');
const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');

// Попап и форма для редактирования профиля
const profilePopupElement = document.querySelector('.popup_type_profile-form');
const profileFormElement = document.forms['profile-form'];
const profileNameInput = profileFormElement.elements['profile-name'];
const profileAboutInput = profileFormElement.elements['profile-about'];

// Кнопка, попап и форма для изменения аватара
const avatarEditButton = profileElement.querySelector('.profile__avatar-edit-button');
const avatarPopupElement = document.querySelector('.popup_type_avatar-form');
const avatarEditForm = document.forms['avatar-form'];
const avatarLinkInput = avatarEditForm.elements['avatar-link'];

// Список попапов и список кнопок закрытия
const popupsList = document.querySelectorAll('.popup');
const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));

// Попап для просмотра страницы
const cardViewPopupElement = document.querySelector('.popup_type_view-image');
const targetImageElement = cardViewPopupElement.querySelector('.view-template__image');
const targetImageTitleElement = cardViewPopupElement.querySelector('.view-template__title');

export { settings, apiRequestConfig, cardsContainer, cardAddButtonElement, cardAddPopupElement, cardAddFormElement, cardTitleInput, cardLinkInput, confirmPopupElement, confirmForm, profileNameElement,profileAboutElement, profileAvatarElement, profileEditButtonElement, profilePopupElement, profileFormElement, profileNameInput, profileAboutInput, avatarEditButton, avatarPopupElement, avatarEditForm, avatarLinkInput, popupsList, popupCloseButtonsList, cardViewPopupElement, targetImageElement, targetImageTitleElement };