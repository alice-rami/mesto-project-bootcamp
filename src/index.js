import './pages/index.css';
import { initialCards } from "./components/initialCards.js";
import { enableValidation, disableButton, hideError } from "./components/validate.js";
import { createCard } from "./components/card.js";
import { openPopup, closePopup, closeByClickOnOverlay } from "./components/modal.js";

// Переменные

export const settings = {
    formSelector: '.form',
    inputSelector: '.form__input',
    inputInvalidSelector: '.form__input_invalid',
    submitButtonSelector: '.form__submit-button',
}; 

// Поля формы и контейнер для создания карточки

const cardTitleInput = document.getElementById('place-title');
const cardLinkInput = document.getElementById('place-link');
const cardsContainer = document.querySelector('.cards__list');

// Кнопка, попап и форма для добавления карточки
const cardAddButtonElement = document.querySelector('.profile__add-button');
const cardAddPopupElement = document.querySelector('.popup_type_add-card');
const cardAddFormElement = cardAddPopupElement.querySelector('.form');

// Поля профиля и кнопка редактирования профиля
const profileElement = document.querySelector('.profile');
const profileNameElement = profileElement.querySelector('.profile__name');
const profileAboutElement = profileElement.querySelector('.profile__about');
const profileEditButtonElement = profileElement.querySelector('.profile__edit-button');

// Попап и форма для редактирования профиля
const profilePopupElement = document.querySelector('.popup_type_profile');
const profileFormElement = profilePopupElement.querySelector('.form');
const profileNameInput = profileFormElement.querySelector('#profile-name');
const profileAboutInput = profileFormElement.querySelector('#profile-about');

// Списки для добавления слушателей
const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));
const popupsList = document.querySelectorAll('.popup');

// Создание карточек из исходного массива
initialCards.forEach(item => {
    const newCard = createCard(item);
    cardsContainer.append(newCard);
});

// Функции и добавление слушателей

popupCloseButtonsList.forEach(item => {
    item.addEventListener('click', () => closePopup(item.closest('.popup')))
});

cardAddButtonElement.addEventListener('click', () => {
    openPopup(cardAddPopupElement);
});

const handleCardAddFormSubmit = (evt) => {
    evt.preventDefault();
    const cardData = {
        name: cardTitleInput.value, 
        link: cardLinkInput.value
    };
    const newCard = createCard(cardData);
    cardsContainer.prepend(newCard);
    cardAddFormElement.reset();
    disableButton(evt.submitter);
    closePopup(cardAddPopupElement);
}

cardAddFormElement.addEventListener('submit', handleCardAddFormSubmit);

const openProfilePopup = () => {
    profileNameInput.value = profileNameElement.textContent;
    profileAboutInput.value = profileAboutElement.textContent;
    openPopup(profilePopupElement);
}

profileEditButtonElement.addEventListener('click', openProfilePopup);

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();
    profileNameElement.textContent = profileNameInput.value;
    profileAboutElement.textContent = profileAboutInput.value;
    closePopup(profilePopupElement);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

popupsList.forEach(popupElement => {
    popupElement.addEventListener('mousedown', closeByClickOnOverlay);
});

enableValidation(settings);

export const handleFormClosing = (form) => {
    const inputsList = Array.from(form.querySelectorAll(settings.inputSelector));
    inputsList.forEach(inputField => {
        hideError(inputField);
    });
    form.reset();
}